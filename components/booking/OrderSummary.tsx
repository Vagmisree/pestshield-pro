'use client';

import { useBookingStore } from '@/stores/useBookingStore';
import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, CreditCard, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function OrderSummary() {
  const {
    step, formData, selectedService, selectedPlan,
    selectedDate, selectedTimeSlot, propertyType,
    couponDiscount, couponCode,
  } = useBookingStore();

  const rows = [
    { label: 'Service', value: selectedService, icon: Shield, step: 2 },
    {
      label: 'Property',
      value: propertyType
        ? `${propertyType.areaType || propertyType.type}${propertyType.size ? ` — ${propertyType.size}` : ''}`
        : null,
      icon: MapPin,
      step: 3,
    },
    { label: 'Plan', value: selectedPlan, icon: CreditCard, step: 4 },
    {
      label: 'Schedule',
      value: selectedDate ? `${format(selectedDate, 'dd MMM, EEE')} • ${selectedTimeSlot}` : null,
      icon: Calendar,
      step: 5,
    },
  ];

  return (
    <div className="bg-forest-900 texture-organic rounded-2xl p-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center">
          <Check className="w-4 h-4 text-forest-900" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Your Booking</p>
          <p className="text-xs text-white/50">Step {step} of 8</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / 7) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Row items */}
      <div className="space-y-4">
        {rows.map((row) => {
          const Icon = row.icon;
          const isDone = step > row.step;
          const isCurrent = step === row.step;

          return (
            <div key={row.label} className="flex items-start gap-3">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                isDone ? 'bg-emerald-400' : isCurrent ? 'bg-white/15' : 'bg-white/8'
              )}>
                {isDone
                  ? <Check className="w-3.5 h-3.5 text-forest-900" />
                  : <Icon className={cn('w-3.5 h-3.5', isCurrent ? 'text-emerald-400' : 'text-white/30')} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 mb-0.5">{row.label}</p>
                {row.value ? (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold text-white truncate"
                  >
                    {row.value}
                  </motion.p>
                ) : (
                  <p className="text-sm text-white/30">Not selected yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon applied */}
      {couponCode && couponDiscount > 0 && (
        <div className="mt-4 p-3 bg-emerald-400/15 border border-emerald-400/30 rounded-xl">
          <p className="text-xs font-medium text-emerald-300">
            🎉 Coupon {couponCode} applied — ₹{couponDiscount} off
          </p>
        </div>
      )}

      {/* Trust line */}
      <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-white/50">
          Secured via Razorpay. 30-day re-service guarantee.
        </p>
      </div>
    </div>
  );
}
