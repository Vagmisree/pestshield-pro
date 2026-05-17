'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionWrapper, SectionHeading } from '@/components/layout'
import { blogPosts } from '@/lib/data/blog-posts'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'

export function BlogPreview() {
  const previewPosts = blogPosts.slice(0, 3)

  return (
    <SectionWrapper background="cream">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
        <SectionHeading
          eyebrow="Pest Control Insights"
          title="Tips & Guides for a Safer Home"
          align="left"
          className="mb-0"
        />
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-brand-600 font-medium hover:underline shrink-0"
        >
          View All Articles →
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={stagger}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {previewPosts.map((post) => (
          <motion.article
            key={post.id}
            variants={fadeUp}
            className="group bg-card rounded-2xl overflow-hidden border border-cream-300 shadow-card hover:shadow-hover transition-all duration-300"
          >
            {/* Image */}
            <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Category badge over image */}
              <span className="absolute top-4 left-4 glass-card text-white text-xs font-semibold px-3 py-1 rounded-full">
                {post.category}
              </span>
            </Link>

            {/* Content */}
            <div className="p-5">
              {/* Title with animated underline */}
              <Link href={`/blog/${post.slug}`} className="block mb-2">
                <h3 className="font-display font-bold text-lg text-ink leading-tight line-clamp-2 relative group-hover:after:w-full after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-600 after:transition-all after:duration-300">
                  {post.title}
                </h3>
              </Link>

              <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{post.excerpt}</p>

              <div className="flex items-center justify-between text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  {post.author && (
                    <>
                      <div className="w-5 h-5 rounded-full bg-brand-100 overflow-hidden">
                        {post.author.avatar && (
                          <Image src={post.author.avatar} alt={post.author.name} width={20} height={20} className="object-cover" />
                        )}
                      </div>
                      <span>{post.author.name}</span>
                    </>
                  )}
                </div>
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
