'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useMyBookings = () =>
  useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/bookings').then((r) => r.data.data?.items || r.data.data || []),
  });

export const useMyInvoices = () =>
  useQuery({
    queryKey: ['my-invoices'],
    queryFn: () => api.get('/payments/invoice/list').then((r) => r.data.data || []).catch(() => []),
  });

export const useMyReports = () =>
  useQuery({
    queryKey: ['my-reports'],
    queryFn: () => api.get('/reports/my').then((r) => r.data.data || []).catch(() => []),
  });

export const useMyProfile = () =>
  useQuery({
    queryKey: ['my-profile'],
    queryFn: () => api.get('/customers/me').then((r) => r.data.data),
  });

export const useMyComplaints = () =>
  useQuery({
    queryKey: ['my-complaints'],
    queryFn: () => api.get('/customers/complaints').then((r) => r.data.data || []),
  });

export const useApproveReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => api.post(`/reports/${reportId}/approve`),
    onSuccess: () => {
      toast.success('Report approved! Technician will proceed with treatment.');
      qc.invalidateQueries({ queryKey: ['my-bookings'] });
      qc.invalidateQueries({ queryKey: ['my-reports'] });
    },
    onError: () => toast.error('Failed to approve report'),
  });
};

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookingId: string; rating: number; comment?: string }) =>
      api.post('/reviews', data),
    onSuccess: () => {
      toast.success('Review submitted! Thank you.');
      qc.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: () => toast.error('Failed to submit review'),
  });
};

export const useRescheduleBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, slotDate, slotTime }: { id: string; slotDate: string; slotTime: string }) =>
      api.patch(`/bookings/${id}/reschedule`, { slotDate, slotTime }),
    onSuccess: () => {
      toast.success('Booking rescheduled successfully!');
      qc.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: () => toast.error('Failed to reschedule booking'),
  });
};

export const useSubmitComplaint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookingId: string; type: string; description: string }) =>
      api.post('/customers/complaints', data),
    onSuccess: () => {
      toast.success('Complaint submitted. Our team will contact you within 24 hours.');
      qc.invalidateQueries({ queryKey: ['my-complaints'] });
    },
    onError: () => toast.error('Failed to submit complaint'),
  });
};
