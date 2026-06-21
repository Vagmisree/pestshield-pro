'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Zap } from 'lucide-react'
import Link from 'next/link'

export function MobileBookBar() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const h = () => setVisible(window.scrollY > 300)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          style={{
            background: 'rgba(7,31,23,0.97)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(0,255,100,0.15)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ minHeight: 68 }}
          >
            {/* Call button */}
            <a
              href="tel:+917981353130"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.75)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
            >
              <Phone className="h-3.5 w-3.5" />
              Call Us
            </a>

            {/* Book button */}
            <Link
              href="/book"
              className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-[#071F17] transition-all"
              style={{
                background: '#FFB800',
                boxShadow: '0 4px 16px rgba(255,184,0,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 24px rgba(255,184,0,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,184,0,0.3)')}
            >
              <Zap className="h-3.5 w-3.5" />
              Book Now — Free Inspection
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
