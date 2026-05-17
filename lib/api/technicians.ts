import { apiClient } from './client';

export const technicianApi = {
  getTasks: (technicianId: string) =>
    apiClient.get(`/technicians/${technicianId}/tasks`).then(r => r.data.data),

  markArrived: (technicianId: string, bookingId: string) =>
    apiClient.patch(`/technicians/${technicianId}/tasks/${bookingId}/arrived`).then(r => r.data.data),

  updateLocation: (technicianId: string, lat: number, lng: number) =>
    apiClient.patch(`/technicians/${technicianId}/location`, { lat, lng }).then(r => r.data.data),

  submitReport: (data: {
    bookingId: string; pestType: string; severity: string;
    affectedAreas: string[]; recommendedTreatment: string;
    chemicalsToBeUsed: string[]; technicianNotes?: string;
  }) => apiClient.post('/reports', data).then(r => r.data.data),

  uploadPhotos: (reportId: string, files: File[], type: 'before' | 'after') => {
    const form = new FormData();
    files.forEach(f => form.append('photos', f));
    return apiClient.post(`/reports/${reportId}/photos?type=${type}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },

  requestOTPClosure: (bookingId: string) =>
    apiClient.post('/auth/send-otp', { bookingId }).then(r => r.data.data),

  closeBooking: (bookingId: string, otp: string) =>
    apiClient.post(`/bookings/${bookingId}/close`, { otp }).then(r => r.data.data),
};
