'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeUp, viewportSettings } from '@/lib/animations'

function getTimeToEndOfMonth() {
  // This function will only be called on client
  if (typeof window === 'undefined') {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const diff = endOfMonth.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div className="bg-forest-900 text-white font-mono font-black text-2xl md:text-3xl w-16 md:w-20 h-16 md:h-20 rounded-xl flex items-center justify-center shadow-lg">
        {pad(value)}
      </div>
      <span className="text-forest-900/80 text-xs font-semibold uppercase tracking-wider mt-2">{label}</span>
    </div>
  )
}

export function OfferBanner() {
  // Start with null — only populate after mount to avoid SSR/client mismatch
  const [time, setTime] = useState<ReturnType<typeof getTimeToEndOfMonth> | null>(null)

  useEffect(() => {
    // Set initial value on client only
    setTime(getTimeToEndOfMonth())
    const interval = setInterval(() => setTime(getTimeToEndOfMonth()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={fadeUp}
      className="bg-accent-500 py-14 md:py-16 overflow-hidden relative"
    >
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #1C1917 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Big 30% OFF */}
        <p className="font-heading font-black text-7xl md:text-8xl text-forest-900 leading-none mb-2">
          30% OFF
        </p>
        <p className="text-forest-900/80 font-semibold text-lg mb-2">
          your first booking — Use code{' '}
          <span className="bg-forest-900 text-accent-400 px-3 py-1 rounded-lg font-mono font-black text-base">
            PESTFREE30
          </span>
        </p>
        <p className="text-forest-900/75 text-sm mb-8">Offer ends in:</p>

        {/* Timer — only render after client mount to prevent hydration mismatch */}
        <div className="flex items-end justify-center gap-3 md:gap-4 mb-10">
          {time ? (
            <>
              <TimeBlock value={time.days} label="Days" />
              <span className="text-forest-900/75 font-black text-3xl mb-4">:</span>
              <TimeBlock value={time.hours} label="Hours" />
              <span className="text-forest-900/75 font-black text-3xl mb-4">:</span>
              <TimeBlock value={time.minutes} label="Mins" />
              <span className="text-forest-900/75 font-black text-3xl mb-4">:</span>
              <TimeBlock value={time.seconds} label="Secs" />
            </>
          ) : (
            /* Placeholder skeleton shown during SSR / before hydration */
            <div className="flex items-end gap-3 md:gap-4">
              {['Days', 'Hours', 'Mins', 'Secs'].map((label, i) => (
                <div key={label} className="flex flex-col items-center">
                  {i > 0 && <span className="sr-only">:</span>}
                  <div className="bg-forest-900/20 w-16 md:w-20 h-16 md:h-20 rounded-xl" />
                  <span className="text-forest-900/80 text-xs font-semibold uppercase tracking-wider mt-2">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/book"
          className="inline-flex items-center justify-center px-8 py-4 bg-forest-900 hover:bg-forest-800 text-white font-bold rounded-full transition-all shadow-lg text-base"
        >
          Claim Offer Now →
        </Link>
      </div>
    </motion.section>
  )
}
