import { create } from "zustand";
import { authApi } from "../services/api";
import type { User } from "../types";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authApi.login(email, password);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authApi.register(userData);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    set({ user: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
      localStorage.removeItem("auth_token");
    }
  },

  clearError: () => set({ error: null }),
}));
