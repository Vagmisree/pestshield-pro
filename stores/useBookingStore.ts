import { create } from 'zustand';
import { api } from '@/lib/api';

export interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  city: string;
}

export interface PropertyType {
  type: 'residential' | 'commercial';
  size?: string;
  areaType?: string;
}

export interface PricingResult {
  baseAmount: number;
  discountAmount: number;
  gstAmount: number;
  totalAmount: number;
}

interface BookingStore {
  step: number;
  formData: BookingFormData;
  selectedService: string | null;
  selectedServiceId: string | null;
  selectedPlan: 'one-time' | 'quarterly' | 'annual' | null;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  propertyType: PropertyType | null;
  bookingId: string | null;
  bookingRef: string | null;
  couponCode: string | null;
  couponDiscount: number;
  pricing: PricingResult | null;
  pincodeAvailable: boolean | null;
  isSubmitting: boolean;
  submitError: string | null;

  setStep: (step: number) => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  setSelectedService: (name: string, id?: string) => void;
  setSelectedPlan: (plan: 'one-time' | 'quarterly' | 'annual') => void;
  setSelectedDate: (date: Date) => void;
  setSelectedTimeSlot: (slot: string) => void;
  setPropertyType: (type: PropertyType) => void;
  setBookingId: (id: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  setPincodeAvailable: (v: boolean | null) => void;
  setPricing: (p: PricingResult | null) => void;
  resetBooking: () => void;
  submitAndPay: (onSuccess: () => void) => Promise<void>;
}

const initialFormData: BookingFormData = {
  fullName: '', phone: '', email: '', address: '', pincode: '', city: '',
};

const PLAN_MAP: Record<string, string> = {
  'one-time': 'SINGLE',
  'quarterly': 'CONTRACT_RESIDENTIAL',
  'annual': 'AMC_COMMERCIAL',
};

const SLOT_MAP: Record<string, string> = {
  'Morning': 'MORNING',
  'Afternoon': 'AFTERNOON',
  'Evening': 'EVENING',
  'Morning (8AM-12PM)': 'MORNING',
  'Afternoon (12PM-4PM)': 'AFTERNOON',
  'Evening (4PM-8PM)': 'EVENING',
};

function nanoid(n = 10) {
  return Math.random().toString(36).substring(2, 2 + n);
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  step: 1,
  formData: initialFormData,
  selectedService: null,
  selectedServiceId: null,
  selectedPlan: null,
  selectedDate: null,
  selectedTimeSlot: null,
  propertyType: null,
  bookingId: null,
  bookingRef: null,
  couponCode: null,
  couponDiscount: 0,
  pricing: null,
  pincodeAvailable: null,
  isSubmitting: false,
  submitError: null,

  setStep: (step) => set({ step }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setSelectedService: (name, id) => set({ selectedService: name, selectedServiceId: id || null }),
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setPropertyType: (type) => set({ propertyType: type }),
  setBookingId: (id) => set({ bookingId: id }),
  applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
  setPincodeAvailable: (v) => set({ pincodeAvailable: v }),
  setPricing: (p) => set({ pricing: p }),

  submitAndPay: async (onSuccess) => {
    const state = get();
    set({ isSubmitting: true, submitError: null });

    try {
      if (!state.selectedServiceId) throw new Error('Please select a service');
      if (!state.selectedDate) throw new Error('Please select a date');
      if (!state.selectedTimeSlot) throw new Error('Please select a time slot');
      if (!state.selectedPlan) throw new Error('Please select a plan');

      const slotDate = state.selectedDate.toISOString().split('T')[0];
      const slotTime = SLOT_MAP[state.selectedTimeSlot] || 'MORNING';
      const planType = PLAN_MAP[state.selectedPlan] || 'SINGLE';

      // 1. Create booking
      const { data: bookingRes } = await api.post('/bookings', {
        serviceId: state.selectedServiceId,
        propertyType: state.propertyType?.areaType?.toUpperCase() || 'APARTMENT',
        propertySize: state.propertyType?.size,
        address: state.formData.address,
        pincode: state.formData.pincode,
        city: state.formData.city,
        slotDate,
        slotTime,
        planType,
        couponCode: state.couponCode || undefined,
      });

      const { bookingId, bookingRef } = bookingRes.data;
      set({ bookingId, bookingRef });

      // 2. Initiate mock payment order
      const { data: orderRes } = await api.post('/payments/create-order', { bookingId });
      const { orderId } = orderRes.data;

      // 3. Mock payment — simulate 1.5s delay then verify
      await new Promise((r) => setTimeout(r, 1500));
      const mockPaymentId = `pay_mock_${nanoid(14)}`;

      // 4. Verify payment
      await api.post('/payments/verify', {
        bookingId,
        razorpayOrderId: orderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: 'mock_sig',
      });

      set({ isSubmitting: false });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err instanceof Error ? err.message : 'Booking failed');
      set({ isSubmitting: false, submitError: msg });
      throw new Error(msg);
    }
  },

  resetBooking: () => set({
    step: 1, formData: initialFormData, selectedService: null, selectedServiceId: null,
    selectedPlan: null, selectedDate: null, selectedTimeSlot: null,
    propertyType: null, bookingId: null, bookingRef: null,
    couponCode: null, couponDiscount: 0, pricing: null, pincodeAvailable: null,
    isSubmitting: false, submitError: null,
  }),
}));
