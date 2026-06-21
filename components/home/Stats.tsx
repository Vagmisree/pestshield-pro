'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { raw: 12000, display: '12,000+', label: 'PROPERTIES SECURED' },
  { raw: 450000, display: '450K+', label: 'CONFIRMED KILLS' },
  { raw: 98, display: '98%', label: 'MISSION SUCCESS RATE' },
  { raw: 2, display: '<2HR', label: 'RESPONSE TIME' },
  { raw: 15, display: '15+', label: 'CITIES' },
  { raw: 200, display: '200+', label: 'OPERATORS' },
]

const TICKER_ITEMS = [
  '🌿 ORGANIC CHEMICALS',
  '✅ ISP CERTIFIED',
  '🛡️ 30-DAY GUARANTEE',
  '👨‍💼 CERTIFIED OPERATORS',
  '📞 24/7 TACTICAL SUPPORT',
  '🌿 ORGANIC CHEMICALS',
  '✅ ISP CERTIFIED',
  '🛡️ 30-DAY GUARANTEE',
  '👨‍💼 CERTIFIED OPERATORS',
  '📞 24/7 TACTICAL SUPPORT',
]

const MATRIX_CHARS = '01ABCDEF虫害防除PEST'.split('')

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, decimal = false) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(decimal ? Math.round(eased * target * 10) / 10 : Math.floor(eased * target))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration, decimal])

  return { count, start: () => setStarted(true) }
}

// ── Single stat with scan sweep and scramble animation ───────────────────────
function StatItem({
  raw, display, label, decimal, index,
}: typeof STATS[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { count, start } = useCountUp(raw, 2200, decimal)
  const [triggered, setTriggered] = useState(false)
  const [scrambleChars, setScrambleChars] = useState('')

  useEffect(() => {
    if (inView && !triggered) { start(); setTriggered(true) }
  }, [inView, triggered, start])

  // Scramble effect
  useEffect(() => {
    if (!triggered) return
    const interval = setInterval(() => {
      setScrambleChars(
        Array.from({ length: 3 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join('')
      )
    }, 100)
    return () => clearInterval(interval)
  }, [triggered])

  // Format the count-up display
  const formatted = decimal
    ? count.toFixed(1)
    : raw >= 1000
    ? count.toLocaleString()
    : count.toString()

  // Extract suffix from display string
  const suffix = display.replace(/[\d,.]+/, '').replace(raw.toString(), '')

  return (
    <div ref={ref} className="flex-1 flex flex-col items-center justify-center py-10 min-w-[100px] text-center relative">
      {/* Scan sweep */}
      {triggered && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 border border-[#00FF64]/20"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 2px, 0 2px)',
            animation: 'scanSweep 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Vertical separator */}
      {index > 0 && (
        <div className="absolute left-0 top-1/4 h-1/2 w-px bg-white/8" />
      )}

      {/* Wireframe rings */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-[#00FF64]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#00FF64]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          <div
            className="font-heading font-black leading-none mb-2 relative z-10"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            <span className="text-white">{triggered ? formatted : '0'}</span>
            <span className="text-white">{suffix}</span>
          </div>
          {/* Scramble chars behind */}
          <div
            className="absolute inset-0 font-mono text-xs text-[#00FF64]/20 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            {scrambleChars}
          </div>
        </div>
        <div className="text-xs font-mono tracking-[3px] uppercase" style={{ color: 'rgba(0,255,100,0.7)' }}>
          {label}
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Stats ────────────────────────────────────────────────────────────────
export function Stats() {
  const [mounted, setMounted] = useState(false)
  const [matrixChars, setMatrixChars] = useState<Array<{ left: string; top: string; delay: string; char: string }>>([])
  const [waveformHeights, setWaveformHeights] = useState<Array<{ heights: string[]; duration: number; delay: number }>>([])

  // Prevent hydration mismatch - generate random values only on client
  useEffect(() => {
    // Generate matrix rain chars
    const chars = [...Array(50)].map((_, i) => ({
      left: `${(i * 2) % 100}%`,
      top: `-${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    }))
    setMatrixChars(chars)

    // Generate waveform heights
    const waves = [...Array(200)].map((_, i) => ({
      heights: [
        '10%',
        `${Math.random() * 80 + 20}%`,
        `${Math.random() * 60 + 10}%`,
        '10%',
      ],
      duration: 2 + Math.random() * 2,
      delay: i * 0.01
    }))
    setWaveformHeights(waves)

    setMounted(true)
  }, [])

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B3D2E 0%, #071F17 100%)',
      }}
    >
      {/* Matrix rain background */}
      {mounted && matrixChars.length > 0 && (
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
          <div className="absolute inset-0" style={{ animation: 'matrixRain 20s linear infinite' }}>
            {matrixChars.map((item, i) => (
              <div
                key={i}
                className="absolute text-[#00FF64] text-xs font-mono"
                style={{
                  left: item.left,
                  top: item.top,
                  animationDelay: item.delay,
                }}
              >
                {item.char}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live waveform - 200 animated bars */}
      {mounted && waveformHeights.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none opacity-10 flex items-end gap-px">
          {waveformHeights.map((wave, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-[#00FF64]"
              animate={{
                height: wave.heights,
              }}
              transition={{
                duration: wave.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: wave.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
        aria-hidden="true"
      />

      {/* Stats row */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center">
          {STATS.map((s, i) => (
            <StatItem key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div
        className="relative overflow-hidden border-t py-3"
        style={{ borderColor: 'rgba(0,255,100,0.10)' }}
      >
        {/* fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
          style={{ background: 'linear-gradient(to right, #0B3D2E, transparent)' }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
          style={{ background: 'linear-gradient(to left, #071F17, transparent)' }} />

        <div
          className="flex gap-10 whitespace-nowrap"
          style={{ animation: 'tickerScroll 30s linear infinite' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: 'rgba(0,255,100,0.40)' }}
            >
              {item}
              <span className="ml-10 text-white/10">·</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scanSweep {
          0%   { clip-path: polygon(0 0, 100% 0, 100% 2px, 0 2px); }
          50%  { clip-path: polygon(0 98%, 100% 98%, 100% 100%, 0 100%); }
          100% { clip-path: polygon(0 0, 100% 0, 100% 2px, 0 2px); }
        }
        @keyframes matrixRain {
          0%   { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </section>
  )
}
