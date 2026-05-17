import { Metadata } from 'next'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { ShopContent } from './shop-content'

export const metadata: Metadata = {
  title: "DIY Pest Control Products | PestShield Pro Shop",
  description: "Shop professional-grade DIY pest control products. Organic sprays, baits, traps, and complete kits for cockroach, termite, rodent, and mosquito control.",
  openGraph: {
    title: "DIY Pest Control Shop | PestShield Pro",
    description: "Professional-grade DIY pest control products for your home.",
    images: ['/images/products/home-pest-kit.jpg'],
  },
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main>
        <ShopContent />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
