'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Link from 'next/link'

export function MobileBookBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsVisible(window.scrollY > 400)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cream-50 border-t border-cream-300 shadow-[0_-8px_32px_rgba(11,61,46,0.1)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 h-[72px]">
            <div className="flex flex-col">
              <span className="text-xs text-neutral-500">Pest-free from</span>
              <span className="text-xl font-bold text-brand-600">₹499</span>
            </div>
            <Link
              href="/book"
              className="flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-semibold rounded-full shadow-md hover:bg-accent-600 transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Now</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
