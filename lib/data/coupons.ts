export interface Coupon {
  code: string;
  discount: number;
  type: 'percent' | 'flat';
  usedCount: number;
  maxUses: number;
  expiry: string;
  status: 'active' | 'expired' | 'inactive';
}

export const mockCoupons: Coupon[] = [
  {
    code: 'PEST10',
    discount: 50,
    type: 'flat',
    usedCount: 245,
    maxUses: 500,
    expiry: '2026-12-31',
    status: 'active',
  },
  {
    code: 'SAVE15',
    discount: 15,
    type: 'percent',
    usedCount: 123,
    maxUses: 300,
    expiry: '2026-11-30',
    status: 'active',
  },
  {
    code: 'SUMMER20',
    discount: 20,
    type: 'percent',
    usedCount: 89,
    maxUses: 200,
    expiry: '2026-08-31',
    status: 'active',
  },
  {
    code: 'WELCOME100',
    discount: 100,
    type: 'flat',
    usedCount: 450,
    maxUses: 500,
    expiry: '2026-06-30',
    status: 'active',
  },
  {
    code: 'LOYALTY10',
    discount: 10,
    type: 'percent',
    usedCount: 78,
    maxUses: 150,
    expiry: '2026-09-30',
    status: 'active',
  },
  {
    code: 'OLDCODE50',
    discount: 50,
    type: 'flat',
    usedCount: 200,
    maxUses: 200,
    expiry: '2026-04-30',
    status: 'expired',
  },
];
