'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { SectionWrapper, SectionHeading } from '@/components/layout'
import { testimonials } from '@/lib/data/testimonials'
import { fadeUp, viewportSettings } from '@/lib/animations'

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const current = testimonials[selectedIndex] || testimonials[0]

  return (
    <SectionWrapper background="cream">
      <SectionHeading
        eyebrow="Customer Stories"
        title="Real People. Real Results."
        align="center"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={fadeUp}
        className="relative"
      >
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <div className="relative bg-card rounded-3xl border border-cream-300 shadow-card p-8 mx-3 h-full">
                  {/* Giant decorative quote mark */}
                  <span className="absolute top-4 right-6 font-display font-black text-[80px] text-forest-900/6 leading-none select-none">&ldquo;</span>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-accent-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-neutral-600 leading-relaxed text-[15px] mb-6 relative z-10">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Reviewer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-cream-200">
                    <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {testimonial.avatarInitials}
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{testimonial.name}</p>
                      <p className="text-xs text-neutral-600">{testimonial.city} · {testimonial.service}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-cream-300 flex items-center justify-center text-neutral-600 hover:text-brand-600 hover:border-brand-600 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-cream-300 flex items-center justify-center text-neutral-600 hover:text-brand-600 hover:border-brand-600 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all ${index === selectedIndex ? 'w-6 bg-brand-600' : 'w-2 bg-cream-300'}`}
                aria-label={`Go to ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
