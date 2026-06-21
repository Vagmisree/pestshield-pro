'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';

export interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  city: string;
  landmark?: string;
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

// ─── Cart Draft ──────────────────────────────────────────────────────────────

export interface BookingDraft {
  cartId: string;
  formData: BookingFormData;
  coords: { lat: number; lng: number } | null;
  selectedService: string | null;
  selectedServiceId: string | null;
  selectedPlan: 'one-time' | 'quarterly' | 'annual' | null;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  propertyType: PropertyType | null;
  couponCode: string | null;
  couponDiscount: number;
  pricing: PricingResult | null;
}

// ─── Confirmed Order (after payment) ─────────────────────────────────────────

export interface ConfirmedOrder {
  bookingRef: string;
  bookingId: string;
  service: string;
}

interface BookingStore {
  step: number;
  formData: BookingFormData;
  coords: { lat: number; lng: number } | null;
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

  // Cart
  cart: BookingDraft[];
  currentDraftId: string | null;
  confirmedOrders: ConfirmedOrder[];

  setStep: (step: number) => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  setCoords: (coords: { lat: number; lng: number } | null) => void;
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

  // Cart actions
  saveCurrentToCart: () => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  loadDraftFromCart: (cartId: string) => void;
  getTotalCartAmount: () => number;
}

const initialFormData: BookingFormData = {
  fullName: '', phone: '', email: '', address: '', pincode: '', city: '', landmark: '',
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

function nanoid(n = 8) {
  return Math.random().toString(36).substring(2, 2 + n);
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  step: 1,
  formData: initialFormData,
  coords: null,
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
  cart: [],
  currentDraftId: null,
  confirmedOrders: [],

  setStep: (step) => set({ step }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setCoords: (coords) => set({ coords }),
  setSelectedService: (name, id) => set({ selectedService: name, selectedServiceId: id || null }),
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setPropertyType: (type) => set({ propertyType: type }),
  setBookingId: (id) => set({ bookingId: id }),
  applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
  setPincodeAvailable: (v) => set({ pincodeAvailable: v }),
  setPricing: (p) => set({ pricing: p }),

  // ─── Cart Actions ──────────────────────────────────────────────────────────

  saveCurrentToCart: () => {
    const state = get();
    const draft: BookingDraft = {
      cartId: nanoid(8),
      formData: state.formData,
      coords: state.coords,
      selectedService: state.selectedService,
      selectedServiceId: state.selectedServiceId,
      selectedPlan: state.selectedPlan,
      selectedDate: state.selectedDate,
      selectedTimeSlot: state.selectedTimeSlot,
      propertyType: state.propertyType,
      couponCode: state.couponCode,
      couponDiscount: state.couponDiscount,
      pricing: state.pricing,
    };
    set((s) => ({
      cart: [...s.cart, draft],
      // Reset current draft for next booking
      step: 1,
      formData: initialFormData,
      coords: null,
      selectedService: null,
      selectedServiceId: null,
      selectedPlan: null,
      selectedDate: null,
      selectedTimeSlot: null,
      propertyType: null,
      couponCode: null,
      couponDiscount: 0,
      pricing: null,
    }));
  },

  removeFromCart: (cartId) =>
    set((s) => ({ cart: s.cart.filter((d) => d.cartId !== cartId) })),

  clearCart: () => set({ cart: [] }),

  loadDraftFromCart: (cartId) => {
    const state = get();
    const draft = state.cart.find((d) => d.cartId === cartId);
    if (!draft) return;
    set({
      currentDraftId: cartId,
      formData: draft.formData,
      coords: draft.coords,
      selectedService: draft.selectedService,
      selectedServiceId: draft.selectedServiceId,
      selectedPlan: draft.selectedPlan,
      selectedDate: draft.selectedDate,
      selectedTimeSlot: draft.selectedTimeSlot,
      propertyType: draft.propertyType,
      couponCode: draft.couponCode,
      couponDiscount: draft.couponDiscount,
      pricing: draft.pricing,
      cart: state.cart.filter((d) => d.cartId !== cartId),
    });
  },

  getTotalCartAmount: () => {
    const { cart, pricing } = get();
    const cartTotal = cart.reduce((sum, d) => sum + (d.pricing?.totalAmount || 0), 0);
    return cartTotal + (pricing?.totalAmount || 0);
  },

  // ─── Submit & Pay ──────────────────────────────────────────────────────────

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

      const confirmedOrders: ConfirmedOrder[] = [];

      // If cart has items, use bulk-create
      if (state.cart.length > 0) {
        const allBookings = [
          // Cart items
          ...state.cart.map((d) => ({
            serviceId: d.selectedServiceId,
            propertyType: d.propertyType?.areaType?.toUpperCase() || 'APARTMENT',
            propertySize: d.propertyType?.size,
            address: d.formData.address,
            pincode: d.formData.pincode,
            city: d.formData.city,
            slotDate: d.selectedDate?.toISOString().split('T')[0],
            slotTime: SLOT_MAP[d.selectedTimeSlot || ''] || 'MORNING',
            planType: PLAN_MAP[d.selectedPlan || 'one-time'] || 'SINGLE',
            couponCode: d.couponCode || undefined,
          })),
          // Current booking
          {
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
          },
        ];

        const { data: bulkRes } = await api.post('/bookings/bulk-create', { bookings: allBookings });
        const results = bulkRes.data as Array<{ bookingRef: string; bookingId: string }>;

        // Create a combined payment order for total amount
        const firstBookingId = results[0].bookingId;
        const { data: orderRes } = await api.post('/payments/create-order', { bookingId: firstBookingId });
        const { orderId } = orderRes.data;

        // Mock payment
        await new Promise((r) => setTimeout(r, 1500));
        const mockPaymentId = `pay_mock_${nanoid(14)}`;

        await api.post('/payments/verify', {
          bookingId: firstBookingId,
          razorpayOrderId: orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: 'mock_sig',
        });

        // Build confirmed orders list
        const cartServices = state.cart.map((d) => d.selectedService || 'Service');
        results.forEach((r, i) => {
          confirmedOrders.push({
            bookingRef: r.bookingRef,
            bookingId: r.bookingId,
            service: i < cartServices.length ? cartServices[i] : (state.selectedService || 'Service'),
          });
        });

        set({
          bookingId: results[results.length - 1].bookingId,
          bookingRef: results[results.length - 1].bookingRef,
          confirmedOrders,
          isSubmitting: false,
        });

      } else {
        // Single booking flow
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

        const { data: orderRes } = await api.post('/payments/create-order', { bookingId });
        const { orderId } = orderRes.data;

        await new Promise((r) => setTimeout(r, 1500));
        const mockPaymentId = `pay_mock_${nanoid(14)}`;

        await api.post('/payments/verify', {
          bookingId,
          razorpayOrderId: orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: 'mock_sig',
        });

        confirmedOrders.push({
          bookingRef,
          bookingId,
          service: state.selectedService || 'Service',
        });

        set({ confirmedOrders, isSubmitting: false });
      }

      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err instanceof Error ? err.message : 'Booking failed');
      set({ isSubmitting: false, submitError: msg });
      throw new Error(msg);
    }
  },

  resetBooking: () => set({
    step: 1, formData: initialFormData, coords: null,
    selectedService: null, selectedServiceId: null,
    selectedPlan: null, selectedDate: null, selectedTimeSlot: null,
    propertyType: null, bookingId: null, bookingRef: null,
    couponCode: null, couponDiscount: 0, pricing: null, pincodeAvailable: null,
    isSubmitting: false, submitError: null,
    cart: [], currentDraftId: null, confirmedOrders: [],
  }),
}));
