'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, TreeDeciduous, Rat, Zap, Bed, Shield, ArrowRight, CheckCircle } from 'lucide-react'

const ServiceIcon3D = dynamic(
  () => import('@/components/three/ServiceIcon3D').then(mod => mod.ServiceIcon3D),
  { ssr: false }
)

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  { id:'1', name:'Cockroach Control',    slug:'cockroach-control',    price:  499, duration:'45–60 min', warranty:'30 days',  icon: Bug,           tag:'Both',        chemical:'Organic',  mesh: 'bug'      },
  { id:'2', name:'Termite Control',      slug:'termite-control',      price: 1499, duration:'2–4 hrs',   warranty:'1 year',   icon: TreeDeciduous, tag:'Both',        chemical:'Chemical', mesh: 'torus'    },
  { id:'3', name:'Rodent Control',       slug:'rodent-control',       price:  799, duration:'60–90 min', warranty:'30 days',  icon: Rat,           tag:'Both',        chemical:'Chemical', mesh: 'sphere'   },
  { id:'4', name:'Mosquito Control',     slug:'mosquito-control',     price:  399, duration:'30–45 min', warranty:'30 days',  icon: Zap,           tag:'Residential', chemical:'Organic',  mesh: 'cone'     },
  { id:'5', name:'Bed Bug Control',      slug:'bed-bug-control',      price:  999, duration:'2–3 hrs',   warranty:'60 days',  icon: Bed,           tag:'Residential', chemical:'Chemical', mesh: 'octahedron'},
  { id:'6', name:'General Pest Control', slug:'general-pest-control', price:  699, duration:'2–3 hrs',   warranty:'30 days',  icon: Shield,        tag:'Both',        chemical:'Both',     mesh: 'dodecahedron'},
] as const

const FILTERS = ['All', 'Residential', 'Commercial'] as const
type Filter = typeof FILTERS[number]
type CardState = 'idle' | 'hunting' | 'eliminated' | 'reset'

// Tag → colour mapping
const TAG_COLORS: Record<string, string> = {
  Both:        'bg-[#00FF64]/10 text-[#00FF64] border-[#00FF64]/20',
  Residential: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Commercial:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
}
const CHEM_COLORS: Record<string, string> = {
  Organic:  'bg-[#00FF64]/10 text-[#00FF64] border-[#00FF64]/20',
  Chemical: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Both:     'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

// Hex-grid SVG background
const HEX_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34z' fill='none' stroke='rgba(0,255,100,0.05)' stroke-width='1'/%3E%3C/svg%3E")`

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08} },
}
const cardAnim = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as number[] } },
}

function ServiceCard({ svc }: { svc: typeof SERVICES[number] }) {
  const [state, setState] = useState<CardState>('idle')
  const [bugPos, setBugPos] = useState({ x: 20, y: 20 })
  const [killCount, setKillCount] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const Icon = svc.icon

  // State machine
  useEffect(() => {
    if (state === 'idle') {
      const timer = setTimeout(() => setState('hunting'), 2000 + (svc.id.charCodeAt(0) * 500))
      return () => clearTimeout(timer)
    }
    if (state === 'hunting') {
      const timer = setTimeout(() => {
        setState('eliminated')
        setKillCount(prev => prev + 1)
      }, 2500)
      return () => clearTimeout(timer)
    }
    if (state === 'eliminated') {
      const timer = setTimeout(() => setState('reset'), 1500)
      return () => clearTimeout(timer)
    }
    if (state === 'reset') {
      const timer = setTimeout(() => setState('idle'), 500)
      return () => clearTimeout(timer)
    }
  }, [state])

  // Bug crawl animation
  useEffect(() => {
    if (state === 'hunting') {
      const interval = setInterval(() => {
        setBugPos(prev => ({
          x: Math.min(prev.x + 3, 200),
          y: 20 + Math.sin(prev.x * 0.05) * 10,
        }))
      }, 50)
      return () => clearInterval(interval)
    } else {
      setBugPos({ x: 20, y: 20 })
    }
  }, [state])

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (y - 0.5) * -10,
      y: (x - 0.5) * 10,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardAnim}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col rounded-2xl p-6 border transition-all duration-300 group overflow-hidden"
      style={{
        background: state === 'eliminated' 
          ? 'rgba(0,255,100,0.1)' 
          : 'rgba(11,61,46,0.30)',
        borderColor: state === 'hunting' 
          ? 'rgba(255,0,0,0.6)' 
          : state === 'eliminated'
          ? 'rgba(0,255,100,0.6)'
          : 'rgba(0,255,100,0.10)',
        boxShadow: state === 'eliminated' 
          ? '0 0 40px rgba(0,255,100,0.3)' 
          : 'none',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* 3D Icon */}
      <div className="w-12 h-12 mb-4">
        <ServiceIcon3D mesh={svc.mesh} />
      </div>

      {/* Kill counter (HUD corner bracket) */}
      {state === 'eliminated' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 text-[#00FF64] text-xs font-mono"
        >
          <div className="border border-[#00FF64] px-2 py-1">
            KILLS: {killCount}
          </div>
        </motion.div>
      )}

      {/* Crawling bug */}
      {(state === 'hunting' || state === 'eliminated') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: state === 'eliminated' ? 0 : 1,
            rotate: state === 'eliminated' ? 180 : 0,
            scale: state === 'eliminated' ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="absolute text-xl pointer-events-none"
          style={{
            left: bugPos.x,
            top: bugPos.y,
          }}
        >
          🪳
        </motion.div>
      )}

      {/* Warning badge */}
      {state === 'hunting' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/50 px-2 py-1 rounded text-xs text-red-400 font-mono animate-pulse">
            ⚠ THREAT DETECTED
          </div>
        </motion.div>
      )}

      {/* Crosshair */}
      {state === 'hunting' && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: bugPos.x,
            top: bugPos.y,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-red-500" />
              <div className="absolute w-full h-px bg-red-500" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Spray particles */}
      {state === 'eliminated' && (
        <div className="absolute" style={{ left: bugPos.x, top: bugPos.y }}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 12) * 40,
                y: Math.sin((i * Math.PI * 2) / 12) * 40,
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.8, delay: i * 0.03 }}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#00FF64]"
              style={{ boxShadow: '0 0 6px rgba(0,255,100,0.8)' }}
            />
          ))}
        </div>
      )}

      {/* THREAT ELIMINATED badge */}
      {state === 'eliminated' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="flex items-center gap-1 bg-[#00FF64]/20 border border-[#00FF64]/50 px-2 py-1 rounded text-xs text-[#00FF64] font-mono font-bold">
            ✓ THREAT ELIMINATED
          </div>
        </motion.div>
      )}

      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Title */}
      <h3 className="font-heading font-bold text-white text-lg mb-2">{svc.name}</h3>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full border ${CHEM_COLORS[svc.chemical]}`}>
          {svc.chemical}
        </span>
        <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full border ${TAG_COLORS[svc.tag]}`}>
          {svc.tag}
        </span>
      </div>

      {/* Mini desc */}
      <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">
        Professional {svc.name.toLowerCase()} using certified techniques and{' '}
        {svc.chemical === 'Organic' ? 'eco-friendly' : 'industrial-grade'} treatments.
      </p>

      {/* Divider */}
      <div className="h-px bg-white/5 mb-4" />

      {/* Price row */}
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-white/40 text-xs">from </span>
          <span className="text-[#FFB800] font-bold text-2xl font-heading">₹{svc.price.toLocaleString()}</span>
        </div>
        <span className="text-white/50 text-xs">{svc.duration}</span>
      </div>

      {/* Warranty badge */}
      <div className="flex items-center gap-1.5 mb-4">
        <CheckCircle className="h-3.5 w-3.5 text-[#00FF64]" />
        <span className="text-[#00FF64] text-xs font-medium">{svc.warranty} warranty</span>
      </div>

      {/* CTA */}
      <Link
        href={`/book?service=${svc.slug}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all group/btn"
        style={{
          background: state === 'eliminated' ? '#00FF64' : 'rgba(255,184,0,0.10)',
          color: state === 'eliminated' ? '#071F17' : '#FFB800',
          border: `1px solid rgba(255,184,0,${state === 'eliminated' ? '1' : '0.25'})`,
        }}
      >
        Book This Service
        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  )
}

export function ServicesGrid() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')

  const filtered = SERVICES.filter(s =>
    activeFilter === 'All' ||
    s.tag === activeFilter ||
    s.tag === 'Both'
  )

  return (
    <section
      className="relative py-24"
      style={{
        background: '#071F17',
        backgroundImage: HEX_BG,
        backgroundSize: '56px 100px',
      }}
    >
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#00FF64]/40" />
            <span className="text-[#00FF64] text-xs font-mono tracking-[4px] uppercase">OUR SERVICES</span>
            <div className="h-px w-8 bg-[#00FF64]/40" />
          </div>
          <h2 className="font-heading font-extrabold text-white text-4xl md:text-5xl tracking-tight mb-4">
            Our Pest Control Services
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            From cockroaches to termites — professional solutions for every infestation.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center gap-2 mb-10"
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
              style={{
                background: activeFilter === f ? 'rgba(0,255,100,0.10)' : 'transparent',
                borderColor: activeFilter === f ? 'rgba(0,255,100,0.40)' : 'rgba(255,255,255,0.10)',
                color: activeFilter === f ? '#00FF64' : 'rgba(255,255,255,0.40)',
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map(svc => (
              <ServiceCard key={svc.id} svc={svc} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
