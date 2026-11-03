import { createClient } from 'npm:@supabase/supabase-js@2';
import { json } from '../_shared/http.ts';

const hmacHex = async (message: string, secret: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const rawBody = await request.text();
  const receivedSignature = request.headers.get('x-razorpay-signature') ?? '';
  const expectedSignature = await hmacHex(rawBody, Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!);
  if (receivedSignature !== expectedSignature) return json({ error: 'Invalid webhook signature' }, 401);

  const event = JSON.parse(rawBody);
  if (event.event !== 'payment.captured') return json({ received: true });
  const payment = event.payload?.payment?.entity;
  if (!payment?.id || !payment?.order_id) return json({ error: 'Invalid payment payload' }, 400);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: order } = await admin.from('orders').select('id,status').eq('razorpay_order_id', payment.order_id).single();
  if (!order) return json({ error: 'Order not found' }, 404);
  if (order.status === 'confirmed') return json({ received: true, duplicate: true });

  const { error } = await admin.rpc('confirm_paid_order', { p_order_id: order.id, p_payment_id: payment.id });
  if (error) {
    console.error(error);
    return json({ error: 'Order confirmation failed' }, 500);
  }
  return json({ received: true });
});
