'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Menu, X, ChevronRight, Home, Wrench, Info, ShoppingBag, BookOpen,
  MapPin, LayoutDashboard, ChevronDown, LogOut, User, Zap, Bug, TreeDeciduous,
  Rat, Wind, Bed, ShieldCheck, HelpCircle, ArrowRight,
} from 'lucide-react'
import { useScrolled } from '@/lib/hooks/use-scrolled'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { mobileMenuVariants, mobileMenuItemVariants } from '@/lib/animations'

const servicesMega = [
  { icon: Bug,           label: 'Cockroach Control',    href: '/services/cockroach-control',    desc: 'Gel bait + spray' },
  { icon: TreeDeciduous, label: 'Termite Control',       href: '/services/termite-control',       desc: '1-year warranty' },
  { icon: Rat,           label: 'Rodent Control',        href: '/services/rodent-control',        desc: 'Humane trapping' },
  { icon: Wind,          label: 'Mosquito Control',      href: '/services/mosquito-control',      desc: 'Fogging + larvicide' },
  { icon: Bed,           label: 'Bed Bug Control',       href: '/services/bed-bug-control',       desc: 'Heat treatment' },
  { icon: ShieldCheck,   label: 'General Pest Control',  href: '/services/general-pest-control',  desc: 'Full home protection' },
]

const navLinks = [
  { label: 'Services',  href: '/services',  icon: Wrench,   hasMega: true },
  { label: 'About',     href: '/about',     icon: Info },
  { label: 'Plans',     href: '/#plans',    icon: Shield },
  { label: 'Branches',  href: '/branches',  icon: MapPin },
  { label: 'Blog',      href: '/blog',      icon: BookOpen },
]

export function Navbar() {
  const scrolled = useScrolled(50)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen]     = useState(false)
  const [userOpen, setUserOpen]     = useState(false)
  const [mounted, setMounted]       = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const pathname  = usePathname()
  const megaRef   = useRef<HTMLDivElement>(null)
  const userRef   = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (!mounted) return <header className="fixed inset-x-0 top-0 z-50 h-16" />

  const dashHref = user?.role === 'ADMIN' ? '/admin' : user?.role === 'TECHNICIAN' ? '/technician' : '/dashboard'

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(7,31,23,0.97)' : 'transparent',
          borderBottomColor: scrolled ? 'rgba(0,255,100,0.10)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.25 }}
        className="border-b"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* ── Logo ───────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#00FF64]/10 border border-[#00FF64]/30 group-hover:border-[#00FF64]/60 transition-colors"
                style={{ boxShadow: '0 0 14px rgba(0,255,100,0.15)' }}>
                <Shield className="h-5 w-5 text-[#00FF64]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-lg text-white tracking-tight">PestShield</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00FF64]/15 text-[#00FF64] border border-[#00FF64]/30 tracking-wide">PRO</span>
              </div>
            </Link>

            {/* ── Desktop links ───────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && !link.href.startsWith('/#') && pathname.startsWith(link.href))
                if (link.hasMega) {
                  return (
                    <div key={link.href} ref={megaRef} className="relative">
                      <button
                        onClick={() => setMegaOpen(!megaOpen)}
                        className={cn(
                          'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                          active ? 'text-[#00FF64]' : 'text-white/70 hover:text-white hover:bg-white/5'
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
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[500px] rounded-2xl p-4 z-50 border"
                            style={{
                              background: 'rgba(7,31,23,0.96)',
                              borderColor: 'rgba(0,255,100,0.15)',
                              backdropFilter: 'blur(20px)',
                              boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,100,0.05)',
                            }}
                          >
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {servicesMega.map((svc) => (
                                <Link key={svc.href} href={svc.href} onClick={() => setMegaOpen(false)}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#00FF64]/5 border border-transparent hover:border-[#00FF64]/15 transition-all group">
                                  <div className="w-9 h-9 rounded-lg bg-[#00FF64]/10 border border-[#00FF64]/20 flex items-center justify-center flex-shrink-0">
                                    <svc.icon className="h-4 w-4 text-[#00FF64]" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-white group-hover:text-[#00FF64] transition-colors">{svc.label}</p>
                                    <p className="text-xs text-white/40">{svc.desc}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                              <Link href="/services" onClick={() => setMegaOpen(false)}
                                className="text-sm font-semibold text-[#00FF64]/70 hover:text-[#00FF64] transition-colors">
                                View all services →
                              </Link>
                              <Link href="/book" onClick={() => setMegaOpen(false)}
                                className="px-4 py-2 bg-[#FFB800] hover:bg-[#FFC933] text-[#071F17] text-sm font-bold rounded-full transition-colors">
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
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                      active ? 'text-[#00FF64]' : 'text-white/70 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* ── Desktop CTA cluster ────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <div ref={userRef} className="relative">
                  <button onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:border-[#00FF64]/30 transition-all text-white/80 hover:text-white">
                    <div className="w-6 h-6 rounded-full bg-[#00FF64]/20 flex items-center justify-center">
                      <span className="text-[#00FF64] text-xs font-black">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', userOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl p-2 z-50 border"
                        style={{
                          background: 'rgba(7,31,23,0.97)',
                          borderColor: 'rgba(0,255,100,0.12)',
                          backdropFilter: 'blur(16px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                      >
                        <div className="px-3 py-2 mb-1 border-b border-white/5">
                          <p className="font-semibold text-white text-sm">{user?.name}</p>
                          <p className="text-xs text-white/40">{user?.phone}</p>
                        </div>
                        <Link href={dashHref} onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
                          <LayoutDashboard className="h-4 w-4 text-[#00FF64]" /> Dashboard
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
                          <User className="h-4 w-4 text-[#00FF64]" /> Profile
                        </Link>
                        <button onClick={() => { logout(); setUserOpen(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-sm text-red-400 mt-1 border-t border-white/5">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login"
                  className="px-4 py-2 text-sm font-medium rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all">
                  Login
                </Link>
              )}
              <Link href="/book"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm text-[#071F17] transition-all group"
                style={{
                  background: '#FFB800',
                  boxShadow: '0 0 0 0 rgba(255,184,0,0)',
                  transition: 'box-shadow 0.3s, background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(255,184,0,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(255,184,0,0)')}
              >
                Book Now
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* ── Mobile toggle ──────────────────────────────────────── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial="closed" animate="open" exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden absolute top-full inset-x-0 border-t overflow-hidden"
              style={{
                background: 'rgba(7,31,23,0.98)',
                borderColor: 'rgba(0,255,100,0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="px-4 py-4 space-y-1">
                {[{ label: 'Home', href: '/', icon: Home }, ...navLinks].map((link) => {
                  const Icon = link.icon
                  return (
                    <motion.div key={link.href} variants={mobileMenuItemVariants}>
                      <Link href={link.href} onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 text-sm font-medium">
                          <Icon className="h-4 w-4 text-[#00FF64]" />
                          {link.label}
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/20" />
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div variants={mobileMenuItemVariants} className="pt-3 pb-1 flex gap-2">
                  {isAuthenticated ? (
                    <Link href={dashHref} onClick={() => setMobileOpen(false)}
                      className="flex-1 py-3 text-center text-sm font-medium rounded-full border border-white/10 text-white/70">
                      Dashboard
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 py-3 text-center text-sm font-medium rounded-full border border-white/10 text-white/70">
                      Login
                    </Link>
                  )}
                  <Link href="/book" onClick={() => setMobileOpen(false)}
                    className="flex-1 py-3 text-center text-sm font-bold rounded-full text-[#071F17]"
                    style={{ background: '#FFB800' }}>
                    Book Now →
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
