'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Target, Eye, Calendar, FileCheck, Clipboard, Shield, CheckCircle, Award, Linkedin, ArrowRight, Star, Users, MapPin } from 'lucide-react'
import { SectionWrapper } from '@/components/layout'
import { fadeUp, slideLeft, slideRight, stagger, viewportSettings } from '@/lib/animations'
import { cn } from '@/lib/utils'

const milestones = [
  { year: '2018', label: 'Founded in Hyderabad', icon: '🌱' },
  { year: '2020', label: 'Expanded to 5 cities', icon: '🏙️' },
  { year: '2023', label: '10,000 customers served', icon: '🎉' },
  { year: '2026', label: '15+ cities, 12,000+ customers', icon: '🚀' },
]

const processSteps = [
  { icon: Calendar, title: 'Booking', description: 'Book online in under 60 seconds or call us directly.' },
  { icon: FileCheck, title: 'Free Inspection', description: 'Our technician inspects your property and identifies the pest problem.' },
  { icon: Clipboard, title: 'Report Approval', description: 'Review and approve the treatment plan and pricing before we proceed.' },
  { icon: Shield, title: 'Treatment', description: 'Certified technician applies the treatment using WHO-approved chemicals.' },
  { icon: CheckCircle, title: 'OTP Closure', description: 'Verify the job is complete with OTP. Full control in your hands.' },
]

const teamMembers = [
  { id: '1', name: 'Dr. Rajesh Kumar', role: 'Founder & CEO', initials: 'RK', linkedIn: '#', bio: '15+ years in pest management' },
  { id: '2', name: 'Priya Sharma', role: 'Head of Operations', initials: 'PS', linkedIn: '#', bio: 'Ex-Swiggy operations lead' },
  { id: '3', name: 'Amit Patel', role: 'Chief Technology Officer', initials: 'AP', linkedIn: '#', bio: 'Built 3 SaaS products' },
]

const certifications = [
  { id: '1', name: 'ISO 9001:2015', description: 'Quality Management System certification ensuring consistent service quality.', icon: Award },
  { id: '2', name: 'ISP Membership', description: 'Member of Indian Society for Pest Management, adhering to industry best practices.', icon: Shield },
  { id: '3', name: 'DPDPA Compliant', description: 'Full compliance with Digital Personal Data Protection Act for data security.', icon: CheckCircle },
  { id: '4', name: 'WHO Chemical Standards', description: 'All chemicals used meet World Health Organization safety standards.', icon: Award },
]

const stats = [
  { value: '12,000+', label: 'Happy Customers', icon: Users },
  { value: '4.8★', label: 'Average Rating', icon: Star },
  { value: '15+', label: 'Cities Served', icon: MapPin },
  { value: '200+', label: 'Certified Technicians', icon: Shield },
]

export function AboutContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-forest-950 overflow-hidden pt-28 pb-24">
        <div className="absolute inset-0">
          <Image src="/images/about-office.jpg" alt="PestShield Pro team" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-950/90 to-forest-900/60" />
        </div>
        <div className="absolute inset-0 texture-organic opacity-40" />
        <motion.div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 9, repeat: Infinity }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">About Us</span>
            </nav>
            <div className="pill-emerald-dark mb-6 w-fit"><Award className="h-3.5 w-3.5 mr-1.5" />Since 2018</div>
            <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
              About
              <br /><span className="gradient-text">PestShield Pro</span>
            </h1>
            <p className="text-white/85 text-lg max-w-2xl mb-10 leading-relaxed">
              {"India's most trusted pest control platform, serving 12,000+ happy customers across 15+ cities since 2018."}
            </p>
            {/* Stats */}
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

      {/* Our Story */}
      <section className="py-16 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={slideRight}>
              <span className="pill-emerald mb-4 inline-block">Our Story</span>
              <h2 className="font-display font-bold text-3xl text-ink mb-5">From Hyderabad to 15+ Cities</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>PestShield Pro was founded in 2018 in Hyderabad with a simple mission: make professional pest control accessible, affordable, and safe for every Indian home.</p>
                <p>We noticed that traditional pest control services were often unreliable, used harmful chemicals, and lacked transparency. So we built something different — a technology-first platform that lets you book treatments in 60 seconds, uses only WHO-approved chemicals, and gives you full control with OTP-verified job closure.</p>
                <p>Today, we serve over 12,000 happy customers across 15+ major cities in India, with a team of 200+ certified technicians committed to creating pest-free homes and businesses.</p>
              </div>
              {/* Milestones */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="bg-card rounded-xl p-4 border border-cream-300 shadow-card">
                    <span className="text-2xl mb-2 block">{milestone.icon}</span>
                    <p className="font-display font-black text-brand-600 text-lg">{milestone.year}</p>
                    <p className="text-sm text-neutral-600">{milestone.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={slideLeft} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image src="/images/about-handshake.jpg" alt="Professional at work" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-forest-900 rounded-2xl p-4 shadow-xl">
                <p className="font-display font-black text-2xl text-white">12,000+</p>
                <p className="text-white/70 text-sm">Happy Customers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
            className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp}
              className="bg-forest-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 texture-organic opacity-30" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center mb-5">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">To make professional, safe, and effective pest control accessible to every Indian household and business through technology, transparency, and trust.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}
              className="bg-cream-100 rounded-2xl p-8 border border-cream-300 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                <Eye className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-display font-bold text-2xl text-ink mb-4">Our Vision</h3>
              <p className="text-neutral-600 leading-relaxed">To become {"India's"} most loved pest control brand by 2030, serving 1 million+ customers with a 99% satisfaction rate and zero-compromise on safety.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-12">
            <span className="pill-emerald mb-4 inline-block">How We Work</span>
            <h2 className="font-display font-bold text-3xl text-ink mb-3">Our 5-Step Process</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">A transparent, customer-first approach that puts you in control every step of the way.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
            className="grid md:grid-cols-5 gap-4">
            {processSteps.map((step, index) => (
              <motion.div key={index} variants={fadeUp}
                className="bg-card rounded-2xl p-5 border border-cream-300 shadow-card text-center relative">
                <div className="w-10 h-10 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
                  {index + 1}
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                  <step.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-display font-bold text-ink mb-2 text-sm">{step.title}</h3>
                <p className="text-neutral-500 text-xs leading-relaxed">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-neutral-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-12">
            <span className="pill-emerald mb-4 inline-block">Leadership</span>
            <h2 className="font-display font-bold text-3xl text-ink mb-3">Meet Our Team</h2>
            <p className="text-neutral-500">The passionate people behind PestShield Pro&apos;s success.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <motion.div key={member.id} variants={fadeUp}
                className="bg-card rounded-2xl p-6 border border-cream-300 shadow-card text-center hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-forest-900 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-black text-2xl text-emerald-400">{member.initials}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-ink">{member.name}</h3>
                <p className="text-sm text-neutral-500 mb-1">{member.role}</p>
                <p className="text-xs text-neutral-400 mb-4">{member.bio}</p>
                <a href={member.linkedIn}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cream-200 text-neutral-500 hover:bg-brand-100 hover:text-brand-600 transition-colors"
                  aria-label={`${member.name} LinkedIn`}>
                  <Linkedin className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-forest-900 texture-organic">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-12">
            <span className="pill-emerald-dark mb-4 inline-block">Trust & Safety</span>
            <h2 className="font-display font-bold text-3xl text-white mb-3">Our Certifications</h2>
            <p className="text-white/70 max-w-xl mx-auto">We maintain the highest standards of quality and safety.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {certifications.map((cert) => (
              <motion.div key={cert.id} variants={fadeUp}
                className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                  <cert.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{cert.name}</h3>
                <p className="text-white/60 text-sm">{cert.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
