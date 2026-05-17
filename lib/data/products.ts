import { Product } from '@/types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Organic Cockroach Gel Bait',
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 324,
    image: '/images/products/cockroach-gel-bait.jpg',
    badge: 'Best Seller',
    inStock: true,
    category: 'Baits',
    pestType: ['Cockroach'],
    chemicalType: 'Organic',
    description: 'Professional-grade organic gel bait for cockroach control. Safe for use in kitchens.',
  },
  {
    id: '2',
    name: 'Multi-Surface Pest Spray',
    price: 199,
    rating: 4.6,
    reviewCount: 186,
    image: '/images/products/pest-spray.jpg',
    inStock: true,
    category: 'Sprays',
    pestType: ['Cockroach', 'Ant', 'Spider'],
    chemicalType: 'Chemical',
    description: 'Fast-acting spray for immediate pest elimination on all surfaces.',
  },
  {
    id: '3',
    name: 'Eco-Friendly Mosquito Repellent',
    price: 149,
    rating: 4.5,
    reviewCount: 256,
    image: '/images/products/mosquito-repellent.jpg',
    badge: 'Organic',
    inStock: true,
    category: 'Sprays',
    pestType: ['Mosquito'],
    chemicalType: 'Organic',
    description: 'Plant-based mosquito repellent safe for children and pets.',
  },
  {
    id: '4',
    name: 'Professional Rodent Trap Set',
    price: 449,
    rating: 4.7,
    reviewCount: 98,
    image: '/images/products/rodent-trap.jpg',
    inStock: true,
    category: 'Traps',
    pestType: ['Rodent'],
    chemicalType: 'Chemical',
    description: 'Set of 4 reusable snap traps for effective rodent control.',
  },
  {
    id: '5',
    name: 'Termite Prevention Kit',
    price: 899,
    originalPrice: 1099,
    rating: 4.9,
    reviewCount: 67,
    image: '/images/products/termite-kit.jpg',
    badge: 'New',
    inStock: true,
    category: 'Kits',
    pestType: ['Termite'],
    chemicalType: 'Chemical',
    description: 'Complete DIY termite prevention kit with bait stations and treatment gel.',
  },
  {
    id: '6',
    name: 'Bed Bug Detector Traps',
    price: 349,
    rating: 4.4,
    reviewCount: 142,
    image: '/images/products/bedbug-trap.jpg',
    inStock: true,
    category: 'Traps',
    pestType: ['Bed Bug'],
    chemicalType: 'Chemical',
    description: 'Early detection traps to monitor bed bug activity in your home.',
  },
  {
    id: '7',
    name: 'Organic Ant Bait Stations',
    price: 249,
    rating: 4.6,
    reviewCount: 189,
    image: '/images/products/ant-bait.jpg',
    badge: 'Organic',
    inStock: true,
    category: 'Baits',
    pestType: ['Ant'],
    chemicalType: 'Organic',
    description: 'Child and pet safe ant bait stations for indoor use.',
  },
  {
    id: '8',
    name: 'Complete Home Pest Control Kit',
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviewCount: 54,
    image: '/images/products/home-pest-kit.jpg',
    badge: 'Best Seller',
    inStock: true,
    category: 'Kits',
    pestType: ['Cockroach', 'Ant', 'Mosquito', 'Spider'],
    chemicalType: 'Organic',
    description: 'All-in-one kit for complete home pest control with organic products.',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getProductsByCategory(category: Product['category'] | 'All'): Product[] {
  if (category === 'All') return products
  return products.filter(product => product.category === category)
}

export function getProductsByPestType(pestType: string): Product[] {
  return products.filter(product => product.pestType.includes(pestType))
}
