'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield } from 'lucide-react'

type Phase = 'idle' | 'spawn' | 'shield' | 'eliminate' | 'secured' | 'form'

const PESTS = [
  ...Array(8).fill('🪳'), // Cockroaches
  ...Array(6).fill('🐜'), // Termites
  ...Array(4).fill('🦟'), // Mosquitos
  ...Array(2).fill('🐀'), // Rats
]

export function BookNow() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [killCount, setKillCount] = useState(0)
  const [pestPositions, setPestPositions] = useState<Array<{ x: number; y: number; emoji: string; id: number }>>([])

  const handleBookClick = () => {
    if (phase !== 'idle') return

    // Phase 1: Spawn pests
    setPhase('spawn')
    const pests = PESTS.map((emoji, i) => ({
      x: 10 + (i % 5) * 18, // Deterministic positioning
      y: 10 + Math.floor(i / 5) * 18,
      emoji,
      id: i,
    }))
    setPestPositions(pests)

    setTimeout(() => {
      // Phase 2: Shield expand
      setPhase('shield')
      
      setTimeout(() => {
        // Phase 3: Kill all bugs
        setPhase('eliminate')
        let count = 0
        const interval = setInterval(() => {
          count++
          setKillCount(count)
          if (count >= 20) {
            clearInterval(interval)
            setTimeout(() => {
              // Phase 4: Area secured
              setPhase('secured')
              
              setTimeout(() => {
                // Phase 5: Show form
                setPhase('form')
              }, 1500)
            }, 500)
          }
        }, 50)
      }, 1000)
    }, 1500)
  }

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B3D2E 0%, #030508 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-[#00FF64]/40" />
              <span className="text-[#00FF64] text-xs font-mono tracking-[4px] uppercase">BATTLE STATION</span>
              <div className="h-px w-8 bg-[#00FF64]/40" />
            </div>
            
            <h2 className="font-heading font-extrabold text-white text-4xl md:text-5xl mb-6">
              Ready to Deploy Strike Force?
            </h2>
            
            <p className="text-white/60 text-lg mb-10">
              Initiate booking sequence and watch our tactical response in action.
            </p>

            <button
              onClick={handleBookClick}
              data-magnetic
              data-spray
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg text-[#071F17] transition-all group relative overflow-hidden"
              style={{
                background: '#FFB800',
                boxShadow: '0 8px 30px rgba(255,184,0,0.3)',
              }}
            >
              <span className="relative z-10">BOOK NOW</span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* Battle Arena */}
        {phase !== 'idle' && phase !== 'form' && (
          <div className="relative w-full max-w-4xl mx-auto h-[600px] rounded-2xl border border-[#00FF64]/20 overflow-hidden"
            style={{ background: 'rgba(7,31,23,0.6)' }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,255,100,0.4) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,255,100,0.4) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Spawned pests */}
            <AnimatePresence>
              {phase === 'spawn' && pestPositions.map((pest) => (
                <motion.div
                  key={pest.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  className="absolute text-3xl"
                  style={{
                    left: `${pest.x}%`,
                    top: `${pest.y}%`,
                  }}
                >
                  {pest.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Shield expansion */}
            {phase === 'shield' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 3, opacity: [0, 0.6, 0] }}
                transition={{ duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#00FF64"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-20 h-20 text-[#00FF64]" />
                </div>
              </motion.div>
            )}

            {/* Elimination particles */}
            {phase === 'eliminate' && (
              <>
                {pestPositions.map((pest) => (
                  <div key={pest.id} className="absolute" style={{ left: `${pest.x}%`, top: `${pest.y}%` }}>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI * 2) / 8) * 50,
                          y: Math.sin((i * Math.PI * 2) / 8) * 50,
                          opacity: [1, 1, 0],
                        }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="absolute w-2 h-2 rounded-full bg-[#00FF64]"
                        style={{ boxShadow: '0 0 8px rgba(0,255,100,0.8)' }}
                      />
                    ))}
                  </div>
                ))}

                {/* Kill counter */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
                >
                  <div className="text-xs font-mono text-white/40 mb-1">THREATS ELIMINATED</div>
                  <div className="text-6xl font-heading font-black text-[#00FF64]">
                    {killCount}
                  </div>
                </motion.div>
              </>
            )}

            {/* Area secured */}
            {phase === 'secured' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="w-32 h-32 rounded-full border-4 border-[#00FF64] flex items-center justify-center mb-6 mx-auto"
                    style={{ background: 'rgba(0,255,100,0.1)' }}
                  >
                    <Shield className="w-16 h-16 text-[#00FF64]" />
                  </motion.div>
                  <div className="text-4xl font-heading font-black text-[#00FF64] mb-2">
                    AREA SECURED
                  </div>
                  <div className="text-white/60 font-mono">All threats neutralized. Proceeding to booking...</div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Booking Form */}
        {phase === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className="rounded-2xl p-8 border"
              style={{
                background: 'rgba(7,31,23,0.8)',
                borderColor: 'rgba(0,255,100,0.3)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#00FF64]/15 border border-[#00FF64]/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#00FF64]" />
                </div>
                <div>
                  <h3 className="text-white font-heading font-bold text-xl">HUD Booking System</h3>
                  <p className="text-white/50 text-sm font-mono">Deploy your strike force now</p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 bg-white/5 border border-white/10 outline-none focus:border-[#00FF64]/50 focus:ring-2 focus:ring-[#00FF64]/10 transition-all"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 bg-white/5 border border-white/10 outline-none focus:border-[#00FF64]/50 focus:ring-2 focus:ring-[#00FF64]/10 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 bg-white/5 border border-white/10 outline-none focus:border-[#00FF64]/50 focus:ring-2 focus:ring-[#00FF64]/10 transition-all"
                />
                
                <Link
                  href="/book"
                  data-magnetic
                  data-spray
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-base font-bold text-[#071F17] transition-all group mt-6"
                  style={{
                    background: '#FFB800',
                    boxShadow: '0 4px 20px rgba(255,184,0,0.3)',
                  }}
                >
                  CONFIRM DEPLOYMENT
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
