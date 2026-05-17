'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, MapPin, Clock, CheckCircle, Camera, Send, Lock, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const AFFECTED_AREAS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'Store Room', 'Roof/Attic', 'Garden/Balcony', 'Entire Property'];
const DURATIONS = ['30 min', '45 min', '1 hr', '1.5 hrs', '2 hrs', '3 hrs', '4 hrs'];

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
    refetchInterval: 60_000,
  });

  const markArrived = useMutation({
    mutationFn: () => api.post(`/bookings/${bookingId}/arrive`),
    onSuccess: () => { toast.success('Marked as arrived!'); qc.invalidateQueries({ queryKey: ['booking', bookingId] }); },
    onError: () => toast.error('Failed to mark arrived'),
  });

  const submitReport = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('bookingId', bookingId);
      form.append('pestType', booking?.service?.pestType || 'GENERAL');
      form.append('severity', `LEVEL_${severity}`);
      affectedAreas.forEach(a => form.append('affectedAreas[]', a));
      form.append('recommendedTreatment', treatment);
      chemicals.split(',').map(c => c.trim()).filter(Boolean).forEach(c => form.append('chemicalsToBeUsed[]', c));
      form.append('estimatedDuration', duration);
      form.append('technicianNotes', notes);
      beforePhotos.forEach(f => form.append('photos', f));
      await api.post('/reports', { bookingId, pestType: booking?.service?.pestType || 'GENERAL', severity: `LEVEL_${severity}`, affectedAreas, recommendedTreatment: treatment, chemicalsToBeUsed: chemicals.split(',').map(c => c.trim()).filter(Boolean), estimatedDuration: duration, technicianNotes: notes });
    },
    onSuccess: () => { toast.success('Inspection report submitted!'); qc.invalidateQueries({ queryKey: ['booking', bookingId] }); },
    onError: () => toast.error('Failed to submit report'),
  });

  const uploadAfterPhotos = useMutation({
    mutationFn: async () => {
      const reportId = booking?.report?.id;
      if (!reportId) throw new Error('No report found');
      const form = new FormData();
      afterPhotos.forEach(f => form.append('photos', f));
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

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-60 rounded-2xl" /></div>;
  if (!booking) return <div className="text-center py-12 text-neutral-500">Booking not found</div>;

  const status = booking.status;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/technician/jobs" className="p-2 hover:bg-cream-200 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-xl text-ink">{booking.service?.name}</h1>
          <p className="text-xs text-neutral-400">#{booking.bookingRef}</p>
        </div>
      </div>

      {/* Customer info */}
      <div className="bg-card rounded-2xl border border-cream-300 p-5 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Customer</p>
        <p className="font-display font-bold text-ink text-lg">{booking.customer?.name}</p>
        <div className="flex flex-col gap-2 mt-3">
          <a href={`tel:${booking.customer?.user?.phone}`}
            className="flex items-center gap-2 text-brand-600 font-semibold text-sm">
            <Phone className="w-4 h-4" /> {booking.customer?.user?.phone} (tap to call)
          </a>
          <p className="flex items-start gap-2 text-sm text-neutral-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-neutral-400" /> {booking.address}, {booking.city}
          </p>
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4 text-neutral-400" /> {booking.slotDate?.split('T')[0]} · {booking.slotTime}
          </p>
        </div>
      </div>

      {/* Step A — Mark Arrived */}
      {status === 'TECHNICIAN_ASSIGNED' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="font-display font-bold text-blue-900 mb-2">Step 1 — Navigate & Arrive</p>
          <p className="text-blue-700 text-sm mb-4">Travel to the customer location and click when you arrive.</p>
          <button onClick={() => markArrived.mutate()} disabled={markArrived.isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-60">
            {markArrived.isPending ? 'Marking...' : '✓ Mark as Arrived'}
          </button>
        </div>
      )}

      {/* Step B — Inspection Form */}
      {status === 'IN_PROGRESS' && !booking.report && (
        <div className="bg-card rounded-2xl border border-cream-300 p-5 shadow-card space-y-4">
          <p className="font-display font-bold text-ink">Step 2 — Inspection Report</p>

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
                <button key={area} onClick={() => setAffectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    affectedAreas.includes(area) ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300')}>
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Recommended Treatment *</label>
            <textarea value={treatment} onChange={e => setTreatment(e.target.value)} rows={3} placeholder="Describe the recommended treatment..."
              className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm outline-none focus:border-brand-600 resize-none" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Chemicals (comma-separated)</label>
            <input value={chemicals} onChange={e => setChemicals(e.target.value)} placeholder="e.g. Imidacloprid Gel, Cypermethrin"
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
            <button onClick={() => beforeRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-cream-300 rounded-xl text-sm text-neutral-600 hover:border-brand-600 w-full justify-center">
              <Camera className="w-4 h-4" /> {beforePhotos.length > 0 ? `${beforePhotos.length} photos selected` : 'Upload Before Photos'}
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any additional notes..."
              className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm outline-none focus:border-brand-600 resize-none" />
          </div>

          <button onClick={() => submitReport.mutate()} disabled={submitReport.isPending || !treatment || affectedAreas.length === 0}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all disabled:opacity-50">
            {submitReport.isPending ? 'Submitting...' : 'Submit Inspection Report'}
          </button>
        </div>
      )}

      {/* Step C — Awaiting Approval */}
      {status === 'INSPECTION_DONE' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-display font-bold text-amber-900 mb-2">Step 3 — Awaiting Customer Approval</p>
          <p className="text-amber-700 text-sm">The customer needs to review and approve your inspection report. This page auto-refreshes every 60 seconds.</p>
          <div className="mt-3 flex items-center gap-2 text-amber-600 text-xs">
            <Clock className="w-3.5 h-3.5" /> Waiting for customer approval...
          </div>
        </div>
      )}

      {/* Step D — Treatment */}
      {status === 'APPROVED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <p className="font-display font-bold text-emerald-900">Step 4 — Proceed with Treatment</p>
          <p className="text-emerald-700 text-sm">Customer has approved the report. Proceed with treatment and upload after photos.</p>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">After Treatment Photos</label>
            <input ref={afterRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => setAfterPhotos(Array.from(e.target.files || []))} />
            <button onClick={() => afterRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-emerald-300 rounded-xl text-sm text-emerald-700 hover:border-emerald-500 w-full justify-center">
              <Camera className="w-4 h-4" /> {afterPhotos.length > 0 ? `${afterPhotos.length} photos selected` : 'Upload After Photos'}
            </button>
          </div>

          {afterPhotos.length > 0 && (
            <button onClick={() => uploadAfterPhotos.mutate()} disabled={uploadAfterPhotos.isPending}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-60">
              {uploadAfterPhotos.isPending ? 'Uploading...' : 'Upload After Photos'}
            </button>
          )}
        </div>
      )}

      {/* Step E — OTP Closure */}
      {(status === 'APPROVED' || status === 'IN_PROGRESS') && booking.report?.afterPhotos?.length > 0 && (
        <div className="bg-forest-900 texture-organic rounded-2xl p-5 space-y-4">
          <p className="font-display font-bold text-white">Step 5 — Close Job with OTP</p>

          {process.env.NEXT_PUBLIC_MOCK_OTP && (
            <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl px-4 py-2">
              <p className="text-amber-300 text-xs font-bold">🧪 Dev OTP: {process.env.NEXT_PUBLIC_MOCK_OTP || '123456'}</p>
            </div>
          )}

          <button onClick={() => sendOtp.mutate()} disabled={sendOtp.isPending}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <Send className="w-4 h-4" /> {sendOtp.isPending ? 'Sending...' : 'Send OTP to Customer'}
          </button>

          {sendOtp.isSuccess && (
            <div className="space-y-3">
              <p className="text-white/85 text-sm text-center">OTP sent via WhatsApp & SMS</p>
              <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP"
                maxLength={6} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-mono tracking-widest outline-none focus:border-emerald-400" />
              <button onClick={() => closeJob.mutate()} disabled={closeJob.isPending || otp.length !== 6}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Lock className="w-4 h-4" /> {closeJob.isPending ? 'Closing...' : 'Close Job'}
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
        </div>
      )}
    </div>
  );
}
