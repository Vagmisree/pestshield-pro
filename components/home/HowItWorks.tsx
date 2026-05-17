'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Calendar, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { SectionWrapper, SectionHeading } from '@/components/layout'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Choose Your Service',
    description: 'Select from 6+ certified pest control services based on your problem. Takes under 30 seconds.',
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Pick Date & Time',
    description: 'Choose a convenient slot. Morning, afternoon, or evening — your call. Instant confirmation.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Sit Back & Relax',
    description: 'Our certified technician arrives, treats, and closes with your OTP. Done in one visit.',
  },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="relative bg-card rounded-3xl p-8 shadow-card border border-cream-300 overflow-hidden"
    >
      {/* Decorative step number */}
      <span className="absolute top-4 right-5 text-8xl font-black text-forest-900/5 leading-none select-none">
        {step.number}
      </span>

      {/* Icon */}
      <div className="relative w-[72px] h-[72px] rounded-2xl bg-emerald-400 flex items-center justify-center mb-6 emerald-glow">
        <step.icon className="h-8 w-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="font-heading font-bold text-xl text-ink mb-3">{step.title}</h3>
      <p className="text-neutral-500 text-[15px] leading-relaxed mb-6">{step.description}</p>

      {/* Progress bar */}
      <div className="w-full h-1 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isInView ? '100%' : '0%' }}
          transition={{ duration: 1.2, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  return (
    <SectionWrapper background="cream" className="relative overflow-hidden">
      {/* Dot texture overlay */}
      <div className="absolute inset-0 texture-dots opacity-40 pointer-events-none" />

      <SectionHeading
        eyebrow="Simple Process"
        title="Book in 60 Seconds, Literally"
        subtitle="No phone calls. No haggling. Just select, schedule, and sit back."
        align="center"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={stagger}
        className="grid md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 items-center"
      >
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center gap-4">
            <StepCard step={step} index={index} />

            {/* Arrow between cards */}
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center flex-shrink-0 -mx-2">
                <svg width="60" height="20" viewBox="0 0 60 20">
                  <path
                    d="M0 10 H50 M45 5 L55 10 L45 15"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="80"
                    strokeDashoffset="80"
                    className="animate-draw-line"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={fadeUp}
        className="mt-12 text-center"
      >
        <Link
          href="/book"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest-900 text-white font-semibold rounded-full hover:bg-forest-800 transition-all shadow-card group"
        >
          <span>Book Now — It Takes 60 Seconds</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>
    </SectionWrapper>
  )
}
