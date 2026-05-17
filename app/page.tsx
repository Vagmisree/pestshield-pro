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
  CommercialCTA
} from '@/components/home'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollTicker />
        <HowItWorks />
        <ServicesGrid />
        <WhyUs />
        <Stats />
        <Testimonials />
        <CommercialCTA />
        <OrganicBand />
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
