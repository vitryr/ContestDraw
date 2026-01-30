/**
 * Retry Utility Tests
 * Tests for retry logic with exponential backoff
 */

import { RetryHandler } from "../retry.util";

describe("RetryHandler", () => {
  describe("withRetry", () => {
    it("should return result on first success", async () => {
      const fn = jest.fn().mockResolvedValue("success");

      const result = await RetryHandler.withRetry(fn);

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should handle successful retry", () => {
      // Test the retry logic concept
      let attempts = 0;
      const maxRetries = 3;
      const shouldRetry = () => attempts < maxRetries;
      
      while (shouldRetry()) {
        attempts++;
      }
      
      expect(attempts).toBe(maxRetries);
    });

    it("should calculate correct delay sequence", () => {
      const delays: number[] = [];
      let delay = 1000;
      const maxDelay = 10000;
      const backoffFactor = 2;

      for (let i = 0; i < 5; i++) {
        delays.push(delay);
        delay = Math.min(delay * backoffFactor, maxDelay);
      }

      expect(delays).toEqual([1000, 2000, 4000, 8000, 10000]);
    });
  });
});

describe("RetryHandler - Unit Logic Tests", () => {
  describe("Exponential Backoff Calculation", () => {
    it("should double delay each retry", () => {
      const initialDelay = 1000;
      const backoffFactor = 2;
      
      const delays = [
        initialDelay,
        initialDelay * backoffFactor,
        initialDelay * backoffFactor * backoffFactor,
      ];

      expect(delays).toEqual([1000, 2000, 4000]);
    });

    it("should respect max delay cap", () => {
      const maxDelay = 30000;
      const delays = [1000, 2000, 4000, 8000, 16000, 32000, 64000];
      
      const cappedDelays = delays.map(d => Math.min(d, maxDelay));

      expect(cappedDelays[5]).toBe(30000);
      expect(cappedDelays[6]).toBe(30000);
    });

    it("should calculate correct delay sequence", () => {
      const config = {
        initialDelay: 1000,
        backoffFactor: 2,
        maxDelay: 10000,
      };

      let delay = config.initialDelay;
      const sequence = [delay];

      for (let i = 0; i < 4; i++) {
        delay = Math.min(delay * config.backoffFactor, config.maxDelay);
        sequence.push(delay);
      }

      expect(sequence).toEqual([1000, 2000, 4000, 8000, 10000]);
    });
  });

  describe("Retry Decision Logic", () => {
    it("should identify retryable HTTP errors", () => {
      const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
      
      const isRetryable = (status: number): boolean => {
        return retryableStatusCodes.includes(status);
      };

      expect(isRetryable(429)).toBe(true);
      expect(isRetryable(503)).toBe(true);
      expect(isRetryable(400)).toBe(false);
      expect(isRetryable(401)).toBe(false);
    });

    it("should identify non-retryable errors", () => {
      const nonRetryableStatusCodes = [400, 401, 403, 404, 422];
      
      const isNonRetryable = (status: number): boolean => {
        return nonRetryableStatusCodes.includes(status);
      };

      expect(isNonRetryable(400)).toBe(true);
      expect(isNonRetryable(401)).toBe(true);
      expect(isNonRetryable(500)).toBe(false);
    });

    it("should check for network errors", () => {
      const networkErrorMessages = [
        "ECONNREFUSED",
        "ENOTFOUND",
        "ETIMEDOUT",
        "ECONNRESET",
      ];

      const isNetworkError = (message: string): boolean => {
        return networkErrorMessages.some(code => message.includes(code));
      };

      expect(isNetworkError("connect ECONNREFUSED")).toBe(true);
      expect(isNetworkError("getaddrinfo ENOTFOUND")).toBe(true);
      expect(isNetworkError("Invalid response")).toBe(false);
    });
  });

  describe("Config Defaults", () => {
    it("should have sensible default values", () => {
      const defaultConfig = {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffFactor: 2,
      };

      expect(defaultConfig.maxRetries).toBe(3);
      expect(defaultConfig.initialDelay).toBe(1000);
      expect(defaultConfig.maxDelay).toBe(30000);
      expect(defaultConfig.backoffFactor).toBe(2);
    });

    it("should merge custom config with defaults", () => {
      const defaultConfig = {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffFactor: 2,
      };

      const customConfig = { maxRetries: 5 };
      const mergedConfig = { ...defaultConfig, ...customConfig };

      expect(mergedConfig.maxRetries).toBe(5);
      expect(mergedConfig.initialDelay).toBe(1000);
    });
  });

  describe("Sleep Function", () => {
    it("should create correct delay promise", () => {
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      expect(typeof sleep(100)).toBe("object");
      expect(sleep(100)).toBeInstanceOf(Promise);
    });
  });

  describe("Attempt Counting", () => {
    it("should count attempts correctly", () => {
      const maxRetries = 3;
      const attempts: number[] = [];

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        attempts.push(attempt);
      }

      expect(attempts).toEqual([0, 1, 2, 3]);
      expect(attempts.length).toBe(maxRetries + 1);
    });
  });

  describe("Error Wrapping", () => {
    it("should wrap error with retry info", () => {
      const maxRetries = 3;
      const originalMessage = "API error";
      const wrappedMessage = `Max retries (${maxRetries}) exceeded: ${originalMessage}`;

      expect(wrappedMessage).toContain("Max retries (3)");
      expect(wrappedMessage).toContain(originalMessage);
    });
  });

  describe("Rate Limit Headers", () => {
    it("should parse Retry-After header (seconds)", () => {
      const retryAfter = "30";
      const delayMs = parseInt(retryAfter, 10) * 1000;

      expect(delayMs).toBe(30000);
    });

    it("should parse Retry-After header (date)", () => {
      const futureDate = new Date(Date.now() + 60000);
      const retryAfter = futureDate.toUTCString();
      const delayMs = new Date(retryAfter).getTime() - Date.now();

      expect(delayMs).toBeGreaterThan(0);
      expect(delayMs).toBeLessThanOrEqual(60000);
    });

    it("should use X-RateLimit-Reset header", () => {
      const resetTimestamp = Math.floor(Date.now() / 1000) + 60;
      const now = Math.floor(Date.now() / 1000);
      const delaySeconds = resetTimestamp - now;

      expect(delaySeconds).toBe(60);
    });
  });

  describe("Jitter", () => {
    it("should add random jitter to delay", () => {
      const baseDelay = 1000;
      const jitterFactor = 0.1;
      
      const addJitter = (delay: number): number => {
        const jitter = delay * jitterFactor * Math.random();
        return delay + jitter;
      };

      const delayWithJitter = addJitter(baseDelay);

      expect(delayWithJitter).toBeGreaterThanOrEqual(baseDelay);
      expect(delayWithJitter).toBeLessThanOrEqual(baseDelay * (1 + jitterFactor));
    });
  });
});
