import { notFound } from 'next/navigation'
import { Navbar, Footer, WhatsAppFloat, MobileBookBar } from '@/components/layout'
import { getBlogPostBySlug, blogPosts } from '@/lib/data/blog-posts'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, User, ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} | PestShield Pro Blog`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  }
}

// Extended content for each post
const postContent: Record<string, string[]> = {
  '5-signs-termite-infestation': [
    'Termites are often called "silent destroyers" because they can cause extensive damage to your home before you even notice them. By the time visible damage appears, the infestation may have been going on for months or even years.',
    '**1. Mud Tubes on Walls** — Subterranean termites build pencil-sized mud tubes along walls, foundations, and beams to travel between their colony and food source. These tubes protect them from predators and maintain humidity. If you spot these brownish tubes, it\'s a strong sign of termite activity.',
    '**2. Hollow-Sounding Wood** — Tap on wooden surfaces in your home. If they sound hollow, termites may have eaten through the wood from the inside. This is especially common in door frames, window sills, and wooden flooring.',
    '**3. Discarded Wings** — Termite swarmers (reproductive termites) shed their wings after finding a new location to start a colony. Finding small, equal-sized wings near windows, doors, or light sources is a clear warning sign.',
    '**4. Frass (Termite Droppings)** — Drywood termites push their droppings out of small holes in the wood. These tiny, pellet-shaped droppings (frass) often look like sawdust or coffee grounds and accumulate near infested wood.',
    '**5. Tight-Fitting Doors and Windows** — As termites eat through wood and produce moisture, it can cause wood to warp. If your doors or windows suddenly become difficult to open or close, termites could be the culprit.',
    'If you notice any of these signs, it\'s crucial to act immediately. Termite damage is not covered by most home insurance policies, and the longer you wait, the more expensive the repairs become. Contact PestShield Pro for a free inspection today.',
  ],
  'organic-pest-control-safe': [
    'The term "organic" in pest control refers to treatments derived from natural sources — plants, minerals, and microorganisms — rather than synthetic chemicals. But does "natural" automatically mean "safe"? The answer is nuanced.',
    'Organic pest control products use active ingredients like neem oil, pyrethrin (from chrysanthemum flowers), diatomaceous earth, and essential oils. These break down faster in the environment and have lower toxicity to mammals compared to synthetic pesticides.',
    'However, "organic" doesn\'t mean completely harmless. Even natural substances can cause irritation if misused. The key is proper application by trained professionals who know the correct concentrations and application methods.',
    'At PestShield Pro, our organic treatments are WHO-approved and tested for safety with children, pets, and pregnant women. We use concentrations that are effective against pests but safe for your family when applied correctly.',
    'The main advantages of organic pest control: faster environmental breakdown (days vs. months for synthetic chemicals), lower risk of chemical resistance in pests, safer for beneficial insects like bees, and no need to vacate your home during treatment.',
    'Our recommendation: for routine pest prevention and mild infestations, organic treatments are excellent. For severe infestations like termites or bed bugs, a combination approach may be more effective. Our technicians will always recommend the safest effective option for your situation.',
  ],
}

const defaultContent = [
  'Pest control is an essential part of maintaining a healthy home environment. Understanding the best practices and latest techniques can help you make informed decisions about protecting your family.',
  'At PestShield Pro, we combine modern technology with proven pest management techniques to deliver effective, safe, and reliable pest control services across India.',
  'Our certified technicians undergo rigorous training and use only WHO-approved chemicals to ensure the safety of your family, pets, and the environment.',
  'Whether you\'re dealing with a current infestation or looking to prevent future pest problems, our team is here to help with customized solutions for your specific needs.',
  'Regular pest control treatments, combined with good hygiene practices and home maintenance, are the most effective way to keep your home pest-free year-round.',
  'Contact us today for a free inspection and let our experts assess your pest control needs. We offer a 30-day re-service guarantee on all our treatments.',
]

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const content = postContent[slug] || defaultContent
  const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-forest-950 overflow-hidden pt-28 pb-0">
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950 to-forest-900" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-0">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-emerald-400 truncate max-w-[200px]">{post!.title}</span>
            </nav>
            <span className="inline-block px-3 py-1 bg-emerald-400/20 text-emerald-300 text-xs font-bold rounded-full mb-4">
              {post!.category}
            </span>
            <h1 className="font-display font-black text-white mb-6 leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              {post!.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-8">
              {post!.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />{post!.author.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />{formatDate(post!.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />{post!.readTime}
              </span>
            </div>
          </div>
          {/* Featured image */}
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="relative h-64 md:h-96 rounded-t-2xl overflow-hidden">
              <Image src={post!.image} alt={post!.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
            </div>
          </div>
        </section>

        {/* Article content */}
        <section className="bg-cream-100 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main content */}
              <article className="lg:col-span-2">
                <div className="bg-card rounded-2xl border border-cream-300 shadow-card p-8">
                  <p className="text-lg text-neutral-600 leading-relaxed mb-6 font-medium">{post!.excerpt}</p>
                  <div className="h-px bg-cream-300 mb-6" />
                  <div className="prose prose-neutral max-w-none">
                    {content.map((para, i) => (
                      <p key={i} className="text-neutral-700 leading-relaxed mb-5 text-base">
                        {para.startsWith('**') ? (
                          <span>
                            <strong className="text-ink font-bold">{para.split('**')[1]}</strong>
                            {para.split('**').slice(2).join('')}
                          </span>
                        ) : para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <Link href="/blog"
                    className="inline-flex items-center gap-2 text-neutral-600 hover:text-ink font-medium transition-colors">
                    <ArrowLeft className="h-4 w-4" />All Articles
                  </Link>
                  <Link href="/book"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-colors text-sm">
                    Book Service <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="space-y-5">
                {/* CTA card */}
                <div className="bg-forest-900 rounded-2xl p-5 text-white">
                  <h3 className="font-display font-bold text-lg mb-2">Need pest control?</h3>
                  <p className="text-white/70 text-sm mb-4">Book a certified technician in 60 seconds. 30-day guarantee.</p>
                  <Link href="/book"
                    className="block w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-center transition-colors text-sm">
                    Book Now →
                  </Link>
                  <Link href="/free-inspection"
                    className="block w-full py-3 mt-2 border border-white/20 text-white/80 hover:bg-white/10 font-semibold rounded-xl text-center transition-colors text-sm">
                    Free Inspection
                  </Link>
                </div>

                {/* Related posts */}
                <div className="bg-card rounded-2xl border border-cream-300 shadow-card p-5">
                  <h3 className="font-display font-bold text-ink mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link key={related.id} href={`/blog/${related.slug}`}
                        className="flex gap-3 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={related.image} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                            {related.title}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">{related.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBookBar />
    </>
  )
}
