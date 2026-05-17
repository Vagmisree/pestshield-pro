'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { fadeUp, viewportSettings } from '@/lib/animations'

export function CTABand() {
  return (
    <section className="relative bg-gradient-to-br from-brand-700 via-forest-900 to-forest-950 texture-organic py-20 md:py-24 overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.1)_0%,transparent_70%)] pointer-events-none" />
      {/* Diagonal light beam */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeUp}
        >
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-emerald-400/15 border-emerald-400/25 text-emerald-300 mb-6">
            Get Started Today
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4 leading-tight">
            Ready to Live Pest-Free?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-xl mx-auto">
            Join 12,000+ happy customers. Book in 60 seconds. Organic, child-safe, guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-forest-900 font-bold rounded-full hover:bg-cream-100 transition-colors shadow-lg text-base"
            >
              Book Free Inspection Now
            </Link>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-base"
            >
              <Phone className="h-5 w-5" />
              <span>+91 98765 43210</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
