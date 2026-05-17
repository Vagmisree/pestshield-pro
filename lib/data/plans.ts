import { Plan } from '@/types'

export const plans: Plan[] = [
  {
    id: '1',
    name: 'One-Time Treatment',
    description: 'Perfect for immediate pest problems that need quick resolution.',
    price: 499,
    visits: 1,
    validity: 'Single visit',
    features: [
      'Single comprehensive treatment',
      'All common pests covered',
      'Free inspection included',
      '30-day warranty',
      'OTP-verified job closure',
      'WhatsApp support',
    ],
    popular: false,
  },
  {
    id: '2',
    name: 'Quarterly AMC',
    description: 'Regular protection with treatments every quarter to keep pests away.',
    price: 2499,
    visits: 4,
    validity: '1 year (4 visits)',
    features: [
      '4 scheduled visits per year',
      'All pest types covered',
      'Priority booking slots',
      'Free emergency visits',
      '24/7 WhatsApp support',
      'Dedicated technician assigned',
      'Detailed inspection reports',
      'Save ₹500 vs one-time',
    ],
    badge: 'Most Popular',
    popular: true,
  },
  {
    id: '3',
    name: 'Annual AMC',
    description: 'Maximum protection with monthly monitoring and unlimited visits.',
    price: 3999,
    visits: 12,
    validity: '1 year (12 visits)',
    features: [
      'Monthly scheduled visits',
      'All pest types covered',
      'Priority booking slots',
      'Unlimited emergency visits',
      '24/7 dedicated support line',
      'Senior technician assigned',
      'Monthly inspection reports',
      'Preventive treatments included',
      'Save ₹1,200 vs one-time',
      'Free product samples',
    ],
    popular: false,
  },
]

export function getPlanById(id: string): Plan | undefined {
  return plans.find(plan => plan.id === id)
}
