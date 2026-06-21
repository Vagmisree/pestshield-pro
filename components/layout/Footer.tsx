'use client'

import Link from 'next/link'
import { Shield, Instagram, Facebook, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'

const FOOTER = {
  services: [
    { label: 'Cockroach Control',    href: '/services/cockroach-control' },
    { label: 'Termite Control',      href: '/services/termite-control' },
    { label: 'Rodent Control',       href: '/services/rodent-control' },
    { label: 'Mosquito Control',     href: '/services/mosquito-control' },
    { label: 'Bed Bug Control',      href: '/services/bed-bug-control' },
    { label: 'General Pest Control', href: '/services/general-pest-control' },
  ],
  company: [
    { label: 'About Us',  href: '/about' },
    { label: 'Our Team',  href: '/about#team' },
    { label: 'Branches',  href: '/branches' },
    { label: 'Blog',      href: '/blog' },
    { label: 'Careers',   href: '/careers' },
    { label: 'Press',     href: '/press' },
  ],
  legal: [
    { label: 'Privacy Policy',   href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy',    href: '/refund-policy' },
    { label: 'Cookie Policy',    href: '/cookies' },
  ],
  cities: ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'Pune', 'Delhi', 'Kolkata', 'Ahmedabad'],
}

const SOCIALS = [
  { icon: Instagram, href: 'https://instagram.com/pestshieldpro', label: 'Instagram' },
  { icon: Facebook,  href: 'https://facebook.com/pestshieldpro',  label: 'Facebook'  },
  { icon: Linkedin,  href: 'https://linkedin.com/company/pestshieldpro', label: 'LinkedIn' },
  { icon: Youtube,   href: 'https://youtube.com/pestshieldpro',   label: 'YouTube'   },
]

const ColHead = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs font-mono tracking-[3px] uppercase mb-5" style={{ color: 'rgba(0,255,100,0.55)' }}>
    {children}
  </h4>
)

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="text-sm transition-colors duration-150"
      style={{ color: 'rgba(255,255,255,0.45)' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
    >
      {children}
    </Link>
  </li>
)

export function Footer() {
  return (
    <footer
      style={{
        background: '#030508',
        borderTop: '1px solid rgba(0,255,100,0.08)',
      }}
    >
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

          {/* ── Column 1: Brand ──────────────────────────────────── */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(0,255,100,0.08)',
                  border: '1px solid rgba(0,255,100,0.2)',
                }}
              >
                <Shield className="h-5 w-5" style={{ color: '#00FF64' }} />
              </div>
              <span className="font-heading font-bold text-white text-base tracking-tight">
                PestShield <span style={{ color: '#00FF64' }}>Pro</span>
              </span>
            </Link>

            <p className="text-sm mb-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              India&apos;s Most Trusted Pest Control Platform
            </p>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.32)' }}>
              Certified, organic pest control services across 15+ cities.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mb-5">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,100,0.35)'; e.currentTarget.style.color = '#00FF64' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2">
              {['ISP Certified', 'Organic Approved', 'DPDPA Compliant'].map(badge => (
                <span
                  key={badge}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* ── Column 2: Services ───────────────────────────────── */}
          <div>
            <ColHead>Services</ColHead>
            <ul className="space-y-2.5">
              {FOOTER.services.map(s => <FooterLink key={s.href} href={s.href}>{s.label}</FooterLink>)}
            </ul>
          </div>

          {/* ── Column 3: Company ────────────────────────────────── */}
          <div>
            <ColHead>Company</ColHead>
            <ul className="space-y-2.5">
              {FOOTER.company.map(s => <FooterLink key={s.href} href={s.href}>{s.label}</FooterLink>)}
            </ul>
          </div>

          {/* ── Column 4: Cities ─────────────────────────────────── */}
          <div>
            <ColHead>Cities We Serve</ColHead>
            <ul className="space-y-2.5">
              {FOOTER.cities.map(city => (
                <li key={city}>
                  <Link
                    href={`/branches?city=${city.toLowerCase()}`}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 5: Contact ─────────────────────────────────── */}
          <div>
            <ColHead>Contact</ColHead>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <Phone className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#00FF64' }} />
                <span>+91 79813 53130<br /><span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Mon–Sat 8 AM – 8 PM</span></span>
              </li>
              <li>
                <a href="mailto:enterprisesshreeji382@gmail.com"
                  className="flex items-start gap-2.5 text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#00FF64' }} />
                  enterprisesshreeji382@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <Clock className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#00FF64' }} />
                Mon–Sat: 8 AM – 8 PM
              </li>
              <li className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#00FF64' }} />
                Hyderabad, India (HQ)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
            © 2025 PestShield Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {FOOTER.legal.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.28)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
