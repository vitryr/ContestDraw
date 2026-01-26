/**
 * Common types for social platform integrations
 */

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    nextCursor?: string;
    hasMore: boolean;
    total?: number;
  };
}

export interface SocialAccount {
  userId: string;
  platform: "instagram" | "facebook" | "twitter" | "tiktok";
  accountId: string;
  username: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  connectedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  username: string;
  userId: string;
  timestamp: Date;
  likes?: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  url: string;
  platform: string;
  caption?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares?: number;
}

export interface APIError {
  code: string;
  message: string;
  statusCode: number;
  retryable: boolean;
  rateLimit?: {
    limit: number;
    remaining: number;
    resetAt: Date;
  };
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}
