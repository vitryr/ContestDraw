export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  emailVerified?: boolean;
  credits: number;
  createdAt: string;
  role?: string;
}

export interface Participant {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  platform: "instagram" | "twitter" | "tiktok" | "manual";
  metadata?: Record<string, any>;
}

export interface DrawFilters {
  minFollowers?: number;
  minLikes?: number;
  minComments?: number;
  excludeKeywords?: string[];
  requireFollowing?: boolean;
  duplicateCheck?: boolean;
}

export interface Draw {
  id: string;
  userId: string;
  title: string;
  description?: string;
  platform: string;
  postUrl?: string;
  participants: Participant[];
  filters: DrawFilters;
  numberOfWinners: number;
  status: "draft" | "configured" | "executed" | "completed";
  createdAt: string;
  executedAt?: string;
}

export interface Winner {
  id: string;
  participant: Participant;
  position: number;
  drawId: string;
  certificateUrl?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "purchase" | "usage" | "refund";
  description: string;
  createdAt: string;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
