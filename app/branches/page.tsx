"use client";

import { motion } from "framer-motion";
import { Navbar, Footer, WhatsAppFloat, MobileBookBar, SectionWrapper } from "@/components/layout";
import { MapPin, Phone, Clock, Navigation, Search, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { fadeUp, stagger, fadeInUp } from "@/lib/animations";
import { cities } from "@/lib/data/cities";
import { cn } from "@/lib/utils";

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = [...new Set(cities.map((city) => city.state).filter(Boolean))];

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = !selectedState || city.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-forest-950 overflow-hidden pt-28 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800" />
          <div className="absolute inset-0 texture-organic opacity-50" />
          <motion.div className="absolute top-1/3 right-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 9, repeat: Infinity }} />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-emerald-400">Branches</span>
              </nav>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-emerald-300 text-sm font-bold uppercase tracking-widest">15+ Cities Across India</span>
              </div>

              <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
                Find Us
                <br /><span className="gradient-text">Near You</span>
              </h1>
              <p className="text-white/85 text-lg max-w-2xl mb-8 leading-relaxed">
                PestShield Pro serves 50+ cities across India. Find your nearest branch and get professional pest control at your doorstep.
              </p>

              {/* Search */}
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input type="text" placeholder="Search by city or state..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* State filters */}
        <SectionWrapper background="cream" className="py-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="flex justify-center">
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => setSelectedState(null)}
                className={cn('px-4 py-2 rounded-full text-sm font-semibold transition-all',
                  !selectedState ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300')}>
                All States
              </button>
              {states.map((state) => (
                <button key={state} onClick={() => setSelectedState(state)}
                  className={cn('px-4 py-2 rounded-full text-sm font-semibold transition-all',
                    selectedState === state ? 'bg-forest-900 text-white' : 'bg-cream-200 text-neutral-600 hover:bg-cream-300')}>
                  {state}
                </button>
              ))}
            </div>
          </motion.div>
        </SectionWrapper>

        {/* Cities grid */}
        <SectionWrapper background="cream">
          <p className="text-neutral-500 text-sm mb-6 font-medium">
            Showing <span className="text-ink font-bold">{filteredCities.length}</span> of {cities.length} locations
          </p>

          {filteredCities.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCities.map((city) => (
                <motion.div key={city.id} variants={fadeInUp}
                  className="bg-card border border-cream-300 rounded-2xl p-6 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-ink">{city.city}</h3>
                      <p className="text-neutral-500 text-sm mt-0.5">{city.state}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                      <MapPin className="w-5 h-5 text-brand-600" />
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-600">{city.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <a href={`tel:${city.phone}`} className="text-ink font-medium hover:text-brand-600 transition-colors">
                        {city.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <span className="text-neutral-600">{city.workingHours}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/book`}
                      className="flex-1 py-2.5 text-center text-sm font-bold bg-forest-900 hover:bg-brand-700 text-white rounded-xl transition-colors">
                      Book Service
                    </Link>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(city.address + ", " + city.city)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2.5 text-sm font-semibold border-2 border-cream-300 hover:border-brand-600 hover:text-brand-600 rounded-xl transition-colors flex items-center gap-2 text-neutral-600">
                      <Navigation className="w-4 h-4" />Map
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink mb-2">No locations found</h3>
              <p className="text-neutral-500">Try adjusting your search or filter</p>
            </div>
          )}
        </SectionWrapper>

        {/* CTA */}
        <section className="bg-forest-900 texture-organic py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-black text-3xl text-white mb-3">Don&apos;t See Your City?</h2>
              <p className="text-white/85 mb-8 max-w-xl mx-auto">
                We&apos;re expanding rapidly. Contact us and we&apos;ll let you know when we arrive in your area.
              </p>
              <Link href="/book"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-colors shadow-lg">
                Request Your City →
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  );
}
