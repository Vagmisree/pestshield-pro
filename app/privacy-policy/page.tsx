"use client";

import { motion } from "framer-motion";
import { Navbar, Footer, WhatsAppFloat, MobileBookBar, SectionWrapper } from "@/components/layout";
import { fadeInUp } from "@/lib/animations";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background">
        <SectionWrapper className="py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Name, email address, phone number, and postal address</li>
                  <li>Service booking details and preferences</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Communication history with our support team</li>
                  <li>Feedback and survey responses</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Process and fulfill your service requests</li>
                  <li>Send you service confirmations, updates, and reminders</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Improve our services and develop new features</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information with:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Service technicians assigned to your booking</li>
                  <li>Payment processors for transaction processing</li>
                  <li>Analytics providers to help us improve our services</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. However, 
                  no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to collect information about your 
                  browsing activities. You can control cookies through your browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: privacy@pestshieldpro.com<br />
                  Phone: 1800-XXX-XXXX<br />
                  Address: PestShield Pro Headquarters, Mumbai, India
                </p>
              </section>
            </div>
          </motion.div>
        </SectionWrapper>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  );
}
