'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data.data),
    refetchInterval: 30_000,
  });

export const useAdminBookings = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ['admin-bookings', params],
    queryFn: () => api.get('/admin/bookings', { params }).then((r) => r.data.data),
  });

export const useAdminTechnicians = () =>
  useQuery({
    queryKey: ['admin-technicians'],
    queryFn: () => api.get('/technicians').then((r) => r.data.data?.technicians || r.data.data || []),
  });

export const useAdminRevenue = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ['admin-revenue', params],
    queryFn: () => api.get('/admin/revenue', { params }).then((r) => r.data.data),
  });

export const useAdminReports = () =>
  useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => api.get('/admin/reports').then((r) => r.data.data || []).catch(() => []),
  });

export const useAdminComplaints = () =>
  useQuery({
    queryKey: ['admin-complaints'],
    queryFn: () => api.get('/admin/complaints').then((r) => r.data.data || []),
  });

export const useReassignTechnician = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, technicianId }: { bookingId: string; technicianId: string }) =>
      api.patch(`/admin/bookings/${bookingId}/reassign`, { technicianId }),
    onSuccess: () => {
      toast.success('Technician reassigned successfully!');
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: () => toast.error('Failed to reassign technician'),
  });
};

export const useCreateTechnician = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/technicians', data),
    onSuccess: () => {
      toast.success('Technician created successfully!');
      qc.invalidateQueries({ queryKey: ['admin-technicians'] });
    },
    onError: () => toast.error('Failed to create technician'),
  });
};

export const useBlockTechnician = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/technicians/${id}/block`),
    onSuccess: () => {
      toast.success('Technician account updated.');
      qc.invalidateQueries({ queryKey: ['admin-technicians'] });
    },
    onError: () => toast.error('Failed to update technician'),
  });
};
