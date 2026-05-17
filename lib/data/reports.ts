export interface InspectionReport {
  id: string;
  bookingNumber: string;
  date: string;
  technician: string;
  pestFound: string;
  severity: 'Low' | 'Medium' | 'High';
  infestationArea: string;
  recommendedTreatment: string;
  chemicalsToBeUsed: string[];
  safetyNotes: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
}

export const mockReports: InspectionReport[] = [
  {
    id: '1',
    bookingNumber: 'PSP-2026-84729',
    date: '2026-05-27',
    technician: 'Rajesh Kumar',
    pestFound: 'Cockroaches',
    severity: 'High',
    infestationArea: 'Kitchen, Living Room',
    recommendedTreatment: 'Gel Bait + Spray treatment',
    chemicalsToBeUsed: ['Imidacloprid Gel', 'Cypermethrin Spray'],
    safetyNotes: 'Keep children and pets away for 2 hours after treatment.',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=500',
  },
  {
    id: '2',
    bookingNumber: 'PSP-2026-84728',
    date: '2026-05-20',
    technician: 'Priya Nair',
    pestFound: 'Termites',
    severity: 'Medium',
    infestationArea: 'Wood structures, Foundation',
    recommendedTreatment: 'Termiticide barrier + Wood treatment',
    chemicalsToBeUsed: ['Imidacloprid Termiticide', 'Wood preservative'],
    safetyNotes: 'Avoid contact with treated areas for 24 hours.',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1589921292688-c0a4b1b1ddaa?w=500',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=500',
  },
  {
    id: '3',
    bookingNumber: 'PSP-2026-84727',
    date: '2026-05-10',
    technician: 'Amit Singh',
    pestFound: 'Mosquitoes',
    severity: 'Low',
    infestationArea: 'Indoor spaces',
    recommendedTreatment: 'Fogging + Breeding site elimination',
    chemicalsToBeUsed: ['Pyrethrin spray', 'Larvicide'],
    safetyNotes: 'Ensure proper ventilation during and after fogging.',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1589921292688-c0a4b1b1ddaa?w=500',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=500',
  },
  {
    id: '4',
    bookingNumber: 'PSP-2026-84726',
    date: '2026-05-08',
    technician: 'Vikram Patel',
    pestFound: 'Bed Bugs',
    severity: 'High',
    infestationArea: 'Bedroom furniture, Mattress',
    recommendedTreatment: 'Heat treatment + Chemical spray',
    chemicalsToBeUsed: ['Pyrethroids', 'Neem oil treatment'],
    safetyNotes: 'Replace bedding after treatment. Wash all items in hot water.',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1589921292688-c0a4b1b1ddaa?w=500',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=500',
  },
];
