import { PaymentOrder } from '@/services/commerce';

type RazorpayResult = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };

const loadScript = () => new Promise<void>((resolve, reject) => {
  if (document.querySelector('script[data-basketful-razorpay]')) return resolve();
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.dataset.basketfulRazorpay = 'true';
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Razorpay Checkout could not load.'));
  document.head.appendChild(script);
});

export async function openRazorpayCheckout(order: PaymentOrder, customer?: { name?: string; phone?: string }) {
  await loadScript();
  return new Promise<RazorpayResult>((resolve, reject) => {
    const Razorpay = (window as unknown as { Razorpay: new (options: object) => { open: () => void; on: (event: string, callback: (error: { error?: { description?: string } }) => void) => void } }).Razorpay;
    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Basketful',
      description: `Order ${order.displayId}`,
      order_id: order.razorpayOrderId,
      prefill: { name: customer?.name, contact: customer?.phone },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
      theme: { color: '#176B3A' },
    });
    checkout.on('payment.failed', (response) => reject(new Error(response.error?.description ?? 'Payment failed.')));
    checkout.open();
  });
}
