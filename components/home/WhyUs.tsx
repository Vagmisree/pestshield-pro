'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { SectionWrapper, SectionHeading } from '@/components/layout'
import { fadeUp, slideRight, stagger, viewportSettings } from '@/lib/animations'

const benefits = [
  { title: 'Free Inspection Report', description: 'No surprises. We assess before we treat.' },
  { title: 'Organic & WHO-Approved Chemicals', description: 'Safe for children, elderly, and pets.' },
  { title: 'Book in Under 60 Seconds', description: 'No calls, no waiting, no negotiation.' },
  { title: 'WhatsApp-First Updates', description: 'Real-time job status directly on WhatsApp.' },
  { title: 'OTP-Verified Job Closure', description: 'You control when the job is marked complete.' },
  { title: '30-Day Re-Service Guarantee', description: 'Pests return? We come back. Free.' },
]

export function WhyUs() {
  return (
    <SectionWrapper background="forest" className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image Side */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeUp}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/images/why-us-team.jpg"
              alt="Happy Indian family at home"
              fill
              className="object-cover"
            />
            {/* Left gradient blend into dark bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-forest-900/40 to-transparent" />
          </div>

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportSettings}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent-500 text-accent-500" />
              ))}
            </div>
            <p className="text-sm font-bold text-white">4.8/5 Rating</p>
            <p className="text-xs text-white/80">from 2,000+ reviews</p>
          </motion.div>
        </motion.div>

        {/* Content Side */}
        <div>
          <SectionHeading
            eyebrow="Why PestShield Pro"
            title="Why 12,000+ Families Trust Us"
            align="left"
            dark={true}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={stagger}
            className="space-y-4"
          >
            {benefits.map((benefit) => (
              <motion.div key={benefit.title} variants={slideRight} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white">{benefit.title}</h3>
                  <p className="text-sm text-white/80">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-full hover:bg-accent-600 transition-colors shadow-md"
            >
              Book Free Inspection →
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 text-white font-medium hover:text-white transition-colors"
            >
              View Certifications →
            </Link>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
