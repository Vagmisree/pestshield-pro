import { apiClient } from './client';

export const blogApi = {
  getPosts: (params?: Record<string, string>) =>
    apiClient.get('/blog/posts', { params }).then(r => r.data.data),

  getPost: (slug: string) =>
    apiClient.get(`/blog/posts/${slug}`).then(r => r.data.data),

  getCategories: () =>
    apiClient.get('/blog/categories').then(r => r.data.data),
};
