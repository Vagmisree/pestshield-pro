'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

function getMsg(pathname: string) {
  if (pathname.startsWith('/services')) return "Hi! I'd like to know more about your pest control services."
  if (pathname.startsWith('/book'))     return "Hi! I need help completing my booking."
  if (pathname.startsWith('/dashboard')) return "Hi! I have a question about my service."
  return "Hi! I'd like to book a pest control service."
}

export function WhatsAppFloat() {
  const [mounted,  setMounted]  = useState(false)
  const [tooltip,  setTooltip]  = useState(false)
  const [bounce,   setBounce]   = useState(true)
  const bounceCount = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Stop bouncing after 3 cycles (~1.5s each = ~4.5s)
    const t = setTimeout(() => setBounce(false), 4500)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  const msg = encodeURIComponent(getMsg(pathname))

  return (
    <div
      className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="px-3 py-2 rounded-xl text-sm font-medium text-white whitespace-nowrap"
            style={{
              background: 'rgba(7,31,23,0.95)',
              border: '1px solid rgba(0,255,100,0.2)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            Chat with us on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={`https://wa.me/917981353130?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        animate={bounce ? { y: [0, -8, 0] } : { y: 0 }}
        transition={bounce ? { duration: 1.5, repeat: 3, ease: 'easeInOut' } : {}}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl relative"
        style={{
          background: '#25D366',
          animation: 'whatsappPulse 2.5s ease-in-out infinite',
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>

      <style>{`
        @keyframes whatsappPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
        }
      `}</style>
    </div>
  )
}
