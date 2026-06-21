'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useMyBookings } from '@/hooks/useCustomerDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight, CalendarDays, CreditCard, Sparkles, FileText,
  Plus, AlertCircle, User, Phone, Star, ClipboardList,
  MessageSquare, CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-emerald-400/15 text-emerald-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  TECHNICIAN_ASSIGNED: 'bg-purple-100 text-purple-700',
  INSPECTION_DONE: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-cyan-100 text-cyan-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  EN_ROUTE: 'bg-sky-100 text-sky-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date?: string | null) {
  if (!date) return '—';
  try { return format(new Date(date), 'dd MMM yyyy'); } catch { return date; }
}

function serviceEmoji(pestType?: string) {
  const map: Record<string, string> = {
    COCKROACH: '🪳', TERMITE: '🪲', RODENT: '🐀',
    MOSQUITO: '🦟', BED_BUG: '🛏️', GENERAL: '🏠',
  };
  return map[pestType || 'GENERAL'] || '🐛';
}

type Booking = {
  id: string;
  bookingRef?: string;
  service?: { name?: string; pestType?: string };
  slotDate?: string;
  slotTime?: string;
  status: string;
  address?: string;
  payment?: { total?: number };
  totalAmount?: number;
  technician?: {
    name: string;
    phone?: string;
    avgRating?: number;
    rating?: number;
    skills?: string[];
  };
  report?: { id?: string; status?: string } | null;
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: bookings = [], isLoading } = useMyBookings();

  const bookingArr: Booking[] = Array.isArray(bookings) ? bookings : [];

  const stats = useMemo(() => ({
    total: bookingArr.length,
    completed: bookingArr.filter((b) => b.status === 'COMPLETED').length,
    upcoming: bookingArr.filter((b) => ['CONFIRMED', 'TECHNICIAN_ASSIGNED', 'EN_ROUTE'].includes(b.status)).length,
    complaints: 0, // placeholder — wire to complaints API when available
  }), [bookingArr]);

  const activeTechnicianBooking = bookingArr.find((b) =>
    ['TECHNICIAN_ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'INSPECTION_DONE'].includes(b.status) && b.technician
  );

  const recentBookings = bookingArr.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Bookings', value: stats.total, sub: 'All time', color: 'border-l-brand-600', icon: Sparkles },
    { label: 'Upcoming', value: stats.upcoming, sub: 'Scheduled', color: 'border-l-blue-500', icon: CalendarDays },
    { label: 'Completed', value: stats.completed, sub: 'Services done', color: 'border-l-emerald-400', icon: CheckCircle },
    { label: 'Complaints', value: stats.complaints, sub: 'Open tickets', color: 'border-l-red-400', icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">

      {/* Section 1 — Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-emerald-500 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm">Welcome back 👋</p>
            <h1 className="font-display font-bold text-2xl mt-1">{user?.name}</h1>
            {user?.loyaltyPoints !== undefined && (
              <span className="mt-2 inline-flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                ⭐ {user.loyaltyPoints} Loyalty Points
              </span>
            )}
          </div>
          <Link
            href="/book"
            className="bg-white text-brand-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-cream-50 transition-colors flex-shrink-0"
          >
            + Book Service
          </Link>
        </div>
      </div>

      {/* Section 2 — Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={cn('bg-card rounded-2xl p-5 border border-cream-300 shadow-card border-l-4', card.color)}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-neutral-500">{card.label}</p>
                <Icon className="w-4 h-4 text-neutral-300" />
              </div>
              <p className="text-3xl font-heading font-black text-ink">{card.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Section 3 — Technician Assignment Card */}
      {activeTechnicianBooking && activeTechnicianBooking.technician && (
        <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-semibold text-ink text-sm">Your Technician is Assigned</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-700 flex-shrink-0">
              {activeTechnicianBooking.technician.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink">{activeTechnicianBooking.technician.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => {
                  const rating = activeTechnicianBooking.technician?.avgRating || activeTechnicianBooking.technician?.rating || 0;
                  return (
                    <Star
                      key={s}
                      className={cn('w-3 h-3', s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-300')}
                    />
                  );
                })}
                <span className="text-xs text-neutral-500 ml-1">
                  {(activeTechnicianBooking.technician.avgRating || activeTechnicianBooking.technician.rating || 0).toFixed(1)}/5
                </span>
              </div>
              {activeTechnicianBooking.technician.skills && (
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  Skills: {activeTechnicianBooking.technician.skills.join(', ')}
                </p>
              )}
            </div>
            {activeTechnicianBooking.technician.phone && (
              <a
                href={`tel:+91${activeTechnicianBooking.technician.phone}`}
                className="flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors flex-shrink-0"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className={cn('px-3 py-1 rounded-full text-xs font-medium', {
              'bg-blue-100 text-blue-700': activeTechnicianBooking.status === 'TECHNICIAN_ASSIGNED',
              'bg-sky-100 text-sky-700': activeTechnicianBooking.status === 'EN_ROUTE',
              'bg-amber-100 text-amber-700': activeTechnicianBooking.status === 'IN_PROGRESS',
              'bg-purple-100 text-purple-700': activeTechnicianBooking.status === 'INSPECTION_DONE',
            })}>
              {activeTechnicianBooking.status === 'TECHNICIAN_ASSIGNED' ? '🟡 Technician Assigned' :
               activeTechnicianBooking.status === 'EN_ROUTE' ? '🚗 On the Way' :
               activeTechnicianBooking.status === 'IN_PROGRESS' ? '🟠 Treatment In Progress' :
               '🔵 Inspection Done — Awaiting Your Approval'}
            </div>
          </div>

          {activeTechnicianBooking.status === 'INSPECTION_DONE' && activeTechnicianBooking.report && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm font-medium text-orange-800 mb-2">
                📋 Inspection Report Ready — Please Review & Approve
              </p>
              <Link
                href={`/booking-status/${activeTechnicianBooking.bookingRef}`}
                className="text-sm font-semibold text-brand-600 underline"
              >
                View Report & Approve →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Section 4 — Recent Bookings */}
      <div className="bg-card rounded-2xl border border-cream-300 shadow-card">
        <div className="flex items-center justify-between p-5 border-b border-cream-200">
          <h3 className="font-heading font-bold text-ink">Recent Services</h3>
          <Link href="/dashboard/bookings" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-cream-200">
          {recentBookings.map((booking) => (
            <Link key={booking.id} href={`/booking-status/${booking.bookingRef || booking.id}`}>
              <div className="flex items-center gap-3 p-4 hover:bg-cream-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-lg flex-shrink-0">
                  {serviceEmoji(booking.service?.pestType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{booking.service?.name || 'Service'}</p>
                  <p className="text-xs text-neutral-500">{formatDate(booking.slotDate)} · {booking.slotTime}</p>
                  {booking.address && (
                    <p className="text-xs text-neutral-400 truncate">{booking.address}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusColors[booking.status] || 'bg-neutral-100 text-neutral-600')}>
                    {formatStatus(booking.status)}
                  </span>
                  <p className="text-xs font-bold text-ink mt-1">
                    ₹{(booking.payment?.total || booking.totalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {recentBookings.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              <p>No bookings yet.</p>
              <Link href="/book" className="text-brand-600 font-semibold hover:underline mt-2 block">
                Book your first service →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Section 5 — Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: FileText, label: 'My Invoices', href: '/dashboard/invoices' },
          { icon: ClipboardList, label: 'Reports', href: '/dashboard/reports' },
          { icon: MessageSquare, label: 'Complaints', href: '/dashboard/complaints' },
          { icon: User, label: 'Profile', href: '/dashboard/profile' },
        ].map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-cream-300 hover:border-brand-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-brand-600" />
            </div>
            <span className="text-xs font-medium text-ink text-center">{label}</span>
          </Link>
        ))}
      </div>

    </div>
  );
}
