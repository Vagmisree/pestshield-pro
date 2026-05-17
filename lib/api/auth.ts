import { apiClient } from './client';

export interface RegisterPayload { name: string; phone: string; email?: string; password: string }
export interface LoginPayload { identifier: string; password: string }
export interface VerifyOtpPayload { tempToken: string; otp: string }

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post('/auth/customer/register', data).then(r => r.data.data),

  verifyOtp: (data: VerifyOtpPayload) =>
    apiClient.post('/auth/customer/verify-otp', data).then(r => r.data.data),

  login: (data: LoginPayload) =>
    apiClient.post('/auth/login', data).then(r => r.data.data),

  logout: () =>
    apiClient.post('/auth/logout').then(r => r.data.data),

  refreshToken: () =>
    apiClient.post('/auth/refresh').then(r => r.data.data),

  forgotPassword: (phone: string) =>
    apiClient.post('/auth/forgot-password', { phone }).then(r => r.data.data),

  resetPassword: (data: { phone: string; otp: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', data).then(r => r.data.data),
};
