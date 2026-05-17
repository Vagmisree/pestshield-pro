// Service Types
export interface Service {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  method: string
  duration: string
  startingPrice: number
  icon: string
  image: string
  tag: 'Residential' | 'Commercial' | 'Both'
  chemicalType: 'Organic' | 'Chemical' | 'Both'
  warranty: string
  includedInAMC: boolean
}

// Plan Types
export interface Plan {
  id: string
  name: string
  description: string
  price: number
  visits: number
  validity: string
  features: string[]
  badge?: string
  popular: boolean
}

// City/Branch Types
export interface City {
  id: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  mapUrl: string
  workingHours: string
  lat: number
  lng: number
}

// Testimonial Types
export interface Testimonial {
  id: string
  name: string
  city: string
  service: string
  rating: number
  text: string
  avatarInitials: string
  avatarImage?: string
  date: string
}

// Blog Post Types
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image: string
  author?: {
    name: string
    avatar: string
  }
}

// Product Types
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  badge?: 'New' | 'Best Seller' | 'Organic'
  inStock: boolean
  category: 'Sprays' | 'Baits' | 'Traps' | 'Kits'
  pestType: string[]
  chemicalType: 'Organic' | 'Chemical'
  description?: string
}

// Stats Types
export interface Stats {
  homesServed: number
  rating: number
  satisfaction: number
  cities: number
  technicians: number
  yearsExp: number
}

// Cart Item Types
export interface CartItem {
  product: Product
  quantity: number
}

// Form Types
export interface ContactFormData {
  fullName: string
  phone: string
  city: string
  service?: string
  message?: string
}

// Navigation Types
export interface NavLink {
  label: string
  href: string
}

// Team Member Types
export interface TeamMember {
  id: string
  name: string
  role: string
  initials: string
  linkedIn?: string
}

// Certification Types
export interface Certification {
  id: string
  name: string
  description: string
  icon: string
}
