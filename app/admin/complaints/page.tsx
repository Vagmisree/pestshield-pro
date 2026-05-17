'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { mockComplaints } from '@/lib/data/complaints';
import { Button } from '@/components/ui/button';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function AdminComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<typeof mockComplaints[0] | null>(null);

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'open', 'in-progress', 'resolved'];
  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    open: <AlertCircle className="w-4 h-4" />,
    'in-progress': <Clock className="w-4 h-4" />,
    resolved: <CheckCircle className="w-4 h-4" />,
  };

  const stats = [
    { label: 'Total Complaints', value: mockComplaints.length, color: 'bg-blue-50' },
    { label: 'Open', value: mockComplaints.filter((c) => c.status === 'open').length, color: 'bg-red-50' },
    { label: 'Resolved', value: mockComplaints.filter((c) => c.status === 'resolved').length, color: 'bg-green-50' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Complaints Management</h1>
        <p className="text-neutral-600">Track and resolve customer complaints</p>
      </div>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-4 mb-6"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className={`${stat.color} border border-neutral-200 rounded-xl p-4 text-center`}
          >
            <p className="text-neutral-600 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-white border border-neutral-200 rounded-xl p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search complaints"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Complaints Table */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr className="text-neutral-600 text-xs font-medium">
                <th className="text-left py-4 px-6">ID</th>
                <th className="text-left py-4 px-6">Customer</th>
                <th className="text-left py-4 px-6">Description</th>
                <th className="text-left py-4 px-6">Priority</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Date</th>
                <th className="text-left py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-4 px-6 font-medium text-neutral-900">#{complaint.id}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-neutral-900">{complaint.customerName}</p>
                      <p className="text-xs text-neutral-500">{complaint.bookingId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-600 max-w-xs truncate">{complaint.description}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[complaint.priority]}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {statusIcons[complaint.status]}
                      <span className="text-neutral-600">{complaint.status.replace('-', ' ').charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-600">{new Date(complaint.date).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No complaints found</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedComplaint(null)}
        >
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Complaint Details</h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-neutral-500 font-medium">COMPLAINT ID</p>
                <p className="text-neutral-900 font-medium">#{selectedComplaint.id}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">CUSTOMER</p>
                <p className="text-neutral-900">{selectedComplaint.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">DESCRIPTION</p>
                <p className="text-neutral-900">{selectedComplaint.description}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">PRIORITY</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[selectedComplaint.priority]}`}>
                  {selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">STATUS</p>
                <div className="flex items-center gap-2 mt-1">
                  {statusIcons[selectedComplaint.status]}
                  <span className="text-neutral-900">
                    {selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">RESOLUTION</p>
                <p className="text-neutral-900 text-sm">{selectedComplaint.resolution || 'Pending'}</p>
              </div>
            </div>

            <Button
              onClick={() => setSelectedComplaint(null)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
