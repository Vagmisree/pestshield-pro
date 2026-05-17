'use client'

import { motion } from 'framer-motion'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { Shield, Clock, Leaf, Star, Users, Award, CheckCircle, ArrowRight, Zap, FileText, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'

const reasons = [
  {
    icon: Shield,
    title: 'OTP-Verified Job Closure',
    desc: 'You control when the job is marked complete. No OTP from you = no payment released to technician. Full accountability.',
    stat: '100%',
    statLabel: 'Verified completions',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Leaf,
    title: 'Organic & Child-Safe Chemicals',
    desc: 'All chemicals are WHO-approved. We offer 100% organic options that are safe for children, pets, and pregnant women.',
    stat: '100%',
    statLabel: 'WHO-approved chemicals',
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Clock,
    title: '60-Second Booking',
    desc: 'Book a certified technician in under 60 seconds. No phone calls, no waiting. Instant confirmation via WhatsApp.',
    stat: '60s',
    statLabel: 'Average booking time',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Star,
    title: '30-Day Re-service Guarantee',
    desc: 'If pests return within 30 days, we re-treat at zero cost. No questions asked. Termite control has a 1-year warranty.',
    stat: '30 Days',
    statLabel: 'Guarantee period',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Users,
    title: 'Background-Verified Technicians',
    desc: 'Every technician undergoes police verification, 40+ hours of training, and carries a photo ID. You see their profile before they arrive.',
    stat: '200+',
    statLabel: 'Certified technicians',
    color: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: FileText,
    title: 'Transparent Inspection Reports',
    desc: 'Before treatment begins, you receive a detailed inspection report with photos. You approve the plan and price before we proceed.',
    stat: '100%',
    statLabel: 'Transparent pricing',
    color: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
]

const comparisons = [
  { feature: 'OTP-verified job closure', us: true, others: false },
  { feature: 'Organic chemical options', us: true, others: false },
  { feature: 'Background-verified technicians', us: true, others: false },
  { feature: 'Inspection report before treatment', us: true, others: false },
  { feature: '30-day re-service guarantee', us: true, others: false },
  { feature: 'Live technician tracking', us: true, others: false },
  { feature: 'GST invoice provided', us: true, others: false },
  { feature: 'Online booking in 60 seconds', us: true, others: false },
]

const stats = [
  { value: '12,000+', label: 'Happy Customers' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '15+', label: 'Cities Served' },
  { value: '98%', label: 'Satisfaction Rate' },
]

export default function WhyPestShieldPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-forest-950 overflow-hidden pt-28 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800" />
          <div className="absolute inset-0 texture-organic opacity-40" />
          <motion.div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 9, repeat: Infinity }} />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-emerald-400">Why PestShield</span>
              </nav>
              <div className="pill-emerald-dark mb-6 w-fit"><Award className="h-3.5 w-3.5 mr-1.5" />{"India's Most Trusted"}</div>
              <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
                Why Choose<br /><span className="gradient-text">PestShield Pro?</span>
              </h1>
              <p className="text-white/85 text-lg max-w-2xl mb-8 leading-relaxed">
                We built PestShield Pro because we were tired of unreliable pest control. Here&apos;s what makes us different.
              </p>
              <div className="flex flex-wrap gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="glass-card rounded-2xl px-5 py-3 text-center">
                    <p className="font-display font-black text-2xl text-white">{s.value}</p>
                    <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 50L720 20L1440 50V50H0Z" fill="#F7F5F0"/>
            </svg>
          </div>
        </section>

        {/* 6 Reasons */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl text-ink mb-3">6 Reasons Customers Choose Us</h2>
              <p className="text-neutral-500 max-w-xl mx-auto">Every feature was built based on real customer feedback and pain points with traditional pest control.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reasons.map((r) => (
                <motion.div key={r.title} variants={fadeUp}
                  className="bg-card rounded-2xl p-6 border border-cream-300 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl ${r.color} flex items-center justify-center mb-4`}>
                    <r.icon className={`h-6 w-6 ${r.iconColor}`} />
                  </div>
                  <h3 className="font-display font-bold text-ink mb-2">{r.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">{r.desc}</p>
                  <div className="pt-4 border-t border-cream-200 flex items-center gap-2">
                    <span className="font-display font-black text-2xl text-brand-600">{r.stat}</span>
                    <span className="text-xs text-neutral-400">{r.statLabel}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-10">
              <h2 className="font-display font-bold text-3xl text-ink mb-3">PestShield vs Others</h2>
              <p className="text-neutral-500">See how we compare to traditional pest control services</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
              className="bg-card rounded-2xl border border-cream-300 overflow-hidden shadow-card">
              <div className="grid grid-cols-3 bg-forest-900 text-white">
                <div className="p-4 font-semibold text-sm">Feature</div>
                <div className="p-4 font-bold text-sm text-center text-emerald-400">PestShield Pro</div>
                <div className="p-4 font-semibold text-sm text-center text-white/60">Others</div>
              </div>
              {comparisons.map((row, i) => (
                <div key={row.feature} className={`grid grid-cols-3 border-t border-cream-200 ${i % 2 === 0 ? 'bg-cream-50' : 'bg-white'}`}>
                  <div className="p-4 text-sm text-neutral-700 font-medium">{row.feature}</div>
                  <div className="p-4 flex justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="p-4 flex justify-center">
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold">✕</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-forest-900 texture-organic">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-black text-3xl text-white mb-3">Ready to experience the difference?</h2>
              <p className="text-white/85 mb-8 max-w-xl mx-auto">Join 12,000+ happy customers. Book in 60 seconds with a 30-day guarantee.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/book"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-colors shadow-lg">
                  Book Now — 30% Off First Service <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/free-inspection"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                  <Zap className="h-5 w-5" />Get Free Inspection
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
