export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  avatar?: string;
  socialAccounts?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
}

export interface Draw {
  id: string;
  title: string;
  description?: string;
  totalEntries: number;
  winnersCount: number;
  filters?: DrawFilters;
  platform?: 'instagram' | 'tiktok' | 'facebook' | 'youtube';
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  completedAt?: string;
  winners?: Winner[];
}

export interface DrawFilters {
  platform?: 'instagram' | 'tiktok' | 'facebook' | 'youtube';
  followersMin?: number;
  followersMax?: number;
  engagementRate?: number;
  location?: string[];
  hashtags?: string[];
  mentions?: string[];
  excludeUsers?: string[];
}

export interface Winner {
  id: string;
  username: string;
  profilePicture?: string;
  followers?: number;
  engagementRate?: number;
  platform: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  bonus?: number;
}

export interface NotificationSettings {
  drawCompleted: boolean;
  newEntries: boolean;
  creditLow: boolean;
  marketing: boolean;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}
