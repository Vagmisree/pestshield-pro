'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar, Footer, WhatsAppFloat } from '@/components/layout';
import { Search, CheckCircle, Clock, Wrench, MapPin, Phone, Calendar, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { fadeUp, stagger, viewportSettings } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusSteps = [
  { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, desc: 'Booking confirmed' },
  { id: 'TECHNICIAN_ASSIGNED', label: 'Assigned', icon: Wrench, desc: 'Technician assigned' },
  { id: 'EN_ROUTE', label: 'On the Way', icon: MapPin, desc: 'Technician en route' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Clock, desc: 'Treatment underway' },
  { id: 'COMPLETED', label: 'Completed', icon: CheckCircle, desc: 'Job completed' },
];

const ACTIVE_STATUSES = [
  'CONFIRMED', 'TECHNICIAN_ASSIGNED', 'EN_ROUTE', 'ARRIVED',
  'INSPECTION_DONE', 'APPROVED', 'IN_PROGRESS', 'TREATMENT_DONE',
];

const STATUS_MESSAGES: Record<string, string> = {
  TECHNICIAN_ASSIGNED: '👷 Technician assigned! Check their details.',
  EN_ROUTE: '🚗 Your technician is on the way!',
  ARRIVED: '✅ Technician has arrived at your location',
  INSPECTION_DONE: '📋 Inspection report ready — please review',
  COMPLETED: '🎉 Service completed! Download your report.',
};

function formatDate(date?: string) {
  if (!date) return '—';
  try { return format(new Date(date), 'dd MMM yyyy'); } catch { return date; }
}

type BookingData = {
  bookingRef: string;
  service?: { name?: string; pestType?: string };
  status: string;
  customer?: { name?: string };
  address?: string;
  slotDate?: string;
  slotTime?: string;
  technician?: { name?: string; phone?: string; avgRating?: number };
  totalAmount?: number;
  report?: { id?: string } | null;
};

export default function BookingStatusPage() {
  const params = useParams();
  const ref = params.ref as string;
  const [searchRef, setSearchRef] = useState(ref || '');
  const [activeRef, setActiveRef] = useState(ref || '');
  const [notFound, setNotFound] = useState(false);
  const prevStatusRef = useRef<string | undefined>(undefined);

  const { data: booking, isLoading } = useQuery<BookingData>({
    queryKey: ['booking-status', activeRef],
    queryFn: () => api.get(`/bookings/ref/${activeRef}`).then(r => r.data.data),
    enabled: !!activeRef,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data && ACTIVE_STATUSES.includes(data.status) ? 30_000 : false;
    },
    refetchIntervalInBackground: false,
    retry: 1,
  });

  // Status change toast
  useEffect(() => {
    if (!booking?.status) return;
    if (prevStatusRef.current && prevStatusRef.current !== booking.status) {
      const msg = STATUS_MESSAGES[booking.status];
      if (msg) toast.success(msg, { duration: 6000 });
    }
    prevStatusRef.current = booking.status;
  }, [booking?.status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;
    setActiveRef(searchRef.trim().toUpperCase());
    setNotFound(false);
  };

  // Map status to step index
  const statusOrder = ['CONFIRMED', 'TECHNICIAN_ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED'];
  const currentStepIdx = booking
    ? statusOrder.findIndex(s => s === booking.status)
    : -1;

  const slotMap: Record<string, string> = {
    MORNING: '8 AM – 12 PM',
    AFTERNOON: '12 PM – 4 PM',
    EVENING: '4 PM – 8 PM',
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-forest-900 flex items-center justify-center mx-auto mb-4">
                <Search className="h-7 w-7 text-emerald-400" />
              </div>
              <h1 className="font-display font-black text-3xl text-ink mb-2">Track Your Booking</h1>
              <p className="text-neutral-500">Enter your booking reference number to check the status</p>
            </motion.div>

            {/* Search form */}
            <motion.form variants={fadeUp} onSubmit={handleSearch} className="flex gap-3 mb-8">
              <input
                value={searchRef}
                onChange={e => setSearchRef(e.target.value)}
                placeholder="e.g. PSP-2026-ABCD1234"
                className="flex-1 px-5 py-3.5 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600 transition-colors font-mono"
              />
              <button type="submit"
                className="px-6 py-3.5 bg-forest-900 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                <Search className="h-4 w-4" />Track
              </button>
            </motion.form>

            {/* Loading */}
            {isLoading && activeRef && (
              <motion.div variants={fadeUp} className="text-center py-8 text-neutral-400">
                <div className="w-8 h-8 border-2 border-brand-600/30 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm">Looking up booking...</p>
              </motion.div>
            )}

            {/* Not found */}
            {!isLoading && activeRef && !booking && (
              <motion.div variants={fadeUp} className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
                <p className="text-red-600 font-semibold">Booking not found</p>
                <p className="text-red-500 text-sm mt-1">Check your reference number and try again. It was sent via SMS/WhatsApp.</p>
              </motion.div>
            )}

            {/* Booking found */}
            {booking && (
              <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
                {/* Status tracker */}
                <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-cream-300 shadow-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-ink">Booking #{booking.bookingRef}</h2>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-200">
                      {booking.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Progress steps */}
                  <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-2">
                    {statusSteps.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step.id} className="flex items-center flex-shrink-0">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={cn('w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all',
                              isDone ? 'bg-forest-900 border-forest-900' : 'bg-white border-cream-300',
                              isCurrent && 'ring-4 ring-forest-900/20')}>
                              <step.icon className={cn('h-4 w-4', isDone ? 'text-white' : 'text-neutral-400')} />
                            </div>
                            <span className={cn('text-[10px] font-semibold text-center w-16', isDone ? 'text-forest-900' : 'text-neutral-400')}>
                              {step.label}
                            </span>
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div className={cn('h-0.5 w-8 mx-1 flex-shrink-0 mb-5', idx < currentStepIdx ? 'bg-forest-900' : 'bg-cream-300')} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Booking details */}
                <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-cream-300 shadow-card p-6">
                  <h3 className="font-display font-bold text-ink mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Wrench, label: 'Service', value: booking.service?.name },
                      { icon: Calendar, label: 'Scheduled', value: `${formatDate(booking.slotDate)} · ${slotMap[booking.slotTime || ''] || booking.slotTime}` },
                      { icon: MapPin, label: 'Address', value: booking.address },
                      { icon: CheckCircle, label: 'Amount', value: booking.totalAmount ? `₹${booking.totalAmount.toLocaleString()}` : '—' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <item.icon className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-medium">{item.label}</p>
                          <p className="text-sm font-semibold text-ink">{item.value || '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Technician card */}
                {booking.technician && (
                  <motion.div variants={fadeUp} className="bg-forest-900 rounded-2xl p-5 text-white">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Your Technician</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center">
                          <span className="font-display font-black text-emerald-400 text-lg">
                            {booking.technician.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-white">{booking.technician.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn('w-3 h-3', s <= Math.round(booking.technician?.avgRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-white/20')} />
                            ))}
                            <span className="text-emerald-400 text-xs ml-1">{booking.technician.avgRating?.toFixed(1) || '—'}</span>
                          </div>
                        </div>
                      </div>
                      {booking.technician.phone && (
                        <a
                          href={`tel:+91${booking.technician.phone}`}
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-semibold"
                        >
                          <Phone className="h-4 w-4" />Call
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Inspection report approval */}
                {booking.status === 'INSPECTION_DONE' && booking.report && (
                  <motion.div variants={fadeUp} className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                    <p className="font-semibold text-orange-800 mb-2">📋 Inspection Report Ready</p>
                    <p className="text-orange-700 text-sm mb-3">Your technician has completed the inspection. Please review and approve to proceed.</p>
                    <Link
                      href={`/dashboard/bookings`}
                      className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      Review & Approve →
                    </Link>
                  </motion.div>
                )}

                <motion.div variants={fadeUp} className="text-center">
                  <Link href="/dashboard"
                    className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                    View full booking history <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {!activeRef && (
              <motion.div variants={fadeUp} className="text-center py-8 text-neutral-400">
                <p className="text-sm">Enter your booking reference above to track your service</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
