import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  name: string;
  role: 'admin';
  email?: string;
}

interface AdminStore {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;

  loginAdmin: (credentials: { email: string; password: string }) => Promise<void>;
  logoutAdmin: () => void;
  setAdminUser: (user: AdminUser) => void;
}

const mockAdmin: AdminUser = {
  name: 'Admin User',
  role: 'admin',
  email: 'admin@pestshield.com',
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,
      isLoading: false,

      loginAdmin: async (credentials) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        set({
          isAdminAuthenticated: true,
          adminUser: mockAdmin,
          isLoading: false,
        });
      },

      logoutAdmin: () => {
        set({
          isAdminAuthenticated: false,
          adminUser: null,
        });
      },

      setAdminUser: (user) => {
        set({
          adminUser: user,
          isAdminAuthenticated: true,
        });
      },
    }),
    {
      name: 'admin-store',
    }
  )
);
