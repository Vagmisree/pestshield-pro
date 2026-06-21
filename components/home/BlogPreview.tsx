'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    slug: 'monsoon-pests-hyderabad',
    category: 'Seasonal Tips',
    readTime: '5 min',
    date: 'June 2025',
    title: 'Monsoon Pest Invasion: How to Protect Your Hyderabad Home This Season',
    excerpt: "Cockroaches, mosquitoes, and rodents surge during monsoon. Here's your complete prevention checklist before the rains hit.",
    gradient: 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 opacity-50">
        <path d="M24 4v8M12 8l4 6M36 8l-4 6M8 20h4M36 20h4M10 32h4M34 32h4" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 28 Q20 36 24 28 Q28 20 32 28" stroke="#6ee7b7" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="38" r="3" fill="#6ee7b7" opacity="0.6"/>
      </svg>
    ),
  },
  {
    slug: 'termite-early-detection',
    category: 'Expert Advice',
    readTime: '7 min',
    date: 'May 2025',
    title: '7 Early Warning Signs of Termite Damage (Most Homeowners Miss #4)',
    excerpt: 'Termites cause ₹35,000 crore in damage annually in India. Learn to spot the subtle signs before they destroy your furniture.',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 opacity-50">
        <circle cx="22" cy="22" r="12" stroke="#93c5fd" strokeWidth="2"/>
        <path d="M31 31l8 8" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M18 22h8M22 18v8" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    slug: 'organic-pest-control-guide',
    category: 'Organic Living',
    readTime: '4 min',
    date: 'May 2025',
    title: "Organic Pest Control: Why It's Safer, Smarter, and Just as Effective",
    excerpt: 'The truth about organic vs chemical pest control — and why PestShield Pro uses organic chemicals as the default for all residential treatments.',
    gradient: 'linear-gradient(135deg, #14532d 0%, #78350f 100%)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 opacity-50">
        <path d="M24 40 C24 40, 8 28, 8 18 C8 10, 15 6, 24 14 C33 6, 40 10, 40 18 C40 28, 24 40, 24 40Z"
          stroke="#86efac" strokeWidth="2" fill="rgba(134,239,172,0.15)"/>
        <path d="M24 40 L24 18" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3 3"/>
      </svg>
    ),
  },
] as const

const CATEGORY_COLORS: Record<string, string> = {
  'Seasonal Tips': 'rgba(110,231,183,0.8)',
  'Expert Advice': 'rgba(147,197,253,0.8)',
  'Organic Living': 'rgba(134,239,172,0.8)',
}

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as number[] } },
})

function BlogCard({ post, index }: { post: typeof BLOG_POSTS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.article
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp(index * 0.1)}
      className="group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300"
      style={{
        background: 'rgba(11,61,46,0.20)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.20)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
    >
      {/* Thumbnail */}
      <div
        className="relative h-48 flex items-center justify-center"
        style={{ background: post.gradient }}
      >
        {/* Category + read time overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.4)',
              color: CATEGORY_COLORS[post.category] || '#fff',
              border: `1px solid ${CATEGORY_COLORS[post.category] || 'rgba(255,255,255,0.2)'}40`,
              backdropFilter: 'blur(4px)',
            }}
          >
            {post.category}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-mono"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <Clock className="h-3 w-3" />
            {post.readTime} read
          </span>
        </div>
        {/* SVG icon centred */}
        <div className="opacity-60 group-hover:opacity-80 transition-opacity">
          {post.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs font-mono mb-3" style={{ color: 'rgba(255,255,255,0.30)' }}>
          {post.date}
        </p>
        <h3
          className="font-heading font-semibold text-white text-base leading-snug mb-3 flex-1 line-clamp-2 group-hover:text-[#00FF64] transition-colors"
        >
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed mb-5 line-clamp-2" style={{ color: 'rgba(255,255,255,0.48)' }}>
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group/link"
          style={{ color: 'rgba(0,255,100,0.7)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00FF64')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,255,100,0.7)')}
        >
          Read Article
          <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.article>
  )
}

export function BlogPreview() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-28" style={{ background: '#030508' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp(0)}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-6 bg-[#00FF64]/60" />
              <span className="text-[#00FF64]/70 text-xs font-mono tracking-[0.2em] uppercase">
                PEST INTELLIGENCE
              </span>
              <div className="h-px w-6 bg-[#00FF64]/60" />
            </div>
          </motion.div>
          <motion.h2
            variants={fadeUp(0.1)}
            className="font-heading font-extrabold text-white tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Expert Tips & Seasonal Guides
          </motion.h2>
          <motion.p variants={fadeUp(0.2)} className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Stay ahead of pests with advice from India&apos;s leading pest control experts.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BLOG_POSTS.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all group"
            style={{
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.12)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,100,0.4)'; e.currentTarget.style.color = '#00FF64' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >
            View All Articles
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
