'use client';

import { motion } from 'framer-motion';
import { fadeInUp, stagger } from '@/lib/animations';
import { mockReports } from '@/lib/data/reports';
import { mockRevenueData } from '@/lib/data/revenueData';
import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';

const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });

export default function AdminReportsPage() {
  const reportTypeData = [
    { name: 'Pest Activity', value: mockReports.filter((r) => r.type === 'pest-activity').length },
    { name: 'Treatment', value: mockReports.filter((r) => r.type === 'treatment').length },
    { name: 'Safety', value: mockReports.filter((r) => r.type === 'safety').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const severityData = [
    { name: 'Low', value: mockReports.filter((r) => r.severity === 'low').length },
    { name: 'Medium', value: mockReports.filter((r) => r.severity === 'medium').length },
    { name: 'High', value: mockReports.filter((r) => r.severity === 'high').length },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Reports & Analytics</h1>
        <p className="text-neutral-600">Comprehensive inspection and performance reports</p>
      </div>

      {/* Quick Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total Reports', value: mockReports.length },
          { label: 'Active Infestations', value: mockReports.filter((r) => r.severity === 'high').length },
          { label: 'Treatment Completed', value: mockReports.filter((r) => r.type === 'treatment').length },
          { label: 'Monthly Revenue', value: `₹${(mockRevenueData.kpis?.todayRevenue || 0).toLocaleString()}` },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className="bg-white border border-neutral-200 rounded-xl p-4"
          >
            <p className="text-neutral-600 text-xs font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Report Types */}
        <motion.div
          variants={fadeInUp}
          className="bg-white border border-neutral-200 rounded-xl p-6"
        >
          <h3 className="font-bold text-neutral-900 mb-4">Reports by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Severity Distribution */}
        <motion.div
          variants={fadeInUp}
          className="bg-white border border-neutral-200 rounded-xl p-6"
        >
          <h3 className="font-bold text-neutral-900 mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="value" fill="#ef4444" name="Cases" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-white border border-neutral-200 rounded-xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-neutral-900">Recent Inspection Reports</h3>
          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200">
              <tr className="text-neutral-600 text-xs font-medium">
                <th className="text-left py-3">Report ID</th>
                <th className="text-left py-3">Booking</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Severity</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Findings</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.slice(0, 8).map((report) => (
                <tr key={report.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 font-medium text-neutral-900">#{report.id}</td>
                  <td className="py-3 text-neutral-600">#{report.bookingId}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {report.pestFound || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        report.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : report.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-600">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="py-3 text-neutral-600 max-w-xs truncate">{report.findings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Customer Satisfaction',
            value: '4.8/5',
            trend: '+0.2%',
            color: 'bg-green-50',
          },
          {
            title: 'On-time Completion',
            value: '94%',
            trend: '+2.1%',
            color: 'bg-blue-50',
          },
          {
            title: 'Repeat Bookings',
            value: '67%',
            trend: '+5.3%',
            color: 'bg-amber-50',
          },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className={`${metric.color} border border-neutral-200 rounded-xl p-6`}
          >
            <p className="text-neutral-600 text-sm font-medium">{metric.title}</p>
            <div className="flex items-end justify-between mt-4">
              <p className="text-3xl font-bold text-neutral-900">{metric.value}</p>
              <span className="text-green-600 text-sm font-medium">{metric.trend}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
