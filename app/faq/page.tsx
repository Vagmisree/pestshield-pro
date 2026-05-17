'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { ChevronDown, HelpCircle, Search, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { cn } from '@/lib/utils'

const faqCategories = [
  {
    id: 'booking',
    label: 'Booking & Scheduling',
    icon: '📅',
    faqs: [
      { q: 'How do I book a pest control service?', a: 'You can book in under 60 seconds on our website or app. Select your service, enter your address and preferred time slot, and confirm. Our team will reach out to confirm your booking.' },
      { q: 'Can I reschedule or cancel my booking?', a: 'Yes, you can reschedule or cancel up to 4 hours before your scheduled appointment from your dashboard. Cancellations within 4 hours may incur a small fee.' },
      { q: 'How far in advance should I book?', a: 'We recommend booking at least 24 hours in advance for best slot availability. For urgent cases, we offer same-day service in select cities.' },
      { q: 'Do you offer weekend appointments?', a: 'Yes! We operate 7 days a week, including Sundays and public holidays, from 8 AM to 8 PM.' },
    ],
  },
  {
    id: 'treatment',
    label: 'Treatment & Safety',
    icon: '🛡️',
    faqs: [
      { q: 'Are the chemicals safe for children and pets?', a: 'All our chemicals are WHO-approved and safe for children and pets once dry (typically 2–4 hours). We also offer 100% organic treatments that are safe immediately after application.' },
      { q: 'Do I need to vacate my home during treatment?', a: 'For most treatments, you can stay home. For fumigation or heavy chemical treatments, we recommend vacating for 2–4 hours. Our technician will advise you before starting.' },
      { q: 'How long does a typical treatment take?', a: 'Treatment duration varies by service: Cockroach control takes 45–60 minutes, Termite treatment 2–4 hours, Bed bug treatment 2–3 hours, and General pest control 2–3 hours.' },
      { q: 'What should I do to prepare for the treatment?', a: 'Clear kitchen counters and store food in sealed containers. Move furniture slightly away from walls. Keep pets in a separate room. Our technician will guide you on any specific preparations.' },
    ],
  },
  {
    id: 'guarantee',
    label: 'Guarantee & Re-service',
    icon: '✅',
    faqs: [
      { q: 'What is your re-service guarantee?', a: 'We offer a 30-day re-service guarantee on most treatments. If pests return within the warranty period, we\'ll re-treat at no extra cost. Termite control comes with a 1-year warranty.' },
      { q: 'How do I claim a re-service?', a: 'Simply raise a complaint from your dashboard or call our support line. We\'ll schedule a re-service within 48 hours at no charge.' },
      { q: 'What is not covered under the guarantee?', a: 'The guarantee does not cover new infestations from external sources, structural issues that allow pest entry, or cases where post-treatment instructions were not followed.' },
    ],
  },
  {
    id: 'payment',
    label: 'Pricing & Payment',
    icon: '💳',
    faqs: [
      { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards, net banking, and cash on service. EMI options are available for AMC plans.' },
      { q: 'Are there any hidden charges?', a: 'No hidden charges. The price shown at booking is the final price. GST (18%) is included in the displayed price.' },
      { q: 'Do you offer discounts for multiple services?', a: 'Yes! Our AMC (Annual Maintenance Contract) plans offer up to 40% savings compared to individual bookings. Use code PESTFREE30 for 30% off your first booking.' },
      { q: 'Can I get an invoice for my booking?', a: 'Yes, a GST invoice is automatically generated after service completion and available in your dashboard under Invoices.' },
    ],
  },
  {
    id: 'technician',
    label: 'Our Technicians',
    icon: '👷',
    faqs: [
      { q: 'Are your technicians certified?', a: 'All our technicians are certified by the Indian Pest Control Association (IPCA) and undergo 40+ hours of training before their first assignment. They are also background-verified.' },
      { q: 'How do I know the technician has arrived?', a: 'You\'ll receive an SMS and WhatsApp notification when the technician is on the way, with their name, photo, and live location tracking.' },
      { q: 'Can I request a specific technician?', a: 'Yes, if you\'ve had a positive experience with a technician, you can request them for future bookings from your dashboard.' },
      { q: 'What if I\'m not satisfied with the technician\'s work?', a: 'You can raise a complaint from your dashboard. We take all feedback seriously and will investigate within 24 hours.' },
    ],
  },
  {
    id: 'amc',
    label: 'AMC Plans',
    icon: '📋',
    faqs: [
      { q: 'What is an AMC plan?', a: 'An Annual Maintenance Contract (AMC) is a yearly subscription that covers multiple pest control visits throughout the year at a discounted rate. It\'s the most cost-effective way to keep your home pest-free.' },
      { q: 'How many visits are included in an AMC?', a: 'Our AMC plans include 4 to 12 visits per year depending on the plan. Each visit covers all common household pests.' },
      { q: 'Can I upgrade my AMC plan?', a: 'Yes, you can upgrade your plan at any time. The price difference will be prorated for the remaining period.' },
      { q: 'Is AMC available for commercial properties?', a: 'Yes! We offer customized AMC plans for restaurants, hotels, offices, and warehouses with SLA-backed response times and compliance documentation.' },
    ],
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('booking')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const activeData = faqCategories.find(c => c.id === activeCategory)

  const filteredFaqs = searchQuery
    ? faqCategories.flatMap(cat => cat.faqs.filter(f =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : activeData?.faqs || []

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
                <span className="text-emerald-400">FAQ</span>
              </nav>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-emerald-300 text-sm font-bold uppercase tracking-widest">Got Questions?</span>
              </div>

              <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
                Frequently Asked
                <br /><span className="gradient-text">Questions</span>
              </h1>
              <p className="text-white/85 text-lg max-w-2xl mb-8 leading-relaxed">
                Everything you need to know about our pest control services, booking process, and guarantees.
              </p>

              {/* Search */}
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input type="text" placeholder="Search questions..."
                  value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory('') }}
                  className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all" />
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 50L720 20L1440 50V50H0Z" fill="#F7F5F0"/>
            </svg>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!searchQuery && (
              <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
                className="flex flex-wrap gap-2 justify-center mb-10">
                {faqCategories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={cn('flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all',
                      activeCategory === cat.id
                        ? 'bg-forest-900 text-white shadow-md'
                        : 'bg-white text-neutral-600 border border-cream-300 hover:border-forest-900 hover:text-forest-900')}>
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}

            <div className="max-w-3xl mx-auto">
              {searchQuery && (
                <p className="text-neutral-500 text-sm mb-6 text-center">
                  {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                </p>
              )}

              <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
                className="space-y-3">
                {filteredFaqs.map((faq, idx) => {
                  const key = `${activeCategory}-${idx}`
                  const isOpen = openFaq === key
                  return (
                    <motion.div key={key} variants={fadeUp}
                      className="bg-card rounded-2xl border border-cream-300 shadow-card overflow-hidden">
                      <button onClick={() => setOpenFaq(isOpen ? null : key)}
                        className="w-full flex items-center justify-between p-5 text-left gap-4">
                        <span className="font-display font-semibold text-ink text-base leading-snug">{faq.q}</span>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center">
                          <ChevronDown className="h-4 w-4 text-neutral-600" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                            <div className="px-5 pb-5 text-neutral-600 text-sm leading-relaxed border-t border-cream-200 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-16">
                  <HelpCircle className="h-12 w-12 text-cream-300 mx-auto mb-4" />
                  <p className="text-neutral-500">No questions found. Try a different search.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Still have questions CTA */}
        <section className="py-16 bg-forest-900 texture-organic">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-black text-3xl text-white mb-3">Still have questions?</h2>
              <p className="text-white/85 mb-8 max-w-xl mx-auto">Our support team is available Mon–Sat, 8 AM – 8 PM. We typically respond within 30 minutes.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://wa.me/919876543210?text=Hi!%20I%20have%20a%20question%20about%20your%20services."
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
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
