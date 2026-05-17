'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Briefcase, CheckCircle } from 'lucide-react';

export default function TechnicianProfilePage() {
  const { user } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['tech-profile-full'],
    queryFn: () => api.get(`/technicians/${user?.id}`).then(r => r.data.data).catch(() => null),
    enabled: !!user?.id,
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-32 rounded-2xl" /></div>;

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-2xl text-ink">My Profile</h1>

      {/* Profile card */}
      <div className="bg-forest-900 texture-organic rounded-2xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-400 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-black text-forest-900">{user?.name?.charAt(0)}</span>
        </div>
        <p className="font-display font-black text-white text-xl">{user?.name}</p>
        <p className="text-white/85 text-sm mt-1">{user?.phone}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
          <span className="text-white font-bold">{profile?.avgRating?.toFixed(1) || '4.8'}</span>
          <span className="text-white/70 text-sm">avg rating</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-4 border border-cream-300 shadow-card text-center">
          <Briefcase className="w-6 h-6 text-brand-600 mx-auto mb-2" />
          <p className="text-2xl font-display font-black text-ink">{profile?.totalJobsCompleted || 0}</p>
          <p className="text-xs text-neutral-500">Total Jobs</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-cream-300 shadow-card text-center">
          <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-2xl font-display font-black text-ink">{profile?.status || 'AVAILABLE'}</p>
          <p className="text-xs text-neutral-500">Status</p>
        </div>
      </div>

      {/* Skills */}
      {profile?.skillTags?.length > 0 && (
        <div className="bg-card rounded-2xl border border-cream-300 p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Skill Tags</p>
          <div className="flex flex-wrap gap-2">
            {profile.skillTags.map((skill: string) => (
              <span key={skill} className="px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-200">
                {skill.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
