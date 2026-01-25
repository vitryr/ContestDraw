import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { User, Draw, Winner, Transaction, CreditPack, ApiResponse, ApiError } from '../types';
import type { LoginResponse, RegisterResponse } from '../types/auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message = error.response?.data?.message || 'An error occurred';

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });

    // Backend returns accessToken, not token
    localStorage.setItem('auth_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);

    // Return with token key for backwards compatibility with store
    return {
      user: {
        ...data.data.user,
        name: `${data.data.user.firstName || ''} ${data.data.user.lastName || ''}`.trim() || data.data.user.email,
        credits: data.data.user.credits || 0
      } as User,
      token: data.data.accessToken
    };
  },

  register: async (userData: { email: string; password: string; name: string }) => {
    // Split name into firstName and lastName for backend
    const nameParts = userData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const { data } = await api.post<ApiResponse<RegisterResponse>>('/auth/register', {
      email: userData.email,
      password: userData.password,
      firstName,
      lastName
    });

    // Backend returns accessToken, not token
    localStorage.setItem('auth_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);

    // Return with token key for backwards compatibility with store
    return {
      user: {
        ...data.data.user,
        name: `${data.data.user.firstName || ''} ${data.data.user.lastName || ''}`.trim() || data.data.user.email,
        credits: data.data.user.credits || 3 // Welcome bonus
      } as User,
      token: data.data.accessToken
    };
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  getCurrentUser: async () => {
    const { data } = await api.get<ApiResponse<User>>('/users/me');
    return data.data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      token,
    });
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      email,
    });
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      password,
    });
    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: string | number }>>('/auth/refresh', {
      refreshToken,
    });

    localStorage.setItem('auth_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);

    return data.data;
  },
};

// Draw API
export const drawApi = {
  create: async (drawData: Partial<Draw>) => {
    const { data } = await api.post<ApiResponse<Draw>>('/draws', drawData);
    return data.data;
  },

  getAll: async () => {
    const { data } = await api.get<ApiResponse<Draw[]>>('/draws');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Draw>>(`/draws/${id}`);
    return data.data;
  },

  update: async (id: string, updates: Partial<Draw>) => {
    const { data } = await api.put<ApiResponse<Draw>>(`/draws/${id}`, updates);
    return data.data;
  },

  execute: async (id: string) => {
    const { data } = await api.post<ApiResponse<{ winners: Winner[] }>>(`/draws/${id}/execute`);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/draws/${id}`);
  },
};

// Participants API
export const participantsApi = {
  import: async (drawId: string, source: string, url?: string) => {
    const { data } = await api.post<ApiResponse<{ participants: any[] }>>(`/draws/${drawId}/import`, {
      source,
      url,
    });
    return data.data;
  },

  uploadCSV: async (drawId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<ApiResponse<{ participants: any[] }>>(
      `/draws/${drawId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  },
};

// Winners API
export const winnersApi = {
  getByDraw: async (drawId: string) => {
    const { data } = await api.get<ApiResponse<Winner[]>>(`/draws/${drawId}/winners`);
    return data.data;
  },

  generateCertificate: async (winnerId: string) => {
    const { data } = await api.post<ApiResponse<{ url: string }>>(`/winners/${winnerId}/certificate`);
    return data.data;
  },

  generateVideo: async (drawId: string) => {
    const { data } = await api.post<ApiResponse<{ url: string }>>(`/draws/${drawId}/video`);
    return data.data;
  },
};

// Credits API
export const creditsApi = {
  getBalance: async () => {
    const { data } = await api.get<ApiResponse<{ balance: number }>>('/credits/balance');
    return data.data;
  },

  getHistory: async () => {
    const { data } = await api.get<ApiResponse<Transaction[]>>('/credits/history');
    return data.data;
  },

  getPacks: async () => {
    const { data } = await api.get<ApiResponse<CreditPack[]>>('/credits/packs');
    return data.data;
  },

  purchase: async (packId: string, paymentMethod: string) => {
    const { data } = await api.post<ApiResponse<{ transaction: Transaction }>>('/credits/purchase', {
      packId,
      paymentMethod,
    });
    return data.data;
  },
};

// Social API
export const socialApi = {
  connectInstagram: async (code: string) => {
    const { data } = await api.post<ApiResponse<{ connected: boolean }>>('/social/instagram/connect', {
      code,
    });
    return data.data;
  },

  connectTwitter: async (code: string) => {
    const { data } = await api.post<ApiResponse<{ connected: boolean }>>('/social/twitter/connect', {
      code,
    });
    return data.data;
  },

  getConnectedAccounts: async () => {
    const { data } = await api.get<ApiResponse<{ accounts: any[] }>>('/social/accounts');
    return data.data;
  },
};

export default api;
