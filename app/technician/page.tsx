'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, CheckCircle, Clock, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TechnicianDashboard() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['tech-jobs'],
    queryFn: () => api.get('/technicians/me/jobs').then(r => r.data.data || []),
    refetchInterval: 60_000,
  });

  const { data: techProfile } = useQuery({
    queryKey: ['tech-profile'],
    queryFn: () => api.get(`/technicians/${user?.id}`).then(r => r.data.data).catch(() => null),
    enabled: !!user?.id,
  });

  const toggleStatus = useMutation({
    mutationFn: (status: string) => api.patch(`/technicians/${user?.id}`, { status }),
    onSuccess: () => {
      toast.success('Availability updated');
      qc.invalidateQueries({ queryKey: ['tech-profile'] });
    },
  });

  const jobsArr = Array.isArray(jobs) ? jobs : [];
  const today = new Date().toISOString().split('T')[0];
  const todayJobs = jobsArr.filter((j: { slotDate?: string }) => j.slotDate?.startsWith(today));
  const completedToday = todayJobs.filter((j: { status?: string }) => j.status === 'COMPLETED').length;
  const nextJob = jobsArr.find((j: { status?: string }) => ['TECHNICIAN_ASSIGNED', 'IN_PROGRESS'].includes(j.status || ''));
  const isAvailable = techProfile?.status === 'AVAILABLE';

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="bg-forest-900 texture-organic rounded-2xl p-5">
        <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">Good morning</p>
        <h1 className="font-display font-black text-white text-2xl mb-3">{user?.name}</h1>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/85 text-sm">Availability Status</p>
            <p className={cn('font-bold text-sm mt-0.5', isAvailable ? 'text-emerald-400' : 'text-neutral-400')}>
              {isAvailable ? '● Available' : '○ Off Duty'}
            </p>
          </div>
          <button
            onClick={() => toggleStatus.mutate(isAvailable ? 'OFF_DUTY' : 'AVAILABLE')}
            disabled={toggleStatus.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-sm font-semibold"
          >
            {isAvailable ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-neutral-400" />}
            Toggle
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-4 border border-cream-300 shadow-card">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-display font-black text-ink">{todayJobs.length}</p>
          <p className="text-xs text-neutral-500 mt-1">Jobs Today</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-cream-300 shadow-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-display font-black text-ink">{completedToday}</p>
          <p className="text-xs text-neutral-500 mt-1">Completed Today</p>
        </div>
      </div>

      {/* Next Job */}
      {nextJob ? (
        <div className="bg-card rounded-2xl border border-cream-300 shadow-card overflow-hidden">
          <div className="bg-brand-600 px-5 py-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <p className="text-white font-bold text-sm">Next Job</p>
          </div>
          <div className="p-5">
            <p className="font-display font-bold text-ink text-lg">{(nextJob as { service?: { name?: string } }).service?.name}</p>
            <p className="text-neutral-500 text-sm mt-1">{(nextJob as { slotDate?: string }).slotDate?.split('T')[0]} · {(nextJob as { slotTime?: string }).slotTime}</p>
            <p className="text-neutral-600 text-sm mt-1">{(nextJob as { city?: string }).city}</p>
            <Link href={`/technician/jobs/${(nextJob as { id?: string }).id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-forest-900 hover:bg-brand-700 text-white font-bold rounded-xl transition-all">
              View Job Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-cream-300 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="font-display font-bold text-ink">All caught up!</p>
          <p className="text-neutral-500 text-sm mt-1">No pending jobs right now.</p>
        </div>
      )}

      {/* All jobs link */}
      <Link href="/technician/jobs"
        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-cream-300 text-neutral-700 font-semibold rounded-xl hover:border-brand-600 hover:text-brand-600 transition-all">
        View All Jobs <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
