'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  'SCANNING AREA...',
  'MOTION DETECTED @ SECTOR 7',
  'THREAT NEUTRALIZED',
  'DEPLOYING COUNTERMEASURES...',
  'AREA SECURED. MONITORING...',
  'ANOMALY DETECTED @ SECTOR 3',
  'ELIMINATING...',
  'STATUS: PROTECTED',
]

export function HUDTerminal() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  const currentMessage = MESSAGES[messageIndex]

  useEffect(() => {
    if (charIndex < currentMessage.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + currentMessage[charIndex])
        setCharIndex(prev => prev + 1)
      }, 25)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % MESSAGES.length)
        setDisplayText('')
        setCharIndex(0)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [charIndex, currentMessage])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed bottom-8 left-8 z-30 pointer-events-none"
    >
      <div
        className="rounded-lg px-4 py-3 border font-mono text-xs"
        style={{
          background: 'rgba(0,20,10,0.9)',
          borderColor: 'rgba(0,255,100,0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(0,255,100,0.1)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF64] animate-pulse" />
          <span className="text-[#00FF64] tracking-wider">TACTICAL HUD</span>
        </div>
        <div className="text-white/80 min-h-[16px]">
          {displayText}
          <span className="inline-block w-1.5 h-3.5 bg-[#00FF64] ml-0.5 animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}
