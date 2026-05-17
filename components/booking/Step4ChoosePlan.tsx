'use client';

import { useState } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { plans } from '@/lib/data/plans';
import { mockCoupons } from '@/lib/data/coupons';
import { Check, ArrowRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Step4Props { onNext: () => void; onBack: () => void }

export function Step4ChoosePlan({ onNext, onBack }: Step4Props) {
  const { selectedPlan, setSelectedPlan, applyCoupon, couponDiscount } = useBookingStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponState, setCouponState] = useState<'idle' | 'success' | 'error'>('idle');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(
      (c) => c.code.toUpperCase() === couponInput.toUpperCase() && c.status === 'active'
    );
    const plan = plans.find((p) => p.name === selectedPlan);
    const base = plan?.price || 0;

    if (coupon) {
      const discount = coupon.type === 'percent'
        ? Math.round((base * coupon.discount) / 100)
        : coupon.discount;
      applyCoupon(coupon.code, discount);
      setCouponState('success');
      setCouponMsg(`✓ ${coupon.code} applied — ₹${discount} off`);
    } else {
      setCouponState('error');
      setCouponMsg('Invalid or expired coupon code');
    }
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-ink mb-1">Choose Your Plan</h2>
      <p className="text-neutral-500 text-sm mb-6">Select the protection plan that fits your needs</p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name;
          const isPopular = plan.popular;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.name as 'one-time' | 'quarterly' | 'annual')}
              className={cn(
                'relative rounded-2xl border-2 p-5 cursor-pointer transition-all overflow-hidden',
                isSelected ? 'border-brand-600 bg-brand-50 shadow-hover' : 'border-cream-300 bg-card hover:border-brand-400',
                isPopular && !isSelected && 'border-brand-300'
              )}
            >
              {/* Best Value ribbon */}
              {isPopular && (
                <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 rounded-tr-2xl">
                  <div className="absolute top-3 right-[-18px] w-[90px] bg-accent-500 text-white text-[9px] font-bold text-center py-1 rotate-45">
                    Best Value
                  </div>
                </div>
              )}

              {isSelected && (
                <div className="absolute top-3 left-3 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <h3 className="font-heading font-bold text-ink mb-1 mt-1">{plan.name}</h3>
              <p className="text-sm text-neutral-500 mb-3">{plan.description}</p>

              <p className="text-3xl font-black font-heading text-ink mb-1">
                {formatPrice(plan.price)}
              </p>
              {plan.visits > 1 && (
                <p className="text-xs text-neutral-400 mb-3">{plan.validity}</p>
              )}

              {/* Savings callout for popular */}
              {isPopular && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full mb-3">
                  <span className="text-xs font-semibold text-emerald-600">Save ₹2,400/year vs one-time</span>
                </div>
              )}

              <ul className="space-y-1.5">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Coupon input */}
      <div className="mb-6">
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
              couponState === 'success' ? 'border-emerald-400 bg-emerald-400/5' :
              couponState === 'error' ? 'border-red-400 bg-red-50' :
              'border-cream-300 focus:border-brand-600'
            )}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponInput || !selectedPlan}
            className="px-5 py-3 bg-forest-900 hover:bg-forest-800 text-white font-semibold rounded-r-xl transition-all disabled:opacity-40 text-sm"
          >
            Apply
          </button>
        </div>
        <AnimatePresence>
          {couponMsg && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn('text-xs mt-1.5', couponState === 'success' ? 'text-emerald-600' : 'text-red-500')}
            >
              {couponMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border-2 border-cream-300 text-neutral-700 font-semibold hover:border-neutral-400 transition-all">
          Back
        </button>
        <button
          onClick={() => selectedPlan && onNext()}
          disabled={!selectedPlan}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-40"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
