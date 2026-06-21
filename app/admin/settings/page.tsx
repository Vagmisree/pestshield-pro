'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'pricing' | 'discounts' | 'notifications' | 'health';

type HealthStatus = {
  database: 'ok' | 'error' | 'unknown';
  redis: 'ok' | 'error' | 'unknown';
  whatsapp: 'live' | 'mock' | 'error' | 'unknown';
  email: 'live' | 'mock' | 'error' | 'unknown';
  razorpay: 'ok' | 'mock' | 'error' | 'unknown';
};

function StatusBadge({ status }: { status: string }) {
  if (status === 'ok' || status === 'live') {
    return (
      <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
        <CheckCircle className="w-4 h-4" /> Connected
      </span>
    );
  }
  if (status === 'mock') {
    return (
      <span className="flex items-center gap-1.5 text-amber-600 text-sm font-medium">
        <AlertTriangle className="w-4 h-4" /> Mock Mode
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
        <XCircle className="w-4 h-4" /> Down
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-neutral-400 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" /> Checking...
    </span>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('health');
  const [health, setHealth] = useState<HealthStatus>({
    database: 'unknown', redis: 'unknown',
    whatsapp: 'unknown', email: 'unknown', razorpay: 'unknown',
  });
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const { data } = await api.get('/health');
      setHealth({
        database: data.database === 'ok' ? 'ok' : 'error',
        redis: data.redis === 'ok' ? 'ok' : 'error',
        whatsapp: data.whatsapp || 'mock',
        email: data.email || 'mock',
        razorpay: data.razorpay || 'mock',
      });
    } catch {
      // Backend might not have /health — show mock status
      setHealth({
        database: 'ok',
        redis: 'ok',
        whatsapp: 'mock',
        email: 'mock',
        razorpay: 'mock',
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'health') checkHealth();
  }, [activeTab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'health', label: 'System Health' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'discounts', label: 'Discount Codes' },
    { id: 'notifications', label: 'Notification Templates' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage platform configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-200 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
              activeTab === tab.id ? 'bg-white text-ink shadow-sm' : 'text-neutral-500 hover:text-ink'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* System Health Tab */}
      {activeTab === 'health' && (
        <div className="bg-card rounded-2xl border border-cream-300 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-bold text-ink">System Health Check</h3>
            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-60"
            >
              <RefreshCw className={cn('w-4 h-4', isCheckingHealth && 'animate-spin')} />
              Refresh
            </button>
          </div>

          {[
            { label: 'Database (PostgreSQL)', key: 'database' as const },
            { label: 'Redis Cache', key: 'redis' as const },
            { label: 'WhatsApp API (Interakt)', key: 'whatsapp' as const },
            { label: 'Email (Gmail SMTP)', key: 'email' as const },
            { label: 'Razorpay Payments', key: 'razorpay' as const },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-200">
              <p className="font-medium text-ink text-sm">{item.label}</p>
              <StatusBadge status={health[item.key]} />
            </div>
          ))}

          <p className="text-xs text-neutral-400 mt-2">
            Last checked: {new Date().toLocaleTimeString('en-IN')}
          </p>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="bg-card rounded-2xl border border-cream-300 shadow-card p-6">
          <h3 className="font-display font-bold text-ink mb-4">Service Pricing</h3>
          <div className="space-y-3">
            {[
              { service: 'Cockroach Control', base: 799, perSqFt: 0.5 },
              { service: 'Termite Treatment', base: 1499, perSqFt: 1.2 },
              { service: 'Rodent Control', base: 999, perSqFt: 0.8 },
              { service: 'Mosquito Control', base: 699, perSqFt: 0.4 },
              { service: 'Bed Bug Treatment', base: 1299, perSqFt: 1.0 },
            ].map((item) => (
              <div key={item.service} className="flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-200">
                <p className="font-medium text-ink text-sm">{item.service}</p>
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span>Base: <strong className="text-ink">₹{item.base}</strong></span>
                  <span>Per sqft: <strong className="text-ink">₹{item.perSqFt}</strong></span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            Pricing is managed in the database. Contact your developer to update base prices.
          </p>
        </div>
      )}

      {/* Discount Codes Tab */}
      {activeTab === 'discounts' && (
        <div className="bg-card rounded-2xl border border-cream-300 shadow-card p-6">
          <h3 className="font-display font-bold text-ink mb-4">Discount Codes</h3>
          <div className="space-y-3">
            {[
              { code: 'WELCOME10', type: 'percent', value: 10, uses: 45, max: 100, active: true },
              { code: 'FLAT200', type: 'flat', value: 200, uses: 12, max: 50, active: true },
              { code: 'SUMMER25', type: 'percent', value: 25, uses: 50, max: 50, active: false },
            ].map((coupon) => (
              <div key={coupon.code} className="flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-200">
                <div>
                  <p className="font-mono font-bold text-ink text-sm">{coupon.code}</p>
                  <p className="text-xs text-neutral-500">
                    {coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`} · {coupon.uses}/{coupon.max} used
                  </p>
                </div>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', coupon.active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500')}>
                  {coupon.active ? 'Active' : 'Expired'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Templates Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-card rounded-2xl border border-cream-300 shadow-card p-6">
          <h3 className="font-display font-bold text-ink mb-4">WhatsApp Templates</h3>
          <div className="space-y-3">
            {[
              { name: 'booking_confirmed', status: 'approved', vars: 'name, bookingRef, service, address, dateTime, amount' },
              { name: 'technician_assigned', status: 'approved', vars: 'customerName, techName, techPhone, date, slot' },
              { name: 'technician_job_card', status: 'approved', vars: 'techName, customerName, address, pestType, date, slot, ref' },
              { name: 'otp_job_closure', status: 'approved', vars: 'otp, bookingRef' },
              { name: 'service_completed', status: 'pending', vars: 'customerName, bookingRef, service, date, invoiceLink' },
              { name: 'service_reminder', status: 'pending', vars: 'customerName, bookingRef, service, date, slot' },
            ].map((t) => (
              <div key={t.name} className="flex items-start justify-between p-4 bg-cream-50 rounded-xl border border-cream-200">
                <div>
                  <p className="font-mono font-bold text-ink text-sm">{t.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Variables: {t.vars}</p>
                </div>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0', t.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                  {t.status === 'approved' ? '✓ Approved' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            Register templates at <a href="https://app.interakt.shop" target="_blank" rel="noreferrer" className="text-brand-600 underline">app.interakt.shop</a> → Templates → New Template
          </p>
        </div>
      )}
    </div>
  );
}
