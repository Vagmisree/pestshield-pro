'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar, Footer } from '@/components/layout'
import { Home, ArrowLeft, Search, Phone } from 'lucide-react'
import { fadeUp, stagger } from '@/lib/animations'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-100 flex items-center justify-center pt-16">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            {/* Big 404 */}
            <motion.div variants={fadeUp} className="relative mb-8">
              <p className="font-display font-black text-[10rem] leading-none text-forest-900/10 select-none">
                404
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-forest-900 flex items-center justify-center shadow-2xl">
                  <Search className="h-12 w-12 text-emerald-400" />
                </div>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display font-black text-3xl md:text-4xl text-ink mb-4">
              Page Not Found
            </motion.h1>
            <motion.p variants={fadeUp} className="text-neutral-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Looks like this page got eaten by pests. {"Let's"} get you back to safety.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-forest-900 hover:bg-brand-700 text-white font-bold rounded-full transition-all shadow-lg">
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
              <Link href="/book"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-lg">
                Book a Service
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Link>
            </motion.div>

            {/* Quick links */}
            <motion.div variants={fadeUp}>
              <p className="text-neutral-400 text-sm mb-4 font-medium uppercase tracking-wider">Popular Pages</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: 'Services', href: '/services' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'DIY Shop', href: '/shop' },
                  { label: 'Branches', href: '/branches' },
                  { label: 'Contact', href: '/contact' },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className="px-4 py-2 bg-white border border-cream-300 rounded-full text-sm font-medium text-neutral-600 hover:border-forest-900 hover:text-forest-900 transition-all">
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Help line */}
            <motion.div variants={fadeUp} className="mt-12 p-5 bg-white rounded-2xl border border-cream-300 shadow-card inline-flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-ink text-sm">Need help? Call us</p>
                <a href="tel:+919876543210" className="text-brand-600 font-bold hover:underline">+91 98765 43210</a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
