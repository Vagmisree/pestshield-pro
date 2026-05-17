import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout';
import { services, getServiceBySlug } from '@/lib/data/services';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Clock, Shield, Wrench, CheckCircle, Leaf, Baby, Star } from 'lucide-react';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};
  return {
    title: `${service.name} — PestShield Pro`,
    description: service.description,
  };
}

const serviceContent: Record<string, {
  tagline: string;
  signs: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}> = {
  'cockroach-control': {
    tagline: 'Eliminate cockroaches permanently with our advanced gel bait system',
    signs: ['Droppings in kitchen cabinets', 'Musty odor in enclosed spaces', 'Egg cases behind appliances', 'Sightings at night', 'Smear marks on walls', 'Shed skins near food areas'],
    steps: [{ title: 'Free Inspection', desc: 'Technician identifies infestation hotspots' }, { title: 'Gel Bait Application', desc: 'Applied in cracks, crevices, and hiding spots' }, { title: 'Spray Treatment', desc: 'Residual spray on surfaces and entry points' }, { title: 'OTP Closure', desc: 'You verify job completion with a 6-digit OTP' }],
    faqs: [{ q: 'How long does the treatment take?', a: '45–60 minutes for a standard 2BHK apartment.' }, { q: 'Is it safe for children and pets?', a: 'Yes, we use WHO-approved organic gel baits that are completely safe.' }, { q: 'When will I see results?', a: 'Most customers see 80% reduction within 48 hours, complete elimination in 7–10 days.' }, { q: 'What if cockroaches return?', a: 'Our 30-day re-service guarantee covers you — we come back free of charge.' }],
  },
  'termite-control': {
    tagline: 'Protect your property from termite damage with our barrier treatment',
    signs: ['Hollow-sounding wood', 'Mud tubes on walls', 'Discarded wings near windows', 'Bubbling or uneven paint', 'Tight-fitting doors/windows', 'Frass (termite droppings)'],
    steps: [{ title: 'Property Survey', desc: 'Complete inspection of structure and soil' }, { title: 'Soil Treatment', desc: 'Termiticide barrier around foundation' }, { title: 'Bait Stations', desc: 'Strategic placement to eliminate colonies' }, { title: 'Annual Monitoring', desc: 'Follow-up visits included in AMC plans' }],
    faqs: [{ q: 'How long does termite treatment last?', a: 'Our soil treatment provides protection for up to 5 years. Bait systems are monitored annually.' }, { q: 'Do I need to vacate?', a: 'No evacuation needed. Treatment is done externally around the foundation.' }, { q: 'What warranty do you offer?', a: '1-year warranty with free re-treatment if termites return.' }, { q: 'Can termites damage concrete?', a: 'Termites cannot damage concrete but can enter through cracks. We seal all entry points.' }],
  },
  'rodent-control': {
    tagline: 'Eliminate rats and mice with our humane and effective rodent management',
    signs: ['Gnaw marks on food packaging', 'Droppings along walls', 'Scratching sounds at night', 'Nesting materials in corners', 'Grease marks along baseboards', 'Damaged wiring'],
    steps: [{ title: 'Inspection', desc: 'Identify entry points and activity areas' }, { title: 'Trap Placement', desc: 'Glue and mechanical traps in activity zones' }, { title: 'Bait Stations', desc: 'Rodenticide placed in tamper-proof stations' }, { title: 'Entry Sealing', desc: 'Recommendations to seal all entry points' }],
    faqs: [{ q: 'Are the rodenticides safe?', a: 'Bait stations are tamper-proof and placed in areas inaccessible to children and pets.' }, { q: 'How many visits are needed?', a: 'Typically 2–3 visits over 2 weeks for complete elimination.' }, { q: 'What about dead rodents?', a: 'Our technician removes all traps and dead rodents during follow-up visits.' }, { q: 'Can rodents return?', a: 'We provide entry-point sealing recommendations to prevent re-entry.' }],
  },
  'mosquito-control': {
    tagline: 'Protect your family from mosquito-borne diseases with our fogging treatment',
    signs: ['Mosquito bites indoors', 'Buzzing sounds at dusk', 'Standing water nearby', 'Larvae in water containers', 'Increased activity after rain', 'Bites during daytime (dengue risk)'],
    steps: [{ title: 'Breeding Site Survey', desc: 'Identify all standing water sources' }, { title: 'Larvicide Treatment', desc: 'Eliminate larvae in water bodies' }, { title: 'Thermal Fogging', desc: 'Kill adult mosquitoes in and around property' }, { title: 'Prevention Tips', desc: 'Guidance on eliminating breeding sites' }],
    faqs: [{ q: 'How long does fogging last?', a: 'Fogging provides immediate relief for 2–4 weeks. Monthly treatments recommended during monsoon.' }, { q: 'Is fogging safe indoors?', a: 'We use organic pyrethrin-based fog that dissipates within 30 minutes. Safe to re-enter after 1 hour.' }, { q: 'Does it work for dengue mosquitoes?', a: 'Yes, our treatment targets Aedes aegypti (dengue) and Anopheles (malaria) mosquitoes.' }, { q: 'What about fish tanks?', a: 'Cover fish tanks during fogging. The fog is safe once it settles.' }],
  },
  'bed-bug-control': {
    tagline: 'Eliminate bed bugs completely with our heat treatment and spray combination',
    signs: ['Red itchy bites in lines', 'Blood stains on sheets', 'Dark spots on mattress seams', 'Musty sweet odor', 'Shed skins near bed', 'Live bugs in mattress folds'],
    steps: [{ title: 'Inspection', desc: 'Thorough check of mattress, furniture, and cracks' }, { title: 'Heat Treatment', desc: 'Targeted heat to kill bugs and eggs' }, { title: 'Residual Spray', desc: 'Long-lasting spray on all surfaces' }, { title: 'Follow-up', desc: 'Second visit after 14 days to ensure elimination' }],
    faqs: [{ q: 'Do I need to throw away my mattress?', a: 'No! Our treatment eliminates bed bugs from mattresses. Replacement is rarely needed.' }, { q: 'How long does treatment take?', a: '2–3 hours for a standard bedroom. Larger infestations may require 2 visits.' }, { q: 'When can I sleep on the bed again?', a: 'After 4 hours once the spray has dried completely.' }, { q: 'What is the 60-day warranty?', a: 'If bed bugs return within 60 days, we re-treat at no charge.' }],
  },
  'general-pest-control': {
    tagline: 'Complete protection against all common household pests in one treatment',
    signs: ['Multiple pest types visible', 'Droppings of various sizes', 'Damage to food packaging', 'Nesting materials found', 'Unusual odors', 'Bites or stings indoors'],
    steps: [{ title: 'Full Property Inspection', desc: 'Identify all pest types and entry points' }, { title: 'Multi-Chemical Treatment', desc: 'Targeted treatment for each pest type' }, { title: 'Preventive Spray', desc: 'Residual barrier on all surfaces' }, { title: 'Report & Recommendations', desc: 'Digital report with prevention tips' }],
    faqs: [{ q: 'What pests are covered?', a: 'Cockroaches, ants, spiders, silverfish, centipedes, and other common household pests.' }, { q: 'How often should I get general pest control?', a: 'Quarterly treatments are recommended for year-round protection.' }, { q: 'Is it safe for my kitchen?', a: 'Yes, we use food-safe chemicals in kitchen areas. Cover food items before treatment.' }, { q: 'Can I combine with other services?', a: 'Yes, we offer bundled pricing when combined with termite or rodent control.' }],
  },
};

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const content = serviceContent[params.slug] || {
    tagline: service.description,
    signs: ['Visible pest activity', 'Droppings or damage', 'Unusual odors', 'Nesting materials'],
    steps: [{ title: 'Inspection', desc: 'Thorough property assessment' }, { title: 'Treatment', desc: 'Targeted pest elimination' }, { title: 'Follow-up', desc: 'Ensure complete elimination' }],
    faqs: [{ q: 'Is it safe?', a: 'Yes, we use WHO-approved chemicals.' }, { q: 'What warranty?', a: `${service.warranty} re-service guarantee.` }],
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-forest-950 overflow-hidden pt-28 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800" />
          <div className="absolute inset-0 texture-organic opacity-40" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-emerald-400">{service.name}</span>
            </nav>
            <div className="max-w-2xl">
              <div className="pill-emerald-dark mb-5 w-fit"><Leaf className="h-3.5 w-3.5 mr-1.5" />{service.chemicalType} Treatment</div>
              <h1 className="font-display font-black text-white mb-4" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.05 }}>
                {service.name}
              </h1>
              <p className="text-white/85 text-lg mb-8 leading-relaxed">{content.tagline}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="text-white text-sm font-semibold">{service.duration}</span>
                </div>
                <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-white text-sm font-semibold">{service.warranty} warranty</span>
                </div>
                <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-emerald-400" />
                  <span className="text-white text-sm font-semibold">{service.method}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <span className="text-white/70 text-sm">Starting from </span>
                  <span className="font-display font-black text-4xl text-white">₹{service.startingPrice.toLocaleString()}</span>
                </div>
                <Link href={`/book?service=${service.slug}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-lg group">
                  Book Free Inspection <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 50L720 20L1440 50V50H0Z" fill="#F7F5F0"/>
            </svg>
          </div>
        </section>

        {/* Signs of Infestation */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-8 text-center">Signs of {service.name.split(' ')[0]} Infestation</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.signs.map((sign, i) => (
                <div key={i} className="flex items-start gap-3 bg-card rounded-2xl p-4 border border-cream-300 shadow-card">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-sm font-black">{i + 1}</span>
                  </div>
                  <p className="text-neutral-700 text-sm font-medium">{sign}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Treatment Process */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-10 text-center">Our Treatment Process</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.steps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-forest-900 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display font-black text-white text-xl">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-display font-bold text-ink mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="py-16 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-8 text-center">Why PestShield is Safe</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Leaf, title: 'Organic Chemicals', desc: 'WHO-approved, eco-friendly formulations' },
                { icon: Baby, title: 'Child & Pet Safe', desc: 'Safe to re-enter within 2 hours of treatment' },
                { icon: CheckCircle, title: 'ISP Certified', desc: 'All technicians are certified professionals' },
              ].map((item) => (
                <div key={item.title} className="bg-card rounded-2xl p-5 border border-cream-300 shadow-card text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-display font-bold text-ink mb-1">{item.title}</h3>
                  <p className="text-neutral-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl text-ink mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faqs.map((faq, i) => (
                <div key={i} className="bg-cream-100 rounded-2xl p-5 border border-cream-300">
                  <p className="font-display font-bold text-ink mb-2">{faq.q}</p>
                  <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-forest-900 texture-organic py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-accent-500 text-accent-500" />)}
              <span className="text-white font-bold ml-2">4.8/5 from 2,000+ reviews</span>
            </div>
            <h2 className="font-display font-black text-3xl text-white mb-4">Ready to Get Rid of {service.name.split(' ')[0]}s?</h2>
            <p className="text-white/85 mb-8">Book a free inspection today. No obligation, no hidden charges.</p>
            <Link href={`/book?service=${service.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-lg text-base">
              Book Free Inspection Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  );
}
