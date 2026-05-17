import { apiClient } from './client';

export const reviewsApi = {
  submit: (data: { bookingId: string; rating: number; comment?: string }) =>
    apiClient.post('/reviews', data).then(r => r.data.data),

  getAll: (params?: Record<string, string>) =>
    apiClient.get('/reviews', { params }).then(r => r.data.data),

  getAggregate: () =>
    apiClient.get('/reviews/aggregate').then(r => r.data.data),
};
