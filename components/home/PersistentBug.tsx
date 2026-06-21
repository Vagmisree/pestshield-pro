'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type BugState = 'crawling' | 'locked' | 'eliminated' | 'respawning'

export function PersistentBug() {
  const [state, setState] = useState<BugState>('crawling')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const bugRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial crawl
    if (state === 'crawling') {
      const crawlTimer = setTimeout(() => {
        setState('locked')
      }, 2000)
      return () => clearTimeout(crawlTimer)
    }

    // Locked state
    if (state === 'locked') {
      const eliminateTimer = setTimeout(() => {
        setState('eliminated')
      }, 1500)
      return () => clearTimeout(eliminateTimer)
    }

    // Eliminated state
    if (state === 'eliminated') {
      const respawnTimer = setTimeout(() => {
        setState('respawning')
      }, 1000)
      return () => clearTimeout(respawnTimer)
    }

    // Respawn and restart cycle
    if (state === 'respawning') {
      const restartTimer = setTimeout(() => {
        setState('crawling')
      }, 500)
      return () => clearTimeout(restartTimer)
    }
  }, [state])

  // Crawling animation
  useEffect(() => {
    if (state === 'crawling') {
      const interval = setInterval(() => {
        setPosition(prev => ({
          x: prev.x + 2,
          y: Math.sin(prev.x * 0.05) * 3,
        }))
      }, 50)
      return () => clearInterval(interval)
    }
  }, [state])

  return (
    <div className="absolute top-32 left-0 w-full pointer-events-none z-40 overflow-hidden">
      <AnimatePresence mode="wait">
        {state !== 'respawning' && (
          <motion.div
            ref={bugRef}
            key={state}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: state === 'crawling' ? position.x : 200,
              top: state === 'crawling' ? position.y : 0,
            }}
            className="relative"
          >
            {/* Bug */}
            <motion.div
              animate={{
                rotate: state === 'eliminated' ? 180 : 0,
                scale: state === 'eliminated' ? 0 : 1,
              }}
              transition={{ duration: 0.5 }}
              className="text-2xl"
            >
              🪳
            </motion.div>

            {/* Laser Dot */}
            {state === 'locked' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"
                style={{
                  boxShadow: '0 0 10px rgba(255,0,0,0.8)',
                }}
              />
            )}

            {/* TARGET LOCKED */}
            {state === 'locked' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-red-500 text-xs font-mono font-bold tracking-wider">
                  TARGET LOCKED
                </span>
              </motion.div>
            )}

            {/* Spray particles */}
            {state === 'locked' && (
              <div className="absolute top-0 left-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 8) * 20,
                      y: Math.sin((i * Math.PI * 2) / 8) * 20,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.05,
                    }}
                    className="absolute w-1 h-1 rounded-full bg-[#00FF64]"
                    style={{
                      boxShadow: '0 0 4px rgba(0,255,100,0.8)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* ELIMINATED badge */}
            {state === 'eliminated' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div
                  className="px-3 py-1 rounded-full border text-xs font-mono font-bold"
                  style={{
                    background: 'rgba(0,255,100,0.1)',
                    borderColor: 'rgba(0,255,100,0.4)',
                    color: '#00FF64',
                  }}
                >
                  ✓ ELIMINATED
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
