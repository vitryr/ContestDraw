import { create } from "zustand";
import { drawApi, participantsApi, winnersApi } from "../services/api";
import type { Draw, Participant, DrawFilters, Winner } from "../types";

interface DrawStore {
  draws: Draw[];
  currentDraw: Draw | null;
  participants: Participant[];
  filters: DrawFilters;
  winners: Winner[];
  isLoading: boolean;
  error: string | null;

  // Draw operations
  fetchDraws: () => Promise<void>;
  fetchDraw: (id: string) => Promise<void>;
  createDraw: (data: Partial<Draw>) => Promise<Draw>;
  updateDraw: (id: string, updates: Partial<Draw>) => Promise<void>;
  deleteDraw: (id: string) => Promise<void>;

  // Participants operations
  importParticipants: (
    drawId: string,
    source: string,
    url?: string,
  ) => Promise<void>;
  uploadParticipantsCSV: (drawId: string, file: File) => Promise<void>;
  setParticipants: (participants: Participant[]) => void;

  // Filters
  setFilters: (filters: DrawFilters) => void;
  updateFilters: (updates: Partial<DrawFilters>) => void;

  // Draw execution
  executeDraw: (drawId: string) => Promise<Winner[]>;

  // Winners
  fetchWinners: (drawId: string) => Promise<void>;
  generateCertificate: (winnerId: string) => Promise<string>;
  generateVideo: (drawId: string) => Promise<string>;

  // Utilities
  clearCurrentDraw: () => void;
  clearError: () => void;
}

export const useDrawStore = create<DrawStore>((set, get) => ({
  draws: [],
  currentDraw: null,
  participants: [],
  filters: {},
  winners: [],
  isLoading: false,
  error: null,

  fetchDraws: async () => {
    set({ isLoading: true, error: null });
    try {
      const draws = await drawApi.getAll();
      set({ draws, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch draws",
        isLoading: false,
      });
    }
  },

  fetchDraw: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const draw = await drawApi.getById(id);
      const currentParticipants = get().participants;

      // Keep locally stored participants if the draw doesn't have any
      // This preserves participants set during import
      const participants = draw.participants?.length > 0
        ? draw.participants
        : currentParticipants;

      // Merge participants into the draw object for consistency
      const drawWithParticipants = {
        ...draw,
        participants: participants,
      };

      set({
        currentDraw: drawWithParticipants,
        participants: participants,
        filters: draw.filters || {},
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch draw",
        isLoading: false,
      });
    }
  },

  createDraw: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const draw = await drawApi.create(data);
      set((state) => ({
        draws: [...state.draws, draw],
        currentDraw: draw,
        isLoading: false,
      }));
      return draw;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create draw",
        isLoading: false,
      });
      throw error;
    }
  },

  updateDraw: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDraw = await drawApi.update(id, updates);
      set((state) => ({
        draws: state.draws.map((d) => (d.id === id ? updatedDraw : d)),
        currentDraw:
          state.currentDraw?.id === id ? updatedDraw : state.currentDraw,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update draw",
        isLoading: false,
      });
    }
  },

  deleteDraw: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await drawApi.delete(id);
      set((state) => ({
        draws: state.draws.filter((d) => d.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete draw",
        isLoading: false,
      });
    }
  },

  importParticipants: async (drawId, source, url) => {
    set({ isLoading: true, error: null });
    try {
      const { participants } = await participantsApi.import(
        drawId,
        source,
        url,
      );
      set({ participants, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to import participants",
        isLoading: false,
      });
      throw error;
    }
  },

  uploadParticipantsCSV: async (drawId, file) => {
    set({ isLoading: true, error: null });
    try {
      const { participants, draw } = await participantsApi.uploadCSV(drawId, file);
      set((state) => ({
        participants,
        currentDraw: draw || (state.currentDraw ? { ...state.currentDraw, participants } : null),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to upload participants",
        isLoading: false,
      });
      throw error;
    }
  },

  setParticipants: (participants) => set({ participants }),

  setFilters: (filters) => set({ filters }),

  updateFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),

  executeDraw: async (drawId) => {
    set({ isLoading: true, error: null });
    try {
      const { winners } = await drawApi.execute(drawId);
      set({ winners, isLoading: false });
      return winners;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to execute draw",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchWinners: async (drawId) => {
    set({ isLoading: true, error: null });
    try {
      const winners = await winnersApi.getByDraw(drawId);
      set({ winners, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch winners",
        isLoading: false,
      });
    }
  },

  // Certificate is per-draw (includes all winners)
  generateCertificate: async (drawId) => {
    try {
      const url = await winnersApi.generateCertificate(drawId);
      return url;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Failed to generate certificate",
      });
      throw error;
    }
  },

  generateVideo: async (drawId) => {
    try {
      const url = await winnersApi.generateVideo(drawId);
      return url;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to generate video",
      });
      throw error;
    }
  },

  clearCurrentDraw: () =>
    set({
      currentDraw: null,
      participants: [],
      filters: {},
      winners: [],
    }),

  clearError: () => set({ error: null }),
}));
