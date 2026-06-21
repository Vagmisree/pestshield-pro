'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, Zap, Shield, Target } from 'lucide-react'

const MoleculeOrbit = dynamic(
  () => import('@/components/three/MoleculeOrbit').then(mod => mod.MoleculeOrbit),
  { ssr: false }
)

const FloatingCard3D = dynamic(
  () => import('@/components/three/FloatingCard3D').then(m => m.FloatingCard3D),
  { ssr: false, loading: () => <div className="rounded-2xl bg-white/5 animate-pulse h-full" /> }
)

// ── Data ──────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'scout', name: 'SCOUT UNIT', originalName: 'Basic Shield', price: 1999, validity: '6 months',
    visits: 2, popular: false, badge: null, protection: 40,
    tagline: 'Light reconnaissance & defense',
    features: [
      'Cockroach Elimination (2× strikes)',
      'Mosquito Neutralization (2× strikes)',
      'ISP Certified Operator',
      'Organic Arsenal',
      '30-Day Re-Deployment',
      'Tactical WhatsApp Support',
    ],
  },
  {
    id: 'strike', name: 'STRIKE FORCE', originalName: 'Pro Shield', price: 3499, validity: '12 months',
    visits: 4, popular: true, badge: 'MOST DEPLOYED', protection: 85,
    tagline: 'Full tactical assault team',
    features: [
      'All 6 Threat Types (4× coordinated strikes)',
      'Priority Strike Scheduling',
      'ISP Certified Senior Operator',
      'Organic Arsenal Only',
      '60-Day Re-Deployment',
      'Dedicated Command Officer',
      'Annual Threat Assessment',
      'Multi-Channel Tactical Support',
    ],
  },
  {
    id: 'siege', name: 'FULL SIEGE', originalName: 'Elite Shield', price: 5999, validity: '12 months',
    visits: 6, popular: false, badge: 'MAXIMUM FIREPOWER', protection: 100,
    tagline: 'Total domination protocol',
    features: [
      'All 6 Threat Types (6× overwhelming force)',
      'Same-Day Emergency Strike',
      'ISP Master Certified Operator',
      'Premium Organic Arsenal',
      '90-Day Re-Deployment',
      'Dedicated Command Officer',
      'Quarterly Threat Intelligence',
      'Priority Multi-Channel Support',
      'Free Perimeter Fortification',
    ],
  },
] as const

const HEX_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34z' fill='none' stroke='rgba(0,255,100,0.04)' stroke-width='1'/%3E%3C/svg%3E")`

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as number[] } },
})

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="h-px w-6 bg-[#00FF64]/60" />
      <span className="text-[#00FF64]/70 text-xs font-mono tracking-[0.2em] uppercase">{text}</span>
      <div className="h-px w-6 bg-[#00FF64]/60" />
    </div>
  )
}

function PlanCard({ plan, index }: { plan: typeof PLANS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [flipped, setFlipped] = useState(false)
  const [priceCount, setPriceCount] = useState(0)

  // Flip animation on view
  useEffect(() => {
    if (inView && !flipped) {
      setTimeout(() => setFlipped(true), index * 150)
    }
  }, [inView, flipped, index])

  // Price count-up
  useEffect(() => {
    if (!flipped) return
    let startTime: number | null = null
    const duration = 1500

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setPriceCount(Math.floor(eased * plan.price))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [flipped, plan.price])

  const cardInner = (
    <div
      className="relative flex flex-col h-full rounded-2xl p-7"
      style={{
        background: '#071F17',
        border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-4 py-1 rounded-full text-[10px] font-black tracking-[3px] uppercase"
            style={{
              background: plan.popular ? '#00FF64' : 'rgba(0,255,100,0.15)',
              color: plan.popular ? '#071F17' : '#00FF64',
              border: plan.popular ? 'none' : '1px solid rgba(0,255,100,0.3)',
            }}
          >
            {plan.badge}
          </span>
        </div>
      )}

      {/* 3D Molecule for popular card */}
      {plan.popular && (
        <div className="absolute top-4 right-4 w-20 h-20 pointer-events-none opacity-60">
          <MoleculeOrbit />
        </div>
      )}

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
        style={{
          background: plan.popular ? 'rgba(0,255,100,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${plan.popular ? 'rgba(0,255,100,0.25)' : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        {index === 0
          ? <Zap className="h-5 w-5" style={{ color: plan.popular ? '#00FF64' : 'rgba(255,255,255,0.4)' }} />
          : index === 1
          ? <Shield className="h-5 w-5" style={{ color: plan.popular ? '#00FF64' : 'rgba(255,255,255,0.4)' }} />
          : <Target className="h-5 w-5" style={{ color: plan.popular ? '#00FF64' : 'rgba(255,255,255,0.4)' }} />
        }
      </div>

      {/* Name */}
      <h3 className="font-heading font-bold text-white text-xl mb-1 tracking-wider">{plan.name}</h3>
      <p className="text-sm mb-5 font-mono" style={{ color: 'rgba(0,255,100,0.6)' }}>{plan.tagline}</p>

      {/* Protection Level */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-white/40">PROTECTION LEVEL</span>
          <span className="text-xs font-mono font-bold text-[#00FF64]">{plan.protection}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={flipped ? { width: `${plan.protection}%` } : { width: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${
                plan.protection === 100 ? '#FFB800' : '#00FF64'
              } 0%, ${plan.protection === 100 ? '#00FF64' : '#0B3D2E'} 100%)`,
              boxShadow: `0 0 10px ${plan.protection === 100 ? '#FFB800' : '#00FF64'}`,
            }}
          />
        </div>
      </div>

      {/* Price */}
      <div className="mb-2">
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>₹</span>
        <span className="font-heading font-black text-white" style={{ fontSize: 48, lineHeight: 1 }}>
          {flipped ? priceCount.toLocaleString() : '0'}
        </span>
        <span className="text-sm ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>/year</span>
      </div>
      <div className="mb-5 font-mono text-sm" style={{ color: 'rgba(0,255,100,0.6)' }}>
        {plan.visits} strikes · {plan.validity}
      </div>

      {/* Divider */}
      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Features */}
      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#00FF64' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={`/book?plan=${plan.id}`}
        data-magnetic
        data-spray
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all group"
        style={plan.popular ? {
          background: '#FFB800',
          color: '#071F17',
          boxShadow: '0 4px 20px rgba(255,184,0,0.25)',
        } : {
          background: 'transparent',
          color: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        onMouseEnter={e => {
          if (plan.popular) e.currentTarget.style.boxShadow = '0 0 30px rgba(255,184,0,0.5)'
          else { e.currentTarget.style.borderColor = 'rgba(0,255,100,0.4)'; e.currentTarget.style.color = '#00FF64' }
        }}
        onMouseLeave={e => {
          if (plan.popular) e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,184,0,0.25)'
          else { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }
        }}
      >
        DEPLOY NOW
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateY: 90 }}
      animate={flipped ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative h-full ${plan.popular ? 'md:-mt-4 md:mb-4 z-10 md:scale-105' : 'z-0'}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {plan.popular ? (
        /* Gradient border wrapper */
        <div
          className="rounded-2xl p-[1px] h-full"
          style={{
            background: 'linear-gradient(135deg, #00FF64, #0B3D2E 50%, #00FF64)',
            boxShadow: '0 0 50px rgba(0,255,100,0.15)',
          }}
        >
          <FloatingCard3D intensity={12} className="h-full" style={{ borderRadius: '14px', height: '100%' }}>
            {cardInner}
          </FloatingCard3D>
        </div>
      ) : (
        <FloatingCard3D intensity={8} className="h-full" style={{ borderRadius: '16px', height: '100%' }}>
          {cardInner}
        </FloatingCard3D>
      )}
    </motion.div>
  )
}

export function Plans() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="py-28 relative"
      id="plans"
      style={{ background: '#030508', backgroundImage: HEX_BG, backgroundSize: '56px 100px' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp(0)}><Eyebrow text="COMBAT PACKAGES" /></motion.div>
          <motion.h2
            variants={fadeUp(0.1)}
            className="font-heading font-extrabold text-white tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Annual Defense Contracts
          </motion.h2>
          <motion.p variants={fadeUp(0.2)} className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Deploy our tactical units for year-round protection. Cancel anytime.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 items-stretch" style={{ perspective: '1400px' }}>
          {PLANS.map((plan, i) => <PlanCard key={plan.id} plan={plan} index={i} />)}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-12"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}
        >
          {['🔒 No hidden fees', '✅ Cancel anytime', '📞 Free consultation', '🌿 Organic chemicals included'].map((item, i) => (
            <span key={item} className="flex items-center gap-5">
              {item}
              {i < 3 && <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
