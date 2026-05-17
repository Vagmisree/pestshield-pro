import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

export type UserRole = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  loyaltyPoints?: number;
  avatar?: string | null;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;

  login: (identifier: string, password: string) => Promise<void>;
  register: (data: { name: string; phone: string; email?: string; password: string }) => Promise<{ tempToken: string }>;
  verifyOtp: (tempToken: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setUser: (user: User, token: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

function saveToken(token: string) {
  Cookies.set('access_token', token, { expires: 1, sameSite: 'lax' });
}

function clearToken() {
  Cookies.remove('access_token');
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
      error: null,

      login: async (identifier, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { identifier, password });
          const { accessToken, user } = data.data;
          saveToken(accessToken);
          set({ user, isAuthenticated: true, role: user.role, isLoading: false });
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            || (err instanceof Error ? err.message : 'Login failed');
          set({ isLoading: false, error: msg });
          throw new Error(msg);
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { data: res } = await api.post('/auth/customer/register', data);
          set({ isLoading: false });
          return { tempToken: res.data.tempToken };
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            || (err instanceof Error ? err.message : 'Registration failed');
          set({ isLoading: false, error: msg });
          throw new Error(msg);
        }
      },

      verifyOtp: async (tempToken, otp) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/customer/verify-otp', { tempToken, otp });
          const { accessToken, user } = data.data;
          saveToken(accessToken);
          set({ user, isAuthenticated: true, role: user.role, isLoading: false });
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            || (err instanceof Error ? err.message : 'OTP verification failed');
          set({ isLoading: false, error: msg });
          throw new Error(msg);
        }
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch { /* ignore */ }
        clearToken();
        set({ user: null, isAuthenticated: false, role: null, error: null });
      },

      hydrate: async () => {
        const token = Cookies.get('access_token');
        if (!token) return;
        try {
          const { data } = await api.get('/customers/me');
          const user = data.data?.user || data.data;
          if (user) set({ user, isAuthenticated: true, role: user.role });
        } catch {
          clearToken();
          set({ user: null, isAuthenticated: false, role: null });
        }
      },

      setUser: (user, token) => {
        saveToken(token);
        set({ user, isAuthenticated: true, role: user.role });
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          await api.patch('/customers/me', data);
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false,
          }));
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Update failed';
          set({ isLoading: false, error: msg });
          throw new Error(msg);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, role: state.role, isAuthenticated: state.isAuthenticated }),
    }
  )
);
