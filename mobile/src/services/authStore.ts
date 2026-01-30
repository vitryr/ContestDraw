import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { apiService } from './apiService';

// JWT token payload interface
interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
}

// Token refresh buffer time (refresh 5 minutes before expiry)
const TOKEN_REFRESH_BUFFER_SECONDS = 5 * 60;

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  refreshAccessToken: () => Promise<boolean>;
  getValidToken: () => Promise<string | null>;
}

/**
 * Decodes a JWT token without verification (client-side only)
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    // Decode base64url to base64, then decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Checks if a token is expired or close to expiry
 * @param token - JWT token string
 * @param bufferSeconds - Number of seconds before actual expiry to consider it expired
 * @returns true if token is expired or will expire within buffer time
 */
const isTokenExpired = (token: string, bufferSeconds: number = TOKEN_REFRESH_BUFFER_SECONDS): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp - bufferSeconds <= currentTime;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isRefreshing: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.post('/auth/login', { email, password });

      // Backend returns nested structure: { data: { user, accessToken, refreshToken, expiresIn } }
      const { user, accessToken, refreshToken } = response.data.data;

      await AsyncStorage.setItem('auth_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });

      // Split name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await apiService.post('/auth/signup', {
        email,
        password,
        firstName,
        lastName
      });

      // Backend returns nested structure: { data: { user, accessToken, refreshToken, expiresIn } }
      const { user, accessToken, refreshToken } = response.data.data;

      await AsyncStorage.setItem('auth_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user');
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem('auth_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        // Check if token needs refresh on load
        if (isTokenExpired(token)) {
          // Attempt to refresh in background, don't block user
          get().refreshAccessToken().catch((error) => {
            console.error('Background token refresh failed:', error);
          });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ isLoading: false });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  clearError: () => set({ error: null }),

  /**
   * Refreshes the access token using the stored refresh token
   * @returns true if refresh was successful, false otherwise
   */
  refreshAccessToken: async () => {
    const { refreshToken, isRefreshing } = get();

    // Prevent concurrent refresh attempts
    if (isRefreshing) {
      // Wait for the ongoing refresh to complete
      return new Promise<boolean>((resolve) => {
        const checkRefresh = setInterval(() => {
          const state = get();
          if (!state.isRefreshing) {
            clearInterval(checkRefresh);
            resolve(state.token !== null);
          }
        }, 100);
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkRefresh);
          resolve(false);
        }, 10000);
      });
    }

    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    try {
      set({ isRefreshing: true });

      const response = await apiService.post('/auth/refresh', {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      await AsyncStorage.setItem('auth_token', accessToken);
      await AsyncStorage.setItem('refresh_token', newRefreshToken);

      set({
        token: accessToken,
        refreshToken: newRefreshToken,
        isRefreshing: false,
      });

      return true;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      set({ isRefreshing: false });

      // If refresh fails with 401, the refresh token is invalid - logout
      if (error.response?.status === 401) {
        await get().logout();
      }

      return false;
    }
  },

  /**
   * Gets a valid access token, refreshing if necessary
   * @returns Valid access token or null if unable to get one
   */
  getValidToken: async () => {
    const { token, refreshToken } = get();

    if (!token) {
      return null;
    }

    // Check if current token is still valid
    if (!isTokenExpired(token)) {
      return token;
    }

    // Token is expired or close to expiry, try to refresh
    if (!refreshToken) {
      console.error('Token expired and no refresh token available');
      return null;
    }

    const refreshSuccess = await get().refreshAccessToken();
    if (refreshSuccess) {
      return get().token;
    }

    return null;
  },
}));

// Export utility functions for external use
export { isTokenExpired, decodeJWT };
