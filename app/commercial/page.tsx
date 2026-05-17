import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout';
import Link from 'next/link';
import { ArrowRight, Building2, Hotel, Utensils, Warehouse, Hospital, Leaf, CheckCircle, Clock, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Pest Control & AMC — PestShield Pro',
  description: 'Enterprise pest management for restaurants, hotels, offices, and warehouses. SLA-backed AMC plans with compliance documentation.',
};

const verticals = [
  { icon: Utensils, label: 'Restaurants & Cafes', desc: 'FSSAI-compliant pest management' },
  { icon: Hotel, label: 'Hotels & Resorts', desc: 'Discreet, scheduled treatments' },
  { icon: Building2, label: 'Offices & IT Parks', desc: 'Zero-disruption service' },
  { icon: Warehouse, label: 'Warehouses', desc: 'Rodent & stored-product pest control' },
  { icon: Hospital, label: 'Hospitals & Clinics', desc: 'Medical-grade safe chemicals' },
  { icon: Leaf, label: 'PGs & Hostels', desc: 'Bed bug & cockroach specialists' },
];

const slaTable = [
  { type: 'Restaurant', visits: '12/year', response: '4 hours', docs: 'FSSAI report' },
  { type: 'Hotel', visits: '24/year', response: '2 hours', docs: 'Compliance certificate' },
  { type: 'Office', visits: '4/year', response: '8 hours', docs: 'Service report' },
  { type: 'Warehouse', visits: '6/year', response: '6 hours', docs: 'Pest activity log' },
];

export default function CommercialPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-forest-950 overflow-hidden pt-28 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800" />
          <div className="absolute inset-0 texture-organic opacity-40" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="pill-emerald-dark mb-6 w-fit"><Building2 className="h-3.5 w-3.5 mr-1.5" />Enterprise Solutions</div>
              <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
                Enterprise Pest Management<br /><span className="gradient-text">for Businesses</span>
              </h1>
              <p className="text-white/85 text-lg mb-8 leading-relaxed">
                SLA-backed Annual Maintenance Contracts for restaurants, hotels, offices, and warehouses. Compliance documentation included.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#enquiry" className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-lg">
                  Get Custom Quote <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                  Call Sales Team
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 50L720 20L1440 50V50H0Z" fill="#F7F5F0"/>
            </svg>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-10 text-center">Who We Serve</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {verticals.map((v) => (
                <div key={v.label} className="bg-card rounded-2xl p-5 border border-cream-300 shadow-card flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-ink">{v.label}</h3>
                    <p className="text-neutral-500 text-sm mt-0.5">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AMC Benefits */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-10 text-center">AMC Benefits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Clock, title: 'SLA-Backed Response', desc: 'Guaranteed response times from 2–8 hours depending on property type' },
                { icon: FileText, title: 'Compliance Documentation', desc: 'FSSAI, ISO, and municipal compliance reports provided after every visit' },
                { icon: CheckCircle, title: 'Single Point of Contact', desc: 'Dedicated account manager for all your properties' },
              ].map((b) => (
                <div key={b.title} className="bg-cream-100 rounded-2xl p-6 border border-cream-300">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="font-display font-bold text-ink mb-2">{b.title}</h3>
                  <p className="text-neutral-600 text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLA Table */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-8 text-center">SLA Commitments</h2>
            <div className="bg-card rounded-2xl border border-cream-300 overflow-hidden shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-forest-900 text-white">
                  <tr>
                    <th className="text-left py-3 px-5 font-semibold">Property Type</th>
                    <th className="text-left py-3 px-5 font-semibold">Visits/Year</th>
                    <th className="text-left py-3 px-5 font-semibold">Response Time</th>
                    <th className="text-left py-3 px-5 font-semibold">Documentation</th>
                  </tr>
                </thead>
                <tbody>
                  {slaTable.map((row, i) => (
                    <tr key={row.type} className={i % 2 === 0 ? 'bg-cream-50' : 'bg-white'}>
                      <td className="py-3 px-5 font-semibold text-ink">{row.type}</td>
                      <td className="py-3 px-5 text-neutral-600">{row.visits}</td>
                      <td className="py-3 px-5 text-neutral-600">{row.response}</td>
                      <td className="py-3 px-5 text-neutral-600">{row.docs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Enquiry Form */}
        <section id="enquiry" className="py-16 bg-white">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-2 text-center">Get a Custom Quote</h2>
            <p className="text-neutral-500 text-center mb-8">Fill in your details and our commercial team will contact you within 2 hours.</p>
            <form className="space-y-4 bg-cream-100 rounded-2xl p-6 border border-cream-300">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Company Name *</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600" placeholder="Acme Restaurants Pvt Ltd" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Contact Name *</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600" placeholder="Ramesh Gupta" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Phone *</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600" placeholder="9876543210" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600" placeholder="ramesh@acme.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Property Type</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600">
                    <option>Restaurant</option><option>Hotel</option><option>Office</option><option>Warehouse</option><option>Hospital</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">City</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600" placeholder="Hyderabad" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Message</label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm outline-none focus:border-brand-600 resize-none" placeholder="Tell us about your requirements..." />
              </div>
              <button type="submit" className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all">
                Submit Enquiry →
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  );
}
