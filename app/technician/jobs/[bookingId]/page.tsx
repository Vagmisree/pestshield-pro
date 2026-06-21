'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Phone, MapPin, Clock, CheckCircle, Camera, Send, Lock,
  ArrowLeft, User, Navigation2, ClipboardList, Star,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';

const AFFECTED_AREAS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'Store Room', 'Roof/Attic', 'Garden/Balcony', 'Entire Property'];
const DURATIONS = ['30 min', '45 min', '1 hr', '1.5 hrs', '2 hrs', '3 hrs', '4 hrs'];

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  TECHNICIAN_ASSIGNED: 'bg-purple-100 text-purple-700',
  EN_ROUTE: 'bg-sky-100 text-sky-700',
  ARRIVED: 'bg-teal-100 text-teal-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  INSPECTION_DONE: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-cyan-100 text-cyan-700',
  TREATMENT_DONE: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
};

function formatDate(date?: string | null) {
  if (!date) return '—';
  try { return format(new Date(date), 'dd MMM yyyy'); } catch { return date; }
}

function formatSlot(slot?: string) {
  const map: Record<string, string> = {
    MORNING: '8 AM – 12 PM',
    AFTERNOON: '12 PM – 4 PM',
    EVENING: '4 PM – 8 PM',
  };
  return map[slot || ''] || slot || '—';
}

function formatPlan(plan?: string) {
  const map: Record<string, string> = {
    SINGLE: 'One-Time Service',
    CONTRACT_RESIDENTIAL: 'Annual Plan',
    AMC_COMMERCIAL: 'AMC Commercial',
  };
  return map[plan || ''] || plan || '—';
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function JobDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const [otp, setOtp] = useState('');
  const [severity, setSeverity] = useState(3);
  const [affectedAreas, setAffectedAreas] = useState<string[]>([]);
  const [treatment, setTreatment] = useState('');
  const [chemicals, setChemicals] = useState('');
  const [duration, setDuration] = useState('1 hr');
  const [notes, setNotes] = useState('');
  const [beforePhotos, setBeforePhotos] = useState<File[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<File[]>([]);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => api.get(`/bookings/${bookingId}`).then(r => r.data.data),
    refetchInterval: 30_000,
  });

  const markEnRoute = useMutation({
    mutationFn: () => api.post(`/bookings/${bookingId}/en-route`),
    onSuccess: () => { toast.success('Navigation started!'); qc.invalidateQueries({ queryKey: ['booking', bookingId] }); },
    onError: () => toast.error('Failed to update status'),
  });

  const markArrived = useMutation({
    mutationFn: () => api.post(`/bookings/${bookingId}/arrive`),
    onSuccess: () => { toast.success('Marked as arrived!'); qc.invalidateQueries({ queryKey: ['booking', bookingId] }); },
    onError: () => toast.error('Failed to mark arrived'),
  });

  const submitReport = useMutation({
    mutationFn: async () => {
      await api.post('/reports', {
        bookingId,
        pestType: booking?.service?.pestType || 'GENERAL',
        severity: `LEVEL_${severity}`,
        affectedAreas,
        recommendedTreatment: treatment,
        chemicalsToBeUsed: chemicals.split(',').map((c: string) => c.trim()).filter(Boolean),
        estimatedDuration: duration,
        technicianNotes: notes,
      });
    },
    onSuccess: () => { toast.success('Inspection report submitted!'); qc.invalidateQueries({ queryKey: ['booking', bookingId] }); },
    onError: () => toast.error('Failed to submit report'),
  });

  const uploadAfterPhotos = useMutation({
    mutationFn: async () => {
      const reportId = booking?.report?.id;
      if (!reportId) throw new Error('No report found');
      const form = new FormData();
      afterPhotos.forEach((f: File) => form.append('photos', f));
      await api.post(`/reports/${reportId}/photos?type=after`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { toast.success('After photos uploaded!'); qc.invalidateQueries({ queryKey: ['booking', bookingId] }); },
    onError: () => toast.error('Failed to upload photos'),
  });

  const sendOtp = useMutation({
    mutationFn: () => api.post(`/bookings/${bookingId}/send-otp`),
    onSuccess: () => toast.success('OTP sent to customer!'),
    onError: () => toast.error('Failed to send OTP'),
  });

  const closeJob = useMutation({
    mutationFn: () => api.post(`/bookings/${bookingId}/close`, { otp }),
    onSuccess: () => { toast.success('Job closed successfully! 🎉'); router.push('/technician/jobs'); },
    onError: () => toast.error('Invalid OTP or job cannot be closed'),
  });

  if (isLoading) return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <Skeleton className="h-64 rounded-3xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
  if (!booking) return <div className="text-center py-12 text-neutral-500">Booking not found</div>;

  const status = booking.status;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/technician/jobs" className="p-2 hover:bg-cream-200 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-xl text-ink">{booking.service?.name}</h1>
          <p className="text-xs text-neutral-400">#{booking.bookingRef}</p>
        </div>
      </div>

      {/* Full Client Details Card */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-5">
        {/* Card header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-brand-100 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <p className="font-bold text-ink text-sm">Client Details</p>
            <p className="text-xs text-neutral-500">Booking {booking.bookingRef}</p>
          </div>
          <span className={cn('ml-auto text-xs font-medium px-2 py-0.5 rounded-full', statusColors[status] || 'bg-neutral-100 text-neutral-600')}>
            {formatStatus(status)}
          </span>
        </div>

        <div className="space-y-3">
          {/* Customer name + call */}
          <div className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
            <div>
              <p className="text-xs text-neutral-500">Customer Name</p>
              <p className="font-semibold text-ink">{booking.customer?.name}</p>
            </div>
            <a
              href={`tel:+91${booking.customer?.user?.phone || booking.customer?.phone}`}
              className="flex items-center gap-1.5 bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-brand-700 transition-colors active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Client
            </a>
          </div>

          {/* Address + maps */}
          <div className="p-3 bg-cream-50 rounded-xl">
            <p className="text-xs text-neutral-500 mb-1">Service Address</p>
            <p className="font-semibold text-ink text-sm">{booking.address}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Pincode: {booking.pincode} · {booking.city}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((booking.address || '') + ' ' + (booking.pincode || ''))}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-1.5 text-brand-600 text-xs font-semibold hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" />
              Open in Google Maps →
            </a>
          </div>

          {/* Service details grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-cream-50 rounded-xl">
              <p className="text-xs text-neutral-500">Service</p>
              <p className="font-semibold text-ink text-sm">{booking.service?.name}</p>
              <p className="text-xs text-neutral-400">{booking.service?.pestType}</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-xl">
              <p className="text-xs text-neutral-500">Schedule</p>
              <p className="font-semibold text-ink text-sm">{formatDate(booking.slotDate)}</p>
              <p className="text-xs text-neutral-400">{formatSlot(booking.slotTime)}</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-xl">
              <p className="text-xs text-neutral-500">Property</p>
              <p className="font-semibold text-ink text-sm">{booking.propertyType}</p>
              <p className="text-xs text-neutral-400">{booking.propertySize}</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-xl">
              <p className="text-xs text-neutral-500">Plan</p>
              <p className="font-semibold text-ink text-sm">{formatPlan(booking.planType)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 — Start Navigation (EN_ROUTE) */}
      {status === 'TECHNICIAN_ASSIGNED' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Navigation2 className="w-5 h-5 text-blue-600" />
            <p className="font-display font-bold text-blue-900">Step 1 — Start Navigation</p>
          </div>
          <p className="text-blue-700 text-sm mb-4">Tap to mark yourself en route to the customer.</p>
          <button
            onClick={() => markEnRoute.mutate()}
            disabled={markEnRoute.isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {markEnRoute.isPending ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Starting...</>
            ) : (
              <><Navigation2 className="w-4 h-4" />Start Navigation</>
            )}
          </button>
        </div>
      )}

      {/* Step 2 — Mark Arrived */}
      {status === 'EN_ROUTE' && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            <p className="font-display font-bold text-sky-900">Step 2 — Mark Arrived</p>
          </div>
          <p className="text-sky-700 text-sm mb-4">You are on the way. Tap when you arrive at the customer location.</p>
          <button
            onClick={() => markArrived.mutate()}
            disabled={markArrived.isPending}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {markArrived.isPending ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Marking...</>
            ) : (
              <><MapPin className="w-4 h-4" />I&apos;ve Arrived</>
            )}
          </button>
        </div>
      )}

      {/* Fallback for old flow — TECHNICIAN_ASSIGNED → arrive directly */}
      {status === 'TECHNICIAN_ASSIGNED' && !markEnRoute.isSuccess && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <p className="text-teal-700 text-xs text-center">
            Or skip navigation and{' '}
            <button
              onClick={() => markArrived.mutate()}
              disabled={markArrived.isPending}
              className="font-bold underline"
            >
              mark arrived directly
            </button>
          </p>
        </div>
      )}

      {/* Step 3 — Inspection Report */}
      {(status === 'ARRIVED' || status === 'IN_PROGRESS') && !booking.report && (
        <div className="bg-card rounded-2xl border border-cream-300 p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-600" />
            <p className="font-display font-bold text-ink">Step 3 — Inspection Report</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">Severity: {severity}/5</label>
            <input type="range" min={1} max={5} value={severity} onChange={e => setSeverity(Number(e.target.value))}
              className="w-full accent-brand-600" />
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>Minimal</span><span>Moderate</span><span>Severe</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">Affected Areas</label>
            <div className="flex flex-wrap gap-2">
              {AFFECTED_AREAS.map(area => (
                <button key={area} type="button"
                  onClick={() => setAffectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    affectedAreas.includes(area) ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300')}>
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Recommended Treatment *</label>
            <textarea value={treatment} onChange={e => setTreatment(e.target.value)} rows={3}
              placeholder="Describe the recommended treatment..."
              className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm outline-none focus:border-brand-600 resize-none" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Chemicals (comma-separated)</label>
            <input value={chemicals} onChange={e => setChemicals(e.target.value)}
              placeholder="e.g. Imidacloprid Gel, Cypermethrin"
              className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm outline-none focus:border-brand-600" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Estimated Duration</label>
            <select value={duration} onChange={e => setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm outline-none focus:border-brand-600 bg-white">
              {DURATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Before Photos (min 2) *</label>
            <input ref={beforeRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => setBeforePhotos(Array.from(e.target.files || []))} />
            <button type="button" onClick={() => beforeRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-cream-300 rounded-xl text-sm text-neutral-600 hover:border-brand-600 w-full justify-center">
              <Camera className="w-4 h-4" />
              {beforePhotos.length > 0 ? `${beforePhotos.length} photos selected` : 'Upload Before Photos'}
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Any additional notes..."
              className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm outline-none focus:border-brand-600 resize-none" />
          </div>

          <button
            onClick={() => submitReport.mutate()}
            disabled={submitReport.isPending || !treatment || affectedAreas.length === 0}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitReport.isPending ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting...</>
            ) : 'Submit Inspection Report'}
          </button>
        </div>
      )}

      {/* Step 4 — Awaiting Customer Approval */}
      {status === 'INSPECTION_DONE' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <p className="font-display font-bold text-amber-900">Step 4 — Awaiting Customer Approval</p>
          </div>
          <p className="text-amber-700 text-sm">The customer needs to review and approve your inspection report.</p>
          <div className="mt-3 flex items-center gap-2 text-amber-600 text-xs">
            <Clock className="w-3.5 h-3.5" /> Auto-refreshes every 30 seconds...
          </div>
        </div>
      )}

      {/* Step 5 — Upload After Photos */}
      {status === 'APPROVED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <p className="font-display font-bold text-emerald-900">Step 5 — Upload After Photos</p>
          </div>
          <p className="text-emerald-700 text-sm">Customer approved. Proceed with treatment and upload after photos.</p>

          <div>
            <input ref={afterRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => setAfterPhotos(Array.from(e.target.files || []))} />
            <button type="button" onClick={() => afterRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-emerald-300 rounded-xl text-sm text-emerald-700 hover:border-emerald-500 w-full justify-center">
              <Camera className="w-4 h-4" />
              {afterPhotos.length > 0 ? `${afterPhotos.length} photos selected` : 'Upload After Photos'}
            </button>
          </div>

          {afterPhotos.length > 0 && (
            <button
              onClick={() => uploadAfterPhotos.mutate()}
              disabled={uploadAfterPhotos.isPending}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {uploadAfterPhotos.isPending ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Uploading...</>
              ) : 'Upload After Photos'}
            </button>
          )}
        </div>
      )}

      {/* Step 6 — Close Job with OTP */}
      {(status === 'APPROVED' || status === 'TREATMENT_DONE') && (booking.report?.afterPhotos?.length > 0 || status === 'TREATMENT_DONE') && (
        <div className="bg-forest-900 texture-organic rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <p className="font-display font-bold text-white">Step 6 — Close Job with OTP</p>
          </div>

          {process.env.NEXT_PUBLIC_MOCK_OTP && (
            <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl px-4 py-2">
              <p className="text-amber-300 text-xs font-bold">🧪 Dev OTP: {process.env.NEXT_PUBLIC_MOCK_OTP || '123456'}</p>
            </div>
          )}

          <button
            onClick={() => sendOtp.mutate()}
            disabled={sendOtp.isPending}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {sendOtp.isPending ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending...</>
            ) : (
              <><Send className="w-4 h-4" />Send OTP to Customer</>
            )}
          </button>

          {sendOtp.isSuccess && (
            <div className="space-y-3">
              <p className="text-white/85 text-sm text-center">OTP sent via WhatsApp & SMS</p>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-mono tracking-widest outline-none focus:border-emerald-400"
              />
              <button
                onClick={() => closeJob.mutate()}
                disabled={closeJob.isPending || otp.length !== 6}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {closeJob.isPending ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Closing...</>
                ) : (
                  <><Lock className="w-4 h-4" />Close Job</>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Completed */}
      {status === 'COMPLETED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <p className="font-display font-black text-emerald-900 text-xl">Job Completed!</p>
          <p className="text-emerald-700 text-sm mt-2">Great work! This job has been successfully closed.</p>
          <div className="mt-4 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
