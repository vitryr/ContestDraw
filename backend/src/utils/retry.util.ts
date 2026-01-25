/**
 * Utility for handling retries with exponential backoff
 */

import { RetryConfig } from '../types/social.types';

export class RetryHandler {
  private static defaultConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2,
  };

  /**
   * Execute a function with retry logic and exponential backoff
   * @param fn - Function to execute
   * @param config - Retry configuration
   * @returns Promise with function result
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    let lastError: Error;
    let delay = finalConfig.initialDelay;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (!this.isRetryable(error)) {
          throw error;
        }

        // Last attempt, throw error
        if (attempt === finalConfig.maxRetries) {
          throw new Error(
            `Max retries (${finalConfig.maxRetries}) exceeded: ${lastError.message}`
          );
        }

        // Wait before retry
        await this.sleep(delay);

        // Calculate next delay with exponential backoff
        delay = Math.min(
          delay * finalConfig.backoffFactor,
          finalConfig.maxDelay
        );

        console.warn(
          `Retry attempt ${attempt + 1}/${finalConfig.maxRetries} after ${delay}ms`
        );
      }
    }

    throw lastError!;
  }

  /**
   * Check if error is retryable
   */
  private static isRetryable(error: any): boolean {
    // Network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // Rate limit errors (429)
    if (error.statusCode === 429 || error.response?.status === 429) {
      return true;
    }

    // Server errors (5xx)
    const status = error.statusCode || error.response?.status;
    if (status >= 500 && status < 600) {
      return true;
    }

    return false;
  }

  /**
   * Sleep for specified milliseconds
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Parse rate limit headers and calculate wait time
   */
  static getRateLimitWaitTime(headers: any): number {
    const resetTime = headers['x-ratelimit-reset'] || headers['x-rate-limit-reset'];
    const remaining = headers['x-ratelimit-remaining'] || headers['x-rate-limit-remaining'];

    if (remaining && parseInt(remaining) === 0 && resetTime) {
      const resetDate = new Date(parseInt(resetTime) * 1000);
      const waitTime = resetDate.getTime() - Date.now();
      return Math.max(waitTime, 0);
    }

    return 0;
  }
}
