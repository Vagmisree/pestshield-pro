'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { useRouter } from 'next/navigation';
import { Copy, Check, Calendar, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface Step8Props { onReset: () => void }

export function Step8Confirmation({ onReset }: Step8Props) {
  const router = useRouter();
  const { bookingId, bookingRef, selectedService, selectedDate, selectedTimeSlot, confirmedOrders, clearCart } = useBookingStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#34d399', '#f59e0b', '#ffffff', '#16a34a'],
      gravity: 0.8,
    });
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayRef = bookingRef || bookingId || '';

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Animated SVG checkmark */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="w-28 h-28 rounded-full bg-emerald-400/15 border-2 border-emerald-400 flex items-center justify-center">
            <motion.svg
              className="w-14 h-14"
              viewBox="0 0 52 52"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.path
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l10 10 14-14"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              />
            </motion.svg>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>

          {/* Multi-booking confirmation */}
          {confirmedOrders.length > 1 ? (
            <>
              <h1 className="font-display text-3xl font-bold text-ink mb-2">
                {confirmedOrders.length} Bookings Confirmed! 🎉
              </h1>
              <p className="text-neutral-500 mb-6">All your pest control services have been booked</p>

              <div className="space-y-3 mb-6">
                {confirmedOrders.map((order, i) => (
                  <div key={order.bookingRef} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl border border-cream-300 text-left">
                    <div>
                      <p className="text-sm font-medium text-ink">Booking {i + 1}</p>
                      <p className="text-xs text-neutral-500">{order.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-brand-600 text-sm">{order.bookingRef}</p>
                      <Link
                        href={`/booking-status/${order.bookingRef}`}
                        className="text-xs text-brand-600 underline"
                      >
                        Track →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold text-ink mb-2">Booking Confirmed! 🎉</h1>
              <p className="text-neutral-500 mb-8">Your pest control service has been booked successfully</p>

              {/* Booking ref card */}
              <div className="bg-forest-900 rounded-2xl p-6 mb-6 text-center">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Your Booking Reference</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="font-mono font-black text-2xl text-emerald-400">{displayRef}</code>
                  <button
                    onClick={() => handleCopy(displayRef)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
                  </button>
                </div>
                <p className="text-white/40 text-xs mt-2">Save this for your records</p>
              </div>

              {/* Quick summary */}
              <div className="bg-card rounded-2xl border border-cream-300 p-5 mb-6 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-brand-600" />
                  <div>
                    <p className="text-xs text-neutral-500">Service</p>
                    <p className="text-sm font-semibold text-ink">{selectedService}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <div>
                    <p className="text-xs text-neutral-500">Scheduled</p>
                    <p className="text-sm font-semibold text-ink">{selectedDate?.toLocaleDateString('en-IN')} • {selectedTimeSlot}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* What happens next */}
          <div className="bg-card rounded-2xl border border-cream-300 p-6 mb-8 text-left">
            <p className="font-display font-bold text-ink text-sm mb-4">What happens next?</p>
            {[
              { done: true, text: 'Payment confirmed & booking created' },
              { done: false, text: 'Technician assigned within 5 minutes' },
              { done: true, text: 'WhatsApp confirmation sent to you' },
              { done: false, text: 'Technician arrives at your scheduled slot' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  s.done ? 'bg-emerald-400' : 'bg-cream-200'
                )}>
                  {s.done && <Check className="w-3 h-3 text-white" />}
                </div>
                <p className={cn('text-sm', s.done ? 'text-ink font-medium' : 'text-neutral-400')}>{s.text}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/bookings')}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl transition-all shadow-card"
            >
              View My Bookings
            </button>
            <button
              onClick={() => { onReset(); router.push('/book'); }}
              className="w-full py-3.5 border-2 border-forest-900 text-forest-900 font-bold rounded-2xl hover:bg-forest-900 hover:text-white transition-all"
            >
              Book Another Service
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
