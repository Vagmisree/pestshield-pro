export interface ContractRenewal {
  id: string;
  customerName: string;
  serviceType: string;
  contractEndDate: string;
  daysRemaining: number;
}

export const mockRenewals: ContractRenewal[] = [
  {
    id: '1',
    customerName: 'Rajesh Sharma',
    serviceType: 'General Pest Control AMC',
    contractEndDate: '2026-06-02',
    daysRemaining: 17,
  },
  {
    id: '2',
    customerName: 'Priya Menon',
    serviceType: 'Termite Control AMC',
    contractEndDate: '2026-05-22',
    daysRemaining: 6,
  },
  {
    id: '3',
    customerName: 'Amit Patel',
    serviceType: 'Cockroach Control AMC',
    contractEndDate: '2026-05-19',
    daysRemaining: 3,
  },
  {
    id: '4',
    customerName: 'Sneha Reddy',
    serviceType: 'General Pest Control AMC',
    contractEndDate: '2026-06-10',
    daysRemaining: 25,
  },
  {
    id: '5',
    customerName: 'Vikram Singh',
    serviceType: 'Rodent Control AMC',
    contractEndDate: '2026-05-20',
    daysRemaining: 4,
  },
  {
    id: '6',
    customerName: 'Deepa Nair',
    serviceType: 'Mosquito Control AMC',
    contractEndDate: '2026-06-14',
    daysRemaining: 29,
  },
];
