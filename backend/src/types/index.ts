import { Request } from 'express';

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * JWT Payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * User registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * User login data
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Token response
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Credit transaction types
 */
export enum CreditTransactionType {
  PURCHASE = 'PURCHASE',
  CONSUMPTION = 'CONSUMPTION',
  REFUND = 'REFUND',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

/**
 * Draw status
 */
export enum DrawStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * Social platform types
 */
export enum SocialPlatform {
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE'
}

/**
 * Draw participant
 */
export interface DrawParticipant {
  id: string;
  name: string;
  identifier: string;
  source: SocialPlatform | 'MANUAL';
  metadata?: Record<string, any>;
}

/**
 * Draw result
 */
export interface DrawResult {
  winners: DrawParticipant[];
  timestamp: Date;
  algorithm: string;
  seed: string;
  certificateHash: string;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * API Error response
 */
export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * API Success response
 */
export interface SuccessResponse<T = any> {
  status: 'success';
  data: T;
  message?: string;
}
