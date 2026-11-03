declare module 'react-native-razorpay' {
  type Options = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: { name?: string; contact?: string; email?: string };
    theme?: { color?: string };
  };
  type Success = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
  const RazorpayCheckout: { open(options: Options): Promise<Success> };
  export default RazorpayCheckout;
}
