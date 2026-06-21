'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { Search, Calendar, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react'

const PipelineScene = dynamic(
  () => import('@/components/three/PipelineScene').then(mod => mod.PipelineScene),
  { ssr: false }
)

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'DETECTION',
    desc: 'Book in 60 seconds. Choose your service, pick a time slot, confirm. Instant booking confirmation via WhatsApp.',
    color: '#00FF64',
    kills: 1250,
  },
  {
    step: '02',
    icon: Calendar,
    title: 'ANALYSIS',
    desc: 'ISP-certified expert arrives on time with all equipment. GPS-tracked with real-time WhatsApp updates.',
    color: '#FFB800',
    kills: 3420,
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'DEPLOYMENT',
    desc: 'Child & pet safe chemicals. Zero mess, full transparency with a digital inspection report sent to you.',
    color: '#00FF64',
    kills: 5680,
  },
  {
    step: '04',
    icon: RefreshCw,
    title: 'ELIMINATION',
    desc: "Pests eliminated. We come back free if they return. Your satisfaction is our mission.",
    color: '#00FF64',
    kills: 12000,
  },
]

const DIAG_STRIPE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M-10 10l20-20M0 40l40-40M30 50l20-20' stroke='rgba(255,255,255,0.02)' stroke-width='1'/%3E%3C/svg%3E")`

export function HowItWorks() {
  const pipelineRef = useRef<any>(null)
  const [activeNode, setActiveNode] = useState(-1)

  const handleNodeActivate = (index: number) => {
    setActiveNode(index)
  }

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: '#030508', backgroundImage: DIAG_STRIPE, backgroundSize: '40px 40px' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#00FF64]/40" />
            <span className="text-[#00FF64] text-xs font-mono tracking-[4px] uppercase">TACTICAL PIPELINE</span>
            <div className="h-px w-8 bg-[#00FF64]/40" />
          </div>
          <h2 className="font-heading font-extrabold text-white text-4xl md:text-5xl tracking-tight mb-4">
            4-Stage Elimination Protocol
          </h2>
          <p className="text-white/55 text-lg max-w-md mx-auto">
            From threat detection to complete elimination.
          </p>
        </motion.div>

        {/* Pipeline 3D Scene */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <PipelineScene ref={pipelineRef} onNodeActivate={handleNodeActivate} />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px hidden md:block"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,255,100,0.2) 10%, rgba(0,255,100,0.2) 90%, transparent)' }}
            aria-hidden="true"
          />

          <div className="space-y-16 md:space-y-0">
            {STEPS.map((step, i) => (
              <StepRow key={step.step} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-20"
        >
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-[#071F17] transition-all group"
            style={{
              background: '#FFB800',
              boxShadow: '0 4px 20px rgba(255,184,0,0.25)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(255,184,0,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,184,0,0.25)')}
          >
            Book Now — It Takes 60 Seconds
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function StepRow({ step, index }: { step: typeof STEPS[number]; index: number }) {
  const ref  = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isEven = index % 2 === 0
  const Icon  = step.icon
  const [count, setCount] = useState(0)

  // Animated kill counter
  useEffect(() => {
    if (!inView) return
    let startTime: number | null = null
    const duration = 2000

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * step.kills))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, step.kills])

  return (
    <div ref={ref} className="relative md:grid md:grid-cols-2 md:gap-8 md:mb-16">
      {/* ── Content card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={`relative ${isEven ? 'md:col-start-1' : 'md:col-start-2 md:row-start-1'}`}
      >
        <div
          className="relative rounded-2xl p-8 border overflow-hidden group transition-all duration-300 hover:border-[rgba(0,255,100,0.2)]"
          style={{
            background: '#071F17',
            borderColor: 'rgba(255,255,255,0.05)',
          }}
        >
          {/* Decorative step number */}
          <span
            className="absolute font-heading font-black leading-none select-none pointer-events-none"
            style={{
              fontSize: 120,
              color: 'rgba(0,255,100,0.035)',
              bottom: -20,
              right: -10,
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            {step.step}
          </span>

          {/* Step label */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-mono tracking-[3px] uppercase"
              style={{ color: step.color }}
            >
              STEP {step.step}
            </span>
          </div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.2 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border"
            style={{
              background: `${step.color}10`,
              borderColor: `${step.color}25`,
              boxShadow: `0 0 20px ${step.color}15`,
            }}
          >
            <Icon className="h-6 w-6" style={{ color: step.color }} />
          </motion.div>

          <h3 className="font-heading font-bold text-white text-xl mb-3">{step.title}</h3>
          <p className="text-white/55 text-sm leading-relaxed mb-4">{step.desc}</p>

          {/* Bugs eliminated counter */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
            <div className="text-[#00FF64] text-xs font-mono">BUGS ELIMINATED:</div>
            <div className="text-white font-bold text-lg font-heading">{count.toLocaleString()}+</div>
          </div>

          {/* Green flash effect for ELIMINATION */}
          {step.title === 'ELIMINATION' && inView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute inset-0 bg-[#00FF64] rounded-2xl pointer-events-none"
            />
          )}
        </div>
      </motion.div>

      {/* ── Centre dot on timeline ────────────────────────────────── */}
      <div
        className={`hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 ${
          index === 0 ? 'top-10' : 'top-10'
        }`}
        style={{ top: 40 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.15 }}
          className="w-4 h-4 rounded-full border-2 z-10 relative"
          style={{
            background: step.color,
            borderColor: '#030508',
            boxShadow: `0 0 12px ${step.color}`,
            animation: 'bioGlowDot 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Empty column for alternating layout ──────────────────── */}
      <div className={`hidden md:block ${isEven ? 'md:col-start-2' : 'md:col-start-1'} md:row-start-1`} />

      <style>{`
        @keyframes bioGlowDot {
          0%,100% { box-shadow: 0 0 8px rgba(0,255,100,0.6); }
          50%      { box-shadow: 0 0 18px rgba(0,255,100,1); }
        }
      `}</style>
    </div>
  )
}
