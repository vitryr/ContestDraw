/**
 * Authentication related TypeScript types
 */

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  credits?: number;
  role?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

// Form validation types
export interface PasswordValidation {
  valid: boolean;
  error?: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}
