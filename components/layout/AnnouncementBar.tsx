'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Leaf } from 'lucide-react'
import Link from 'next/link'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const dismissed = localStorage.getItem('announcement-dismissed-v2')
    if (!dismissed) setIsVisible(true)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('announcement-dismissed-v2', 'true')
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-forest-900 text-white overflow-hidden"
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="border-l-2 border-emerald-400 pl-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white/90 font-medium">
                  🌿 Limited time: Free Inspection + 30% off first booking
                </span>
                <Link
                  href="/book"
                  className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 hover:no-underline ml-1 transition-colors"
                >
                  Book Now →
                </Link>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
