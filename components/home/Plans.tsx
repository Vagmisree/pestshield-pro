'use client'

import { motion } from 'framer-motion'
import { Check, Calendar, Zap } from 'lucide-react'
import { SectionWrapper, SectionHeading } from '@/components/layout'
import { plans } from '@/lib/data/plans'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { formatPrice, cn } from '@/lib/utils'

export function Plans() {
  return (
    <SectionWrapper background="white">
      <SectionHeading
        eyebrow="Protect All Year"
        title="Annual Maintenance Plans"
        subtitle="Save up to 40% compared to one-time bookings."
        align="center"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={stagger}
        className="grid md:grid-cols-3 gap-6 lg:gap-8 items-center"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            variants={fadeUp}
            className={cn(
              'relative rounded-2xl p-6 lg:p-8',
              plan.popular
                ? 'bg-white border-2 border-brand-600 shadow-hover md:scale-105 z-10'
                : 'bg-white border border-cream-300 shadow-card'
            )}
          >
            {/* Popular ribbon */}
            {plan.badge && (
              <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 rounded-tr-2xl">
                <div className="absolute top-4 right-[-20px] w-[100px] bg-accent-500 text-white text-[10px] font-bold text-center py-1 rotate-45 shadow-sm">
                  {plan.badge}
                </div>
              </div>
            )}

            {/* Icon */}
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
              plan.popular ? 'bg-brand-600' : 'bg-brand-50'
            )}>
              {index === 0
                ? <Zap className={cn('h-6 w-6', plan.popular ? 'text-white' : 'text-brand-600')} />
                : <Calendar className={cn('h-6 w-6', plan.popular ? 'text-white' : 'text-brand-600')} />
              }
            </div>

            {/* Name & Description */}
            <h3 className="font-heading font-bold text-xl text-ink mb-2">{plan.name}</h3>
            <p className="text-sm text-neutral-600 mb-4">{plan.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black font-display text-ink">
                {plan.price === 499 ? 'from ' : ''}{formatPrice(plan.price)}
              </span>
              {plan.price > 499 && <span className="text-neutral-600 text-sm">/year</span>}
              {plan.id === '2' && (
                <span className="inline-flex items-center gap-1 bg-emerald-400/10 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/20">
                  Save ₹500
                </span>
              )}
              {plan.id === '3' && (
                <span className="inline-flex items-center gap-1 bg-emerald-400/10 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/20">
                  Save ₹1,200
                </span>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 bg-cream-100 rounded-lg px-3 py-2">
                  <Check className={cn('h-4 w-4 shrink-0 mt-0.5', plan.popular ? 'text-emerald-400' : 'text-neutral-400')} />
                  <span className="text-sm text-neutral-600">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button className={cn(
              'w-full py-3 rounded-full font-semibold transition-all',
              plan.popular
                ? 'bg-accent-500 hover:bg-accent-600 text-white shadow-md'
                : 'border-2 border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-white'
            )}>
              {plan.popular ? 'Get Started' : plan.id === '1' ? 'Book Now' : 'Get Started'}
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={fadeUp}
        className="mt-10 text-center"
      >
        <p className="text-sm text-neutral-500 mb-4">All plans include free inspection · WhatsApp updates · OTP closure</p>
        <a
          href="https://wa.me/919876543210?text=Hi!%20I%20need%20help%20choosing%20an%20AMC%20plan."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700"
        >
          <span>Not sure which plan? WhatsApp us</span>
          <span>→</span>
        </a>
      </motion.div>
    </SectionWrapper>
  )
}
