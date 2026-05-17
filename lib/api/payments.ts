import { apiClient } from './client';

export const paymentsApi = {
  createOrder: (bookingId: string) =>
    apiClient.post('/payments/create-order', { bookingId }).then(r => r.data.data),

  verifyPayment: (data: {
    razorpayOrderId: string; razorpayPaymentId: string;
    razorpaySignature: string; bookingId: string;
  }) => apiClient.post('/payments/verify', data).then(r => r.data.data),

  getInvoice: (bookingId: string) =>
    apiClient.get(`/payments/invoice/${bookingId}`).then(r => r.data.data),
};

// ─── Razorpay Script Loader ───────────────────────────────────────────────────

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayOptions {
  orderId: string;
  amount: number;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onFailure: (error: any) => void;
}

export async function openRazorpayCheckout(opts: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Razorpay SDK failed to load');

  const rzp = new (window as any).Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: opts.amount,
    currency: 'INR',
    name: 'PestShield Pro',
    description: `Booking ${opts.bookingRef}`,
    order_id: opts.orderId,
    prefill: { name: opts.customerName, contact: opts.customerPhone, email: opts.customerEmail },
    theme: { color: '#1B6B35' },
    handler: opts.onSuccess,
    modal: { ondismiss: () => opts.onFailure({ message: 'Payment cancelled' }) },
  });
  rzp.open();
}
