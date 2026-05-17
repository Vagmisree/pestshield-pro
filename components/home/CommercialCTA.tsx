'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'

const verticals = [
  { emoji: '🍽️', label: 'Restaurants' },
  { emoji: '🏨', label: 'Hotels' },
  { emoji: '🏢', label: 'Offices' },
]

export function CommercialCTA() {
  return (
    <section className="relative bg-forest-950 texture-organic overflow-hidden py-16 md:py-20">
      {/* Diagonal edges */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-cream-100" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-cream-100" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeUp}
            className="max-w-xl"
          >
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-emerald-400/15 border-emerald-400/25 text-emerald-300 mb-5">
              Commercial Solutions
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight mb-4">
              Scale Your Business With PestShield
            </h2>
            <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8">
              Tailored pest management for hotels, restaurants, warehouses, and offices. Flexible AMC plans with dedicated account managers and compliance reports.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-accent-500 text-white font-bold rounded-full hover:bg-accent-600 transition-all shadow-lg"
              >
                Get Custom Quote →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>

          {/* Right — vertical cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={stagger}
            className="flex gap-4"
          >
            {verticals.map((v) => (
              <motion.div
                key={v.label}
                variants={fadeUp}
                className="glass-card rounded-2xl p-5 text-center min-w-[100px]"
              >
                <span className="text-3xl block mb-2">{v.emoji}</span>
                <span className="text-sm font-semibold text-white block mb-1">{v.label}</span>
                <span className="text-[10px] text-emerald-300 font-medium uppercase tracking-wider">AMC Available</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
