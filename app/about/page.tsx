import { Metadata } from 'next'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { AboutContent } from './about-content'

export const metadata: Metadata = {
  title: "About Us | PestShield Pro — India's #1 Pest Control",
  description: "Learn about PestShield Pro's mission to provide safe, effective pest control across India. Founded in 2018, serving 12,000+ customers in 15+ cities.",
  openGraph: {
    title: "About PestShield Pro",
    description: "Learn about our mission to provide safe, effective pest control across India.",
    images: ['/images/about-handshake.jpg'],
  },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutContent />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
