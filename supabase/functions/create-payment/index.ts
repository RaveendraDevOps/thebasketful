import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/http.ts';

type CartItem = { productId: string; quantity: number };
type RequestBody = { addressId: string; deliverySlot: string; mode: 'household' | 'business'; items: CartItem[] };

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')!;
    const razorpaySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return json({ error: 'Authentication required' }, 401);

    const admin = createClient(supabaseUrl, serviceRole);
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) return json({ error: 'Invalid session' }, 401);

    const body = await request.json() as RequestBody;
    if (!body.addressId || !body.deliverySlot || !['household', 'business'].includes(body.mode) || !body.items?.length) {
      return json({ error: 'Invalid checkout request' }, 400);
    }
    if (body.items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100)) {
      return json({ error: 'Invalid cart quantities' }, 400);
    }

    const productIds = [...new Set(body.items.map((item) => item.productId))];
    const [{ data: products, error: productsError }, { data: address, error: addressError }] = await Promise.all([
      admin.from('products').select('*').in('id', productIds).eq('active', true),
      admin.from('addresses').select('*').eq('id', body.addressId).eq('user_id', authData.user.id).single(),
    ]);
    if (productsError || !products || products.length !== productIds.length) return json({ error: 'One or more products are unavailable' }, 409);
    if (addressError || !address) return json({ error: 'Delivery address not found' }, 404);

    let subtotal = 0;
    const lines = body.items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId)!;
      if (product.stock_quantity < item.quantity) throw new Error(`${product.name} has insufficient stock`);
      const unitPrice = body.mode === 'business' ? product.business_price_paise : product.household_price_paise;
      subtotal += unitPrice * item.quantity;
      return {
        product_id: product.id,
        product_name: product.name,
        unit: body.mode === 'business' ? product.business_unit : product.household_unit,
        unit_price_paise: unitPrice,
        quantity: item.quantity,
      };
    });
    const freeDeliveryThreshold = body.mode === 'business' ? 150000 : 49900;
    const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 3900;
    const addressSnapshot = {
      label: address.label, recipientName: address.recipient_name, phone: address.phone,
      line1: address.line1, line2: address.line2, city: address.city,
      state: address.state, postalCode: address.postal_code,
    };

    const { data: order, error: orderError } = await admin.from('orders').insert({
      user_id: authData.user.id,
      address_id: address.id,
      customer_mode: body.mode,
      subtotal_paise: subtotal,
      delivery_fee_paise: deliveryFee,
      delivery_slot: body.deliverySlot,
      address_snapshot: addressSnapshot,
    }).select().single();
    if (orderError) throw orderError;

    const { error: itemsError } = await admin.from('order_items').insert(lines.map((line) => ({ ...line, order_id: order.id })));
    if (itemsError) throw itemsError;

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpaySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: order.total_paise,
        currency: 'INR',
        receipt: order.display_id,
        notes: { basketful_order_id: order.id, user_id: authData.user.id },
      }),
    });
    if (!razorpayResponse.ok) {
      await admin.from('orders').update({ status: 'payment_failed' }).eq('id', order.id);
      return json({ error: 'Payment provider could not create the order' }, 502);
    }
    const razorpayOrder = await razorpayResponse.json();
    await Promise.all([
      admin.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', order.id),
      admin.from('payments').insert({
        order_id: order.id,
        razorpay_order_id: razorpayOrder.id,
        amount_paise: order.total_paise,
      }),
    ]);

    return json({
      basketfulOrderId: order.id,
      displayId: order.display_id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.total_paise,
      currency: 'INR',
      keyId: razorpayKeyId,
    }, 201);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Unexpected server error' }, 500);
  }
});
