'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, viewportSettings } from '@/lib/animations'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
  dark?: boolean
}

export function SectionHeading({
  eyebrow, title, subtitle, align = 'center', className, dark = false
}: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={fadeUp}
      className={cn('mb-10 md:mb-16', align === 'center' && 'text-center', className)}
    >
      {eyebrow && (
        <div className={cn('flex items-center gap-3 mb-5', align === 'center' && 'justify-center')}>
          <span className={cn(
            'inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border',
            dark
              ? 'bg-emerald-400/15 border-emerald-400/25 text-emerald-300'
              : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-600'
          )}>
            {eyebrow}
          </span>
        </div>
      )}

      <h2 className={cn(
        'font-display font-bold text-balance leading-[1.05] tracking-tight',
        'text-3xl sm:text-4xl md:text-[42px]',
        dark ? 'text-white' : 'text-ink'
      )}>
        {title}
      </h2>

      {subtitle && (
        <p className={cn(
          'mt-4 text-base md:text-lg leading-relaxed max-w-2xl',
          align === 'center' && 'mx-auto',
          dark ? 'text-white/65' : 'text-neutral-500'
        )}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
