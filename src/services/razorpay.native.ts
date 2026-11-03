import RazorpayCheckout from 'react-native-razorpay';
import { colors } from '@/theme';
import { PaymentOrder } from '@/services/commerce';

export async function openRazorpayCheckout(order: PaymentOrder, customer?: { name?: string; phone?: string }) {
  return RazorpayCheckout.open({
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: 'Basketful',
    description: `Order ${order.displayId}`,
    order_id: order.razorpayOrderId,
    prefill: { name: customer?.name, contact: customer?.phone },
    theme: { color: colors.primary },
  });
}
