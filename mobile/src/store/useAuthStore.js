import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import safeStorage from './safeStorage';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
