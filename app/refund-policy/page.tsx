"use client";

import { motion } from "framer-motion";
import { Navbar, Footer, WhatsAppFloat, MobileBookBar, SectionWrapper } from "@/components/layout";
import { fadeInUp } from "@/lib/animations";

export default function RefundPolicyPage() {
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
            <h1 className="text-4xl font-bold text-foreground mb-8">Refund Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
                <p className="text-muted-foreground">
                  At PestShield Pro, customer satisfaction is our top priority. We stand behind the 
                  quality of our services and offer a comprehensive refund policy to ensure your peace of mind.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Service Guarantee</h2>
                <p className="text-muted-foreground mb-4">
                  If pests return within the warranty period:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>We will provide free re-treatment at no additional cost</li>
                  <li>If the problem persists after two re-treatments, you may be eligible for a refund</li>
                  <li>Warranty periods vary by service type (see Terms of Service)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Eligibility</h2>
                <p className="text-muted-foreground mb-4">
                  You may be eligible for a full or partial refund under the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Service not rendered:</strong> Full refund if we fail to provide the scheduled service</li>
                  <li><strong>Cancellation before service:</strong> Full refund if cancelled 48+ hours before appointment</li>
                  <li><strong>Cancellation 24-48 hours before:</strong> 75% refund</li>
                  <li><strong>Cancellation within 24 hours:</strong> 50% refund</li>
                  <li><strong>Unsatisfactory service:</strong> Case-by-case evaluation with re-treatment option first</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Annual Contracts</h2>
                <p className="text-muted-foreground mb-4">
                  For annual maintenance contracts:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Cancellation within 7 days of signing: Full refund</li>
                  <li>Cancellation after 7 days: Pro-rated refund minus services already rendered</li>
                  <li>Early termination fee may apply (10% of remaining contract value)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Non-Refundable Situations</h2>
                <p className="text-muted-foreground mb-4">
                  Refunds will not be provided in the following cases:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Customer fails to follow post-treatment instructions</li>
                  <li>Property conditions change significantly after treatment</li>
                  <li>New pest infestation from external sources</li>
                  <li>No-show without prior cancellation notice</li>
                  <li>Pest issues resulting from structural problems not disclosed before service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
                <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                  <li>Contact our customer support within 7 days of the issue</li>
                  <li>Provide your booking ID and describe the problem</li>
                  <li>Our team will investigate and respond within 48 hours</li>
                  <li>If eligible, refunds will be processed within 7-10 business days</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Methods</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Refunds will be issued to the original payment method</li>
                  <li>Credit/Debit card refunds: 5-7 business days</li>
                  <li>Bank transfer refunds: 7-10 business days</li>
                  <li>UPI/Digital wallet refunds: 2-3 business days</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  For refund requests or questions about this policy:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: refunds@pestshieldpro.com<br />
                  Phone: 1800-XXX-XXXX<br />
                  Hours: Monday - Saturday, 9 AM - 7 PM
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
