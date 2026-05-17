export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  bookingNumber: string;
  service: string;
  baseAmount: number;
  gst: number;
  total: number;
  status: 'Paid' | 'Due';
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-001',
    date: '2026-05-20',
    bookingNumber: 'PSP-2026-84728',
    service: 'Termite Control',
    baseAmount: 3000,
    gst: 540,
    total: 3540,
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-002',
    date: '2026-05-10',
    bookingNumber: 'PSP-2026-84727',
    service: 'Mosquito Control',
    baseAmount: 1800,
    gst: 324,
    total: 2124,
    status: 'Paid',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-003',
    date: '2026-05-08',
    bookingNumber: 'PSP-2026-84726',
    service: 'Bed Bug Control',
    baseAmount: 2200,
    gst: 396,
    total: 2596,
    status: 'Paid',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2026-004',
    date: '2026-05-05',
    bookingNumber: 'PSP-2026-84725',
    service: 'Rodent Control',
    baseAmount: 3500,
    gst: 630,
    total: 4130,
    status: 'Paid',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2026-005',
    date: '2026-04-15',
    bookingNumber: 'PSP-2026-84724',
    service: 'General Pest Control',
    baseAmount: 2000,
    gst: 360,
    total: 2360,
    status: 'Paid',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2026-006',
    date: '2026-05-16',
    bookingNumber: 'PSP-2026-84729',
    service: 'Cockroach Control',
    baseAmount: 2500,
    gst: 450,
    total: 2950,
    status: 'Due',
  },
];
