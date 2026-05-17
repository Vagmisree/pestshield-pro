import { apiClient } from './client';

export const shopApi = {
  getProducts: (params?: Record<string, string>) =>
    apiClient.get('/shop/products', { params }).then(r => r.data.data),

  getProduct: (slug: string) =>
    apiClient.get(`/shop/products/${slug}`).then(r => r.data.data),

  checkout: (data: { items: { productId: string; quantity: number }[]; deliveryAddress: string; paymentMethod?: string }) =>
    apiClient.post('/shop/cart/checkout', data).then(r => r.data.data),

  getOrders: (params?: Record<string, string>) =>
    apiClient.get('/shop/orders', { params }).then(r => r.data.data),

  getOrder: (id: string) =>
    apiClient.get(`/shop/orders/${id}`).then(r => r.data.data),
};
