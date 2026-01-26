import { create } from "zustand";
import { creditsApi } from "../services/api";
import type { Transaction, CreditPack } from "../types";

interface CreditsStore {
  balance: number;
  history: Transaction[];
  packs: CreditPack[];
  isLoading: boolean;
  error: string | null;

  fetchBalance: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchPacks: () => Promise<void>;
  purchaseCredits: (packId: string, paymentMethod: string) => Promise<void>;
  clearError: () => void;
}

export const useCreditsStore = create<CreditsStore>((set) => ({
  balance: 0,
  history: [],
  packs: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      const { balance } = await creditsApi.getBalance();
      set({ balance });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch balance",
      });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const history = await creditsApi.getHistory();
      set({ history, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch history",
        isLoading: false,
      });
    }
  },

  fetchPacks: async () => {
    set({ isLoading: true, error: null });
    try {
      const packs = await creditsApi.getPacks();
      set({ packs, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch packs",
        isLoading: false,
      });
    }
  },

  purchaseCredits: async (packId, paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const { transaction } = await creditsApi.purchase(packId, paymentMethod);
      set((state) => ({
        balance: state.balance + transaction.amount,
        history: [transaction, ...state.history],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to purchase credits",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
