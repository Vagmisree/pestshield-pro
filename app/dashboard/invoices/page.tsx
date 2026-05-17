'use client';

import { mockInvoices } from '@/lib/data/invoices';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filteredInvoices = filterStatus
    ? mockInvoices.filter(i => i.status === filterStatus)
    : mockInvoices;

  const totalAmount = mockInvoices.reduce((s, i) => s + i.total, 0);
  const paidAmount = mockInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const dueAmount = mockInvoices.filter(i => i.status === 'Due').reduce((s, i) => s + i.total, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-36 mb-2" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Invoices</h1>
        <p className="text-neutral-500 mt-1">View and manage your billing invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: totalAmount, color: 'border-l-neutral-400' },
          { label: 'Paid', value: paidAmount, color: 'border-l-emerald-400' },
          { label: 'Due', value: dueAmount, color: 'border-l-red-500' },
        ].map((s) => (
          <div key={s.label} className={cn('bg-card rounded-2xl p-4 border border-cream-300 shadow-card border-l-4', s.color)}>
            <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
            <p className="font-display font-black text-xl text-ink">₹{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[null, 'Paid', 'Due'].map((s) => (
          <button
            key={s ?? 'all'}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold transition-all',
              filterStatus === s ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300'
            )}
          >
            {s ?? `All (${mockInvoices.length})`}
          </button>
        ))}
      </div>

      {/* Invoice cards with stamp overlay */}
      <div className="space-y-3">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="relative bg-card rounded-2xl border border-cream-300 shadow-card p-6 overflow-hidden">
            {/* PAID/DUE stamp overlay */}
            {invoice.status === 'Paid' && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2 -rotate-12 pointer-events-none select-none">
                <span className="text-[56px] font-black text-emerald-400/8 leading-none">PAID</span>
              </div>
            )}
            {invoice.status === 'Due' && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2 -rotate-12 pointer-events-none select-none">
                <span className="text-[56px] font-black text-red-500/8 leading-none">DUE</span>
              </div>
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-display font-bold text-ink">{invoice.service}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Ref: {invoice.bookingNumber} · {invoice.date}</p>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold',
                  invoice.status === 'Paid' ? 'bg-emerald-400/10 text-emerald-600' : 'bg-red-100 text-red-600'
                )}>
                  {invoice.status}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-neutral-400">Base: ₹{invoice.baseAmount.toLocaleString()} + GST: ₹{invoice.gst.toLocaleString()}</p>
                  <p className="font-display font-black text-2xl text-ink mt-1">₹{invoice.total.toLocaleString()}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-cream-200 hover:bg-cream-300 text-neutral-700 text-xs font-bold rounded-xl transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
