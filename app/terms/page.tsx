"use client";

import { motion } from "framer-motion";
import { Navbar, Footer, WhatsAppFloat, MobileBookBar, SectionWrapper } from "@/components/layout";
import { fadeInUp } from "@/lib/animations";

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using PestShield Pro services, you agree to be bound by these Terms of 
                  Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services Description</h2>
                <p className="text-muted-foreground">
                  PestShield Pro provides professional pest control services including but not limited to 
                  termite control, cockroach management, rodent control, mosquito treatment, bed bug 
                  elimination, and general pest management for residential and commercial properties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Booking and Scheduling</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>All bookings are subject to availability and confirmation</li>
                  <li>You must provide accurate contact and property information</li>
                  <li>Rescheduling must be done at least 24 hours before the appointment</li>
                  <li>Cancellations within 24 hours may incur a cancellation fee</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Service Warranty</h2>
                <p className="text-muted-foreground mb-4">
                  We offer service warranties as follows:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>One-time treatments: 30-day warranty</li>
                  <li>Annual contracts: Coverage throughout the contract period</li>
                  <li>Warranty is void if property conditions change significantly</li>
                  <li>Re-treatment provided free of charge during warranty period if pests return</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Payment Terms</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Payment is due upon completion of service unless otherwise agreed</li>
                  <li>We accept cash, credit/debit cards, and digital payment methods</li>
                  <li>Annual contracts require advance payment or EMI as per agreement</li>
                  <li>Prices are subject to change with prior notice</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Customer Responsibilities</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide safe access to the property for our technicians</li>
                  <li>Inform us of any pets, allergies, or special requirements</li>
                  <li>Follow post-treatment instructions provided by our team</li>
                  <li>Report any issues within the warranty period promptly</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  PestShield Pro shall not be liable for any indirect, incidental, special, or consequential 
                  damages arising from the use of our services. Our total liability shall not exceed the 
                  amount paid for the specific service in question.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Safety and Compliance</h2>
                <p className="text-muted-foreground">
                  All our treatments comply with local and national safety regulations. We use 
                  government-approved chemicals and follow industry best practices. Material Safety 
                  Data Sheets (MSDS) are available upon request.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modifications</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be effective 
                  immediately upon posting on our website. Continued use of our services constitutes 
                  acceptance of modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: legal@pestshieldpro.com<br />
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
