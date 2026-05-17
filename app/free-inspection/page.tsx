'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { CheckCircle, Shield, Clock, Star, Leaf, Phone, ArrowRight, Search } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { toast } from 'sonner'

const benefits = [
  { icon: Shield, title: 'No Obligation', desc: 'Free inspection with zero pressure to book' },
  { icon: Clock, title: 'Within 24 Hours', desc: 'Technician visits within 24 hours of request' },
  { icon: Star, title: 'Expert Assessment', desc: 'Certified technician identifies all pest risks' },
  { icon: Leaf, title: 'Written Report', desc: 'Detailed report with treatment recommendations' },
]

const steps = [
  { num: '01', title: 'Fill the form', desc: 'Enter your details and preferred time slot' },
  { num: '02', title: 'We confirm', desc: 'Our team calls you within 30 minutes' },
  { num: '03', title: 'Technician visits', desc: 'Certified expert inspects your property' },
  { num: '04', title: 'Get your report', desc: 'Receive a detailed pest assessment report' },
]

export default function FreeInspectionPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: 'Hyderabad', pestType: 'Cockroach', preferredTime: 'Morning (8AM–12PM)' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Please fill in all required fields'); return }
    setSubmitted(true)
    toast.success('Request submitted! We\'ll call you within 30 minutes.')
  }

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
                <span className="text-emerald-400">Free Inspection</span>
              </nav>
              <div className="pill-emerald-dark mb-6 w-fit"><Leaf className="h-3.5 w-3.5 mr-1.5" />100% Free, No Obligation</div>
              <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
                Book Your Free<br /><span className="gradient-text">Pest Inspection</span>
              </h1>
              <p className="text-white/85 text-lg max-w-2xl mb-8 leading-relaxed">
                Get a certified technician to inspect your property and identify pest risks — completely free, with no obligation to book.
              </p>
              <div className="flex flex-wrap gap-3">
                {['No hidden charges', 'Within 24 hours', 'Written report included'].map((b) => (
                  <div key={b} className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-white text-sm font-semibold">{b}</span>
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

        {/* Benefits */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {benefits.map((b) => (
                <motion.div key={b.title} variants={fadeUp}
                  className="bg-card rounded-2xl p-5 border border-cream-300 shadow-card text-center">
                  <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center mx-auto mb-3">
                    <b.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-bold text-ink mb-1">{b.title}</h3>
                  <p className="text-neutral-500 text-sm">{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Form + Steps */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}>
                <h2 className="font-display font-bold text-2xl text-ink mb-6">Request Your Free Inspection</h2>
                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-ink mb-2">Request Submitted!</h3>
                    <p className="text-neutral-600 mb-6">{"We'll call you within 30 minutes to confirm your inspection slot."}</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white font-bold rounded-full">
                      Back to Home
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 border border-cream-300 shadow-card">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Your Name *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm outline-none focus:border-brand-600 transition-colors" placeholder="Ramesh Kumar" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Phone Number *</label>
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm outline-none focus:border-brand-600 transition-colors" placeholder="9876543210" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">City</label>
                        <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm outline-none focus:border-brand-600">
                          {['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Pest Type</label>
                        <select value={form.pestType} onChange={e => setForm(f => ({ ...f, pestType: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm outline-none focus:border-brand-600">
                          {['Cockroach', 'Termite', 'Rodent', 'Mosquito', 'Bed Bug', 'Not Sure'].map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Preferred Time</label>
                      <select value={form.preferredTime} onChange={e => setForm(f => ({ ...f, preferredTime: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm outline-none focus:border-brand-600">
                        {['Morning (8AM–12PM)', 'Afternoon (12PM–4PM)', 'Evening (4PM–8PM)'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <button type="submit"
                      className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md">
                      Book Free Inspection <ArrowRight className="h-5 w-5" />
                    </button>
                    <p className="text-xs text-neutral-400 text-center">No spam. We only call to confirm your slot.</p>
                  </form>
                )}
              </motion.div>

              {/* Steps */}
              <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}>
                <h2 className="font-display font-bold text-2xl text-ink mb-6">How It Works</h2>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <motion.div key={step.num} variants={fadeUp}
                      className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-cream-300 shadow-card">
                      <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-black text-emerald-400 text-sm">{step.num}</span>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-ink mb-1">{step.title}</h3>
                        <p className="text-neutral-500 text-sm">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 p-5 bg-forest-900 rounded-2xl text-white">
                  <p className="font-semibold mb-1">Prefer to call directly?</p>
                  <a href="tel:+919876543210" className="flex items-center gap-2 text-emerald-400 font-bold text-lg hover:text-emerald-300 transition-colors">
                    <Phone className="h-5 w-5" />+91 98765 43210
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
