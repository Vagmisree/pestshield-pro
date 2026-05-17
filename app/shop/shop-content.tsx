'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag, Leaf, Zap } from 'lucide-react'
import { SectionWrapper } from '@/components/layout'
import { products, getProductsByCategory } from '@/lib/data/products'
import { useCartStore } from '@/stores/use-cart-store'
import { fadeUp, stagger, viewportSettings } from '@/lib/animations'
import { formatPrice, cn } from '@/lib/utils'
import { Product } from '@/types'

const categories = ['All', 'Sprays', 'Baits', 'Traps', 'Kits'] as const

export function ShopContent() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All')
  const { items, isOpen, addItem, removeItem, updateQuantity, closeCart, openCart, getTotal, getItemCount } = useCartStore()
  const filteredProducts = getProductsByCategory(activeCategory as Product['category'] | 'All')

  return (
    <>
      {/* Hero */}
      <section className="relative bg-forest-950 overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800" />
        </div>
        <div className="absolute inset-0 texture-organic opacity-50" />
        <motion.div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 9, repeat: Infinity }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">DIY Shop</span>
            </nav>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-accent-500/20 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-accent-400" />
              </div>
              <span className="text-accent-400 text-sm font-bold uppercase tracking-widest">Professional Grade Products</span>
            </div>

            <h1 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.05 }}>
              DIY Pest Control
              <br /><span className="gradient-text">Products</span>
            </h1>
            <p className="text-white/85 text-lg max-w-2xl mb-8 leading-relaxed">
              Professional-grade products for tackling pest problems yourself. Safe, effective, and easy to use at home.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Leaf, label: 'Organic Options Available' },
                { icon: Zap, label: 'Fast Delivery' },
                { icon: ShoppingCart, label: 'Free Shipping ₹499+' },
              ].map((b) => (
                <div key={b.label} className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full">
                  <b.icon className="h-4 w-4 text-emerald-400" />
                  <span className="text-white text-sm font-semibold">{b.label}</span>
                </div>
              ))}
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeUp}
            className="lg:w-56 shrink-0">
            <div className="bg-card rounded-2xl p-5 shadow-card border border-cream-300 sticky top-24">
              <h3 className="font-display font-bold text-ink mb-4">Categories</h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={cn('w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      activeCategory === cat ? 'bg-forest-900 text-white' : 'text-neutral-600 hover:bg-cream-200')}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Products */}
          <div className="flex-1">
            {/* Cart bar */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="flex items-center justify-between bg-forest-900 rounded-2xl px-5 py-3.5 mb-6 shadow-card">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-emerald-400" />
                <span className="text-white font-semibold text-sm">
                  {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} in cart
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-white">{formatPrice(getTotal())}</span>
                <button onClick={openCart}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full text-sm transition-colors">
                  View Cart
                </button>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={stagger}
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUp}
                  className="group bg-card rounded-2xl overflow-hidden border border-cream-300 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={product.image} alt={product.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/30 to-transparent" />
                    {product.badge && (
                      <span className={cn('absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full',
                        product.badge === 'Best Seller' ? 'bg-accent-500 text-white' :
                        product.badge === 'New' ? 'bg-blue-500 text-white' :
                        'bg-emerald-500 text-white')}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-ink mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-4 w-4 fill-accent-500 text-accent-500" />
                        <span className="text-sm font-bold text-ink">{product.rating}</span>
                      </div>
                      <span className="text-sm text-neutral-500">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-display font-black text-brand-600">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <button onClick={() => { addItem(product); openCart(); }}
                      className="w-full py-2.5 flex items-center justify-center gap-2 bg-forest-900 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all group/btn">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCart} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 shadow-2xl flex flex-col border-l border-cream-300">
              <div className="flex items-center justify-between p-5 border-b border-cream-200 bg-forest-900">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-emerald-400" />
                  <h2 className="font-display font-bold text-white text-lg">Your Cart</h2>
                </div>
                <button onClick={closeCart} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-14 w-14 text-cream-300 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium">Your cart is empty</p>
                    <button onClick={closeCart} className="mt-4 text-brand-600 font-semibold hover:underline text-sm">
                      Continue Shopping →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 p-4 bg-cream-100 rounded-2xl border border-cream-200">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-ink text-sm line-clamp-2 mb-1">{item.product.name}</h4>
                          <p className="text-brand-600 font-bold">{formatPrice(item.product.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center font-bold text-ink">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => removeItem(item.product.id)}
                              className="w-7 h-7 rounded-lg hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors ml-auto">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {items.length > 0 && (
                <div className="p-5 border-t border-cream-200 space-y-4 bg-cream-50">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 font-medium">Subtotal</span>
                    <span className="text-2xl font-display font-black text-ink">{formatPrice(getTotal())}</span>
                  </div>
                  <button className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-colors shadow-md text-base">
                    Proceed to Checkout →
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
