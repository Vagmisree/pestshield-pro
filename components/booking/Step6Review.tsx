'use client';

import { useBookingStore } from '@/stores/useBookingStore';
import { services } from '@/lib/data/services';
import { plans } from '@/lib/data/plans';
import { mockCoupons } from '@/lib/data/coupons';
import { useState } from 'react';
import { format } from 'date-fns';
import { Check, Shield, ArrowRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Step6Props { onNext: () => void; onBack: () => void; onJumpToStep: (step: number) => void }

export function Step6Review({ onNext, onBack, onJumpToStep }: Step6Props) {
  const { selectedService, selectedPlan, selectedDate, selectedTimeSlot, formData, propertyType, applyCoupon, couponDiscount, couponCode: appliedCode } = useBookingStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponState, setCouponState] = useState<'idle' | 'success' | 'error'>('idle');
  const [couponMsg, setCouponMsg] = useState('');

  const service = services.find((s) => s.name === selectedService);
  const plan = plans.find((p) => p.name === selectedPlan);
  const baseAmount = plan?.price || 0;
  const gst = Math.round(baseAmount * 0.18);
  const total = baseAmount + gst - couponDiscount;

  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find((c) => c.code.toUpperCase() === couponInput.toUpperCase() && c.status === 'active');
    if (coupon) {
      const discount = coupon.type === 'percent' ? Math.round((baseAmount * coupon.discount) / 100) : coupon.discount;
      applyCoupon(coupon.code, discount);
      setCouponState('success');
      setCouponMsg(`✓ ${coupon.code} applied — ₹${discount} off`);
    } else {
      setCouponState('error');
      setCouponMsg('Invalid or expired coupon code');
    }
  };

  const rows = [
    { label: 'Service', value: service?.name, step: 2 },
    { label: 'Property', value: propertyType ? `${propertyType.areaType || propertyType.type}${propertyType.size ? ` — ${propertyType.size}` : ''}` : null, step: 3 },
    { label: 'Plan', value: selectedPlan, step: 4 },
    { label: 'Schedule', value: selectedDate ? `${format(selectedDate, 'dd MMM, EEE')} • ${selectedTimeSlot}` : null, step: 5 },
    { label: 'Address', value: formData.address ? `${formData.address}, ${formData.city} ${formData.pincode}` : null, step: 1 },
  ];

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-ink mb-1">Review Your Booking</h2>
      <p className="text-neutral-500 text-sm mb-6">Make sure everything looks correct</p>

      <div className="bg-card rounded-3xl border border-cream-300 shadow-card p-6 mb-5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-4 border-b border-cream-200 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">{row.label}</p>
                <p className="text-sm font-semibold text-ink">{row.value || '—'}</p>
              </div>
            </div>
            <button
              onClick={() => onJumpToStep(row.step)}
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="bg-cream-100 rounded-2xl p-5 mb-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Base Price</span>
          <span className="font-medium text-ink">₹{baseAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">GST (18%)</span>
          <span className="font-medium text-ink">₹{gst.toLocaleString()}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Coupon ({appliedCode})</span>
            <span>-₹{couponDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-cream-300 pt-2 flex justify-between">
          <span className="font-bold text-ink">Total</span>
          <span className="text-2xl font-black font-heading text-brand-600">₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Coupon */}
      {!appliedCode && (
        <div className="mb-5">
          <p className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-brand-600" /> Have a coupon?
          </p>
          <div className="flex gap-0">
            <input
              value={couponInput}
              onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponState('idle'); }}
              placeholder="Enter coupon code"
              className={cn(
                'flex-1 px-4 py-3 rounded-l-xl border-2 border-r-0 text-sm outline-none transition-all',
                couponState === 'success' ? 'border-emerald-400' : couponState === 'error' ? 'border-red-400' : 'border-cream-300 focus:border-brand-600'
              )}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponInput}
              className="px-5 py-3 bg-forest-900 hover:bg-forest-800 text-white font-semibold rounded-r-xl transition-all disabled:opacity-40 text-sm"
            >
              Apply
            </button>
          </div>
          {couponMsg && (
            <p className={cn('text-xs mt-1.5', couponState === 'success' ? 'text-emerald-600' : 'text-red-500')}>{couponMsg}</p>
          )}
        </div>
      )}

      {/* Technician info card — dark forest */}
      <div className="mt-6 bg-forest-900 texture-organic rounded-2xl p-5 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-sm">Instant Technician Assignment</p>
          <p className="text-white/65 text-sm mt-1">
            A certified, background-verified technician will be assigned automatically within 5 minutes of payment.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border-2 border-cream-300 text-neutral-700 font-semibold hover:border-neutral-400 transition-all">
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all"
        >
          Proceed to Payment <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
