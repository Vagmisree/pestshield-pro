'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, stagger } from '@/lib/animations';
import { mockTechnicians } from '@/lib/data/technicians';
import { Search, Star, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const availabilityColors: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  BUSY: 'bg-amber-100 text-amber-700',
  OFF_DUTY: 'bg-neutral-100 text-neutral-500',
  Available: 'bg-emerald-100 text-emerald-700',
  'On Job': 'bg-amber-100 text-amber-700',
  'On Leave': 'bg-neutral-100 text-neutral-500',
  Offline: 'bg-red-100 text-red-600',
};

export default function AdminTechniciansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());

  const filtered = mockTechnicians.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableCount = mockTechnicians.filter(t =>
    t.status === 'Available' || t.status === 'AVAILABLE'
  ).length;

  const viewHistory = (id: string) => {
    toast.info(`Viewing job history for technician ${id}`);
  };

  const toggleBlock = (id: string) => {
    setBlockedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success('Technician unblocked');
      } else {
        next.add(id);
        toast.success('Technician blocked');
      }
      return next;
    });
  };

  const editTechnician = (id: string) => {
    toast.info(`Edit skills for technician ${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Technicians</h1>
        <p className="text-neutral-500 mt-1">{availableCount} available · {mockTechnicians.length} total</p>
      </div>

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: mockTechnicians.length, color: 'border-l-brand-600' },
          { label: 'Available', value: availableCount, color: 'border-l-emerald-400' },
          { label: 'Avg Rating', value: (mockTechnicians.reduce((s, t) => s + t.rating, 0) / mockTechnicians.length).toFixed(1), color: 'border-l-accent-500' },
        ].map((s) => (
          <motion.div key={s.label} variants={fadeInUp} className={cn('bg-card rounded-2xl p-5 border border-cream-300 shadow-card border-l-4', s.color)}>
            <p className="text-2xl font-heading font-black text-ink">{s.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
        />
      </div>

      {/* Performance Table */}
      <div className="bg-card rounded-2xl border border-cream-300 shadow-card overflow-hidden">
        <div className="p-5 border-b border-cream-200">
          <h3 className="font-display font-bold text-ink">Technician Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Today</TableHead>
                <TableHead>This Month</TableHead>
                <TableHead>Avg Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const isBlocked = blockedIds.has(t.id);
                const availStatus = t.status === 'Available' ? 'AVAILABLE'
                  : t.status === 'On Job' ? 'BUSY'
                  : 'OFF_DUTY';
                return (
                  <TableRow key={t.id} className={cn(isBlocked && 'opacity-50')}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-ink text-sm">{t.name}</p>
                          <p className="text-xs text-neutral-500">{t.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(t.skills || []).slice(0, 2).map((s: string) => (
                          <span key={s} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-ink">{t.jobsToday || 0}</TableCell>
                    <TableCell className="text-neutral-600">{t.jobsTotal || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{t.rating?.toFixed(1) || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', availabilityColors[t.status] || 'bg-neutral-100 text-neutral-500')}>
                        {isBlocked ? 'Blocked' : t.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-neutral-400 hover:text-ink p-1 rounded-lg hover:bg-cream-100 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewHistory(t.id)}>
                            View Job History
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleBlock(t.id)}>
                            {isBlocked ? 'Unblock' : 'Block'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => editTechnician(t.id)}>
                            Edit Skills
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
