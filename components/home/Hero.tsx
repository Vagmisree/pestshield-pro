'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, Baby, CheckCircle, Star, Home, Building, Lock, ArrowRight, Play, ShieldCheck, Clock, Award } from 'lucide-react'

const badges = [
  { icon: Leaf, label: 'Organic Chemicals' },
  { icon: Baby, label: 'Child & Pet Safe' },
  { icon: CheckCircle, label: 'ISP Certified' },
]

const trustItems = [
  { icon: Star, value: '4.8/5', label: 'Rating', color: 'text-accent-500' },
  { icon: Home, value: '12,000+', label: 'Homes', color: 'text-emerald-400' },
  { icon: Building, value: '15+', label: 'Cities', color: 'text-blue-400' },
  { icon: Lock, value: 'DPDPA', label: 'Safe', color: 'text-purple-400' },
]

const highlights = [
  { icon: ShieldCheck, title: '30-Day Guarantee', desc: 'Pests return? We come back free.' },
  { icon: Clock, title: 'Book in 60 Seconds', desc: 'No calls, no waiting, instant slot.' },
  { icon: Award, title: 'Certified Technicians', desc: 'Background-verified professionals.' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex overflow-hidden bg-forest-950">
      {/* Full background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-technician.jpg"
          alt="Professional pest control technician"
          fill
          priority
          className="object-cover object-center opacity-35"
        />
        {/* Rich gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-forest-950/30" />
      </div>

      {/* Animated glow orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-brand-600 rounded-full blur-[120px]"
        />
      </div>

      {/* Texture */}
      <div className="absolute inset-0 z-0 texture-organic opacity-40" />

      {/* Main content */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-28 pb-24 md:pt-32 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Text */}
          <div>
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="pill-emerald-dark mb-8 w-fit"
            >
              <Leaf className="h-3.5 w-3.5 mr-1.5" />
              India&apos;s #1 Organic Pest Control Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black text-white leading-[1.02] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)' }}
            >
              India&apos;s Most Trusted
              <br />
              <span className="gradient-text">Pest Control</span>
              <br />
              Platform.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white/90 text-lg leading-relaxed max-w-lg mb-8"
            >
              Book a certified technician in{' '}
              <strong className="text-emerald-300">60 seconds</strong>.
              Organic chemicals, child-safe treatments, and a 30-day re-service guarantee.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {badges.map((badge) => (
                <div key={badge.label} className="glass-card inline-flex items-center gap-2 px-3.5 py-2 rounded-full">
                  <badge.icon className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">{badge.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link
                href="/book"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-full bg-accent-500 text-white hover:bg-accent-600 transition-all shadow-lg hover:shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">Book Free Inspection</span>
                <ArrowRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/70 transition-all"
              >
                <Play className="h-4 w-4" />
                View All Services
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {trustItems.map((item, index) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm font-bold text-white">{item.value}</span>
                  <span className="text-sm text-white/75">{item.label}</span>
                  {index < trustItems.length - 1 && (
                    <span className="hidden sm:block ml-2 text-white/30">·</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Feature highlight cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col gap-5"
          >
            {/* Large visual card — replaced with stats/info graphic */}
            <div className="relative rounded-3xl overflow-hidden h-64 shadow-2xl bg-gradient-to-br from-forest-800 to-forest-950 border border-white/10">
              {/* Background pattern */}
              <div className="absolute inset-0 texture-organic opacity-60" />
              {/* Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-600/20 rounded-full blur-2xl" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-7">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Customer Satisfaction</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-display font-black text-white">98%</span>
                      <span className="text-emerald-400 text-sm font-bold mb-1.5">↑ All time</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>

                {/* Middle — service pills */}
                <div className="flex flex-wrap gap-2">
                  {['Cockroach', 'Termite', 'Rodent', 'Mosquito', 'Bed Bug'].map((s) => (
                    <span key={s} className="px-3 py-1 bg-white/10 border border-white/15 rounded-full text-white text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['bg-emerald-400', 'bg-accent-500', 'bg-blue-400', 'bg-purple-400'].map((c, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-forest-900 flex items-center justify-center`}>
                          <span className="text-white text-[9px] font-black">{['R', 'P', 'A', 'S'][i]}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs font-medium">12,000+ happy customers</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent-500 text-accent-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Three highlight cards */}
            <div className="grid grid-cols-3 gap-4">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <motion.div
                    key={h.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-white font-bold text-xs leading-tight mb-1">{h.title}</p>
                    <p className="text-white/65 text-[11px] leading-tight">{h.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Rating strip */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <span className="text-white font-bold">4.8 / 5</span>
                <span className="text-white/70 text-sm">from 2,000+ reviews</span>
              </div>
              <div className="text-right">
                <p className="text-emerald-300 font-bold text-sm">30-Day</p>
                <p className="text-white/70 text-xs">Re-service guarantee</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom wave into cream */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#F7F5F0"/>
        </svg>
      </div>
    </section>
  )
}
