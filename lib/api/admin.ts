import { apiClient } from './client';

export const adminApi = {
  getDashboard: () =>
    apiClient.get('/admin/dashboard').then(r => r.data.data),

  getBookings: (params?: Record<string, string>) =>
    apiClient.get('/admin/bookings', { params }).then(r => r.data.data),

  reassignTechnician: (bookingId: string, technicianId: string) =>
    apiClient.patch(`/admin/bookings/${bookingId}/reassign`, { technicianId }).then(r => r.data.data),

  getTechnicians: () =>
    apiClient.get('/admin/technicians').then(r => r.data.data),

  blockTechnician: (id: string) =>
    apiClient.post(`/admin/technicians/${id}/block`).then(r => r.data.data),

  getRevenue: (params?: Record<string, string>) =>
    apiClient.get('/admin/revenue', { params }).then(r => r.data.data),

  getComplaints: () =>
    apiClient.get('/admin/complaints').then(r => r.data.data),

  getCustomers: (params?: Record<string, string>) =>
    apiClient.get('/admin/customers', { params }).then(r => r.data.data),

  createCoupon: (data: object) =>
    apiClient.post('/admin/coupons', data).then(r => r.data.data),

  getCoupons: () =>
    apiClient.get('/admin/coupons').then(r => r.data.data),

  updateCoupon: (id: string, data: object) =>
    apiClient.patch(`/admin/coupons/${id}`, data).then(r => r.data.data),

  getNotificationLog: (params?: Record<string, string>) =>
    apiClient.get('/admin/notifications/log', { params }).then(r => r.data.data),

  getAuditLog: (params?: Record<string, string>) =>
    apiClient.get('/admin/audit-log', { params }).then(r => r.data.data),

  getAnalytics: () =>
    apiClient.get('/admin/analytics').then(r => r.data.data),

  moderateReview: (id: string, status: 'PUBLISHED' | 'REJECTED') =>
    apiClient.patch(`/reviews/${id}/moderate`, { status }).then(r => r.data.data),
};
