'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle, AlertCircle, Info, Zap, RefreshCw, Filter } from 'lucide-react'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

type NotifType = 'booking' | 'payment' | 'complaint' | 'system' | 'renewal'

interface Notification {
  id: string
  type: NotifType
  title: string
  message: string
  timestamp: string
  read: boolean
  severity: 'info' | 'success' | 'warning' | 'error'
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'booking', title: 'New Booking Received', message: 'Ramesh Kumar booked Cockroach Control for 18 May 2026 at 10:00 AM in Hyderabad.', timestamp: '2026-05-17T09:30:00', read: false, severity: 'info' },
  { id: '2', type: 'payment', title: 'Payment Confirmed', message: 'Payment of ₹799 received for booking #PSP-2026-001. Mock payment ID: pay_mock_abc123.', timestamp: '2026-05-17T09:15:00', read: false, severity: 'success' },
  { id: '3', type: 'complaint', title: 'New Complaint Raised', message: 'Priya Sharma raised complaint #COMP-001: Pest returned after treatment. Booking #PSP-2026-002.', timestamp: '2026-05-17T08:45:00', read: false, severity: 'warning' },
  { id: '4', type: 'renewal', title: 'AMC Renewal Due', message: 'Anita Reddy\'s Annual Maintenance Contract expires in 5 days (22 May 2026). Send reminder.', timestamp: '2026-05-17T08:00:00', read: true, severity: 'warning' },
  { id: '5', type: 'booking', title: 'Booking Completed', message: 'Technician Suresh Reddy completed Termite Control for Vikram Singh. OTP verified.', timestamp: '2026-05-16T17:30:00', read: true, severity: 'success' },
  { id: '6', type: 'system', title: 'System Alert', message: 'Backend API response time exceeded 2s threshold. Check server health.', timestamp: '2026-05-16T14:00:00', read: true, severity: 'error' },
  { id: '7', type: 'payment', title: 'Refund Processed', message: 'Refund of ₹499 processed for cancelled booking #PSP-2026-003.', timestamp: '2026-05-16T11:00:00', read: true, severity: 'info' },
  { id: '8', type: 'booking', title: 'Technician Assigned', message: 'Ravi Kumar assigned to booking #PSP-2026-004 for Bed Bug Control on 19 May 2026.', timestamp: '2026-05-16T10:30:00', read: true, severity: 'info' },
]

const typeConfig: Record<NotifType, { label: string; color: string; bg: string }> = {
  booking: { label: 'Booking', color: 'text-blue-600', bg: 'bg-blue-50' },
  payment: { label: 'Payment', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  complaint: { label: 'Complaint', color: 'text-amber-600', bg: 'bg-amber-50' },
  system: { label: 'System', color: 'text-red-600', bg: 'bg-red-50' },
  renewal: { label: 'Renewal', color: 'text-purple-600', bg: 'bg-purple-50' },
}

const severityIcon = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
}

const severityColor = {
  info: 'text-blue-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<NotifType | 'all'>('all')

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-sm font-bold rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-neutral-600">System alerts, booking updates, and payment notifications</p>
        </div>
        <button onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-cream-200 hover:bg-cream-300 text-neutral-700 font-semibold rounded-xl transition-colors text-sm">
          <CheckCircle className="h-4 w-4" />Mark All Read
        </button>
      </div>

      {/* Filter tabs */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}
        className="flex flex-wrap gap-2 mb-6">
        {(['all', 'booking', 'payment', 'complaint', 'renewal', 'system'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize',
              filter === f ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300')}>
            {f === 'all' ? 'All' : typeConfig[f as NotifType]?.label}
            {f === 'all' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Notifications list */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
        {filtered.map((notif) => {
          const Icon = severityIcon[notif.severity]
          const typeConf = typeConfig[notif.type]
          return (
            <motion.div key={notif.id} variants={fadeUp}
              className={cn('bg-card rounded-2xl border shadow-card p-5 transition-all cursor-pointer hover:shadow-hover',
                notif.read ? 'border-cream-300' : 'border-brand-200 bg-brand-50/30')}>
              <div className="flex items-start gap-4" onClick={() => markRead(notif.id)}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', typeConf.bg)}>
                  <Icon className={cn('h-5 w-5', severityColor[notif.severity])} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn('font-display font-bold text-sm', notif.read ? 'text-neutral-700' : 'text-ink')}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0" />
                      )}
                    </div>
                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0', typeConf.bg, typeConf.color)}>
                      {typeConf.label}
                    </span>
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed">{notif.message}</p>
                  <p className="text-neutral-400 text-xs mt-2">
                    {new Date(notif.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 text-cream-300 mx-auto mb-4" />
          <p className="text-neutral-500">No notifications in this category</p>
        </div>
      )}
    </div>
  )
}
