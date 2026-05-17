'use client';

import { mockReports } from '@/lib/data/reports';
import { mockBookings } from '@/lib/data/bookings';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const pestTypeColor: Record<string, string> = {
  Cockroaches: 'bg-green-500',
  Termites: 'bg-amber-500',
  Mosquitoes: 'bg-blue-500',
  'Bed Bugs': 'bg-red-500',
  Rodents: 'bg-orange-500',
};

const severityLevel: Record<string, number> = { Low: 1, Medium: 3, High: 5 };

export default function ReportsPage() {
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filteredReports = filterSeverity
    ? mockReports.filter(r => r.severity === filterSeverity)
    : mockReports;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56 mb-2" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Inspection Reports</h1>
        <p className="text-neutral-500 mt-1">Detailed reports from completed services</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[null, 'Low', 'Medium', 'High'].map((s) => (
          <button
            key={s ?? 'all'}
            onClick={() => setFilterSeverity(s)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold transition-all',
              filterSeverity === s ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300'
            )}
          >
            {s ?? `All (${mockReports.length})`}
          </button>
        ))}
      </div>

      {/* Report cards */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const booking = mockBookings.find(b => b.bookingNumber === report.bookingNumber);
          const sevLevel = severityLevel[report.severity] || 1;
          const sevColor = report.severity === 'High' ? 'bg-red-500' : report.severity === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400';

          return (
            <div key={report.id} className="bg-card rounded-2xl border border-cream-300 shadow-card overflow-hidden">
              {/* Pest-type color band */}
              <div className={cn('h-1.5', pestTypeColor[report.pestFound] || 'bg-brand-600')} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-display font-bold text-ink">{report.pestFound}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{report.date} · Technician: {report.technician}</p>
                  </div>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold',
                    'bg-emerald-400/10 text-emerald-600'
                  )}>
                    Approved
                  </span>
                </div>

                {/* Severity dots */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-neutral-400 font-medium">Severity:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className={cn('w-3.5 h-3.5 rounded-full', n <= sevLevel ? sevColor : 'bg-cream-300')} />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500 ml-1">{report.severity}</span>
                </div>

                <p className="text-sm text-neutral-600 mb-4">
                  <span className="font-medium">Affected:</span> {report.infestationArea}
                </p>

                {/* Download PDF button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-forest-900 text-white text-xs font-bold rounded-xl hover:bg-forest-800 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download Report PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
