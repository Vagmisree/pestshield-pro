'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

interface PestCounterProps {
  baseCount?: number
}

export function PestCounter({ baseCount = 2847 }: PestCounterProps) {
  const [count, setCount] = useState(baseCount)
  const [show, setShow] = useState(false)
  const [bump, setBump] = useState(false)

  // Show after 3s delay
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(t)
  }, [])

  // Increment every 8–12 seconds
  useEffect(() => {
    if (!show) return
    let timeoutId: ReturnType<typeof setTimeout>
    const schedule = () => {
      const delay = 8000 + Math.random() * 4000
      timeoutId = setTimeout(() => {
        setCount(c => c + 1)
        setBump(true)
        setTimeout(() => setBump(false), 400)
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timeoutId)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0 }}
          className="fixed bottom-20 right-4 z-50 pointer-events-none"
          aria-live="polite"
          aria-label={`${count.toLocaleString()} pests eliminated today`}
        >
          <div className="flex items-center gap-2.5 bg-forest-950/90 backdrop-blur-md border border-emerald-400/30 rounded-2xl px-4 py-2.5 shadow-xl">
            <motion.div
              animate={{ scale: bump ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <div>
              <motion.span
                key={count}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-display font-black text-white text-sm block"
              >
                {count.toLocaleString()}
              </motion.span>
              <span className="text-white/50 text-[10px] font-medium leading-none">pests eliminated today</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
