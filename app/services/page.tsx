import { Metadata } from 'next'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { ServicesContent } from './services-content'

export const metadata: Metadata = {
  title: "All Pest Control Services | PestShield Pro — India's #1 Pest Control",
  description: "Explore our complete range of pest control services: cockroach, termite, rodent, mosquito, bed bug, and general pest control. Certified treatments for homes and businesses.",
  openGraph: {
    title: "All Pest Control Services | PestShield Pro",
    description: "Explore our complete range of pest control services with certified treatments.",
    images: ['/images/services/general-pest.jpg'],
  },
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesContent />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
