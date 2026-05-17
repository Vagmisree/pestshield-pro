'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, stagger } from '@/lib/animations';
import { mockTechnicians } from '@/lib/data/technicians';
import { Search, Star, Phone, Mail, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  Available: 'bg-emerald-400/15 text-emerald-700',
  'On Job': 'bg-amber-100 text-amber-700',
  'On Leave': 'bg-neutral-100 text-neutral-600',
  Offline: 'bg-red-100 text-red-600',
};

export default function AdminTechniciansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<typeof mockTechnicians[0] | null>(null);

  const filtered = mockTechnicians.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableCount = mockTechnicians.filter(t => t.status === 'Available').length;

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

      {/* Grid */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tech) => (
          <motion.div
            key={tech.id}
            variants={fadeInUp}
            onClick={() => setSelectedTech(tech)}
            className="bg-card rounded-2xl border border-cream-300 shadow-card p-5 hover:shadow-hover transition-all cursor-pointer"
          >
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg flex-shrink-0">
                {tech.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading font-bold text-ink">{tech.name}</h3>
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {tech.city}
                </p>
              </div>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tech.skills.slice(0, 2).map((s) => (
                <span key={s} className="px-2 py-0.5 bg-cream-200 text-neutral-600 text-xs rounded-full">{s}</span>
              ))}
            </div>

            {/* Rating + status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('w-3.5 h-3.5', i < Math.floor(tech.rating) ? 'fill-accent-500 text-accent-500' : 'text-cream-300')} />
                ))}
                <span className="text-xs text-neutral-500 ml-1">({tech.rating})</span>
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[tech.status] || 'bg-neutral-100 text-neutral-600')}>
                {tech.status}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-cream-200 flex items-center justify-between text-xs text-neutral-500">
              <span>{tech.jobsTotal} jobs</span>
              <span>₹{tech.revenue.toLocaleString()} revenue</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Modal */}
      {selectedTech && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTech(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-hover max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl">
                  {selectedTech.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-ink">{selectedTech.name}</h3>
                  <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', statusColors[selectedTech.status])}>
                    {selectedTech.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedTech(null)} className="p-2 hover:bg-cream-200 rounded-xl transition-colors">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Phone className="w-4 h-4 text-brand-600" /> {selectedTech.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="w-4 h-4 text-brand-600" /> {selectedTech.city}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('w-4 h-4', i < Math.floor(selectedTech.rating) ? 'fill-accent-500 text-accent-500' : 'text-cream-300')} />
                ))}
                <span className="text-sm font-medium text-ink ml-1">{selectedTech.rating}/5</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-cream-100 rounded-xl mb-5">
              <div className="text-center">
                <p className="text-xl font-black font-heading text-ink">{selectedTech.jobsTotal}</p>
                <p className="text-xs text-neutral-500">Total Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black font-heading text-ink">{selectedTech.jobsToday}</p>
                <p className="text-xs text-neutral-500">Today</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black font-heading text-ink">{selectedTech.reServiceRate}%</p>
                <p className="text-xs text-neutral-500">Re-service</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedTech.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200">{s}</span>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
