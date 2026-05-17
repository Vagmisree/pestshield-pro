'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar, Footer, WhatsAppFloat } from '@/components/layout'
import { Search, CheckCircle, Clock, Wrench, MapPin, Phone, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'

const statusSteps = [
  { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, desc: 'Booking confirmed' },
  { id: 'ASSIGNED', label: 'Assigned', icon: Wrench, desc: 'Technician assigned' },
  { id: 'EN_ROUTE', label: 'On the Way', icon: MapPin, desc: 'Technician en route' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Clock, desc: 'Treatment underway' },
  { id: 'COMPLETED', label: 'Completed', icon: CheckCircle, desc: 'Job completed' },
]

// Mock booking data for demo
const mockBooking = {
  ref: 'PSP-2026-001',
  service: 'Cockroach Control',
  status: 'IN_PROGRESS',
  customerName: 'Ramesh Kumar',
  address: 'Flat 4B, Green Valley Apartments, Hyderabad',
  scheduledDate: '17 May 2026',
  scheduledTime: '10:00 AM – 11:00 AM',
  technician: { name: 'Suresh Reddy', phone: '+91 98765 11111', rating: 4.9 },
  amount: '₹799',
}

export default function BookingStatusPage() {
  const params = useParams()
  const ref = params.ref as string
  const [searchRef, setSearchRef] = useState(ref || '')
  const [booking, setBooking] = useState(ref ? mockBooking : null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchRef.toUpperCase() === 'PSP-2026-001') {
      setBooking(mockBooking)
      setNotFound(false)
    } else {
      setBooking(null)
      setNotFound(true)
    }
  }

  const currentStepIdx = booking ? statusSteps.findIndex(s => s.id === booking.status) : -1

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-forest-900 flex items-center justify-center mx-auto mb-4">
                <Search className="h-7 w-7 text-emerald-400" />
              </div>
              <h1 className="font-display font-black text-3xl text-ink mb-2">Track Your Booking</h1>
              <p className="text-neutral-500">Enter your booking reference number to check the status</p>
            </motion.div>

            {/* Search form */}
            <motion.form variants={fadeUp} onSubmit={handleSearch}
              className="flex gap-3 mb-8">
              <input value={searchRef} onChange={e => setSearchRef(e.target.value)}
                placeholder="e.g. PSP-2026-001"
                className="flex-1 px-5 py-3.5 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600 transition-colors font-mono" />
              <button type="submit"
                className="px-6 py-3.5 bg-forest-900 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                <Search className="h-4 w-4" />Track
              </button>
            </motion.form>

            {notFound && (
              <motion.div variants={fadeUp} className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
                <p className="text-red-600 font-semibold">Booking not found</p>
                <p className="text-red-500 text-sm mt-1">Check your reference number and try again. It was sent via SMS/WhatsApp.</p>
              </motion.div>
            )}

            {booking && (
              <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
                {/* Status tracker */}
                <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-cream-300 shadow-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-ink">Booking #{booking.ref}</h2>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-200">
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress steps */}
                  <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-2">
                    {statusSteps.map((step, idx) => {
                      const isDone = idx <= currentStepIdx
                      const isCurrent = idx === currentStepIdx
                      return (
                        <div key={step.id} className="flex items-center flex-shrink-0">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={cn('w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all',
                              isDone ? 'bg-forest-900 border-forest-900' : 'bg-white border-cream-300',
                              isCurrent && 'ring-4 ring-forest-900/20')}>
                              <step.icon className={cn('h-4 w-4', isDone ? 'text-white' : 'text-neutral-400')} />
                            </div>
                            <span className={cn('text-[10px] font-semibold text-center w-16', isDone ? 'text-forest-900' : 'text-neutral-400')}>
                              {step.label}
                            </span>
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div className={cn('h-0.5 w-8 mx-1 flex-shrink-0 mb-5', idx < currentStepIdx ? 'bg-forest-900' : 'bg-cream-300')} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Booking details */}
                <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-cream-300 shadow-card p-6">
                  <h3 className="font-display font-bold text-ink mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Wrench, label: 'Service', value: booking.service },
                      { icon: Calendar, label: 'Scheduled', value: `${booking.scheduledDate} · ${booking.scheduledTime}` },
                      { icon: MapPin, label: 'Address', value: booking.address },
                      { icon: CheckCircle, label: 'Amount', value: booking.amount },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <item.icon className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-medium">{item.label}</p>
                          <p className="text-sm font-semibold text-ink">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Technician card */}
                {booking.technician && (
                  <motion.div variants={fadeUp} className="bg-forest-900 rounded-2xl p-5 text-white">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Your Technician</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center">
                          <span className="font-display font-black text-emerald-400 text-lg">
                            {booking.technician.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-white">{booking.technician.name}</p>
                          <p className="text-emerald-400 text-sm">⭐ {booking.technician.rating} rating</p>
                        </div>
                      </div>
                      <a href={`tel:${booking.technician.phone}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-semibold">
                        <Phone className="h-4 w-4" />Call
                      </a>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={fadeUp} className="text-center">
                  <Link href="/dashboard"
                    className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                    View full booking history <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {!booking && !notFound && (
              <motion.div variants={fadeUp} className="text-center py-8 text-neutral-400">
                <p className="text-sm">Try <span className="font-mono font-bold text-neutral-600">PSP-2026-001</span> for a demo</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
