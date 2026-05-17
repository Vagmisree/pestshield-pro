'use client'

import { motion } from 'framer-motion'
import { stagger, fadeUp, viewportSettings } from '@/lib/animations'
import { useCountUp } from '@/lib/hooks/use-count-up'

const statsData = [
  { value: 12000, suffix: '+', label: 'Homes Treated' },
  { value: 4.8, suffix: '/5', label: 'Average CSAT Score', decimals: 1 },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' },
  { value: 15, suffix: '+', label: 'Cities Covered' },
]

function StatItem({ value, suffix, label, decimals = 0 }: {
  value: number; suffix: string; label: string; decimals?: number
}) {
  const { value: displayValue, ref } = useCountUp(value, { decimals })

  return (
    <motion.div
      variants={fadeUp}
      className="px-6 lg:px-10 py-8 text-center border-b md:border-b-0 md:border-r border-white/10 last:border-0"
    >
      {/* Dot accent */}
      <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-4" />
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-2 leading-none"
      >
        {displayValue}
        <span className="text-emerald-400">{suffix}</span>
      </div>
      <div className="text-sm uppercase tracking-wider text-white/85 mt-2">{label}</div>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section
      className="relative bg-forest-900 texture-organic py-20 md:py-24 overflow-hidden"
      style={{ clipPath: 'polygon(0 8%, 100% 0, 100% 92%, 0 100%)' }}
    >
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-800/30 to-transparent pointer-events-none animate-[glow_6s_ease-in-out_infinite]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4"
        >
          {statsData.map((stat) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
