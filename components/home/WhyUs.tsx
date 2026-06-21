'use client'

import { useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { Check, Star, Shield, Leaf, Clock, Zap, RefreshCw, Smartphone } from 'lucide-react'

const FloatingCard3D = dynamic(
  () => import('@/components/three/FloatingCard3D').then(m => m.FloatingCard3D),
  { ssr: false, loading: () => <div className="rounded-2xl border border-white/10 bg-white/5 animate-pulse h-full" /> }
)

const benefits = [
  { icon: Leaf,       title: 'Free Inspection Report',           desc: 'No surprises. We assess before we treat.',                color: '#00FF64' },
  { icon: Shield,     title: 'Organic & WHO-Approved Chemicals',  desc: 'Safe for children, elderly, and pets.',                   color: '#34d399' },
  { icon: Zap,        title: 'Book in Under 60 Seconds',          desc: 'No calls, no waiting, no negotiation.',                   color: '#FFB800' },
  { icon: Smartphone, title: 'WhatsApp-First Updates',            desc: 'Real-time job status directly on WhatsApp.',              color: '#00FF64' },
  { icon: Check,      title: 'OTP-Verified Job Closure',          desc: 'You control when the job is marked complete.',            color: '#34d399' },
  { icon: RefreshCw,  title: '30-Day Re-Service Guarantee',       desc: 'Pests return? We come back. Free.',                       color: '#FFB800' },
]

const stats = [
  { value: '12,000+', label: 'Families Protected' },
  { value: '4.8★',    label: 'Google Rating'       },
  { value: '15+',     label: 'Cities'               },
  { value: '98%',     label: 'Success Rate'         },
]

export function WhyUs() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #071F17 0%, #0B3D2E 50%, #071F17 100%)' }}
    >
      {/* ── 3D floating accent orbs ─────────────────────────────── */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,100,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,184,0,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* ── Grid lines ──────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,100,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,100,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#00FF64]/40" />
            <span className="text-[#00FF64] text-xs font-mono tracking-[4px] uppercase">WHY PESTSHIELD PRO</span>
            <div className="h-px w-8 bg-[#00FF64]/40" />
          </div>
          <h2 className="font-heading font-extrabold text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
            Why 12,000+ Families{' '}
            <span className="relative inline-block">
              <span className="text-[#00FF64]">Trust Us</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                <motion.path
                  d="M0 3 Q50 0 100 3 Q150 6 200 3"
                  stroke="#00FF64" strokeWidth="2" fill="none"
                  initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
            </span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Six reasons the most discerning homeowners choose PestShield Pro over every competitor.
          </p>
        </motion.div>

        {/* ── 3D Benefits grid ────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 32, rotateX: 15 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ perspective: '800px' }}
              >
                <FloatingCard3D
                  className="h-full"
                  intensity={10}
                  style={{
                    background: 'rgba(11,61,46,0.3)',
                    border: '1px solid rgba(0,255,100,0.12)',
                    borderRadius: '16px',
                    padding: '28px',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border"
                    style={{
                      background: `${b.color}15`,
                      borderColor: `${b.color}30`,
                      boxShadow: `0 0 20px ${b.color}20`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: b.color }} />
                  </div>

                  {/* 3D raised number */}
                  <div
                    className="absolute top-5 right-5 font-heading font-black text-5xl leading-none select-none pointer-events-none"
                    style={{ color: 'rgba(0,255,100,0.04)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <h3 className="font-heading font-bold text-white text-base mb-2">{b.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{b.desc}</p>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-px"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.06 }}
                    style={{ background: `linear-gradient(90deg, transparent, ${b.color}40, transparent)` }}
                  />
                </FloatingCard3D>
              </motion.div>
            )
          })}
        </div>

        {/* ── Stats row — 3D perspective cards ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          style={{ perspective: '1200px' }}
        >
          {stats.map((s, i) => (
            <FloatingCard3D
              key={s.label}
              intensity={8}
              style={{
                background: 'rgba(7,31,23,0.8)',
                border: '1px solid rgba(0,255,100,0.15)',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center',
                backdropFilter: 'blur(16px)',
              }}
            >
              <motion.div
                className="font-heading font-black text-3xl text-white mb-1"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: 'spring', stiffness: 200, delay: 0.6 + i * 0.1 }}
              >
                {s.value}
              </motion.div>
              <div className="text-xs font-mono tracking-widest uppercase text-[#00FF64]/70">{s.label}</div>
            </FloatingCard3D>
          ))}
        </motion.div>

        {/* ── Rating + CTAs ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {/* Google rating badge */}
          <FloatingCard3D
            intensity={6}
            style={{
              background: 'rgba(7,31,23,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '999px',
              padding: '12px 24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" />)}
            </div>
            <span className="text-white font-bold text-sm">4.8/5</span>
            <span className="text-white/40 text-xs">from 2,400+ reviews</span>
          </FloatingCard3D>

          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-[#071F17] transition-all"
            style={{
              background: '#FFB800',
              boxShadow: '0 4px 24px rgba(255,184,0,0.3)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(255,184,0,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,184,0,0.3)')}
          >
            Book Free Inspection →
          </Link>

          <Link
            href="/about"
            className="text-white/60 hover:text-white font-medium text-sm transition-colors"
          >
            View Certifications →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
