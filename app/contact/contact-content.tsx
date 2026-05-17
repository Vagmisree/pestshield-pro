'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Phone, Mail, Clock, MapPin, Send, MessageCircle } from 'lucide-react'
import { SectionWrapper } from '@/components/layout'
import { fadeUp, slideLeft, slideRight, viewportSettings } from '@/lib/animations'
import { cities } from '@/lib/data/cities'
import { services } from '@/lib/data/services'

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  city: z.string().min(1, 'Please select a city'),
  service: z.string().optional(),
  message: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Mail, label: 'Email', value: 'hello@pestshieldpro.in', href: 'mailto:hello@pestshieldpro.in' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat 8 AM – 8 PM, Sun 9 AM – 5 PM', href: null },
]

export function ContactContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Form data:', data)
    toast.success("Received! We'll call you within 2 hours.")
    reset()
    setIsSubmitting(false)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-brand-800 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </nav>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Have questions? Need a quote? Our team is ready to help you get a pest-free home.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={slideRight}
          >
            <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-6">
              Send Us a Message
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName')}
                  className="w-full h-12 px-4 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full h-12 pl-12 pr-4 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    placeholder="98765 43210"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  City *
                </label>
                <select
                  id="city"
                  {...register('city')}
                  className="w-full h-12 px-4 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select your city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.city}>{city.city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              {/* Service */}
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Service Needed
                </label>
                <select
                  id="service"
                  {...register('service')}
                  className="w-full h-12 px-4 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select a service (optional)</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>{service.name}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
                  placeholder="Tell us about your pest problem (optional)"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 flex items-center justify-center gap-2 bg-accent-400 text-neutral-900 font-semibold rounded-full hover:bg-accent-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={slideLeft}
          >
            <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-6">
              Get in Touch
            </h2>

            {/* Contact Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-4 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-brand-600" />
                    </div>
                    <span className="font-medium text-neutral-700">{item.label}</span>
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-brand-600 hover:text-brand-700"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-neutral-600">{item.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-card">
              <iframe
                src="https://maps.google.com/maps?q=Hyderabad+Telangana&z=13&output=embed"
                className="w-full h-[300px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PestShield Pro Hyderabad Office Location"
              />
            </div>

            {/* Address */}
            <div className="mt-4 flex items-start gap-3 text-neutral-600">
              <MapPin className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
              <p className="text-sm">
                1st Floor, Banjara Towers, Road No. 12, Banjara Hills, Hyderabad, Telangana 500034
              </p>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>
    </>
  )
}
