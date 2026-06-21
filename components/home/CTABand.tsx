'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Phone, CheckCircle, AlertTriangle } from 'lucide-react'

const CTAParticleExplosion = dynamic(
  () => import('@/components/three/CTAParticleExplosion').then(mod => mod.CTAParticleExplosion),
  { ssr: false }
)

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as number[] } },
})

export function CTABand() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const router = useRouter()
  const [exploding, setExploding] = useState(false)

  const handleEmergencyClick = () => {
    setExploding(true)
    setTimeout(() => {
      router.push('/contact')
    }, 1200)
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 40%, #990000 100%)',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D depth floor */}
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))',
          transform: 'rotateX(30deg) translateZ(-20px)',
          transformOrigin: 'bottom',
        }} />

      {/* 3D extruded side walls */}
      <div className="absolute top-0 bottom-0 left-0 w-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)',
          transform: 'rotateY(5deg) translateZ(-10px)',
          transformOrigin: 'left',
        }} />
      <div className="absolute top-0 bottom-0 right-0 w-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(0,0,0,0.3), transparent)',
          transform: 'rotateY(-5deg) translateZ(-10px)',
          transformOrigin: 'right',
        }} />
      {/* Emergency ticker */}
      <div className="absolute top-0 left-0 w-full overflow-hidden bg-black/30 py-2">
        <div
          className="whitespace-nowrap text-xs font-mono font-bold tracking-wider text-white/90 uppercase"
          style={{
            animation: 'ticker 20s linear infinite',
          }}
        >
          ⚠️ EMERGENCY PEST ALERT ⚠️ DON'T LET PESTS WIN ⚠️ CALL IN THE STRIKE FORCE ⚠️ 
          EMERGENCY PEST ALERT ⚠️ DON'T LET PESTS WIN ⚠️ CALL IN THE STRIKE FORCE ⚠️ 
          EMERGENCY PEST ALERT ⚠️ DON'T LET PESTS WIN ⚠️ CALL IN THE STRIKE FORCE ⚠️
        </div>
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          opacity: 0.25,
        }}
        aria-hidden="true"
      />

      {/* Blinking LEDs */}
      <div className="absolute top-20 left-8 w-3 h-3 rounded-full bg-[#FFB800]"
        style={{ animation: 'blink 1s ease-in-out infinite' }} />
      <div className="absolute top-24 left-12 w-2 h-2 rounded-full bg-[#00FF64]"
        style={{ animation: 'blink 1.5s ease-in-out infinite' }} />
      <div className="absolute bottom-16 right-10 w-3 h-3 rounded-full bg-[#FFB800]"
        style={{ animation: 'blink 1.2s ease-in-out infinite' }} />
      <div className="absolute bottom-20 right-16 w-2 h-2 rounded-full bg-[#00FF64]"
        style={{ animation: 'blink 0.8s ease-in-out infinite' }} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp(0)} className="mb-5">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[3px] uppercase px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.12)',
                color: 'rgba(103,45,0,0.9)',
                border: '1px solid rgba(0,0,0,0.10)',
              }}
            >
              ⚡ LIMITED TIME
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUp(0.1)}
            className="font-heading font-extrabold leading-tight tracking-tight mb-5 flex items-center justify-center gap-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-[#FFB800] animate-pulse" />
            DON'T LET PESTS WIN
          </motion.h2>
          <motion.h3
            variants={fadeUp(0.15)}
            className="font-heading font-bold leading-tight tracking-wide mb-5"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            CALL IN THE STRIKE FORCE NOW
          </motion.h3>

          {/* Sub */}
          <motion.p
            variants={fadeUp(0.2)}
            className="text-lg max-w-xl mx-auto mb-10"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            24/7 Emergency Response · Same-Day Service · 
            <span className="font-bold text-[#FFB800]" style={{ animation: 'pulse 2s ease-in-out infinite' }}> +91 79813 53130</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp(0.3)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 relative"
          >
            {/* Particle explosion */}
            {exploding && (
              <div className="absolute inset-0 pointer-events-none z-50">
                <CTAParticleExplosion />
              </div>
            )}

            <button
              onClick={handleEmergencyClick}
              data-magnetic
              data-spray
              disabled={exploding}
              className="flex items-center gap-3 px-12 py-6 rounded-full font-black text-xl text-[#071F17] shadow-2xl transition-all group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFB800 0%, #00FF64 100%)',
                boxShadow: '0 8px 40px rgba(255,184,0,0.6), 0 0 60px rgba(0,255,100,0.3)',
                border: '3px solid rgba(255,255,255,0.5)',
              }}
            >
              <span className="relative z-10">🚨 EMERGENCY CONTACT</span>
              <ArrowRight className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="tel:+917981353130"
              className="flex items-center gap-2 px-8 py-5 rounded-full font-bold text-base transition-all border-2"
              style={{
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(0,0,0,0.2)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.2)')}
            >
              <Phone className="h-5 w-5 animate-pulse" />
              CALL NOW
            </a>
          </motion.div>

          {/* Trust icons */}
          <motion.div
            variants={fadeUp(0.4)}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {[
              '⚡ Same-Day Response',
              '🛡️ ISP Certified',
              '🌿 100% Organic',
              '✅ 30-Day Guarantee',
            ].map((item, i) => (
              <span key={item} className="flex items-center gap-1.5">
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px currentColor; }
          50% { opacity: 0.3; box-shadow: 0 0 2px currentColor; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </section>
  )
}
