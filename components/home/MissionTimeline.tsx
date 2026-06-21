'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const OBT: React.CSSProperties = { fontFamily: 'var(--font-orbitron)' }

const STEPS = [
  {
    num: '01',
    label: 'THREAT IDENTIFIED',
    title: 'Choose Service',
    desc: 'Select from 6+ certified pest control services. Our AI pre-scans your area for active threats.',
    color: '#FF2020',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="rgba(255,32,32,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx="20" cy="20" r="2" fill="#FF2020" />
        <line x1="20" y1="2" x2="20" y2="8" stroke="#FF2020" strokeWidth="1.5" />
        <line x1="20" y1="32" x2="20" y2="38" stroke="#FF2020" strokeWidth="1.5" />
        <line x1="2" y1="20" x2="8" y2="20" stroke="#FF2020" strokeWidth="1.5" />
        <line x1="32" y1="20" x2="38" y2="20" stroke="#FF2020" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: '02',
    label: 'UNIT DEPLOYED',
    title: 'Technician Dispatched',
    desc: 'Certified agent arrives within the slot. GPS-tracked. WhatsApp updates en route.',
    color: 'rgba(0,255,100,0.8)',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="14" y="8" width="12" height="20" rx="2" stroke="rgba(0,255,100,0.6)" strokeWidth="1.5" />
        <circle cx="20" cy="32" r="3" fill="rgba(0,255,100,0.6)" />
        <line x1="20" y1="2" x2="20" y2="8" stroke="rgba(0,255,100,0.6)" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    num: '03',
    label: 'NEUTRALISING THREATS',
    title: 'Treatment In Progress',
    desc: 'Organic treatment with WHO-approved chemicals. Child & pet safe. Takes 45–90 min.',
    color: 'rgba(0,255,100,0.8)',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="rgba(0,255,100,0.4)" strokeWidth="1" />
        {[0,60,120,180,240,300].map(a => (
          <line key={a}
            x1={20} y1={20}
            x2={20 + 12 * Math.cos(a * Math.PI / 180)}
            y2={20 + 12 * Math.sin(a * Math.PI / 180)}
            stroke="rgba(0,255,100,0.5)" strokeWidth="1.5"
          />
        ))}
        <circle cx="20" cy="20" r="3" fill="rgba(0,255,100,0.8)" />
      </svg>
    ),
  },
  {
    num: '04',
    label: 'HOME SECURED',
    title: 'Zone Cleared',
    desc: 'OTP-verified closure. Full inspection report. 30-day re-service guarantee activated.',
    color: '#00FF64',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4 L34 12 L34 26 L20 36 L6 26 L6 12 Z" stroke="#00FF64" strokeWidth="1.5" fill="rgba(0,255,100,0.06)" />
        <path d="M14 20 L18 24 L26 16" stroke="#00FF64" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function MissionTimeline() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      ref={ref}
      id="how-it-works"
      style={{ background: '#07080F', minHeight: '100vh', padding: '120px 24px 80px', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div style={{ ...OBT, fontSize: 8, letterSpacing: 6, color: 'rgba(0,255,100,0.5)', marginBottom: 12 }}>
            MISSION PROTOCOL
          </div>
          <h2 style={{ ...OBT, fontSize: 'clamp(24px, 5vw, 48px)', fontWeight: 900, color: '#fff' }}>
            OPERATION SEQUENCE
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connecting line */}
          <div className="hidden md:block" style={{ position: 'absolute', top: 80, left: '10%', right: '10%', height: 1, background: 'rgba(0,255,100,0.1)' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', background: 'rgba(0,255,100,0.3)', transformOrigin: 'left', borderTop: '1px dashed rgba(0,255,100,0.3)' }}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-6 md:gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ y: 30, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                onMouseEnter={() => setActiveStep(i)}
                style={{
                  cursor: 'default',
                  padding: 24,
                  border: `1px solid ${activeStep === i ? step.color : 'rgba(255,255,255,0.06)'}`,
                  background: activeStep === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition: 'all 0.3s',
                  position: 'relative',
                }}
              >
                {/* Big background number */}
                <div style={{
                  position: 'absolute', top: 8, right: 12,
                  ...OBT, fontSize: 96, fontWeight: 900,
                  color: 'rgba(255,255,255,0.03)', lineHeight: 1,
                  pointerEvents: 'none', userSelect: 'none',
                }}>
                  {step.num}
                </div>

                {/* Step label */}
                <div style={{ ...OBT, fontSize: 7, letterSpacing: 3, color: '#FF2020', marginBottom: 16, textTransform: 'uppercase' }}>
                  STEP {step.num}
                </div>

                {/* Icon */}
                <motion.div
                  animate={inView ? { scale: [0.7, 1.1, 1] } : {}}
                  transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 300, damping: 12 }}
                  style={{ marginBottom: 16 }}
                >
                  {step.icon}
                </motion.div>

                {/* Title */}
                <div style={{ ...OBT, fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  {step.title}
                </div>

                {/* Description */}
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  {step.desc}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-10">
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  width: activeStep === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activeStep === i ? '#00FF64' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center mt-16"
        >
          <Link
            href="/book"
            className="btn-kill inline-flex items-center gap-3"
            style={{
              ...OBT,
              background: '#FF2020',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              padding: '14px 32px',
              border: '1px solid rgba(255,32,32,0.6)',
            }}
          >
            ⚡ DEPLOY TEAM NOW
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
