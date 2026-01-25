/**
 * Simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class Cache {
  private static store = new Map<string, CacheEntry<any>>();

  /**
   * Set cache entry with TTL in seconds
   */
  static set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Get cache entry if not expired
   */
  static get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Delete cache entry
   */
  static delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  static clear(): void {
    this.store.clear();
  }

  /**
   * Clean up expired entries
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  static async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    this.set(key, value, ttlSeconds);
    return value;
  }
}

// Cleanup expired entries every 5 minutes
setInterval(() => Cache.cleanup(), 5 * 60 * 1000);
