'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ArrowRight, BookOpen, Clock, User } from 'lucide-react'
import { SectionWrapper } from '@/components/layout'
import { blogPosts } from '@/lib/data/blog-posts'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { formatDate, cn } from '@/lib/utils'

const categories = ['All', 'Cockroach', 'Termite', 'Rodent', 'Mosquito', 'Seasonal', 'How-To']

export function BlogContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' ||
                            post.category.toLowerCase().includes(activeCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-forest-950 overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800" />
        </div>
        <div className="absolute inset-0 texture-organic opacity-50" />
        <motion.div className="absolute top-1/4 left-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 9, repeat: Infinity }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">Blog</span>
            </nav>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-emerald-300 text-sm font-bold uppercase tracking-widest">Pest Control Insights</span>
            </div>

            <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
              Expert Tips &amp;
              <br /><span className="gradient-text">Guides</span>
            </h1>
            <p className="text-white/85 text-lg max-w-2xl mb-8 leading-relaxed">
              Expert advice, seasonal guides, and how-to articles to help you maintain a pest-free home all year round.
            </p>

            {/* Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <input type="text" placeholder="Search articles..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-13 pl-12 pr-4 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 50L720 20L1440 50V50H0Z" fill="#F7F5F0"/>
          </svg>
        </div>
      </section>

      <SectionWrapper background="cream">
        {/* Category filters */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
          className="flex justify-center mb-10">
          <div className="relative flex flex-wrap items-center gap-1 bg-cream-200 p-1 rounded-full">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn('relative px-4 py-2 text-sm font-semibold rounded-full transition-colors z-10',
                  activeCategory === cat ? 'text-white' : 'text-neutral-600 hover:text-ink')}>
                {activeCategory === cat && (
                  <motion.span layoutId="blog-tab"
                    className="absolute inset-0 bg-forest-900 rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                )}
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-500 text-lg">No articles found.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featuredPost && (
              <motion.article initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
                className="mb-12">
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <div className="grid md:grid-cols-2 gap-0 bg-card rounded-3xl overflow-hidden border border-cream-300 shadow-card hover:shadow-hover transition-all duration-300">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <Image src={featuredPost.image} alt={featuredPost.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent" />
                      <span className="absolute top-4 left-4 glass-card text-white text-xs font-bold px-3 py-1 rounded-full">
                        {featuredPost.category}
                      </span>
                      <span className="absolute bottom-4 left-4 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <h2 className="font-display font-bold text-2xl md:text-3xl text-ink group-hover:text-brand-600 transition-colors mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-neutral-600 mb-6 line-clamp-3 leading-relaxed">{featuredPost.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {featuredPost.author && (
                            <>
                              <div className="w-9 h-9 rounded-full bg-forest-900 flex items-center justify-center">
                                <span className="text-white text-xs font-black">{featuredPost.author.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-ink">{featuredPost.author.name}</p>
                                <p className="text-xs text-neutral-500">{formatDate(featuredPost.date)}</p>
                              </div>
                            </>
                          )}
                        </div>
                        <span className="flex items-center gap-1.5 text-sm text-neutral-500">
                          <Clock className="h-3.5 w-3.5" />{featuredPost.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Grid */}
            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <motion.article key={post.id} variants={fadeUp}
                  className="group bg-card rounded-2xl overflow-hidden border border-cream-300 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <Image src={post.image} alt={post.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent" />
                      <span className="absolute top-3 left-3 glass-card text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-lg text-ink group-hover:text-brand-600 transition-colors line-clamp-2 mb-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-cream-200">
                        <span className="flex items-center gap-1.5"><User className="h-3 w-3" />{post.author?.name}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </>
        )}
      </SectionWrapper>
    </>
  )
}
