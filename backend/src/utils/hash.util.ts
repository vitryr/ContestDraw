import * as crypto from 'crypto';

/**
 * Hash verification utility for draw results transparency
 * Uses SHA-256 for cryptographic integrity verification
 */

export interface DrawHashData {
  drawId: string;
  timestamp: string;
  participants: Array<{ id: string; name: string; username: string }>;
  winners: Array<{ id: string; position: number; participantId: string }>;
  randomSeed: string;
  filters: Record<string, any>;
  algorithm: string;
}

/**
 * Generate SHA-256 hash of draw results
 * @param data - Draw data to hash
 * @returns Hex-encoded SHA-256 hash
 */
export function generateDrawHash(data: DrawHashData): string {
  // Normalize data to ensure consistent hashing
  const normalizedData = {
    drawId: data.drawId,
    timestamp: data.timestamp,
    participants: data.participants
      .map(p => ({ id: p.id, name: p.name, username: p.username }))
      .sort((a, b) => a.id.localeCompare(b.id)), // Sort for consistency
    winners: data.winners
      .map(w => ({ id: w.id, position: w.position, participantId: w.participantId }))
      .sort((a, b) => a.position - b.position),
    randomSeed: data.randomSeed,
    filters: data.filters,
    algorithm: data.algorithm,
  };

  // Convert to deterministic JSON string
  const dataString = JSON.stringify(normalizedData, Object.keys(normalizedData).sort());

  // Generate SHA-256 hash
  const hash = crypto
    .createHash('sha256')
    .update(dataString, 'utf8')
    .digest('hex');

  return hash;
}

/**
 * Verify hash integrity
 * @param data - Draw data to verify
 * @param expectedHash - Expected hash value
 * @returns True if hash matches
 */
export function verifyDrawHash(data: DrawHashData, expectedHash: string): boolean {
  const computedHash = generateDrawHash(data);
  return computedHash === expectedHash;
}

/**
 * Generate short verification code (first 12 chars of hash)
 * @param hash - Full hash
 * @returns Short verification code
 */
export function generateVerificationCode(hash: string): string {
  return hash.substring(0, 12).toUpperCase();
}

/**
 * Generate timestamp with timezone info
 * @returns ISO 8601 timestamp with timezone
 */
export function generateTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format hash for display (grouped in blocks of 4)
 * @param hash - Hash to format
 * @returns Formatted hash (e.g., "A1B2 C3D4 E5F6...")
 */
export function formatHashForDisplay(hash: string): string {
  return hash.match(/.{1,4}/g)?.join(' ') || hash;
}

/**
 * Generate cryptographically secure random seed
 * @returns Hex-encoded random seed
 */
export function generateRandomSeed(): string {
  return crypto.randomBytes(32).toString('hex');
}

export const HASH_ALGORITHM = 'SHA-256';
export const PRNG_ALGORITHM = 'Cryptographically Secure PRNG (crypto.randomBytes)';
