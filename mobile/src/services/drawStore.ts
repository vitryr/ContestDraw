import { create } from 'zustand';
import { Draw, DrawFilters, Winner } from '../types';
import { apiService } from './apiService';

interface DrawState {
  draws: Draw[];
  currentDraw: Draw | null;
  isLoading: boolean;
  error: string | null;

  fetchDraws: () => Promise<void>;
  fetchDraw: (id: string) => Promise<void>;
  createDraw: (data: Partial<Draw>) => Promise<Draw>;
  updateDraw: (id: string, data: Partial<Draw>) => Promise<void>;
  deleteDraw: (id: string) => Promise<void>;
  executeDraw: (id: string) => Promise<Winner[]>;
  setCurrentDraw: (draw: Draw | null) => void;
  clearError: () => void;
}

export const useDrawStore = create<DrawState>((set, get) => ({
  draws: [],
  currentDraw: null,
  isLoading: false,
  error: null,

  fetchDraws: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get('/draws');
      set({ draws: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch draws',
        isLoading: false,
      });
    }
  },

  fetchDraw: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get(`/draws/${id}`);
      set({ currentDraw: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch draw',
        isLoading: false,
      });
    }
  },

  createDraw: async (data: Partial<Draw>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.post('/draws', data);
      const newDraw = response.data;
      set((state) => ({
        draws: [newDraw, ...state.draws],
        currentDraw: newDraw,
        isLoading: false,
      }));
      return newDraw;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create draw',
        isLoading: false,
      });
      throw error;
    }
  },

  updateDraw: async (id: string, data: Partial<Draw>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.put(`/draws/${id}`, data);
      const updatedDraw = response.data;
      set((state) => ({
        draws: state.draws.map((draw) =>
          draw.id === id ? updatedDraw : draw
        ),
        currentDraw: state.currentDraw?.id === id ? updatedDraw : state.currentDraw,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update draw',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteDraw: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiService.delete(`/draws/${id}`);
      set((state) => ({
        draws: state.draws.filter((draw) => draw.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete draw',
        isLoading: false,
      });
      throw error;
    }
  },

  executeDraw: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.post(`/draws/${id}/execute`);
      const winners = response.data.winners;

      set((state) => ({
        currentDraw: state.currentDraw ? {
          ...state.currentDraw,
          status: 'completed',
          winners,
          completedAt: new Date().toISOString(),
        } : null,
        isLoading: false,
      }));

      return winners;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to execute draw',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentDraw: (draw: Draw | null) => set({ currentDraw: draw }),
  clearError: () => set({ error: null }),
}));
