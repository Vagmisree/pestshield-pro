'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { Eye, Scan, AlertTriangle } from 'lucide-react'

type Mode = 'normal' | 'xray'

const PESTS = [
  { room: 'kitchen', type: 'Cockroaches', count: 5, x: 15, y: 65, confidence: 98 },
  { room: 'bathroom', type: 'Termites', count: 8, x: 75, y: 30, confidence: 95 },
  { room: 'bedroom', type: 'Bed Bugs', count: 12, x: 70, y: 70, confidence: 97 },
  { room: 'living', type: 'Rodents', count: 2, x: 25, y: 35, confidence: 92 },
]

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
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

export function AIPestVision() {
  const ref = useRef<HTMLElement>(null)
  const houseRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const scanLineRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [mode, setMode] = useState<Mode>('normal')
  const [scanning, setScanning] = useState(false)

  const activateXRay = () => {
    if (scanning || mode === 'xray') return
    setScanning(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setMode('xray')
        setScanning(false)
      }
    })

    // 0.0s - White flash
    tl.to(flashRef.current, {
      opacity: 1,
      duration: 0.1,
      ease: 'power2.in'
    })
    .to(flashRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out'
    })

    // 0.1s - Scan line sweep
    tl.to(scanLineRef.current, {
      top: '0%',
      opacity: 1,
      duration: 0,
    }, 0.1)
    .to(scanLineRef.current, {
      top: '100%',
      duration: 1.5,
      ease: 'power1.inOut'
    }, 0.1)

    // 0.5s - Reveal house in x-ray mode
    tl.to(houseRef.current, {
      filter: 'brightness(0.4) contrast(1.5) hue-rotate(120deg)',
      duration: 0.5,
      ease: 'power2.out'
    }, 0.5)
  }

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #030508 0%, #071F17 100%)',
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,100,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,100,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp(0)}><Eyebrow text="AI DETECTION SYSTEM" /></motion.div>
          <motion.h2
            variants={fadeUp(0.1)}
            className="font-heading font-extrabold text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            What Hides in Your Home?
          </motion.h2>
          <motion.p variants={fadeUp(0.2)} className="text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Our AI-powered detection reveals threats invisible to the naked eye.
          </motion.p>
        </motion.div>

        {/* House Visualization */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Mode indicator */}
            <div className="absolute -top-12 left-0 flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                  mode === 'normal'
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-transparent text-white/40 border border-transparent'
                }`}
              >
                NORMAL MODE
              </div>
              <div
                className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                  mode === 'xray'
                    ? 'bg-[#00FF64]/20 text-[#00FF64] border border-[#00FF64]'
                    : 'bg-transparent text-white/40 border border-transparent'
                }`}
              >
                X-RAY MODE
              </div>
            </div>

            {/* House container */}
            <div
              ref={houseRef}
              className="relative aspect-[4/3] rounded-2xl border-2 overflow-hidden transition-all duration-500"
              style={{
                borderColor: mode === 'xray' ? '#00FF64' : 'rgba(255,255,255,0.15)',
                background: mode === 'normal'
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                  : 'linear-gradient(135deg, #0a0e1a 0%, #1a0e2e 100%)',
              }}
            >
              {/* House illustration */}
              <svg viewBox="0 0 800 600" className="w-full h-full">
                {/* Roof */}
                <polygon points="400,80 150,280 650,280" fill={mode === 'xray' ? '#1a0e2e' : '#2a2a3e'} stroke={mode === 'xray' ? '#00FF64' : '#3a3a4e'} strokeWidth="2" />
                
                {/* Main structure */}
                <rect x="150" y="280" width="500" height="280" fill={mode === 'xray' ? '#0f0a1a' : '#1e1e2e'} stroke={mode === 'xray' ? '#00FF64' : '#3a3a4e'} strokeWidth="2" />
                
                {/* Kitchen (left side) */}
                <rect x="150" y="380" width="150" height="180" fill={mode === 'xray' ? 'rgba(139,0,0,0.3)' : '#252535'} stroke={mode === 'xray' ? '#00FF64' : '#3a3a4e'} strokeWidth="1" />
                <text x="225" y="480" fill={mode === 'xray' ? '#00FF64' : '#666'} fontSize="14" textAnchor="middle" fontFamily="monospace">KITCHEN</text>
                
                {/* Living Room (center) */}
                <rect x="300" y="280" width="200" height="140" fill={mode === 'xray' ? 'rgba(139,0,0,0.3)' : '#252535'} stroke={mode === 'xray' ? '#00FF64' : '#3a3a4e'} strokeWidth="1" />
                <text x="400" y="355" fill={mode === 'xray' ? '#00FF64' : '#666'} fontSize="14" textAnchor="middle" fontFamily="monospace">LIVING</text>
                
                {/* Bathroom (top right) */}
                <rect x="500" y="280" width="150" height="140" fill={mode === 'xray' ? 'rgba(139,0,0,0.3)' : '#252535'} stroke={mode === 'xray' ? '#00FF64' : '#3a3a4e'} strokeWidth="1" />
                <text x="575" y="355" fill={mode === 'xray' ? '#00FF64' : '#666'} fontSize="12" textAnchor="middle" fontFamily="monospace">BATHROOM</text>
                
                {/* Bedroom (bottom right) */}
                <rect x="500" y="420" width="150" height="140" fill={mode === 'xray' ? 'rgba(139,0,0,0.3)' : '#252535'} stroke={mode === 'xray' ? '#00FF64' : '#3a3a4e'} strokeWidth="1" />
                <text x="575" y="495" fill={mode === 'xray' ? '#00FF64' : '#666'} fontSize="14" textAnchor="middle" fontFamily="monospace">BEDROOM</text>
                
                {/* Door */}
                <rect x="370" y="480" width="60" height="80" fill={mode === 'xray' ? '#1a0e2e' : '#2a2a3e'} stroke={mode === 'xray' ? '#00FF64' : '#3a3a4e'} strokeWidth="2" />
              </svg>

              {/* Pest markers (only in X-RAY mode) */}
              {mode === 'xray' && PESTS.map((pest, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                  className="absolute"
                  style={{ left: `${pest.x}%`, top: `${pest.y}%` }}
                >
                  {/* Danger marker */}
                  <div className="relative">
                    <AlertTriangle className="w-6 h-6 text-[#FF0000] animate-pulse" />
                    
                    {/* Detection box */}
                    <div
                      className="absolute top-8 left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg border-2 pointer-events-none"
                      style={{
                        background: 'rgba(0,0,0,0.9)',
                        borderColor: '#FF0000',
                        boxShadow: '0 0 20px rgba(255,0,0,0.5)',
                      }}
                    >
                      <div className="text-[#FF0000] text-xs font-mono font-bold mb-1 flex items-center gap-1">
                        <Scan className="w-3 h-3" />
                        THREAT DETECTED
                      </div>
                      <div className="text-white text-sm font-semibold mb-1">{pest.type}</div>
                      <div className="text-white/60 text-xs mb-2">Count: {pest.count} detected</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">Confidence:</span>
                        <span className="text-[#00FF64] font-bold">{pest.confidence}%</span>
                      </div>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00FF64] rounded-full"
                          style={{ width: `${pest.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* White flash overlay */}
              <div
                ref={flashRef}
                className="absolute inset-0 bg-white pointer-events-none"
                style={{ opacity: 0 }}
              />

              {/* Scan line */}
              <div
                ref={scanLineRef}
                className="absolute left-0 w-full h-1 pointer-events-none"
                style={{
                  top: '-100%',
                  opacity: 0,
                  background: 'linear-gradient(to bottom, transparent, #00FF64, transparent)',
                  boxShadow: '0 0 20px rgba(0,255,100,0.8)',
                }}
              />
            </div>

            {/* Activate button */}
            <div className="mt-12 text-center">
              {mode === 'normal' ? (
                <button
                  onClick={activateXRay}
                  disabled={scanning}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: scanning ? 'rgba(0,255,100,0.2)' : '#00FF64',
                    color: scanning ? '#00FF64' : '#071F17',
                    boxShadow: scanning ? 'none' : '0 8px 30px rgba(0,255,100,0.4)',
                  }}
                >
                  <Eye className="w-6 h-6" />
                  {scanning ? 'SCANNING...' : 'ACTIVATE PEST VISION'}
                  {!scanning && <Scan className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                </button>
              ) : (
                <button
                  onClick={() => setMode('normal')}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all group"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  RESET VIEW
                </button>
              )}
            </div>
          </div>

          {/* Warning message in X-RAY mode */}
          {mode === 'xray' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-2xl border-2"
              style={{
                background: 'rgba(255,0,0,0.05)',
                borderColor: 'rgba(255,0,0,0.3)',
              }}
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-[#FF0000] shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">Multiple Threats Detected</h3>
                  <p className="text-white/70 leading-relaxed">
                    Our AI has identified <span className="text-[#FF0000] font-bold">{PESTS.reduce((sum, p) => sum + p.count, 0)} pest threats</span> across {PESTS.length} rooms. 
                    Immediate professional intervention recommended. Book your free inspection now.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
