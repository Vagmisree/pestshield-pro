import { apiClient } from './client';

export interface CreateBookingPayload {
  serviceId: string; propertyType: string; propertySize?: string;
  address: string; pincode: string; city: string;
  slotDate: string; slotTime: string; planType?: string;
  notes?: string; couponCode?: string;
}

export const bookingsApi = {
  create: (data: CreateBookingPayload) =>
    apiClient.post('/bookings', data).then(r => r.data.data),

  getMyBookings: (params?: Record<string, string>) =>
    apiClient.get('/bookings', { params }).then(r => r.data.data),

  getById: (id: string) =>
    apiClient.get(`/bookings/${id}`).then(r => r.data.data),

  reschedule: (id: string, data: { slotDate: string; slotTime: string }) =>
    apiClient.patch(`/bookings/${id}/reschedule`, data).then(r => r.data.data),

  cancel: (id: string, reason: string) =>
    apiClient.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data.data),

  approveReport: (id: string) =>
    apiClient.post(`/bookings/${id}/approve-report`).then(r => r.data.data),

  close: (id: string, otp: string) =>
    apiClient.post(`/bookings/${id}/close`, { otp }).then(r => r.data.data),

  checkPincode: (pincode: string) =>
    apiClient.get(`/bookings/check-pincode/${pincode}`).then(r => r.data.data),
};
