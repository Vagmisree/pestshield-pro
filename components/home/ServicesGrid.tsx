'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionWrapper, SectionHeading } from '@/components/layout'
import { services, getServicesByTag } from '@/lib/data/services'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { formatPrice, cn } from '@/lib/utils'
import { Service } from '@/types'

const filterTabs = ['All', 'Residential', 'Commercial', 'Organic'] as const

export function ServicesGrid() {
  const [activeFilter, setActiveFilter] = useState<typeof filterTabs[number]>('All')

  const filteredServices = getServicesByTag(activeFilter as Service['tag'] | 'Organic' | 'All')

  return (
    <SectionWrapper background="green-tint">
      <SectionHeading
        eyebrow="What We Treat"
        title="All Pest Control Services"
        subtitle="Certified treatments for homes and businesses across India."
        align="center"
      />

      {/* Filter Tabs — sliding pill */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={fadeUp}
        className="flex justify-center mb-10"
      >
        <div className="relative flex items-center gap-1 bg-cream-200 p-1 rounded-full">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                'relative px-5 py-2 text-sm font-semibold rounded-full transition-colors z-10',
                activeFilter === tab ? 'text-white' : 'text-neutral-600 hover:text-ink'
              )}
            >
              {activeFilter === tab && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-forest-900 rounded-full -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={stagger}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              variants={fadeUp}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-card rounded-2xl overflow-hidden border border-cream-300 shadow-card hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />
                  <span className={`absolute bottom-3 left-3 glass-card text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {service.chemicalType}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-ink mb-3">
                    {service.name}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="bg-cream-200 text-neutral-600 text-xs px-2.5 py-1 rounded-full">{service.duration}</span>
                    <span className="bg-cream-200 text-neutral-600 text-xs px-2.5 py-1 rounded-full truncate max-w-[120px]">{service.method}</span>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm text-neutral-400">from </span>
                    <span className="text-2xl font-display font-black text-brand-600">
                      {formatPrice(service.startingPrice)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="bg-emerald-400/10 text-emerald-600 border border-emerald-400/20 rounded-full text-xs px-2.5 py-1">
                      {service.warranty} warranty
                    </span>
                  </div>

                  <Link
                    href={`/book?service=${service.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-forest-900 hover:bg-brand-700 rounded-xl transition-all group/btn"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* WhatsApp CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={fadeUp}
        className="mt-12 text-center"
      >
        <a
          href="https://wa.me/919876543210?text=Hi!%20I%20need%20help%20choosing%20a%20pest%20control%20service."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700"
        >
          <span>{"Can't decide? Chat with our experts"}</span>
          <span>→</span>
        </a>
      </motion.div>
    </SectionWrapper>
  )
}
