'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { slideUp } from '@/lib/animations'

const cities = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai']
const pestTypes = ['Cockroach', 'Termite', 'Rodent', 'Mosquito', 'Bed Bug']

export function EnquiryPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    pestType: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setIsOpen(false)
      setForm({ name: '', phone: '', city: '', pestType: '' })
    }, 3000)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 px-5 py-3 bg-brand-600 text-white font-semibold rounded-full shadow-lg hover:bg-brand-700 hover:scale-105 transition-all text-sm"
      >
        Get Free Inspection 🌿
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 max-w-md mx-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-xl text-neutral-900">
                  Get Free Inspection
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-500" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <p className="text-lg font-semibold text-neutral-900">
                    We'll call you within 30 minutes!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <select
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors text-sm"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      required
                      value={form.pestType}
                      onChange={(e) => setForm({ ...form, pestType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors text-sm"
                    >
                      <option value="">Select Pest Type</option>
                      {pestTypes.map((pest) => (
                        <option key={pest} value={pest}>{pest}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors"
                  >
                    Submit
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
