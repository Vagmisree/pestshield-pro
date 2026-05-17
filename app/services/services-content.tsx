'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Wrench, Shield, ArrowRight, Phone, MessageCircle, CheckCircle, Leaf, Star, Zap } from 'lucide-react'
import { SectionWrapper } from '@/components/layout'
import { services, getServicesByTag } from '@/lib/data/services'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { formatPrice, cn } from '@/lib/utils'
import { Service } from '@/types'

const filterTabs = ['All', 'Residential', 'Commercial', 'Organic'] as const

const stats = [
  { value: '6+', label: 'Services' },
  { value: '30-Day', label: 'Guarantee' },
  { value: '100%', label: 'Organic Options' },
  { value: '15+', label: 'Cities' },
]

const trustBadges = [
  { icon: Shield, text: 'WHO-Approved Chemicals' },
  { icon: CheckCircle, text: '30-Day Re-service Guarantee' },
  { icon: Star, text: '4.8★ Average Rating' },
  { icon: Zap, text: 'OTP-Verified Closure' },
]

export function ServicesContent() {
  const [activeFilter, setActiveFilter] = useState<typeof filterTabs[number]>('All')
  const filteredServices = getServicesByTag(activeFilter as Service['tag'] | 'Organic' | 'All')

  return (
    <>
      {/* Hero */}
      <section className="relative bg-forest-950 overflow-hidden pt-28 pb-24">
        <div className="absolute inset-0">
          <Image src="/images/hero-technician.jpg" alt="Services" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-950/90 to-forest-900/60" />
        </div>
        <div className="absolute inset-0 texture-organic opacity-40" />
        <motion.div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px] pointer-events-none"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">Services</span>
            </nav>

            <div className="pill-emerald-dark mb-6 w-fit">
              <Leaf className="h-3.5 w-3.5 mr-1.5" />
              Certified Pest Control Solutions
            </div>

            <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
              All Pest Control
              <br /><span className="gradient-text">Services</span>
            </h1>
            <p className="text-white/85 text-lg max-w-2xl mb-10 leading-relaxed">
              Certified treatments for homes and businesses across India. Organic chemicals, background-verified technicians, and a 30-day re-service guarantee.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="glass-card rounded-2xl px-5 py-3 text-center">
                  <p className="font-display font-black text-2xl text-white">{s.value}</p>
                  <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {trustBadges.map((b) => (
                <div key={b.text} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <b.icon className="h-4 w-4 text-emerald-400" />
                  <span className="text-white/90 text-sm font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 50L720 20L1440 50V50H0Z" fill="#F7F5F0"/>
          </svg>
        </div>
      </section>

      {/* Filter + Grid */}
      <SectionWrapper background="cream">
        {/* Sliding filter tabs */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
          className="flex justify-center mb-10">
          <div className="relative flex items-center gap-1 bg-cream-200 p-1 rounded-full shadow-inner">
            {filterTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveFilter(tab)}
                className={cn('relative px-6 py-2.5 text-sm font-semibold rounded-full transition-colors z-10',
                  activeFilter === tab ? 'text-white' : 'text-neutral-600 hover:text-ink')}>
                {activeFilter === tab && (
                  <motion.span layoutId="svc-tab"
                    className="absolute inset-0 bg-forest-900 rounded-full -z-10 shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                )}
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
          className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div key={service.id} id={service.slug} layout variants={fadeUp}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-card rounded-2xl overflow-hidden border border-cream-300 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                <div className="md:flex">
                  <div className="relative md:w-2/5 h-52 md:h-auto overflow-hidden">
                    <Image src={service.image} alt={service.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
                    <span className={cn('absolute bottom-3 left-3 glass-card text-white text-xs font-bold px-3 py-1 rounded-full',
                      service.chemicalType === 'Organic' ? 'border-emerald-400/40' : '')}>
                      {service.chemicalType}
                    </span>
                    {service.includedInAMC && (
                      <span className="absolute top-3 right-3 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        AMC
                      </span>
                    )}
                  </div>
                  <div className="md:w-3/5 p-6">
                    <h2 className="font-display font-bold text-xl text-ink mb-2">{service.name}</h2>
                    <p className="text-neutral-600 text-sm mb-4 leading-relaxed line-clamp-3">{service.longDescription}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="flex items-center gap-1.5 bg-cream-200 text-neutral-700 text-xs px-2.5 py-1 rounded-full">
                        <Clock className="h-3 w-3" />{service.duration}
                      </span>
                      <span className="flex items-center gap-1.5 bg-cream-200 text-neutral-700 text-xs px-2.5 py-1 rounded-full">
                        <Wrench className="h-3 w-3" />{service.method}
                      </span>
                      <span className="flex items-center gap-1.5 bg-emerald-400/10 text-emerald-700 text-xs px-2.5 py-1 rounded-full border border-emerald-400/20">
                        <Shield className="h-3 w-3" />{service.warranty} warranty
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-cream-200">
                      <div>
                        <span className="text-xs text-neutral-500">from </span>
                        <span className="text-2xl font-display font-black text-brand-600">{formatPrice(service.startingPrice)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/services/${service.slug}`}
                          className="px-3 py-2 border border-cream-300 hover:border-brand-600 text-neutral-600 hover:text-brand-600 font-semibold rounded-xl transition-all text-sm">
                          Details
                        </Link>
                        <Link href={`/book?service=${service.slug}`}
                          className="group/btn inline-flex items-center gap-2 px-5 py-2 bg-forest-900 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all text-sm">
                          Book Now
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Process strip */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
          className="mt-16 bg-forest-900 rounded-3xl p-8 text-white">
          <h3 className="font-display font-bold text-xl text-center mb-8">How Our Service Works</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Book Online', desc: 'Select service, date & time in 60 seconds' },
              { num: '02', title: 'Inspection', desc: 'Technician inspects and shares report' },
              { num: '03', title: 'Treatment', desc: 'WHO-approved chemicals applied safely' },
              { num: '04', title: 'OTP Closure', desc: 'You verify completion with OTP' },
            ].map((step, i) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display font-black text-emerald-400">{step.num}</span>
                </div>
                <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                <p className="text-white/60 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </SectionWrapper>

      {/* Bottom CTA */}
      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
            className="bg-gradient-to-br from-forest-950 to-forest-900 rounded-3xl p-10 text-center texture-organic overflow-hidden relative">
            <motion.div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none"
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity }} />
            <h2 className="font-display font-black text-3xl text-white mb-3 relative z-10">Not sure what you need?</h2>
            <p className="text-white/85 mb-8 max-w-xl mx-auto relative z-10">Our experts identify the right service for your pest problem. Free consultation, no obligation.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <a href="https://wa.me/919876543210?text=Hi!%20I%20need%20help%20identifying%20my%20pest%20problem."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#20bd5a] transition-colors shadow-lg">
                <MessageCircle className="h-5 w-5" />Chat on WhatsApp
              </a>
              <a href="tel:+919876543210"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                <Phone className="h-5 w-5" />+91 98765 43210
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
