'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const OBT: React.CSSProperties = { fontFamily: 'var(--font-orbitron)' }

const PESTS = [
  { name: 'COCKROACH',    confidence: 97, cam: 'CAM-01' },
  { name: 'TERMITE',      confidence: 84, cam: 'CAM-02' },
  { name: 'RODENT',       confidence: 71, cam: 'CAM-03' },
  { name: 'MOSQUITO',     confidence: 89, cam: 'CAM-01' },
  { name: 'BED BUG',      confidence: 78, cam: 'CAM-02' },
]

function CameraFeed({ label, pestName }: { label: string; pestName: string }) {
  const [scanning, setScanning] = useState(true)
  const [confidence, setConfidence] = useState(97)
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    // Set confidence on client only
    setConfidence(97 - Math.floor(Math.random() * 20))
    
    // Set timestamp on client only
    setTimestamp(new Date().toLocaleTimeString())
    
    const t = setTimeout(() => setScanning(false), 1500 + Math.random() * 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: 12,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Noise texture via CSS */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Camera label */}
      <div style={{ ...OBT, fontSize: 7, color: 'rgba(0,255,100,0.5)', letterSpacing: 3, marginBottom: 8, position: 'relative', zIndex: 1 }}>
        {label} · LIVE
      </div>

      {/* Mock pest shape */}
      <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        {/* Pest silhouette */}
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" style={{ opacity: 0.4 }}>
          <ellipse cx="30" cy="45" rx="16" ry="22" fill="#4A2510" />
          <ellipse cx="30" cy="25" rx="12" ry="10" fill="#6B3520" />
          <line x1="14" y1="35" x2="2" y2="28" stroke="#2A1008" strokeWidth="2" />
          <line x1="14" y1="45" x2="2" y2="45" stroke="#2A1008" strokeWidth="2" />
          <line x1="14" y1="55" x2="2" y2="62" stroke="#2A1008" strokeWidth="2" />
          <line x1="46" y1="35" x2="58" y2="28" stroke="#2A1008" strokeWidth="2" />
          <line x1="46" y1="45" x2="58" y2="45" stroke="#2A1008" strokeWidth="2" />
          <line x1="46" y1="55" x2="58" y2="62" stroke="#2A1008" strokeWidth="2" />
        </svg>

        {/* Bounding box */}
        {!scanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              inset: 8,
              border: '1px dashed rgba(255,32,32,0.6)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ ...OBT, fontSize: 6, color: '#FF4444', position: 'absolute', top: -10, left: 0, letterSpacing: 1, whiteSpace: 'nowrap' }}>
              {pestName} · {confidence}% CONF
            </div>
          </motion.div>
        )}
      </div>

      {/* Timestamp */}
      <div style={{ ...OBT, fontSize: 6, color: 'rgba(255,255,255,0.2)', marginTop: 6, position: 'relative', zIndex: 1 }}>
        {timestamp} · {scanning ? 'SCANNING...' : 'THREAT DETECTED'}
      </div>
    </div>
  )
}

export function ThreatDetection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [revealed, setRevealed] = useState<number[]>([])

  useEffect(() => {
    if (!inView) return
    PESTS.forEach((_, i) => {
      setTimeout(() => setRevealed(r => [...r, i]), i * 400)
    })
  }, [inView])

  return (
    <section
      ref={ref}
      style={{ background: '#030508', minHeight: '100vh', padding: '120px 24px 80px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div style={{ ...OBT, fontSize: 8, letterSpacing: 6, color: 'rgba(0,255,100,0.5)', marginBottom: 12, textTransform: 'uppercase' }}>
            PHASE 01 — DETECTION
          </div>
          <h2 style={{ ...OBT, fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            SCANNING FOR THREATS
          </h2>
          <div style={{ height: 1, background: 'rgba(0,255,100,0.15)', maxWidth: 200, margin: '20px auto 0' }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: detection list */}
          <div className="space-y-4">
            {PESTS.map((pest, i) => (
              <AnimatedPestRow key={pest.name} pest={pest} visible={revealed.includes(i)} />
            ))}
          </div>

          {/* Right: camera feeds */}
          <div className="grid grid-cols-2 gap-3">
            {PESTS.slice(0, 3).map(pest => (
              <CameraFeed key={pest.cam + pest.name} label={pest.cam} pestName={pest.name} />
            ))}
            <div
              className="col-span-2 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,255,100,0.1)', padding: 20 }}
            >
              <div style={{ ...OBT, fontSize: 8, color: 'rgba(0,255,100,0.3)', letterSpacing: 4 }}>
                AI ANALYSIS COMPLETE · 5 THREATS IDENTIFIED
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedPestRow({ pest, visible }: { pest: typeof PESTS[0]; visible: boolean }) {
  const [progress, setProgress] = useState(0)
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    if (!visible) return
    setScanning(true)
    let p = 0
    const t = setInterval(() => {
      p += 2 + Math.random() * 4
      setProgress(Math.min(pest.confidence, p))
      if (p >= pest.confidence) { clearInterval(t); setScanning(false) }
    }, 50)
    return () => clearInterval(t)
  }, [visible, pest.confidence])

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={visible ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* Bounding box icon */}
      <div style={{
        width: 36, height: 36, border: '1px dashed rgba(255,32,32,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{ width: 16, height: 20, background: 'rgba(74,37,16,0.6)', borderRadius: 2 }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: 10, color: 'rgba(255,255,255,0.9)', letterSpacing: 2 }}>
            {pest.name}
          </span>
          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: 10, color: scanning ? 'rgba(255,255,255,0.3)' : '#FF2020', fontWeight: 700 }}>
            {scanning ? 'SCANNING...' : `${Math.round(progress)}% CONFIDENCE`}
          </span>
        </div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FF2020, #FF8800)',
              borderRadius: 1,
              width: `${progress}%`,
            }}
            transition={{ duration: 0.05 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
