export interface RevenueData {
  monthly: Array<{ month: string; revenue: number }>;
  daily: Array<{ date: string; bookings: number }>;
  byService: Array<{ service: string; revenue: number }>;
  byCity: Array<{ city: string; revenue: number; bookings: number }>;
  kpis: {
    todayBookings: number;
    todayRevenue: number;
    activeTechnicians: number;
    csatScore: number;
  };
}

export const mockRevenueData: RevenueData = {
  monthly: [
    { month: 'January', revenue: 185000 },
    { month: 'February', revenue: 210000 },
    { month: 'March', revenue: 195000 },
    { month: 'April', revenue: 220000 },
    { month: 'May', revenue: 245000 },
    { month: 'June', revenue: 235000 },
    { month: 'July', revenue: 260000 },
    { month: 'August', revenue: 250000 },
    { month: 'September', revenue: 230000 },
    { month: 'October', revenue: 265000 },
    { month: 'November', revenue: 280000 },
    { month: 'December', revenue: 310000 },
  ],
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    bookings: Math.floor(Math.random() * 50) + 30,
  })),
  byService: [
    { service: 'Cockroach Control', revenue: 125000 },
    { service: 'Termite Control', revenue: 110000 },
    { service: 'Mosquito Control', revenue: 95000 },
    { service: 'Rodent Control', revenue: 105000 },
    { service: 'Bed Bug Control', revenue: 85000 },
    { service: 'General Pest Control', revenue: 75000 },
  ],
  byCity: [
    { city: 'Hyderabad', revenue: 145000, bookings: 324 },
    { city: 'Bangalore', revenue: 125000, bookings: 289 },
    { city: 'Delhi', revenue: 115000, bookings: 267 },
    { city: 'Mumbai', revenue: 130000, bookings: 301 },
    { city: 'Pune', revenue: 95000, bookings: 218 },
    { city: 'Chennai', revenue: 80000, bookings: 185 },
    { city: 'Kolkata', revenue: 70000, bookings: 162 },
    { city: 'Gurgaon', revenue: 110000, bookings: 254 },
  ],
  kpis: {
    todayBookings: 47,
    todayRevenue: 38400,
    activeTechnicians: 14,
    csatScore: 4.8,
  },
};
