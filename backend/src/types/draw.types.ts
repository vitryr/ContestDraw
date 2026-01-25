/**
 * Draw Types and Interfaces
 * Type definitions for the draw engine system
 */

export interface DrawFilters {
  removeDuplicates: boolean;
  maxEntriesPerUser: number | null; // 1, 5, 10, or unlimited (null)
  minMentions: number; // Minimum @ mentions required
  requiredHashtag?: string;
  requiredKeywords?: string[];
  verifyFollowing: boolean;
  followingAccounts?: string[]; // @accounts to verify
  blacklist?: string[]; // Usernames to exclude
}

export interface Participant {
  id: string;
  username: string;
  comment: string;
  timestamp: Date;
  mentions: string[];
  hashtags: string[];
  entryCount?: number;
}

export interface Winner {
  participant: Participant;
  position: number;
  selectedAt: Date;
  seed: string;
}

export interface DrawResult {
  drawId: string;
  timestamp: Date;
  totalParticipants: number;
  eligibleParticipants: number;
  winners: Winner[];
  alternates: Winner[];
  filters: DrawFilters;
  algorithm: string;
  certificateHash?: string;
  certificateBuffer?: Buffer;
}

export interface DrawConfig {
  drawId: string;
  winnersCount: number;
  alternatesCount: number;
  filters: DrawFilters;
}

export interface CertificateData {
  drawId: string;
  timestamp: Date;
  totalParticipants: number;
  eligibleParticipants: number;
  winnersCount: number;
  alternatesCount: number;
  algorithm: string;
  filters: DrawFilters;
  winners: Winner[];
  alternates: Winner[];
}

export interface FilterResult {
  passed: Participant[];
  filtered: Participant[];
  reason: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
