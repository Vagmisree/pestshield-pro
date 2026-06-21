'use client';

import { useState } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { plans } from '@/lib/data/plans';
import { Lock, AlertCircle, CreditCard, Smartphone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Step7Props { onNext: () => void; onBack: () => void }

const paymentMethods = [
  { id: 'upi', label: 'Pay with UPI (Mock)', icon: Smartphone, sub: 'GPay · PhonePe · Paytm' },
  { id: 'card', label: 'Pay with Card (Mock)', icon: CreditCard, sub: 'Visa · Mastercard · RuPay' },
  { id: 'netbanking', label: 'Net Banking (Mock)', icon: Globe, sub: 'All major banks' },
];

function formatDate(date: Date | null) {
  if (!date) return '—';
  try { return format(new Date(date), 'dd MMM'); } catch { return '—'; }
}

export function Step7Payment({ onNext, onBack }: Step7Props) {
  const {
    selectedPlan, couponDiscount, submitAndPay, isSubmitting, submitError,
    cart, selectedService, formData, pricing, getTotalCartAmount,
    selectedDate, selectedTimeSlot,
  } = useBookingStore();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showMockDialog, setShowMockDialog] = useState(false);

  const plan = plans.find((p) => p.name === selectedPlan);
  const baseAmount = pricing?.baseAmount || plan?.price || 0;
  const gst = pricing?.gstAmount || Math.round(baseAmount * 0.18);
  const currentTotal = pricing?.totalAmount || (baseAmount + gst - couponDiscount);
  const grandTotal = cart.length > 0 ? getTotalCartAmount() : currentTotal;

  const handlePayNow = () => setShowMockDialog(true);

  const handleMockPay = async () => {
    setShowMockDialog(false);
    try {
      await submitAndPay(onNext);
    } catch {
      // error shown via submitError
    }
  };

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-ink mb-1">Complete Payment</h2>
      <p className="text-neutral-500 text-sm mb-6">Choose your payment method</p>

      {/* Cart summary — shown when multiple bookings */}
      {cart.length > 0 && (
        <div className="space-y-3 mb-5">
          <p className="text-sm font-semibold text-neutral-600">All Bookings in Cart</p>
          {cart.map((d, i) => (
            <div key={d.cartId} className="flex justify-between items-center p-3 bg-cream-50 rounded-xl border border-cream-300">
              <div>
                <p className="text-sm font-medium text-ink">Booking {i + 1}: {d.selectedService}</p>
                <p className="text-xs text-neutral-500">{d.formData.address.slice(0, 40)}</p>
                <p className="text-xs text-neutral-500">{formatDate(d.selectedDate)} · {d.selectedTimeSlot}</p>
              </div>
              <p className="font-bold text-brand-600">₹{d.pricing?.totalAmount.toLocaleString() || '—'}</p>
            </div>
          ))}
          {/* Current booking */}
          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <div>
              <p className="text-sm font-medium text-ink">Booking {cart.length + 1}: {selectedService} ✦ Current</p>
              <p className="text-xs text-neutral-500">{formData.address.slice(0, 40)}</p>
              <p className="text-xs text-neutral-500">{formatDate(selectedDate)} · {selectedTimeSlot}</p>
            </div>
            <p className="font-bold text-brand-600">₹{currentTotal.toLocaleString()}</p>
          </div>
          {/* Grand total */}
          <div className="flex justify-between items-center p-3 bg-ink text-white rounded-xl">
            <p className="font-semibold">Grand Total ({cart.length + 1} bookings)</p>
            <p className="font-bold text-lg">₹{grandTotal.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Amount card — single booking */}
      {cart.length === 0 && (
        <div className="relative bg-forest-900 texture-organic rounded-2xl p-6 mb-6 overflow-hidden">
          <p className="text-white/85 text-sm mb-1">Total Payable</p>
          <p className="text-5xl font-display font-black text-white">₹{currentTotal.toLocaleString()}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="text-white/85">Base: ₹{baseAmount.toLocaleString()}</span>
            <span className="text-white/85">GST 18%: ₹{gst.toLocaleString()}</span>
            {couponDiscount > 0 && <span className="text-emerald-400">-₹{couponDiscount.toLocaleString()} off</span>}
          </div>
          {process.env.NEXT_PUBLIC_MOCK_PAYMENT === 'true' && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full px-3 py-1">
              <span className="text-amber-300 text-xs font-bold">🧪 Mock Payment Mode</span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {submitError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-5 text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      {/* Payment methods */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;
          return (
            <div key={method.id} onClick={() => setPaymentMethod(method.id)}
              className={cn('flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all',
                isSelected ? 'border-brand-600 bg-brand-50' : 'border-cream-300 bg-card hover:border-brand-400')}>
              <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                isSelected ? 'border-brand-600' : 'border-cream-300')}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
              </div>
              <Icon className={cn('w-5 h-5 flex-shrink-0', isSelected ? 'text-brand-600' : 'text-neutral-400')} />
              <div>
                <p className="font-semibold text-ink text-sm">{method.label}</p>
                <p className="text-xs text-neutral-500">{method.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay button */}
      <button onClick={handlePayNow} disabled={isSubmitting}
        className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <Lock className="w-5 h-5 relative z-10" />
        <span className="relative z-10">
          {isSubmitting ? 'Processing...' : `Pay ₹${grandTotal.toLocaleString()} Securely`}
        </span>
      </button>
      <p className="text-center text-xs text-neutral-400 mt-3">
        🔒 256-bit encrypted · PCI-DSS compliant · Never stored on our servers
      </p>

      <button onClick={onBack} disabled={isSubmitting} className="w-full py-3 mt-3 rounded-xl border-2 border-cream-300 text-neutral-700 font-semibold hover:border-neutral-400 transition-all disabled:opacity-40">
        Back
      </button>

      {/* Mock Payment Dialog */}
      {showMockDialog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-hover max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧪</span>
            </div>
            <h3 className="font-display font-bold text-ink text-lg mb-2">Simulating Payment Gateway</h3>
            <p className="text-neutral-500 text-sm mb-6">
              This is a mock payment. In production, you would be redirected to {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'card payment' : 'net banking'} gateway.
            </p>
            <div className="bg-cream-100 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-neutral-500 mb-1">
                {cart.length > 0 ? `${cart.length + 1} Bookings` : 'Amount'}
              </p>
              <p className="font-display font-black text-2xl text-ink">₹{grandTotal.toLocaleString()}</p>
              <p className="text-xs text-neutral-400 mt-1">Mock transaction ID: pay_mock_demo</p>
            </div>
            <button onClick={handleMockPay}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all mb-3">
              ✓ Confirm Mock Payment
            </button>
            <button onClick={() => setShowMockDialog(false)} className="w-full py-2.5 text-neutral-500 hover:text-neutral-700 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}