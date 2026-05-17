'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useMyBookings } from '@/hooks/useCustomerDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CalendarDays, CreditCard, Sparkles, FileText, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-emerald-400/15 text-emerald-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  TECHNICIAN_ASSIGNED: 'bg-purple-100 text-purple-700',
  INSPECTION_DONE: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-cyan-100 text-cyan-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const statusDots: Record<string, string> = {
  COMPLETED: 'bg-emerald-400',
  CONFIRMED: 'bg-blue-500',
  TECHNICIAN_ASSIGNED: 'bg-purple-500',
  IN_PROGRESS: 'bg-amber-500',
  CANCELLED: 'bg-red-500',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: bookings = [], isLoading } = useMyBookings();

  const stats = useMemo(() => {
    const arr = Array.isArray(bookings) ? bookings : [];
    return {
      total: arr.length,
      completed: arr.filter((b: { status: string }) => b.status === 'COMPLETED').length,
      scheduled: arr.filter((b: { status: string }) => ['CONFIRMED', 'TECHNICIAN_ASSIGNED'].includes(b.status)).length,
    };
  }, [bookings]);

  const upcomingBooking = Array.isArray(bookings)
    ? bookings.find((b: { status: string }) => ['CONFIRMED', 'TECHNICIAN_ASSIGNED'].includes(b.status))
    : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Services', value: stats.total, sub: `${stats.completed} completed`, color: 'border-l-brand-600', icon: Sparkles },
    { label: 'Scheduled', value: stats.scheduled, sub: 'Upcoming', color: 'border-l-blue-500', icon: CalendarDays },
    { label: 'Loyalty Points', value: user?.loyaltyPoints || 0, sub: 'Points earned', color: 'border-l-emerald-400', icon: Sparkles },
    { label: 'Completed', value: stats.completed, sub: 'All time', color: 'border-l-amber-500', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="relative bg-forest-900 texture-organic rounded-3xl p-8 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-emerald-400/80 text-sm font-medium mb-1">Good morning 🌿</p>
          <h2 className="text-3xl font-heading font-bold text-white mb-1">{user?.name}</h2>
          <p className="text-white/85 text-sm mb-6">Your home is protected</p>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="glass-card rounded-full px-4 py-2 text-sm text-white/85">
              <span className="font-bold text-white">{stats.completed}</span> Services done
            </div>
            <div className="glass-card rounded-full px-4 py-2 text-sm text-white/85">
              <span className="font-bold text-emerald-400">{user?.loyaltyPoints || 0}</span> Points
            </div>
          </div>
          <Link href="/book" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-md">
            <Plus className="w-4 h-4" /> Book New Service
          </Link>
          {upcomingBooking && (
            <div className="mt-5 flex items-center gap-3 bg-white/12 rounded-xl px-4 py-3">
              <CalendarDays className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-white/85 text-sm">
                <span className="font-bold text-white">Next service:</span>{' '}
                {(upcomingBooking as { service?: { name?: string } }).service?.name} · {(upcomingBooking as { slotDate?: string }).slotDate?.split('T')[0]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
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

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl border border-cream-300 shadow-card p-5">
        <p className="font-display font-bold text-ink mb-4 text-sm">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Plus, label: 'New Booking', href: '/book', color: 'bg-brand-50 text-brand-600' },
            { icon: FileText, label: 'View Reports', href: '/dashboard/reports', color: 'bg-emerald-400/10 text-emerald-600' },
            { icon: CreditCard, label: 'Invoices', href: '/dashboard/invoices', color: 'bg-amber-50 text-amber-600' },
            { icon: AlertCircle, label: 'Complaints', href: '/dashboard/complaints', color: 'bg-red-50 text-red-500' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream-100 hover:bg-cream-200 transition-colors group">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', action.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-neutral-600 group-hover:text-ink">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-card rounded-2xl border border-cream-300 shadow-card">
        <div className="flex items-center justify-between p-5 border-b border-cream-200">
          <h3 className="font-heading font-bold text-ink">Recent Services</h3>
          <Link href="/dashboard/bookings" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-cream-200">
          {(Array.isArray(bookings) ? bookings : []).slice(0, 4).map((booking: {
            id: string; service?: { name?: string }; slotDate?: string; status: string; totalAmount?: number
          }) => (
            <div key={booking.id} className="flex items-center gap-4 p-4 hover:bg-cream-100 transition-colors">
              <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', statusDots[booking.status] || 'bg-neutral-300')} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink text-sm truncate">{booking.service?.name || 'Service'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <CalendarDays className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs text-neutral-500">{booking.slotDate?.split('T')[0]}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[booking.status] || 'bg-neutral-100 text-neutral-600')}>
                  {booking.status}
                </span>
                <p className="text-xs font-semibold text-ink mt-1">₹{booking.totalAmount?.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {(!bookings || (bookings as unknown[]).length === 0) && (
            <div className="p-8 text-center text-neutral-500">
              <p>No bookings yet.</p>
              <Link href="/book" className="text-brand-600 font-semibold hover:underline mt-2 block">Book your first service →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
