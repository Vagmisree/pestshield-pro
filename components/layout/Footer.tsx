import Link from 'next/link'
import { Shield, Instagram, Facebook, Linkedin, Twitter, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'DIY Shop', href: '/shop' },
  { label: 'Organic Treatment', href: '/organic' },
  { label: 'Branch Locator', href: '/branches' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Commercial / AMC', href: '/commercial' },
  { label: 'Free Inspection', href: '/free-inspection' },
  { label: 'Why PestShield', href: '/why-pestshield' },
]

const serviceLinks = [
  { label: 'Cockroach Control', href: '/services#cockroach' },
  { label: 'Termite Control', href: '/services#termite' },
  { label: 'Rodent Control', href: '/services#rodent' },
  { label: 'Mosquito Control', href: '/services#mosquito' },
  { label: 'Bed Bug Control', href: '/services#bedbug' },
  { label: 'General Pest Control', href: '/services#general' },
]

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/pestshieldpro', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/pestshieldpro', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com/company/pestshieldpro', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/pestshieldpro', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/pestshieldpro', label: 'YouTube' },
]

const trustBadges = ['ISO Certified', 'DPDPA Compliant', 'ISP Member']

export function Footer() {
  return (
    <footer className="bg-forest-950 text-white texture-organic border-t-2 border-emerald-400/30">
      {/* Gradient top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-forest-800 border border-white/10">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="font-heading font-bold text-xl">PestShield Pro</span>
            </Link>
            <p className="mt-3 text-white/85 text-sm max-w-xs">
              {"India's most trusted pest control platform. Book in 60 seconds, guaranteed results."}
            </p>
            {/* Micro-stat pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['12,000+ Homes', '4.8★ Rating', '15+ Cities'].map((s) => (
                <span key={s} className="glass-card rounded-full px-3 py-1 text-white/90 text-xs">{s}</span>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/12 hover:bg-emerald-400/20 hover:text-emerald-300 transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* About Column */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-white/95">
              About PestShield Pro
            </h3>
            <p className="text-white/85 text-sm mb-4">
              Founded in 2018, we&apos;ve grown to serve 12,000+ customers across 15+ cities with our commitment to quality and safety.
            </p>
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-1 text-xs font-medium border border-emerald-400/30 rounded-full text-emerald-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-white/95">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/85 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-white/95">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/85 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-white/95">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/85">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                <span>Hyderabad, Telangana — HQ</span>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-white/85 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@pestshieldpro.in" className="flex items-center gap-3 text-sm text-white/85 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>hello@pestshieldpro.in</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/85">
                <Clock className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Mon–Sat: 8 AM – 8 PM</span>
              </li>
              <li>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/85 hover:text-white transition-colors">
                  <span className="w-4 h-4 rounded-full bg-[#25D366] flex-shrink-0" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-white/90">
            <div className="flex items-center gap-4">
              <p>© 2026 PestShield Pro. All rights reserved.</p>
              <span className="hidden md:block">·</span>
              <p className="hidden md:block">GSTIN: 36XXXXX1234Z1ZX · ISP Reg: PSP-2018-HYD</p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
