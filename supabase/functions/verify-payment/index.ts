import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/http.ts';

const hmacHex = async (message: string, secret: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: authData, error: authError } = await admin.auth.getUser(token ?? '');
    if (authError || !authData.user) return json({ error: 'Authentication required' }, 401);

    const { basketfulOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();
    if (![basketfulOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature].every(Boolean)) {
      return json({ error: 'Missing payment verification data' }, 400);
    }
    const { data: order } = await admin.from('orders').select('id,user_id,razorpay_order_id').eq('id', basketfulOrderId).single();
    if (!order || order.user_id !== authData.user.id || order.razorpay_order_id !== razorpayOrderId) {
      return json({ error: 'Order not found' }, 404);
    }

    const expected = await hmacHex(`${razorpayOrderId}|${razorpayPaymentId}`, Deno.env.get('RAZORPAY_KEY_SECRET')!);
    if (expected !== razorpaySignature) {
      await admin.from('payments').update({ status: 'failed', failure_reason: 'Signature verification failed' }).eq('order_id', order.id);
      return json({ error: 'Payment signature is invalid' }, 400);
    }

    const { error: confirmError } = await admin.rpc('confirm_paid_order', {
      p_order_id: order.id,
      p_payment_id: razorpayPaymentId,
    });
    if (confirmError) throw confirmError;
    return json({ verified: true, orderId: order.id });
  } catch (error) {
    console.error(error);
    return json({ error: 'Payment verification failed' }, 500);
  }
});
