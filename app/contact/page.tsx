import { Metadata } from 'next'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { ContactContent } from './contact-content'

export const metadata: Metadata = {
  title: "Contact Us | PestShield Pro — India's #1 Pest Control",
  description: "Get in touch with PestShield Pro. Book a free inspection, request a quote, or chat with our pest control experts. Available Mon-Sat, 8 AM - 8 PM.",
  openGraph: {
    title: "Contact PestShield Pro",
    description: "Book a free inspection or get in touch with our pest control experts.",
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactContent />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
