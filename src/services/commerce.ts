import { supabase } from '@/lib/supabase';
import { CartLine, CustomerMode, Order, OrderStatus } from '@/types';

export type CustomerAddress = {
  id: string;
  label: string;
  detail: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
};

export type CreateAddressInput = Omit<CustomerAddress, 'id' | 'detail'>;

const requireSupabase = () => {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
};

export async function listAddresses(): Promise<CustomerAddress[]> {
  const client = requireSupabase();
  const { data, error } = await client.from('addresses').select('*').order('is_default', { ascending: false }).order('created_at');
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    detail: [item.line1, item.line2, item.city, item.state, item.postal_code].filter(Boolean).join(', '),
    recipientName: item.recipient_name,
    phone: item.phone,
    line1: item.line1,
    line2: item.line2 ?? undefined,
    city: item.city,
    state: item.state,
    postalCode: item.postal_code,
  }));
}

export async function createAddress(input: CreateAddressInput) {
  const client = requireSupabase();
  const { data: authData } = await client.auth.getUser();
  if (!authData.user) throw new Error('Sign in before adding an address.');
  const { data, error } = await client.from('addresses').insert({
    user_id: authData.user.id,
    label: input.label,
    recipient_name: input.recipientName,
    phone: input.phone,
    line1: input.line1,
    line2: input.line2 || null,
    city: input.city,
    state: input.state,
    postal_code: input.postalCode,
  }).select().single();
  if (error) throw error;
  return data.id as string;
}

export type PaymentOrder = {
  basketfulOrderId: string;
  displayId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export async function createPaymentOrder(addressId: string, deliverySlot: string, mode: CustomerMode, items: CartLine[]) {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke<PaymentOrder>('create-payment', {
    body: { addressId, deliverySlot, mode, items },
  });
  if (error) throw error;
  if (!data) throw new Error('Payment order was not created.');
  return data;
}

export async function verifyPayment(input: {
  basketfulOrderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke('verify-payment', { body: input });
  if (error) throw error;
  return data;
}

const statusLabel = (status: string): OrderStatus => ({
  pending_payment: 'Confirmed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  payment_failed: 'Payment failed',
}[status] as OrderStatus);

export async function listOrders(): Promise<Order[]> {
  const client = requireSupabase();
  const { data, error } = await client.from('orders').select('*, order_items(id)').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.display_id,
    date: new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    total: item.total_paise / 100,
    status: statusLabel(item.status),
    itemCount: item.order_items?.length ?? 0,
    address: Object.values(item.address_snapshot ?? {}).filter(Boolean).join(', '),
    slot: item.delivery_slot,
  }));
}

export async function getOrder(displayId: string) {
  const orders = await listOrders();
  return orders.find((order) => order.id === displayId) ?? null;
}
