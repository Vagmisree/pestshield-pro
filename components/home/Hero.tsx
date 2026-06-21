'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import {
  Leaf, Baby, CheckCircle, ArrowRight, Play,
  Star, Home, Building, Lock, Phone, MapPin,
  Shield, ChevronDown,
} from 'lucide-react'
import { HUDTerminal } from './HUDTerminal'
import { PersistentBug } from './PersistentBug'

const HeroSequence = dynamic(
  () => import('@/components/three/HeroSequence').then(mod => mod.HeroSequence),
  { ssr: false }
)

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES_LIST = [
  'Cockroach Control', 'Termite Control', 'Rodent Control',
  'Mosquito Control', 'Bed Bug Control', 'General Pest Control',
]
const CITIES = ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'Pune', '+10 more']
const TRUST_BADGES = [
  { icon: Leaf,         label: 'Organic Chemicals' },
  { icon: Baby,         label: 'Child & Pet Safe' },
  { icon: CheckCircle,  label: 'ISP Certified' },
]
const HERO_STATS = [
  { value: '12,000+', label: 'Homes Protected' },
  { value: '4.8★',    label: 'Avg. Rating' },
  { value: '15+',     label: 'Cities' },
  { value: '98%',     label: 'Satisfaction' },
  { value: '200+',    label: 'Technicians' },
]

// ── Animated underline SVG for "Delivered" ───────────────────────────────────
function BioUnderline() {
  return (
    <svg
      viewBox="0 0 220 12"
      fill="none"
      className="absolute -bottom-1 left-0 w-full"
      aria-hidden="true"
    >
      <motion.path
        d="M4 8 C40 2, 80 12, 120 6 C160 0, 180 10, 218 6"
        stroke="#00FF64"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

// ── Scan-line sweep ───────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <div
      className="absolute inset-x-0 pointer-events-none"
      style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,255,100,0.4), transparent)',
        animation: 'scanSweep 4s linear infinite',
        zIndex: 5,
      }}
      aria-hidden="true"
    />
  )
}

// ── Quick Book Card ───────────────────────────────────────────────────────────
function QuickBookCard() {
  const [service, setService] = useState('')
  const [city, setCity]       = useState('')
  const [phone, setPhone]     = useState('')
  const [sent, setSent]       = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const selectCls = `
    w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80
    bg-white/5 border border-white/10 outline-none
    focus:border-[#00FF64]/50 focus:ring-2 focus:ring-[#00FF64]/10
    transition-all appearance-none
  `

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-6 border"
      style={{
        background: 'rgba(11,61,46,0.6)',
        borderColor: 'rgba(0,255,100,0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 60px rgba(0,255,100,0.08)',
        animation: 'bioGlow 3s ease-in-out infinite',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#FFB800]/15 border border-[#FFB800]/30 flex items-center justify-center">
          <span className="text-[#FFB800] text-base">⚡</span>
        </div>
        <h3 className="text-white font-heading font-semibold text-base">Get Instant Quote</h3>
      </div>

      <div className="h-px bg-white/5 mb-4" />

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <select
            value={service}
            onChange={e => setService(e.target.value)}
            className={selectCls}
            style={{ backgroundImage: 'none' }}
          >
            <option value="" disabled style={{ background: '#0B3D2E' }}>Select Service</option>
            {SERVICES_LIST.map(s => (
              <option key={s} value={s} style={{ background: '#0B3D2E' }}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className={selectCls}
            style={{ backgroundImage: 'none' }}
          >
            <option value="" disabled style={{ background: '#0B3D2E' }}>Your City</option>
            {['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'Pune', 'Delhi', 'Kolkata'].map(c => (
              <option key={c} value={c} style={{ background: '#0B3D2E' }}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Phone Number"
            className={`${selectCls} placeholder:text-white/30`}
            maxLength={10}
          />
        </div>

        <div className="h-px bg-white/5 my-2" />

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full py-3.5 rounded-full text-center text-sm font-bold text-[#071F17]"
              style={{ background: '#00FF64' }}
            >
              ✓ We&apos;ll call you in 2 min!
            </motion.div>
          ) : (
            <motion.button
              key="cta"
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-full text-sm font-bold text-[#071F17] transition-all flex items-center justify-center gap-2"
              style={{
                background: '#FFB800',
                boxShadow: '0 4px 20px rgba(255,184,0,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(255,184,0,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,184,0,0.3)')}
            >
              🟡 Get Free Quote
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="h-px bg-white/5 my-2" />
        <div className="flex items-center justify-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-[#00FF64]" /> No spam</span>
          <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-[#00FF64]" /> Call back in 2 min</span>
        </div>
      </form>
    </motion.div>
  )
}

// ── Scroll indicator ──────────────────────────────────────────────────────────
function ScrollCue() {
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const h = () => setVis(window.scrollY < 80)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <AnimatePresence>
      {vis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-20"
        >
          <span className="text-white/30 text-[10px] tracking-[3px] uppercase font-mono">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-[#00FF64]/50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── fadeUp factory ────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as number[] } },
})

// ── Main Hero ─────────────────────────────────────────────────────────────────
export function Hero() {
  const [sequenceComplete, setSequenceComplete] = useState(false)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroCtasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sequenceComplete) {
      const tl = gsap.timeline()
      
      tl.from('.hero-title span', {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power4.out',
      })
      .from('.hero-sub', {
        y: 20,
        opacity: 0,
        duration: 0.7,
      }, '-=0.3')
      .from('.hero-ctas > *', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
      }, '-=0.2')
    }
  }, [sequenceComplete])

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,255,100,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 80% 20%, rgba(11,61,46,0.9) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 70% 80%, rgba(255,184,0,0.05) 0%, transparent 50%),
          #071F17
        `,
      }}
    >
      {/* Hero Sequence */}
      {!sequenceComplete && (
        <HeroSequence onSequenceComplete={() => setSequenceComplete(true)} />
      )}

      {/* HUD Terminal */}
      {sequenceComplete && <HUDTerminal />}

      {/* Persistent Bug on Headline */}
      {sequenceComplete && <PersistentBug />}
      {/* Scanline */}
      <ScanLine />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,100,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,100,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Main grid */}
      <div className="relative z-10 flex-1 flex flex-col mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <div className="flex-1 grid lg:grid-cols-[60%_40%] gap-10 xl:gap-16 items-center">

          {/* ── LEFT COLUMN ────────────────────────────────────────── */}
          <motion.div initial="hidden" animate="visible">
            {/* Announcement pill */}
            <motion.div variants={fadeUp(0)} className="mb-7">
              <span className="inline-flex items-center gap-2 border border-[#00FF64]/30 bg-[#00FF64]/5 text-[#00FF64] text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-full">
                <Leaf className="h-3.5 w-3.5" />
                New: AI Pest Risk Assessment — Free with every booking
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              ref={heroTitleRef}
              variants={fadeUp(0.15)}
              className="hero-title font-heading font-extrabold text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)' }}
            >
              <span>Pest-Free</span>{' '}
              <span>Living,</span>{' '}
              <span className="relative inline-block text-white italic">
                Delivered
                <BioUnderline />
              </span>{' '}
              <span>to</span>{' '}
              <span>Your</span>{' '}
              <span>Door.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              ref={heroSubRef}
              variants={fadeUp(0.3)}
              className="hero-sub text-lg leading-relaxed max-w-lg mb-7"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Book a certified pest control treatment in under{' '}
              <span className="text-white font-semibold">60 seconds</span>.
              Organic, child-safe, and backed by a{' '}
              <span className="text-white font-semibold">30-day re-service guarantee</span>.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={fadeUp(0.45)} className="flex flex-wrap gap-2 mb-8">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/80"
                >
                  <Icon className="h-3.5 w-3.5 text-[#00FF64]" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              ref={heroCtasRef}
              variants={fadeUp(0.6)}
              className="hero-ctas flex flex-col sm:flex-row gap-3 mb-8"
            >
              <Link
                href="/book"
                data-magnetic
                data-spray
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-[#071F17] transition-all group"
                style={{
                  background: '#FFB800',
                  boxShadow: '0 4px 20px rgba(255,184,0,0.25)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(255,184,0,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,184,0,0.25)')}
              >
                BOOK NOW
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="tel:+911234567890"
                data-magnetic
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-white border-2 border-white/20 hover:bg-white/5 hover:border-white/30 transition-all"
              >
                <Phone className="h-4 w-4 text-[#00FF64]" />
                CALL NOW
              </Link>
            </motion.div>

            {/* Cities */}
            <motion.div variants={fadeUp(0.75)} className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-white/40">
                <MapPin className="h-3.5 w-3.5 text-[#00FF64]" />
                Serving:
              </span>
              {CITIES.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-full text-xs text-white/60 bg-white/5 border border-white/10 hover:border-[#00FF64]/30 hover:text-white/90 cursor-pointer transition-all"
                >
                  {c}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — Quick Book Card ────────────────────── */}
          <div className="lg:pl-4">
            <QuickBookCard />
          </div>
        </div>
      </div>

      {/* ── Floating stat bar ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="relative z-10 border-t w-full"
        style={{
          background: 'rgba(7,31,23,0.8)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(0,255,100,0.1)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-y-3 py-4">
            {HERO_STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2 flex-1 justify-center min-w-[100px]">
                {i > 0 && (
                  <div className="hidden sm:block w-px h-8 bg-white/5 mr-2" />
                )}
                <div className="text-center">
                  <div className="text-[#00FF64] font-bold text-xl leading-none font-heading">{s.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <ScrollCue />

      {/* Custom keyframe for bioGlow */}
      <style>{`
        @keyframes bioGlow {
          0%,100% { box-shadow: 0 0 20px rgba(0,255,100,0.06); }
          50%      { box-shadow: 0 0 40px rgba(0,255,100,0.14); }
        }
        @keyframes scanSweep {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 0.5; }
          95%  { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  )
}
