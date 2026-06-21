'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const CustomerGlobe = dynamic(
  () => import('@/components/three/CustomerGlobe').then(mod => mod.CustomerGlobe),
  { ssr: false }
)

const FloatingCard3D = dynamic(
  () => import('@/components/three/FloatingCard3D').then(m => m.FloatingCard3D),
  { ssr: false, loading: () => <div className="rounded-2xl border border-[#00FF64]/20 bg-[#071F17]/90 animate-pulse h-full" /> }
)

const TESTIMONIALS = [
  { id:'1', name:'Priya Sharma',   city:'Hyderabad', service:'Cockroach Control', rating:5, date:'2 weeks ago', missionId: '001',
    text:"Absolutely impressed! The technician arrived on time and explained everything. No smell, no mess. Cockroaches gone in 24 hours. Booked the AMC plan right after!" },
  { id:'2', name:'Ramesh Kumar',   city:'Bangalore', service:'Termite Control',   rating:5, date:'1 month ago', missionId: '002',
    text:"Had severe termite damage in my wooden furniture. PestShield Pro diagnosed it accurately and the treatment was thorough. 6 months in, zero signs of termites." },
  { id:'3', name:'Anjali Mehta',   city:'Mumbai',    service:'Bed Bug Control',   rating:5, date:'3 weeks ago', missionId: '003',
    text:"Bed bugs were driving us crazy. Tried everything before calling PestShield. Their heat treatment was game-changing. Slept peacefully that same night." },
  { id:'4', name:'Sneha Reddy',    city:'Chennai',   service:'Mosquito Control',  rating:5, date:'2 weeks ago', missionId: '004',
    text:"With the monsoon season, mosquitoes were unbearable. PestShield's fogging treatment made our evenings enjoyable again. The organic chemicals gave us peace of mind." },
  { id:'5', name:'Amit Joshi',     city:'Pune',      service:'Rodent Control',    rating:4, date:'1 month ago', missionId: '005',
    text:"Professional service from start to finish. They identified 3 entry points I never knew existed. No rodents since. Would highly recommend for commercial spaces." },
  { id:'6', name:'Dr. Ravi Nair',  city:'Delhi',     service:'General Pest',      rating:5, date:'3 weeks ago', missionId: '006',
    text:"As a doctor, I was specifically concerned about chemical safety. PestShield Pro's organic options are genuinely child and pet safe. Exceptional professionalism." },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-white/20'}`} />
      ))}
    </div>
  )
}

function TestimonialCard3D({ t, active }: { t: typeof TESTIMONIALS[number]; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -20, z: -50 }}
      animate={{ opacity: 1, rotateY: 0, z: 0 }}
      exit={{ opacity: 0, rotateY: 20, z: -50 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '1000px' }}
    >
      <FloatingCard3D
        intensity={8}
        style={{
          background: 'linear-gradient(135deg, rgba(7,31,23,0.95) 0%, rgba(11,61,46,0.85) 100%)',
          border: '1px solid rgba(0,255,100,0.25)',
          borderRadius: '20px',
          padding: '36px',
          backdropFilter: 'blur(16px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Watermark */}
        <div className="absolute -top-4 -right-4 opacity-[0.06] pointer-events-none select-none">
          <div className="border-4 border-[#00FF64] rounded-xl px-5 py-2 rotate-12">
            <span className="text-[#00FF64] text-2xl font-black font-mono tracking-widest">DECLASSIFIED</span>
          </div>
        </div>

        {/* Doc lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-2xl overflow-hidden"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,255,100,0.5) 20px, rgba(0,255,100,0.5) 21px)' }} />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#00FF64]/60 text-xs font-mono tracking-[3px] uppercase">FIELD REPORT</span>
              <span className="text-white/30 text-xs font-mono">#{t.missionId}</span>
            </div>
            <h3 className="font-heading font-bold text-white text-xl">Mission Report</h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
            style={{ background: 'rgba(0,255,100,0.08)', borderColor: 'rgba(0,255,100,0.25)' }}>
            <CheckCircle2 className="w-4 h-4 text-[#00FF64]" />
            <span className="text-[#00FF64] text-xs font-mono font-bold tracking-wider">SUCCESSFUL</span>
          </div>
        </div>

        <StarRating rating={t.rating} />

        {/* Details */}
        <div className="mt-4 grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs font-mono text-white/35 mb-1">LOCATION</div>
            <div className="text-white font-semibold text-sm">{t.city}</div>
          </div>
          <div>
            <div className="text-xs font-mono text-white/35 mb-1">OPERATION</div>
            <div className="text-white font-semibold text-sm">{t.service}</div>
          </div>
        </div>

        <div className="h-px bg-white/5 mb-4" />

        <blockquote className="text-white/80 text-sm leading-relaxed italic pl-4 border-l-2 border-[#00FF64]/30 mb-5">
          &ldquo;{t.text}&rdquo;
        </blockquote>

        {/* Agent */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: 'rgba(0,255,100,0.15)', color: '#00FF64', border: '1px solid rgba(0,255,100,0.25)' }}>
            {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{t.name}</p>
            <p className="text-xs font-mono text-white/35">Verified · {t.date}</p>
          </div>
          <Shield className="w-7 h-7 text-[#00FF64]/20" />
        </div>
      </FloatingCard3D>
    </motion.div>
  )
}

export function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selected, setSelected] = useState(0)

  const prev = () => setSelected(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setSelected(i => (i + 1) % TESTIMONIALS.length)

  return (
    <section ref={ref} className="py-28 relative overflow-hidden" style={{ background: '#071F17' }}>
      {/* radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(0,255,100,0.05) 0%, transparent 70%)' }} />

      {/* Perspective grid */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,255,100,0.03))`,
          maskImage: 'linear-gradient(to bottom, transparent, black)',
        }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-6 bg-[#00FF64]/60" />
            <span className="text-[#00FF64]/70 text-xs font-mono tracking-[0.2em] uppercase">FIELD REPORTS</span>
            <div className="h-px w-6 bg-[#00FF64]/60" />
          </div>
          <h2 className="font-heading font-extrabold text-white tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Secured Zones Across India
          </h2>
          <p className="mt-4 text-lg text-white/45">
            Declassified mission reports from our tactical operations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: -15 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ perspective: '1000px' }}
          >
            <div className="aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden border border-[#00FF64]/15"
              style={{ background: 'rgba(3,5,8,0.8)' }}>
              <CustomerGlobe onCityClick={(i) => setSelected(i)} />
            </div>
            <p className="mt-4 text-center text-sm font-mono text-white/35">
              <span className="text-[#00FF64]">INTERACTIVE:</span> Click any city pin to view report
            </p>
          </motion.div>

          {/* Card + nav */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <TestimonialCard3D key={selected} t={TESTIMONIALS[selected]} active />
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setSelected(i)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: i === selected ? '#00FF64' : 'rgba(0,255,100,0.2)',
                      transform: i === selected ? 'scale(1.4)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                  style={{ border: '1px solid rgba(0,255,100,0.2)', color: 'rgba(0,255,100,0.6)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.2)')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                  style={{ border: '1px solid rgba(0,255,100,0.2)', color: 'rgba(0,255,100,0.6)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.2)')}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Google rating */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16 flex justify-center"
          style={{ perspective: '600px' }}
        >
          <FloatingCard3D
            intensity={5}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 32px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0">
              <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
              <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
              <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-white text-xl">4.8</span>
                <span className="text-white/40 text-sm">out of 5</span>
                <div className="flex gap-0.5 ml-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />)}
                </div>
              </div>
              <p className="text-xs text-white/30 mt-0.5">Based on 2,400+ reviews</p>
            </div>
          </FloatingCard3D>
        </motion.div>
      </div>
    </section>
  )
}
