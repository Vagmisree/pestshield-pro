import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import {
  Hero,
  ScrollTicker,
  HowItWorks,
  ServicesGrid,
  WhyUs,
  Stats,
  Testimonials,
  OrganicBand,
  Plans,
  BlogPreview,
  CTABand,
  EnquiryPopup,
  OfferBanner,
  CommercialCTA,
  AIPestVision,
} from '@/components/home'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ─── Part 1 — above the fold ───────────────────── */}
        <Hero />
        <ScrollTicker />
        <ServicesGrid />
        <HowItWorks />
        <Stats />

        {/* ─── Part 2 — below the fold ───────────────────── */}
        <WhyUs />
        <Testimonials />
        <CommercialCTA />
        <OrganicBand />
        <AIPestVision />
        <Plans />
        <OfferBanner />
        <BlogPreview />
        <CTABand />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
      <EnquiryPopup />
    </>
  )
}
