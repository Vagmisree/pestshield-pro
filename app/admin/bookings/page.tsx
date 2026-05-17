'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { mockBookings } from '@/lib/data/bookings';
import { Search, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Booking = typeof mockBookings[0];

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-400/15 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
  'In Progress': 'bg-amber-100 text-amber-700',
};

const statuses = ['all', 'Scheduled', 'Completed', 'Cancelled', 'In Progress'];

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Bookings Management</h1>
        <p className="text-neutral-500 mt-1">Manage and track all customer bookings</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by customer or booking ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
          />
        </div>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              statusFilter === s ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300'
            )}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-card border border-cream-300 rounded-2xl overflow-hidden shadow-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-cream-200">
              <tr className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                <th className="text-left py-3 px-5">ID</th>
                <th className="text-left py-3 px-5">Customer</th>
                <th className="text-left py-3 px-5">Service</th>
                <th className="text-left py-3 px-5">Date</th>
                <th className="text-left py-3 px-5">Amount</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-ink">#{booking.bookingNumber}</td>
                  <td className="py-3.5 px-5">
                    <p className="font-medium text-ink">{booking.technician.name}</p>
                    <p className="text-xs text-neutral-500">{booking.city}</p>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-600">{booking.service}</td>
                  <td className="py-3.5 px-5 text-neutral-600">{booking.date}</td>
                  <td className="py-3.5 px-5 font-medium text-ink">₹{booking.total}</td>
                  <td className="py-3.5 px-5">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[booking.status] || 'bg-neutral-100 text-neutral-600')}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-neutral-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="p-12 text-center text-neutral-500">No bookings found</div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-hover max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-ink">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-cream-200 rounded-xl transition-colors">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Booking ID', value: selectedBooking.bookingNumber },
                { label: 'Technician', value: selectedBooking.technician.name },
                { label: 'Phone', value: selectedBooking.technician.phone },
                { label: 'Service', value: selectedBooking.service },
                { label: 'Date', value: selectedBooking.date },
                { label: 'Amount', value: `₹${selectedBooking.total}` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2 border-b border-cream-200 last:border-0">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">{row.label}</span>
                  <span className="text-sm font-medium text-ink">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-xs text-neutral-500 uppercase tracking-wider">Status</span>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[selectedBooking.status] || 'bg-neutral-100 text-neutral-600')}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
