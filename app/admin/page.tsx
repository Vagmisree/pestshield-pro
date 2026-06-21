'use client';

import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { motion } from 'framer-motion';
import { stagger, fadeInUp } from '@/lib/animations';
import { mockRenewals } from '@/lib/data/renewals';
import dynamic from 'next/dynamic';
import { TrendingUp, Users, Zap, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AreaChart = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });

const SERVICE_COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

// Fallback service breakdown if API doesn't return it
const DEFAULT_SERVICE_BREAKDOWN = [
  { service: 'Cockroach', count: 42 },
  { service: 'Termite', count: 28 },
  { service: 'Rodent', count: 19 },
  { service: 'Mosquito', count: 15 },
  { service: 'Bed Bug', count: 11 },
  { service: 'General', count: 8 },
];

export default function AdminDashboard() {
  const [period, setPeriod] = useState('30D');
  const { data: dashData, isLoading } = useAdminDashboard();

  const todayBookings = dashData?.todayBookings || { total: 0, confirmed: 0, inProgress: 0, completed: 0 };
  const revenue = dashData?.revenue || { today: 0, week: 0, month: 0, gstCollected: 0 };
  const technicianMap = dashData?.technicianMap || [];
  const upcomingSlots = dashData?.upcomingSlots || [];
  const monthlyRevenue = dashData?.revenueTrend || [];
  const serviceBreakdown = dashData?.serviceBreakdown || DEFAULT_SERVICE_BREAKDOWN;

  const kpiCards = [
    { title: "Today's Bookings", value: todayBookings.total, subtext: `${todayBookings.completed} completed`, icon: Zap, color: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-l-blue-500' },
    { title: 'Active Technicians', value: technicianMap.length, subtext: 'With location data', icon: Users, color: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-l-emerald-500' },
    { title: "Today's Revenue", value: `₹${revenue.today.toLocaleString()}`, subtext: `Month: ₹${revenue.month.toLocaleString()}`, icon: TrendingUp, color: 'bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-l-amber-500' },
    { title: 'Renewals Due', value: mockRenewals.length, subtext: `${mockRenewals.filter(r => r.daysRemaining < 7).length} urgent`, icon: RefreshCw, color: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-l-purple-500' },
    { title: 'Upcoming (24h)', value: upcomingSlots.length, subtext: 'Scheduled slots', icon: Calendar, color: 'bg-cyan-50', textColor: 'text-cyan-600', borderColor: 'border-l-cyan-500' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Dashboard</h1>
        <p className="text-neutral-600">Welcome to PestShield Admin Panel · Live data</p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={idx} variants={fadeInUp} className={cn('bg-card rounded-2xl p-5 border border-cream-300 shadow-card border-l-4', card.borderColor)}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', card.color)}>
                <Icon className={cn('w-5 h-5', card.textColor)} />
              </div>
              <p className="text-2xl font-display font-black text-ink">{card.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{card.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{card.subtext}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-cream-300 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-ink">Revenue Trend</h3>
            <div className="flex gap-1 bg-cream-200 p-1 rounded-xl">
              {['7D', '30D', '90D', '12M'].map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={cn('px-3 py-1.5 text-xs font-bold rounded-lg transition-colors',
                    period === p ? 'bg-white text-ink shadow-sm' : 'text-neutral-500 hover:text-ink')}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue.length ? monthlyRevenue : [{ month: 'No data', revenue: 0 }]}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD9D0" />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#FEFCF7', border: '1px solid #DDD9D0', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#revenueGrad)" name="Revenue (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-cream-300 rounded-2xl p-6 shadow-card">
          <h3 className="font-display font-bold text-ink mb-4">Today&apos;s Bookings</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[
              { name: 'Confirmed', value: todayBookings.confirmed },
              { name: 'In Progress', value: todayBookings.inProgress },
              { name: 'Completed', value: todayBookings.completed },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD9D0" />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#FEFCF7', border: '1px solid #DDD9D0', borderRadius: '12px' }} />
              <Bar dataKey="value" fill="#16a34a" name="Bookings" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 — Service Breakdown Donut */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-6">
          <h3 className="font-semibold text-ink mb-4">Bookings by Service</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={serviceBreakdown}
                dataKey="count"
                nameKey="service"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {serviceBreakdown.map((_: unknown, i: number) => (
                  <Cell key={i} fill={SERVICE_COLORS[i % SERVICE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} bookings`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Renewals */}
        <div className="bg-card border border-cream-300 rounded-2xl overflow-hidden shadow-card">
          <div className="p-5 border-b border-cream-200 flex items-center justify-between">
            <h3 className="font-display font-bold text-ink">Contract Renewals Due</h3>
            <span className="text-xs text-red-500 font-bold bg-red-50 px-2.5 py-1 rounded-full">
              {mockRenewals.filter(r => r.daysRemaining < 7).length} urgent
            </span>
          </div>
          <div className="divide-y divide-cream-100 overflow-y-auto max-h-[200px]">
            {mockRenewals.map((renewal) => (
              <div key={renewal.id} className="flex items-center gap-4 p-4">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0',
                  renewal.daysRemaining < 7 ? 'bg-red-500' : renewal.daysRemaining < 15 ? 'bg-amber-500' : 'bg-emerald-400')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{renewal.customerName}</p>
                  <p className="text-xs text-neutral-400">{renewal.serviceType}</p>
                </div>
                <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full',
                  renewal.daysRemaining < 7 ? 'bg-red-50 text-red-600' :
                  renewal.daysRemaining < 15 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600')}>
                  {renewal.daysRemaining}d left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
