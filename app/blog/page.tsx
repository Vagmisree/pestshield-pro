import { Metadata } from 'next'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { BlogContent } from './blog-content'

export const metadata: Metadata = {
  title: "Blog - Pest Control Tips & Guides | PestShield Pro",
  description: "Expert advice on pest control, prevention tips, and guides for a safer home. Learn about termites, cockroaches, bed bugs, and more from our certified experts.",
  openGraph: {
    title: "Pest Control Blog | PestShield Pro",
    description: "Expert advice and tips for a pest-free home.",
  },
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <BlogContent />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
