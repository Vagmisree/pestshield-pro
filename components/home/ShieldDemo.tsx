'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/lib/hooks/use-count-up'
import Link from 'next/link'

const OBT: React.CSSProperties = { fontFamily: 'var(--font-orbitron)' }

function CountStat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { value, ref } = useCountUp(end)
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex items-start gap-3">
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF64', marginTop: 6, flexShrink: 0, boxShadow: '0 0 8px rgba(0,255,100,0.6)' }} />
      <div>
        <div style={{ ...OBT, fontSize: 28, fontWeight: 900, color: '#00FF64', lineHeight: 1 }}>
          {value}{suffix}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3, letterSpacing: 1, textTransform: 'uppercase' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

// CSS-only house wireframe
function HouseWireframe({ shieldPulsing }: { shieldPulsing: boolean }) {
  return (
    <div style={{ position: 'relative', width: 260, height: 260, margin: '0 auto' }}>
      {/* Shield sphere */}
      <motion.div
        animate={shieldPulsing ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -20,
          borderRadius: '50%',
          border: '1px solid rgba(0,255,100,0.25)',
          background: 'radial-gradient(ellipse, rgba(0,255,100,0.04) 0%, transparent 70%)',
          boxShadow: shieldPulsing ? '0 0 40px rgba(0,255,100,0.15)' : 'none',
          transition: 'box-shadow 0.5s',
        }}
      />
      <motion.div
        animate={shieldPulsing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        style={{
          position: 'absolute', inset: 10,
          borderRadius: '50%',
          border: '1px solid rgba(0,255,100,0.15)',
        }}
      />

      {/* House SVG */}
      <svg viewBox="0 0 260 260" fill="none" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        {/* Roof */}
        <path d="M130 40 L220 110 L40 110 Z" stroke="rgba(0,255,100,0.35)" strokeWidth="1.5" fill="rgba(0,255,100,0.03)" />
        {/* Walls */}
        <rect x="60" y="110" width="140" height="110" stroke="rgba(0,255,100,0.35)" strokeWidth="1.5" fill="rgba(0,255,100,0.03)" />
        {/* Door */}
        <rect x="108" y="165" width="44" height="55" stroke="rgba(0,255,100,0.25)" strokeWidth="1" fill="rgba(0,255,100,0.02)" />
        {/* Windows */}
        <rect x="72" y="130" width="34" height="28" stroke="rgba(0,255,100,0.2)" strokeWidth="1" fill="rgba(0,255,100,0.02)" />
        <rect x="154" y="130" width="34" height="28" stroke="rgba(0,255,100,0.2)" strokeWidth="1" fill="rgba(0,255,100,0.02)" />
        {/* Grid floor lines */}
        <line x1="40" y1="220" x2="220" y2="220" stroke="rgba(0,255,100,0.1)" strokeWidth="1" />
      </svg>

      {/* Orbiting pest markers (CSS animation) */}
      {[0, 90, 180, 270].map((deg, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
        >
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: `rotate(${deg}deg) translateX(120px) translateY(-50%)`,
            width: 8, height: 8,
            borderRadius: '50%',
            background: '#FF2020',
            boxShadow: '0 0 6px rgba(255,32,32,0.6)',
          }} />
        </motion.div>
      ))}
    </div>
  )
}

export function ShieldDemo() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [shieldActive, setShieldActive] = useState(false)

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setShieldActive(true), 1500)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <section
      ref={ref}
      style={{ background: '#07080F', minHeight: '100vh', padding: '100px 24px 80px', display: 'flex', alignItems: 'center' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div style={{ ...OBT, fontSize: 8, letterSpacing: 6, color: 'rgba(0,255,100,0.5)', marginBottom: 12 }}>
                SHIELD TECHNOLOGY
              </div>
              <h2 style={{ ...OBT, fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                360° PROTECTION
              </h2>
              {shieldActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ ...OBT, fontSize: 12, color: '#00FF64', marginBottom: 32, textShadow: '0 0 12px rgba(0,255,100,0.5)' }}
                >
                  ACTIVATED
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-6 mb-10"
            >
              <CountStat end={12548} suffix="+" label="Homes Protected" />
              <CountStat end={99} suffix=".2%" label="Success Rate" />
              <div className="flex items-start gap-3">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF64', marginTop: 6, flexShrink: 0, boxShadow: '0 0 8px rgba(0,255,100,0.6)' }} />
                <div>
                  <div style={{ ...OBT, fontSize: 14, fontWeight: 700, color: '#00FF64' }}>30-Day Guarantee</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3, letterSpacing: 1 }}>
                    RE-SERVICE · FREE · GUARANTEED
                  </div>
                </div>
              </div>
            </motion.div>

            <Link
              href="/book"
              className="btn-kill inline-block"
              style={{
                ...OBT,
                background: '#FF2020', color: '#fff',
                fontSize: 11, fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', padding: '14px 28px',
                border: '1px solid rgba(255,32,32,0.6)',
              }}
            >
              ACTIVATE PROTECTION
            </Link>
          </div>

          {/* Right: 3D house */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <HouseWireframe shieldPulsing={shieldActive} />
            {shieldActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-6"
                style={{ ...OBT, fontSize: 12, color: '#00FF64', letterSpacing: 3, textShadow: '0 0 16px rgba(0,255,100,0.5)' }}
              >
                ZONE SECURED
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
