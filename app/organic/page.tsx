'use client'

import { motion } from 'framer-motion'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { Leaf, ShieldCheck, Droplets, Wind, CheckCircle2, ArrowRight, Star, Award, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { cn } from '@/lib/utils'

const organicMethods = [
  { icon: Leaf, title: 'Herbal Repellents', description: 'Plant-based solutions using neem, citronella, eucalyptus, and lemongrass extracts that naturally repel pests without harmful residues.', color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { icon: Droplets, title: 'Essential Oil Treatments', description: 'Concentrated natural oils that disrupt pest behavior and breeding cycles without synthetic chemicals.', color: 'bg-blue-50', iconColor: 'text-blue-600' },
  { icon: Wind, title: 'Biological Controls', description: 'Using natural predators and beneficial microorganisms to control pest populations organically and sustainably.', color: 'bg-purple-50', iconColor: 'text-purple-600' },
  { icon: ShieldCheck, title: 'Physical Barriers', description: 'Non-toxic barriers and traps that prevent pest entry without any chemical intervention whatsoever.', color: 'bg-amber-50', iconColor: 'text-amber-600' },
]

const benefits = [
  'Safe for children and pets', 'No harmful chemical residues', 'Eco-friendly and sustainable',
  'Pleasant natural fragrances', 'No evacuation needed during treatment', 'Long-lasting protection',
  'FSSAI compliant for food areas', 'Reduces environmental impact',
]

const certifications = [
  { name: 'ISO 9001:2015', description: 'Quality Management', icon: Award },
  { name: 'ISO 14001:2015', description: 'Environmental Management', icon: Leaf },
  { name: 'FSSAI Approved', description: 'Food Safety Certified', icon: ShieldCheck },
  { name: 'NPMA Member', description: 'Professional Standards', icon: Sparkles },
]

const testimonials = [
  { name: 'Priya Sharma', city: 'Hyderabad', text: 'Used organic treatment for cockroaches. My 2-year-old was playing in the same room 2 hours later — completely safe!', rating: 5 },
  { name: 'Rahul Mehta', city: 'Bangalore', text: 'Finally a pest control service that doesn\'t leave that horrible chemical smell. The neem-based treatment worked perfectly.', rating: 5 },
  { name: 'Anita Reddy', city: 'Chennai', text: 'We have a pet dog and were worried about chemicals. The organic option was perfect — effective and completely pet-safe.', rating: 5 },
]

export default function OrganicPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-forest-950 overflow-hidden pt-28 pb-24">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800" />
          <div className="absolute inset-0 texture-organic opacity-40" />
          <motion.div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 9, repeat: Infinity }} />
          <motion.div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity, delay: 3 }} />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-emerald-400">Organic Treatment</span>
              </nav>
              <div className="pill-emerald-dark mb-6 w-fit"><Leaf className="h-3.5 w-3.5 mr-1.5" />100% Natural Solutions</div>
              <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
                Nature-Powered
                <br /><span className="gradient-text">Pest Control</span>
              </h1>
              <p className="text-white/85 text-lg max-w-2xl mb-10 leading-relaxed">
                Protect your home and family with certified organic pest control. Safe for children, pets, and the planet — without compromising effectiveness.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/book?type=organic"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-lg">
                  Book Organic Treatment <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/free-inspection"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                  Free Inspection
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 50L720 20L1440 50V50H0Z" fill="#F7F5F0"/>
            </svg>
          </div>
        </section>

        {/* Methods */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-12">
              <span className="pill-emerald mb-4 inline-block">Our Methods</span>
              <h2 className="font-display font-bold text-3xl text-ink mb-3">How We Keep It Natural</h2>
              <p className="text-neutral-500 max-w-xl mx-auto">Time-tested natural methods combined with modern application techniques for maximum effectiveness.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {organicMethods.map((method) => (
                <motion.div key={method.title} variants={fadeUp}
                  className="bg-card rounded-2xl p-6 border border-cream-300 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', method.color)}>
                    <method.icon className={cn('h-6 w-6', method.iconColor)} />
                  </div>
                  <h3 className="font-display font-bold text-ink mb-2">{method.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{method.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits + Visual */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="pill-emerald mb-4 inline-block">Why Go Organic</span>
                <h2 className="font-display font-bold text-3xl text-ink mb-4">Benefits of Organic Pest Control</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">Choose organic pest control for a healthier home and a greener planet. Our natural solutions provide effective protection without compromising safety.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-neutral-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="relative">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-forest-900 to-forest-800 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 texture-organic opacity-30" />
                    <div className="relative z-10 text-center p-8">
                      <div className="w-24 h-24 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-6">
                        <Leaf className="h-12 w-12 text-emerald-400" />
                      </div>
                      <h3 className="font-display font-black text-3xl text-white mb-2">100% Natural</h3>
                      <p className="text-white/70">Chemical-free pest solutions</p>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {[{ v: '50,000+', l: 'Homes Protected' }, { v: '4.9★', l: 'Organic Rating' }].map((s) => (
                          <div key={s.l} className="glass-card rounded-xl p-3 text-center">
                            <p className="font-display font-black text-xl text-white">{s.v}</p>
                            <p className="text-white/60 text-xs">{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-10">
              <h2 className="font-display font-bold text-3xl text-ink mb-3">What Customers Say</h2>
              <p className="text-neutral-500">Real reviews from families who chose organic treatment</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
              className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <motion.div key={t.name} variants={fadeUp}
                  className="bg-card rounded-2xl p-6 border border-cream-300 shadow-card">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent-500 text-accent-500" />
                    ))}
                  </div>
                  <p className="text-neutral-700 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-cream-200">
                    <div className="w-9 h-9 rounded-full bg-forest-900 flex items-center justify-center">
                      <span className="text-white text-xs font-black">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{t.name}</p>
                      <p className="text-xs text-neutral-400">{t.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 bg-forest-900 texture-organic">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp} className="text-center mb-10">
              <h2 className="font-display font-bold text-3xl text-white mb-3">Our Certifications</h2>
              <p className="text-white/70 max-w-xl mx-auto">We maintain the highest standards of quality and environmental responsibility.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {certifications.map((cert) => (
                <motion.div key={cert.name} variants={fadeUp}
                  className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                    <cert.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-1">{cert.name}</h3>
                  <p className="text-white/60 text-sm">{cert.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-forest-950 to-forest-900 rounded-3xl p-10 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 texture-organic opacity-30" />
              <div className="relative z-10">
                <h2 className="font-display font-black text-3xl mb-4">Ready for Chemical-Free Protection?</h2>
                <p className="text-white/85 max-w-xl mx-auto mb-8">Join thousands of families who have chosen organic pest control. Get a free consultation today.</p>
                <Link href="/book?type=organic"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-colors shadow-lg">
                  Book Organic Treatment <ArrowRight className="h-5 w-5" />
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
