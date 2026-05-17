export interface Booking {
  id: string;
  bookingNumber: string;
  service: string;
  plan: 'one-time' | 'quarterly' | 'annual';
  date: string;
  timeSlot: string;
  status: 'Scheduled' | 'Assigned' | 'En Route' | 'In Progress' | 'Completed' | 'Cancelled';
  technician: {
    name: string;
    phone: string;
    rating: number;
    avatar: string | null;
  };
  address: string;
  city: string;
  amount: number;
  gst: number;
  total: number;
  createdAt: string;
  completedAt?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  treatmentNotes?: string;
  invoiceUrl: string;
}

export const mockBookings: Booking[] = [
  {
    id: '1',
    bookingNumber: 'PSP-2026-84729',
    service: 'Cockroach Control',
    plan: 'quarterly',
    date: '2026-05-27',
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'Scheduled',
    technician: {
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      rating: 4.8,
      avatar: null,
    },
    address: '123 Main Street, Banjara Hills',
    city: 'Hyderabad',
    amount: 2500,
    gst: 450,
    total: 2950,
    createdAt: '2026-05-16',
    invoiceUrl: '#',
  },
  {
    id: '2',
    bookingNumber: 'PSP-2026-84728',
    service: 'Termite Control',
    plan: 'one-time',
    date: '2026-05-20',
    timeSlot: '2:00 PM - 4:00 PM',
    status: 'Completed',
    technician: {
      name: 'Priya Nair',
      phone: '+91 9876543211',
      rating: 4.9,
      avatar: null,
    },
    address: '123 Main Street, Banjara Hills',
    city: 'Hyderabad',
    amount: 3000,
    gst: 540,
    total: 3540,
    createdAt: '2026-05-10',
    completedAt: '2026-05-20',
    beforePhoto: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    afterPhoto: 'https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=500',
    treatmentNotes: 'Applied gel bait and spray. Infestation reduced significantly.',
    invoiceUrl: '#',
  },
  {
    id: '3',
    bookingNumber: 'PSP-2026-84727',
    service: 'Mosquito Control',
    plan: 'quarterly',
    date: '2026-05-10',
    timeSlot: '8:00 AM - 10:00 AM',
    status: 'Completed',
    technician: {
      name: 'Amit Singh',
      phone: '+91 9876543212',
      rating: 4.7,
      avatar: null,
    },
    address: '123 Main Street, Banjara Hills',
    city: 'Hyderabad',
    amount: 1800,
    gst: 324,
    total: 2124,
    createdAt: '2026-04-10',
    completedAt: '2026-05-10',
    beforePhoto: 'https://images.unsplash.com/photo-1589921292688-c0a4b1b1ddaa?w=500',
    afterPhoto: 'https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=500',
    treatmentNotes: 'Fogging done. All mosquito breeding spots treated.',
    invoiceUrl: '#',
  },
  {
    id: '4',
    bookingNumber: 'PSP-2026-84726',
    service: 'Bed Bug Control',
    plan: 'one-time',
    date: '2026-05-08',
    timeSlot: '4:00 PM - 6:00 PM',
    status: 'Completed',
    technician: {
      name: 'Vikram Patel',
      phone: '+91 9876543213',
      rating: 4.6,
      avatar: null,
    },
    address: '123 Main Street, Banjara Hills',
    city: 'Hyderabad',
    amount: 2200,
    gst: 396,
    total: 2596,
    createdAt: '2026-04-20',
    completedAt: '2026-05-08',
    invoiceUrl: '#',
  },
  {
    id: '5',
    bookingNumber: 'PSP-2026-84725',
    service: 'Rodent Control',
    plan: 'annual',
    date: '2026-05-05',
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'Completed',
    technician: {
      name: 'Deepak Sharma',
      phone: '+91 9876543214',
      rating: 4.8,
      avatar: null,
    },
    address: '123 Main Street, Banjara Hills',
    city: 'Hyderabad',
    amount: 3500,
    gst: 630,
    total: 4130,
    createdAt: '2026-03-15',
    completedAt: '2026-05-05',
    invoiceUrl: '#',
  },
  {
    id: '6',
    bookingNumber: 'PSP-2026-84724',
    service: 'General Pest Control',
    plan: 'one-time',
    date: '2026-04-15',
    timeSlot: '2:00 PM - 4:00 PM',
    status: 'Cancelled',
    technician: {
      name: 'N/A',
      phone: 'N/A',
      rating: 0,
      avatar: null,
    },
    address: '123 Main Street, Banjara Hills',
    city: 'Hyderabad',
    amount: 2000,
    gst: 360,
    total: 2360,
    createdAt: '2026-04-10',
    invoiceUrl: '#',
  },
];
