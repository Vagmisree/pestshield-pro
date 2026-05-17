import { apiClient } from './client';

export const servicesApi = {
  getAll: () =>
    apiClient.get('/services').then(r => r.data.data),

  getBySlug: (slug: string) =>
    apiClient.get(`/services/${slug}`).then(r => r.data.data),
};
