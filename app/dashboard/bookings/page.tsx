'use client';

import { useMyBookings, useApproveReport } from '@/hooks/useCustomerDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Clock, MapPin, FileText, Search, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  TECHNICIAN_ASSIGNED: 'bg-purple-100 text-purple-700',
  INSPECTION_DONE: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-cyan-100 text-cyan-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-emerald-400/15 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const statusAccent: Record<string, string> = {
  COMPLETED: 'bg-emerald-400',
  CONFIRMED: 'bg-blue-500',
  TECHNICIAN_ASSIGNED: 'bg-purple-500',
  IN_PROGRESS: 'bg-amber-500',
  CANCELLED: 'bg-red-500',
};

const filterStatuses = ['All', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

type Booking = {
  id: string;
  bookingRef: string;
  service?: { name?: string };
  slotDate?: string;
  slotTime?: string;
  city?: string;
  status: string;
  totalAmount?: number;
  report?: { id: string; status: string } | null;
};

export default function BookingsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [reportModal, setReportModal] = useState<{ bookingId: string; reportId: string } | null>(null);
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(null);
  const { data: bookings = [], isLoading } = useMyBookings();
  const approveReport = useApproveReport();

  const filtered = (Array.isArray(bookings) ? bookings as Booking[] : []).filter((b) => {
    const matchFilter = filter === 'All' || b.status === filter;
    const matchSearch = !search || b.bookingRef?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const openReport = async (bookingId: string, reportId: string) => {
    setReportModal({ bookingId, reportId });
    try {
      const { data } = await api.get(`/reports/${bookingId}`);
      setReportData(data.data);
    } catch {
      toast.error('Could not load report');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48 mb-2" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">My Bookings</h1>
        <p className="text-neutral-500 mt-1">View and manage all your pest control bookings</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15" />
        </div>
        {filterStatuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-4 py-2 rounded-full text-sm font-semibold transition-all',
              filter === s ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300')}>
            {s === 'All' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="space-y-3">
        {filtered.map((booking) => (
          <div key={booking.id} className="bg-card rounded-2xl border border-cream-300 shadow-card hover:shadow-hover transition-all overflow-hidden">
            <div className={cn('h-1', statusAccent[booking.status] || 'bg-neutral-300')} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-display font-bold text-ink">{booking.service?.name || 'Service'}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">#{booking.bookingRef}</p>
                </div>
                <span className={cn('px-3 py-1 rounded-full text-xs font-bold shrink-0', statusColors[booking.status] || 'bg-neutral-100 text-neutral-600')}>
                  {booking.status?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-neutral-500 mb-4">
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {booking.slotDate?.split('T')[0]}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.slotTime}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.city}</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {booking.status === 'INSPECTION_DONE' && booking.report && (
                  <button onClick={() => openReport(booking.id, booking.report!.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl hover:bg-orange-100 transition-colors">
                    <FileText className="w-3.5 h-3.5" /> View & Approve Report
                  </button>
                )}
                <span className="ml-auto font-bold text-ink text-sm">₹{booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-500">No bookings found</div>
        )}
      </div>

      {/* Report Approval Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setReportModal(null)}>
          <div className="bg-card rounded-2xl shadow-hover max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-ink text-lg">Inspection Report</h3>
              <button onClick={() => setReportModal(null)} className="p-2 hover:bg-cream-200 rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>
            {reportData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-neutral-500 uppercase">Pest Found</p><p className="font-bold text-ink">{String((reportData as { pestType?: unknown }).pestType || '')}</p></div>
                  <div><p className="text-xs text-neutral-500 uppercase">Severity</p><p className="font-bold text-ink">{String((reportData as { severity?: unknown }).severity || '')}</p></div>
                </div>
                <div><p className="text-xs text-neutral-500 uppercase mb-1">Affected Areas</p>
                  <p className="text-sm text-neutral-700">{((reportData as { affectedAreas?: unknown[] }).affectedAreas || []).join(', ')}</p>
                </div>
                <div><p className="text-xs text-neutral-500 uppercase mb-1">Recommended Treatment</p>
                  <p className="text-sm text-neutral-700">{String((reportData as { recommendedTreatment?: unknown }).recommendedTreatment || '')}</p>
                </div>
                <div><p className="text-xs text-neutral-500 uppercase mb-1">Chemicals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {((reportData as { chemicalsToBeUsed?: unknown[] }).chemicalsToBeUsed || []).map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-cream-200 text-neutral-700 text-xs rounded-full">{String(c)}</span>
                    ))}
                  </div>
                </div>
                {(reportData as { status?: unknown }).status === 'PENDING_APPROVAL' && (
                  <button
                    onClick={async () => {
                      await approveReport.mutateAsync(reportModal.reportId);
                      setReportModal(null);
                    }}
                    disabled={approveReport.isPending}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {approveReport.isPending ? 'Approving...' : 'Approve Report & Start Treatment'}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
