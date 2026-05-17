import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/components/providers/QueryProvider'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "PestShield Pro — India's #1 Pest Control Service",
  description: "Book certified pest control in 60 seconds. Organic, child-safe treatments with a 30-day re-service guarantee. Serving 15+ cities across India.",
  keywords: ['pest control india', 'cockroach treatment', 'termite control', 'bed bug control', 'organic pest control', 'pest control hyderabad', 'pest control bangalore', 'pest control mumbai'],
  authors: [{ name: 'PestShield Pro' }],
  creator: 'PestShield Pro',
  publisher: 'PestShield Pro',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pestshieldpro.in',
    siteName: 'PestShield Pro',
    title: "PestShield Pro — India's #1 Pest Control Service",
    description: "Book certified pest control in 60 seconds. Organic, child-safe treatments with a 30-day re-service guarantee.",
    images: [
      {
        url: '/images/hero-technician.jpg',
        width: 1200,
        height: 630,
        alt: 'PestShield Pro - Professional Pest Control',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "PestShield Pro — India's #1 Pest Control Service",
    description: "Book certified pest control in 60 seconds. Organic, child-safe treatments with a 30-day re-service guarantee.",
    images: ['/images/hero-technician.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#15803d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmSans.variable} ${inter.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PestShield Pro',
              url: 'https://pestshieldpro.in',
              logo: 'https://pestshieldpro.in/logo.png',
              sameAs: [
                'https://facebook.com/pestshieldpro',
                'https://instagram.com/pestshieldpro',
                'https://linkedin.com/company/pestshieldpro',
                'https://twitter.com/pestshieldpro',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-98765-43210',
                contactType: 'customer service',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi'],
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
