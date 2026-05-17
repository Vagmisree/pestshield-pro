'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Menu, X, ChevronRight, Home, Wrench, Info, ShoppingBag, BookOpen,
  MapPin, LayoutDashboard, ChevronDown, LogOut, User, Zap, Bug, TreeDeciduous,
  Rat, Wind, Bed, ShieldCheck, HelpCircle
} from 'lucide-react'
import { useScrolled } from '@/lib/hooks/use-scrolled'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { mobileMenuVariants, mobileMenuItemVariants } from '@/lib/animations'

const servicesMega = [
  { icon: Bug, label: 'Cockroach Control', href: '/services/cockroach-control', desc: 'Gel bait + spray' },
  { icon: TreeDeciduous, label: 'Termite Control', href: '/services/termite-control', desc: '1-year warranty' },
  { icon: Rat, label: 'Rodent Control', href: '/services/rodent-control', desc: 'Humane trapping' },
  { icon: Wind, label: 'Mosquito Control', href: '/services/mosquito-control', desc: 'Fogging + larvicide' },
  { icon: Bed, label: 'Bed Bug Control', href: '/services/bed-bug-control', desc: 'Heat treatment' },
  { icon: ShieldCheck, label: 'General Pest Control', href: '/services/general-pest-control', desc: 'Full home protection' },
]

const navLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Services', href: '/services', icon: Wrench, hasMega: true },
  { label: 'About', href: '/about', icon: Info },
  { label: 'DIY Shop', href: '/shop', icon: ShoppingBag },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Branches', href: '/branches', icon: MapPin },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
]

export function Navbar() {
  const scrolled = useScrolled(60)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const pathname = usePathname()
  const megaRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!mounted) {
    return <header className="fixed top-0 left-0 right-0 z-50 h-16"><nav className="h-full" /></header>
  }

  const dashboardHref = user?.role === 'ADMIN' ? '/admin' : user?.role === 'TECHNICIAN' ? '/technician' : '/dashboard'

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(247,245,240,0.97)' : 'rgba(247,245,240,0)',
          boxShadow: scrolled ? '0 1px 0 rgba(221,217,208,0.8)' : 'none',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className={cn(
                'relative flex items-center justify-center w-9 h-9 rounded-xl transition-all',
                scrolled ? 'bg-forest-900 ring-1 ring-forest-700' : 'bg-white/15 backdrop-blur-sm'
              )}>
                <Shield className="h-5 w-5 text-white" />
                {scrolled && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                )}
              </div>
              <span className={cn('font-heading font-bold text-lg transition-colors', scrolled ? 'text-ink' : 'text-white')}>
                PestShield Pro
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                if (link.hasMega) {
                  return (
                    <div key={link.href} ref={megaRef} className="relative">
                      <button
                        onClick={() => setMegaOpen(!megaOpen)}
                        className={cn(
                          'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                          scrolled
                            ? isActive ? 'text-brand-600 bg-brand-50' : 'text-neutral-700 hover:text-brand-600 hover:bg-brand-50'
                            : 'text-white/85 hover:text-white hover:bg-white/10'
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', megaOpen && 'rotate-180')} />
                      </button>
                      <AnimatePresence>
                        {megaOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-cream-300 p-4 z-50"
                          >
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {servicesMega.map((svc) => (
                                <Link key={svc.href} href={svc.href} onClick={() => setMegaOpen(false)}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-100 transition-colors group">
                                  <div className="w-9 h-9 rounded-lg bg-forest-900 flex items-center justify-center flex-shrink-0">
                                    <svc.icon className="h-4 w-4 text-emerald-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-ink group-hover:text-brand-600 transition-colors">{svc.label}</p>
                                    <p className="text-xs text-neutral-400">{svc.desc}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-cream-200 pt-3 flex items-center justify-between">
                              <Link href="/services" onClick={() => setMegaOpen(false)}
                                className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                                View all services →
                              </Link>
                              <Link href="/book" onClick={() => setMegaOpen(false)}
                                className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold rounded-full transition-colors">
                                Book Now
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }
                return (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all relative group',
                      scrolled
                        ? isActive ? 'text-brand-600 bg-brand-50' : 'text-neutral-700 hover:text-brand-600 hover:bg-brand-50'
                        : 'text-white/85 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      'absolute bottom-1 left-4 right-4 h-0.5 transition-transform origin-left rounded-full',
                      scrolled ? 'bg-emerald-400' : 'bg-white/60',
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )} />
                  </Link>
                )
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2">
              {/* Free Inspection button */}
              <Link href="/free-inspection"
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full border transition-all',
                  scrolled
                    ? 'text-brand-600 border-brand-200 bg-brand-50 hover:bg-brand-100'
                    : 'text-white border-white/30 hover:bg-white/10'
                )}
              >
                <Zap className="h-3.5 w-3.5" />
                Free Inspection
              </Link>

              {isAuthenticated ? (
                <div ref={userRef} className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-full border transition-all',
                      scrolled
                        ? 'text-neutral-700 border-cream-300 hover:border-brand-600 hover:text-brand-600'
                        : 'text-white border-white/30 hover:bg-white/10'
                    )}
                  >
                    <div className="w-6 h-6 rounded-full bg-forest-900 flex items-center justify-center">
                      <span className="text-white text-xs font-black">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-cream-300 p-2 z-50"
                      >
                        <div className="px-3 py-2 mb-1 border-b border-cream-200">
                          <p className="font-semibold text-ink text-sm">{user?.name}</p>
                          <p className="text-xs text-neutral-400">{user?.phone}</p>
                        </div>
                        <Link href={dashboardHref} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-cream-100 transition-colors text-sm text-neutral-700">
                          <LayoutDashboard className="h-4 w-4 text-neutral-400" />Dashboard
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-cream-100 transition-colors text-sm text-neutral-700">
                          <User className="h-4 w-4 text-neutral-400" />Profile
                        </Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm text-red-600 mt-1 border-t border-cream-200">
                          <LogOut className="h-4 w-4" />Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login"
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full border transition-all',
                    scrolled
                      ? 'text-neutral-700 border-cream-300 hover:border-brand-600 hover:text-brand-600'
                      : 'text-white border-white/30 hover:bg-white/10'
                  )}
                >
                  Login
                </Link>
              )}
              <Link href="/book"
                className="relative group px-5 py-2.5 text-sm font-semibold rounded-full bg-accent-500 text-white hover:bg-accent-600 transition-all shadow-md hover:shadow-lg">
                <span className="relative z-10">Book Now</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'md:hidden p-2 rounded-xl transition-colors',
                scrolled ? 'text-ink hover:bg-cream-200' : 'text-white hover:bg-white/10'
              )}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial="closed" animate="open" exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden absolute top-full left-0 right-0 bg-cream-100 border-t border-cream-300 shadow-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <motion.div key={link.href} variants={mobileMenuItemVariants}>
                      <Link href={link.href} onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-neutral-400" />
                          {link.label}
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div variants={mobileMenuItemVariants}>
                  <Link href="/free-inspection" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-base font-medium text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-brand-600" />
                      Free Inspection
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </Link>
                </motion.div>
                <motion.div variants={mobileMenuItemVariants} className="pt-4 flex gap-3">
                  {isAuthenticated ? (
                    <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3 text-center text-sm font-medium rounded-full border border-cream-300 text-neutral-700 hover:border-brand-600 hover:text-brand-600 transition-all">
                      Dashboard →
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3 text-center text-sm font-medium rounded-full border border-cream-300 text-neutral-700 hover:border-brand-600 hover:text-brand-600 transition-all">
                      Login
                    </Link>
                  )}
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 px-4 py-3 text-center text-sm font-semibold rounded-full bg-accent-500 text-white hover:bg-accent-600 transition-all">
                    Book Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
