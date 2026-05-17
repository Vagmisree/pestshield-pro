import { BlogPost } from '@/types'

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: '5-signs-termite-infestation',
    title: '5 Signs You Have a Termite Infestation at Home',
    excerpt: 'Termites can silently destroy your home structure. Learn to identify the warning signs before it\'s too late and save thousands in repair costs.',
    category: 'Termite Control',
    readTime: '5 min read',
    date: '2026-05-10',
    image: '/images/blog/termite-damage.jpg',
    author: {
      name: 'Dr. Ravi Kumar',
      avatar: '/images/avatars/dr-ravi.jpg',
    },
  },
  {
    id: '2',
    slug: 'organic-pest-control-safe',
    title: 'Are Organic Pest Control Chemicals Actually Safe?',
    excerpt: 'Understanding the science behind organic pest control and why it\'s the safer choice for families with children, elderly, and pets.',
    category: 'Safety',
    readTime: '7 min read',
    date: '2026-05-05',
    image: '/images/blog/organic-safe.jpg',
    author: {
      name: 'Dr. Priya Nair',
      avatar: '/images/avatars/dr-priya.jpg',
    },
  },
  {
    id: '3',
    slug: 'cockroach-gel-bait-vs-spray',
    title: 'Cockroach Control: Gel Bait vs Spray — Which Works Better?',
    excerpt: 'A detailed comparison of the two most popular cockroach treatment methods. Learn which one is right for your specific situation.',
    category: 'Cockroach Control',
    readTime: '6 min read',
    date: '2026-04-28',
    image: '/images/blog/cockroach-treatment.jpg',
    author: {
      name: 'Amit Shah',
      avatar: '/images/avatars/amit.jpg',
    },
  },
  {
    id: '4',
    slug: 'monsoon-pest-prevention-guide',
    title: 'Monsoon Season Pest Prevention Guide for Indian Homes',
    excerpt: 'Monsoon brings relief from heat but also an army of pests. Here\'s your comprehensive guide to keeping them out during the rainy season.',
    category: 'Prevention Tips',
    readTime: '8 min read',
    date: '2026-04-20',
    image: '/images/blog/monsoon-pests.jpg',
    author: {
      name: 'Dr. Ravi Kumar',
      avatar: '/images/avatars/dr-ravi.jpg',
    },
  },
  {
    id: '5',
    slug: 'amc-saves-money',
    title: 'Why Annual Maintenance Plans Save You Money Long-Term',
    excerpt: 'A cost breakdown showing how investing in an AMC can save you up to 40% compared to one-time bookings while keeping your home pest-free year-round.',
    category: 'AMC Plans',
    readTime: '4 min read',
    date: '2026-04-12',
    image: '/images/blog/amc-savings.jpg',
    author: {
      name: 'Sneha Patel',
      avatar: '/images/avatars/sneha.jpg',
    },
  },
  {
    id: '6',
    slug: 'otp-verified-job-closure',
    title: 'How OTP-Verified Job Closure Protects Homeowners',
    excerpt: 'Learn how our innovative OTP verification system ensures service quality and protects you from incomplete or unsatisfactory work.',
    category: 'Technology',
    readTime: '3 min read',
    date: '2026-04-05',
    image: '/images/blog/otp-verification.jpg',
    author: {
      name: 'Amit Shah',
      avatar: '/images/avatars/amit.jpg',
    },
  },
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === 'All') return blogPosts
  return blogPosts.filter(post => post.category === category)
}
