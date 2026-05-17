export interface Complaint {
  id: string;
  customer: string;
  bookingNumber: string;
  service: string;
  complaint: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  replies: Array<{
    id: string;
    author: string;
    message: string;
    date: string;
  }>;
}

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    customer: 'Priya Sharma',
    bookingNumber: 'PSP-2026-84729',
    service: 'Cockroach Control',
    complaint: 'Technician was late by 30 minutes',
    date: '2026-05-27',
    priority: 'Medium',
    status: 'Resolved',
    replies: [
      {
        id: '1',
        author: 'Support Team',
        message: 'We sincerely apologize for the delay. A 10% discount has been applied to your account.',
        date: '2026-05-27',
      },
    ],
  },
  {
    id: '2',
    customer: 'Rajesh Patel',
    bookingNumber: 'PSP-2026-84728',
    service: 'Termite Control',
    complaint: 'Some chemicals were spilled on furniture',
    date: '2026-05-20',
    priority: 'High',
    status: 'In Progress',
    replies: [
      {
        id: '1',
        author: 'Support Team',
        message: 'We are investigating this matter. Our manager will contact you soon.',
        date: '2026-05-21',
      },
    ],
  },
  {
    id: '3',
    customer: 'Amit Kumar',
    bookingNumber: 'PSP-2026-84727',
    service: 'Mosquito Control',
    complaint: 'Pest still visible after treatment',
    date: '2026-05-12',
    priority: 'High',
    status: 'Resolved',
    replies: [
      {
        id: '1',
        author: 'Support Team',
        message: 'We are scheduling a re-service visit at no additional cost.',
        date: '2026-05-12',
      },
      {
        id: '2',
        author: 'Support Team',
        message: 'Re-service completed successfully on 2026-05-18.',
        date: '2026-05-18',
      },
    ],
  },
  {
    id: '4',
    customer: 'Seema Verma',
    bookingNumber: 'PSP-2026-84726',
    service: 'Bed Bug Control',
    complaint: 'Invoice was overcharged',
    date: '2026-05-09',
    priority: 'Medium',
    status: 'Resolved',
    replies: [
      {
        id: '1',
        author: 'Support Team',
        message: 'We found the billing error and have issued a refund of ₹500.',
        date: '2026-05-10',
      },
    ],
  },
  {
    id: '5',
    customer: 'Vikas Singh',
    bookingNumber: 'PSP-2026-84725',
    service: 'Rodent Control',
    complaint: 'Need clarification on warranty coverage',
    date: '2026-05-06',
    priority: 'Low',
    status: 'Open',
    replies: [],
  },
  {
    id: '6',
    customer: 'Priya Sharma',
    bookingNumber: 'PSP-2026-84724',
    service: 'General Pest Control',
    complaint: 'Booking was cancelled without proper notice',
    date: '2026-04-16',
    priority: 'Medium',
    status: 'Resolved',
    replies: [
      {
        id: '1',
        author: 'Support Team',
        message: 'Full refund has been processed. We apologize for the inconvenience.',
        date: '2026-04-17',
      },
    ],
  },
];
