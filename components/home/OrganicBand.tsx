'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'

const facts = [
  { emoji: '🌿', label: 'No Harmful Pesticides' },
  { emoji: '👶', label: 'Child & Pet Safe' },
  { emoji: '🏛️', label: 'CIB&RC Certified' },
  { emoji: '🛡️', label: '30-Day Guarantee' },
]

export function OrganicBand() {
  return (
    <section className="relative overflow-hidden flex flex-col md:flex-row min-h-[480px]">
      {/* Left — Forest Dark */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={fadeUp}
        className="relative z-10 w-full md:w-[55%] bg-forest-900 texture-organic p-10 md:p-14 lg:p-16 flex flex-col justify-center"
      >
        <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
          No Harmful Chemicals.<br/>
          <span className="gradient-text">Ever.</span>
        </h2>
        <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-md">
          Completely safe for children, elderly, and pets. No toxic odors, no health risks — just effective, eco-friendly pest control.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={stagger}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          {['0 Harmful Pesticides', '100% Child Safe', 'Pet Friendly', 'CIB&RC Certified'].map((fact) => (
            <motion.div
              key={fact}
              variants={fadeUp}
              className="glass-card rounded-xl p-3 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-white text-xs font-medium">{fact}</span>
            </motion.div>
          ))}
        </motion.div>

        <Link
          href="/organic"
          className="inline-flex items-center justify-center w-fit px-6 py-3 border-2 border-emerald-400/50 text-emerald-300 font-semibold rounded-full hover:bg-emerald-400/10 transition-all"
        >
          Learn About Organic Treatments →
        </Link>
      </motion.div>

      {/* Right — Image with diagonal clip */}
      <div
        className="hidden md:block md:w-[45%] relative"
        style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <Image
          src="/images/organic-nature.jpg"
          alt="Organic green nature"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest-900/20" />
      </div>
    </section>
  )
}
