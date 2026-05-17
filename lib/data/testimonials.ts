import { Testimonial } from '@/types'

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    city: 'Hyderabad',
    service: 'Cockroach Control',
    rating: 5,
    text: '"Absolutely fantastic service! The technician was punctual, professional, and explained every step of the process. No more cockroaches in our kitchen. Highly recommend PestShield Pro!"',
    avatarInitials: 'PS',
    avatarImage: '/images/avatars/priya-sharma.jpg',
    date: '2026-04-15',
  },
  {
    id: '2',
    name: 'Ramesh Gupta',
    city: 'Bengaluru',
    service: 'Termite Control',
    rating: 5,
    text: '"We had a severe termite problem that was damaging our wooden furniture. The team did a thorough job with the soil treatment. One year warranty gives us peace of mind. Excellent work!"',
    avatarInitials: 'RG',
    avatarImage: '/images/avatars/ramesh.jpg',
    date: '2026-04-02',
  },
  {
    id: '3',
    name: 'Anjali Mehta',
    city: 'Mumbai',
    service: 'Bed Bug Control',
    rating: 5,
    text: '"After trying multiple services, PestShield Pro finally solved our bed bug nightmare. The heat treatment was effective and the 60-day warranty proved they stand behind their work. Thank you!"',
    avatarInitials: 'AM',
    avatarImage: '/images/avatars/anjali.jpg',
    date: '2026-03-28',
  },
  {
    id: '4',
    name: 'Suresh Reddy',
    city: 'Chennai',
    service: 'General Pest Control',
    rating: 4,
    text: '"Very happy with the AMC plan. The quarterly visits keep our home completely pest-free. The WhatsApp updates are convenient, and the OTP verification system is a nice touch for security."',
    avatarInitials: 'SR',
    date: '2026-03-20',
  },
  {
    id: '5',
    name: 'Kavitha N.',
    city: 'Pune',
    service: 'Mosquito Control',
    rating: 5,
    text: '"During monsoon, mosquitoes were unbearable. The fogging treatment was quick and effective. Used organic chemicals which was important for us since we have a baby at home. Great service!"',
    avatarInitials: 'KN',
    date: '2026-03-15',
  },
  {
    id: '6',
    name: 'Vikram Joshi',
    city: 'Delhi',
    service: 'Rodent Control',
    rating: 5,
    text: '"Had rats in our warehouse causing damage to stock. PestShield Pro not only eliminated them but also helped identify and seal entry points. Professional team and excellent follow-up service."',
    avatarInitials: 'VJ',
    date: '2026-03-08',
  },
]

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find(testimonial => testimonial.id === id)
}
