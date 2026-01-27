import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import type {
  User,
  Draw,
  Winner,
  Transaction,
  CreditPack,
  ApiResponse,
  ApiError,
} from "../types";
import type { LoginResponse, RegisterResponse } from "../types/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Track if we're currently refreshing to avoid infinite loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Response interceptor - handle errors with automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // Handle 401 with automatic token refresh
    if (error.response?.status === 401 && !originalRequest?._retry) {
      // Don't redirect for auth endpoints (login/register) - let the form handle the error
      const isAuthEndpoint = originalRequest?.url?.includes("/auth/login") ||
                             originalRequest?.url?.includes("/auth/register");
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refresh_token");

      // No refresh token available, redirect to login
      if (!refreshToken) {
        localStorage.removeItem("auth_token");
        window.location.href = "/auth";
        toast.error("Session expired. Please login again.");
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            }
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem("auth_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        // Update the authorization header
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Retry the original request
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth";
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || "An error occurred";
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });

    // Backend returns accessToken, not token
    localStorage.setItem("auth_token", data.data.accessToken);
    localStorage.setItem("refresh_token", data.data.refreshToken);

    // Return with token key for backwards compatibility with store
    return {
      user: {
        ...data.data.user,
        name:
          `${data.data.user.firstName || ""} ${data.data.user.lastName || ""}`.trim() ||
          data.data.user.email,
        credits: data.data.user.credits || 0,
      } as User,
      token: data.data.accessToken,
    };
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    // Split name into firstName and lastName for backend
    const nameParts = userData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const { data } = await api.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      {
        email: userData.email,
        password: userData.password,
        firstName,
        lastName,
      },
    );

    // Backend returns accessToken, not token
    localStorage.setItem("auth_token", data.data.accessToken);
    localStorage.setItem("refresh_token", data.data.refreshToken);

    // Return with token key for backwards compatibility with store
    return {
      user: {
        ...data.data.user,
        name:
          `${data.data.user.firstName || ""} ${data.data.user.lastName || ""}`.trim() ||
          data.data.user.email,
        credits: data.data.user.credits || 3, // Welcome bonus
      } as User,
      token: data.data.accessToken,
    };
  },

  logout: async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  },

  getCurrentUser: async () => {
    const { data } = await api.get<ApiResponse<User>>("/users/me");
    return data.data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await api.post<ApiResponse<{ message: string }>>(
      "/auth/verify-email",
      {
        token,
      },
    );
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post<ApiResponse<{ message: string }>>(
      "/auth/forgot-password",
      {
        email,
      },
    );
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post<ApiResponse<{ message: string }>>(
      "/auth/reset-password",
      {
        token,
        password,
      },
    );
    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string | number;
      }>
    >("/auth/refresh", {
      refreshToken,
    });

    localStorage.setItem("auth_token", data.data.accessToken);
    localStorage.setItem("refresh_token", data.data.refreshToken);

    return data.data;
  },
};

// Users API (Profile management)
export const usersApi = {
  getProfile: async () => {
    const { data } = await api.get<ApiResponse<User>>("/users/me");
    return data.data;
  },

  updateProfile: async (profileData: { firstName?: string; lastName?: string }) => {
    const { data } = await api.patch<ApiResponse<User>>("/users/me", profileData);
    return data.data;
  },

  requestEmailChange: async (newEmail: string) => {
    const { data } = await api.post<ApiResponse<{ message: string }>>(
      "/users/me/request-email-change",
      { newEmail },
    );
    return data;
  },
};

// Draw API
export const drawApi = {
  create: async (drawData: Partial<Draw>) => {
    const { data } = await api.post<ApiResponse<{ draw: Draw }>>(
      "/draws",
      drawData,
    );
    return data.data.draw;
  },

  getAll: async () => {
    const { data } = await api.get<ApiResponse<Draw[]>>("/draws");
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ draw: Draw }>>(
      `/draws/${id}`,
    );
    return data.data.draw;
  },

  update: async (id: string, updates: Partial<Draw>) => {
    const { data } = await api.put<ApiResponse<Draw>>(`/draws/${id}`, updates);
    return data.data;
  },

  execute: async (id: string) => {
    const { data } = await api.post<ApiResponse<{ winners: Winner[] }>>(
      `/draws/${id}/execute`,
    );
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/draws/${id}`);
  },

  generateVideo: async (id: string) => {
    const { data } = await api.post<ApiResponse<{ jobId: string; estimatedTime: string }>>(
      `/draws/${id}/video/generate`,
    );
    return data.data;
  },

  getVideoJobStatus: async (id: string, jobId: string) => {
    const { data } = await api.get<ApiResponse<{ id: string; status: string; videoUrl?: string; error?: string }>>(
      `/draws/${id}/video/status/${jobId}`,
    );
    return data.data;
  },

  getVideoStatus: async (id: string) => {
    const { data } = await api.get<ApiResponse<{
      id: string;
      status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
      videoUrl?: string;
      error?: string;
      createdAt: string;
      completedAt?: string;
    } | null>>(`/draws/${id}/video/status`);
    return data.data;
  },
};

// Participants API
export const participantsApi = {
  import: async (drawId: string, source: string, url?: string) => {
    const { data } = await api.post<ApiResponse<{ participants: any[] }>>(
      `/draws/${drawId}/import`,
      {
        source,
        url,
      },
    );
    return data.data;
  },

  uploadCSV: async (drawId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<ApiResponse<{ draw: any; participants: any[]; addedCount: number; totalParticipants: number }>>(
      `/draws/${drawId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data.data;
  },
};

// Winners API
export const winnersApi = {
  getByDraw: async (drawId: string) => {
    const { data } = await api.get<ApiResponse<Winner[]>>(
      `/draws/${drawId}/winners`,
    );
    return data.data;
  },

  // Certificate is generated per draw (includes all winners)
  generateCertificate: async (drawId: string): Promise<string> => {
    // Returns the PDF as a blob URL
    const response = await api.get(`/draws/${drawId}/certificate`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  },

  // Video is generated per draw - returns image/animation data
  generateVideo: async (drawId: string): Promise<string> => {
    const response = await api.get(`/draws/${drawId}/video`, {
      responseType: "blob",
    });

    // Check content type to determine response type
    const contentType = response.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      // JSON response - animation data for frontend rendering
      const text = await response.data.text();
      const data = JSON.parse(text);
      // Return a data URL that frontend can use
      return `data:application/json;base64,${btoa(JSON.stringify(data))}`;
    } else if (contentType.includes("image/")) {
      // Image response - video poster/thumbnail
      const blob = new Blob([response.data], { type: contentType });
      return URL.createObjectURL(blob);
    } else {
      // Default to video
      const blob = new Blob([response.data], { type: "video/mp4" });
      return URL.createObjectURL(blob);
    }
  },
};

// Credits API
export const creditsApi = {
  getBalance: async () => {
    const { data } = await api.get<
      ApiResponse<{
        balance: {
          credits: number;
          subscriptionCredits?: number;
          totalCredits?: number;
        };
      }>
    >("/credits/balance");
    // Extract the numeric balance from the backend response object
    const balanceData = data.data.balance;
    return {
      balance:
        balanceData.totalCredits ?? balanceData.credits ?? balanceData ?? 0,
    };
  },

  getHistory: async () => {
    const { data } =
      await api.get<ApiResponse<Transaction[]>>("/credits/history");
    return data.data;
  },

  getPacks: async () => {
    const { data } = await api.get<ApiResponse<CreditPack[]>>("/credits/packs");
    return data.data;
  },

  purchase: async (packId: string, paymentMethod: string) => {
    const { data } = await api.post<ApiResponse<{ transaction: Transaction }>>(
      "/credits/purchase",
      {
        packId,
        paymentMethod,
      },
    );
    return data.data;
  },
};

// Social API
export const socialApi = {
  connectInstagram: async (code: string) => {
    const { data } = await api.post<ApiResponse<{ connected: boolean }>>(
      "/social/instagram/connect",
      {
        code,
      },
    );
    return data.data;
  },

  connectTwitter: async (code: string) => {
    const { data } = await api.post<ApiResponse<{ connected: boolean }>>(
      "/social/twitter/connect",
      {
        code,
      },
    );
    return data.data;
  },

  getConnectedAccounts: async () => {
    const { data } =
      await api.get<ApiResponse<{ accounts: any[] }>>("/social/accounts");
    return data.data;
  },
};

export default api;
