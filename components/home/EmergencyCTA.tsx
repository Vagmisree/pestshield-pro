'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const OBT: React.CSSProperties = { fontFamily: 'var(--font-orbitron)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

export function EmergencyCTA() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{
        background: '#030508',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top threat bar */}
      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '10px 24px',
          background: 'rgba(255,32,32,0.08)',
          borderBottom: '1px solid rgba(255,32,32,0.25)',
          borderTop: '1px solid rgba(255,32,32,0.25)',
          textAlign: 'center',
          ...OBT, fontSize: 9, letterSpacing: 4, color: '#FF4444',
        }}
      >
        ⚠ EMERGENCY PEST RESPONSE AVAILABLE 24/7 ⚠
      </motion.div>

      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,32,32,0.04) 0%, transparent 70%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center relative z-10"
        style={{ maxWidth: 700 }}
      >
        <div style={{ ...OBT, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', marginBottom: 8, lineHeight: 1 }}>
          PESTS IN YOUR HOME?
        </div>
        <div style={{
          ...OBT,
          fontSize: 'clamp(16px, 3vw, 24px)',
          fontWeight: 900,
          color: '#FF2020',
          marginBottom: 20,
          textShadow: '0 0 30px rgba(255,32,32,0.6)',
          lineHeight: 1,
        }}>
          BOOK EMERGENCY INSPECTION
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36, lineHeight: 1.6 }}>
          Response in 60 minutes. Certified technicians. Organic treatment.
        </div>

        <Link
          href="/book"
          className="btn-kill inline-block w-full sm:w-auto"
          style={{
            ...OBT,
            background: '#FF2020', color: '#fff',
            fontSize: 16, fontWeight: 900, letterSpacing: 4,
            textTransform: 'uppercase', padding: '18px 48px',
            border: '1px solid rgba(255,32,32,0.5)',
            display: 'inline-block',
            textAlign: 'center',
          }}
        >
          CALL FOR BACKUP
        </Link>

        <div style={{ ...MONO, fontSize: 12, color: '#00FF64', marginTop: 16, letterSpacing: 2 }}>
          +91 79813 53130 · AVAILABLE NOW
        </div>
      </motion.div>
    </section>
  )
}
