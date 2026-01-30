import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '../config/environment';

// Flag to prevent circular import issues
let authStoreModule: typeof import('./authStore') | null = null;

// Lazy load auth store to avoid circular dependencies
const getAuthStore = async () => {
  if (!authStoreModule) {
    authStoreModule = await import('./authStore');
  }
  return authStoreModule.useAuthStore;
};

class ApiService {
  private api: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: ENV.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Process the queue of failed requests after token refresh
   */
  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private setupInterceptors() {
    // Request interceptor - get valid token before each request
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Skip token for auth endpoints (login, signup, refresh)
        const skipTokenEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh'];
        const shouldSkipToken = skipTokenEndpoints.some(endpoint =>
          config.url?.includes(endpoint)
        );

        if (shouldSkipToken) {
          return config;
        }

        try {
          const authStore = await getAuthStore();
          const state = authStore.getState();

          // Use getValidToken which handles refresh automatically
          const validToken = await state.getValidToken();

          if (validToken) {
            config.headers.Authorization = `Bearer ${validToken}`;
          }
        } catch (error) {
          console.error('Error getting valid token:', error);
          // Fall back to stored token if getValidToken fails
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 errors with token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Skip retry for auth endpoints
        const skipRetryEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh'];
        const shouldSkipRetry = skipRetryEndpoints.some(endpoint =>
          originalRequest.url?.includes(endpoint)
        );

        // If 401 error and not an auth endpoint and hasn't been retried yet
        if (error.response?.status === 401 && !shouldSkipRetry && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.api(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const authStore = await getAuthStore();
            const state = authStore.getState();
            const refreshSuccess = await state.refreshAccessToken();

            if (refreshSuccess) {
              const newToken = authStore.getState().token;
              this.processQueue(null, newToken);

              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }

              return this.api(originalRequest);
            } else {
              // Refresh failed, logout user
              this.processQueue(new Error('Token refresh failed'), null);
              await state.logout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);

            // Logout on refresh error
            try {
              const authStore = await getAuthStore();
              await authStore.getState().logout();
            } catch (logoutError) {
              console.error('Logout error after refresh failure:', logoutError);
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // For other 401 errors (e.g., refresh endpoint itself), clear auth state
        if (error.response?.status === 401 && shouldSkipRetry) {
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('refresh_token');
          await AsyncStorage.removeItem('user');
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  /**
   * Get the base URL for the API (useful for direct file downloads)
   */
  getBaseUrl(): string {
    return ENV.apiUrl;
  }

  /**
   * Get the current auth header value for direct requests (e.g., file downloads)
   */
  async getAuthHeader(): Promise<string> {
    try {
      const authStore = await getAuthStore();
      const state = authStore.getState();
      const validToken = await state.getValidToken();
      return validToken ? `Bearer ${validToken}` : '';
    } catch (error) {
      console.error('Error getting auth header:', error);
      const token = await AsyncStorage.getItem('auth_token');
      return token ? `Bearer ${token}` : '';
    }
  }
}

export const apiService = new ApiService();
