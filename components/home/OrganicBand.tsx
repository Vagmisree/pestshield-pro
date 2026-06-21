'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const TILES = [
  {
    emoji: '🌱',
    title: 'Plant-Based Formula',
    sub: 'Zero synthetic pesticides',
  },
  {
    emoji: '🐕',
    title: 'Pet & Child Safe',
    sub: 'No harmful VOCs or fumes',
  },
  {
    emoji: '♻️',
    title: 'Eco-Certified',
    sub: 'ISO 14001 compliant process',
  },
]

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as number[] } },
})

// Decorative leaf SVG (inline, no external file)
function LeafDecor() {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[320px] lg:w-[440px] pointer-events-none select-none"
      style={{ opacity: 0.07, color: '#00FF64' }}
      aria-hidden="true"
    >
      <path d="M200 20 C280 20, 380 80, 380 200 C380 340, 280 460, 200 480 C120 460, 20 340, 20 200 C20 80, 120 20, 200 20Z"
        stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M200 20 L200 480" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
      <path d="M200 80 C240 100, 320 140, 340 200" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M200 80 C160 100, 80 140, 60 200" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M200 160 C250 170, 330 190, 355 230" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M200 160 C150 170, 70 190, 45 230" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M200 240 C245 248, 315 260, 340 290" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M200 240 C155 248, 85 260, 60 290" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M200 320 C235 330, 295 350, 310 380" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M200 320 C165 330, 105 350, 90 380" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function OrganicBand() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B3D2E 0%, #071F17 50%, #145c43 100%)',
      }}
    >
      {/* Leaf art */}
      <LeafDecor />

      {/* Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,255,100,0.08)' stroke-width='1'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp(0)}
            className="inline-flex items-center gap-2 mb-5"
          >
            <div className="h-px w-6" style={{ background: 'rgba(0,255,100,0.6)' }} />
            <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(0,255,100,0.7)' }}>
              🌿 ORGANIC COMMITMENT
            </span>
            <div className="h-px w-6" style={{ background: 'rgba(0,255,100,0.6)' }} />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp(0.1)}
            className="font-heading font-extrabold text-white leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
          >
            Nature-Friendly Pest Control.{' '}
            <span style={{ color: '#00FF64' }}>No Compromises.</span>
          </motion.h2>

          {/* Body */}
          <motion.p
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp(0.2)}
            className="text-lg leading-relaxed mb-10"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            PestShield Pro uses only ISP-approved organic chemicals in all residential
            treatments — completely safe for children, pets, and the environment.
            We believe effective pest control shouldn&apos;t come at the cost of your family&apos;s health.
          </motion.p>

          {/* Feature tiles */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="grid sm:grid-cols-3 gap-4 mb-10"
          >
            {TILES.map((tile) => (
              <motion.div
                key={tile.title}
                variants={fadeUp(0)}
                className="flex gap-3 rounded-xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <span className="text-2xl shrink-0">{tile.emoji}</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-snug mb-1">{tile.title}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{tile.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp(0.5)}
          >
            <Link
              href="/organic"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white border transition-all group"
              style={{ borderColor: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,100,0.5)'; e.currentTarget.style.color = '#00FF64' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff' }}
            >
              See Our Organic Services
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
