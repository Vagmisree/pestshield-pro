'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Clock, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  TECHNICIAN_ASSIGNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  INSPECTION_DONE: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-cyan-100 text-cyan-700',
  COMPLETED: 'bg-emerald-400/15 text-emerald-700',
};

type Job = {
  id: string;
  bookingRef: string;
  service?: { name?: string };
  customer?: { name?: string };
  slotDate?: string;
  slotTime?: string;
  city?: string;
  address?: string;
  status: string;
};

export default function TechnicianJobsPage() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['tech-jobs'],
    queryFn: () => api.get('/technicians/me/jobs').then(r => r.data.data || []),
    refetchInterval: 60_000,
  });

  const jobsArr = Array.isArray(jobs) ? jobs as Job[] : [];
  const today = new Date().toISOString().split('T')[0];

  const grouped = {
    today: jobsArr.filter(j => j.slotDate?.startsWith(today) && j.status !== 'COMPLETED'),
    upcoming: jobsArr.filter(j => j.slotDate && j.slotDate > today && j.status !== 'COMPLETED'),
    past: jobsArr.filter(j => j.status === 'COMPLETED' || (j.slotDate && j.slotDate < today)),
  };

  if (isLoading) {
    return <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>;
  }

  const JobCard = ({ job }: { job: Job }) => (
    <Link href={`/technician/jobs/${job.id}`}
      className="block bg-card rounded-2xl border border-cream-300 shadow-card hover:shadow-hover transition-all overflow-hidden">
      <div className={cn('h-1', job.status === 'COMPLETED' ? 'bg-emerald-400' : job.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-blue-500')} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-display font-bold text-ink">{job.service?.name}</p>
            <p className="text-xs text-neutral-400">#{job.bookingRef}</p>
          </div>
          <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold', statusColors[job.status] || 'bg-neutral-100 text-neutral-600')}>
            {job.status?.replace('_', ' ')}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {job.slotDate?.split('T')[0]}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.slotTime}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.city}</span>
        </div>
        <div className="flex items-center justify-end mt-3">
          <span className="text-brand-600 text-xs font-bold flex items-center gap-1">View Details <ArrowRight className="w-3 h-3" /></span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-ink">My Jobs</h1>

      {grouped.today.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Today</p>
          <div className="space-y-3">{grouped.today.map(j => <JobCard key={j.id} job={j} />)}</div>
        </div>
      )}
      {grouped.upcoming.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Upcoming</p>
          <div className="space-y-3">{grouped.upcoming.map(j => <JobCard key={j.id} job={j} />)}</div>
        </div>
      )}
      {grouped.past.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Past</p>
          <div className="space-y-3">{grouped.past.map(j => <JobCard key={j.id} job={j} />)}</div>
        </div>
      )}
      {jobsArr.length === 0 && (
        <div className="text-center py-12 text-neutral-500">No jobs assigned yet.</div>
      )}
    </div>
  );
}
