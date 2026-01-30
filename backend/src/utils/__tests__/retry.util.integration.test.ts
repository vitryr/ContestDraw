/**
 * Retry Utility Integration Tests
 * Tests that exercise the RetryHandler class
 */

import { RetryHandler } from "../retry.util";

describe("RetryHandler Integration", () => {
  describe("withRetry - Success Cases", () => {
    it("should return result on first success", async () => {
      const fn = jest.fn().mockResolvedValue("success");

      const result = await RetryHandler.withRetry(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should work with different return types", async () => {
      const numberFn = jest.fn().mockResolvedValue(42);
      const objectFn = jest.fn().mockResolvedValue({ key: "value" });

      expect(await RetryHandler.withRetry(numberFn)).toBe(42);
      expect(await RetryHandler.withRetry(objectFn)).toEqual({ key: "value" });
    });
  });

  describe("withRetry - Retry Cases", () => {
    it("should retry and succeed on second attempt", async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce({ code: "ECONNRESET" })
        .mockResolvedValueOnce("success");

      const result = await RetryHandler.withRetry(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should retry on 429 rate limit", async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce({ statusCode: 429 })
        .mockResolvedValueOnce("ok");

      const result = await RetryHandler.withRetry(fn, {
        maxRetries: 2,
        initialDelay: 10,
      });

      expect(result).toBe("ok");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should retry on 5xx errors", async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce({ statusCode: 503 })
        .mockResolvedValueOnce("recovered");

      const result = await RetryHandler.withRetry(fn, {
        maxRetries: 2,
        initialDelay: 10,
      });

      expect(result).toBe("recovered");
    });
  });

  describe("withRetry - Failure Cases", () => {
    it("should throw immediately for non-retryable errors", async () => {
      const fn = jest.fn().mockRejectedValue({ statusCode: 400 });

      await expect(
        RetryHandler.withRetry(fn, { maxRetries: 3, initialDelay: 10 })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should throw for 401 unauthorized", async () => {
      const fn = jest.fn().mockRejectedValue({ statusCode: 401 });

      await expect(
        RetryHandler.withRetry(fn, { maxRetries: 3, initialDelay: 10 })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("should throw after max retries exceeded", async () => {
      const fn = jest.fn().mockRejectedValue({ code: "ETIMEDOUT" });

      await expect(
        RetryHandler.withRetry(fn, { maxRetries: 2, initialDelay: 10 })
      ).rejects.toThrow("Max retries");

      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe("getRateLimitWaitTime", () => {
    it("should calculate wait time from headers", () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 60;
      const headers = {
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": futureTimestamp.toString(),
      };

      const waitTime = RetryHandler.getRateLimitWaitTime(headers);

      expect(waitTime).toBeGreaterThan(0);
      expect(waitTime).toBeLessThanOrEqual(60000);
    });

    it("should return 0 when remaining is not 0", () => {
      const headers = {
        "x-ratelimit-remaining": "10",
        "x-ratelimit-reset": "1234567890",
      };

      const waitTime = RetryHandler.getRateLimitWaitTime(headers);

      expect(waitTime).toBe(0);
    });

    it("should return 0 when no headers", () => {
      const waitTime = RetryHandler.getRateLimitWaitTime({});

      expect(waitTime).toBe(0);
    });
  });

  describe("Default Configuration", () => {
    it("should use default config when none provided", async () => {
      const fn = jest.fn().mockResolvedValue("ok");

      await RetryHandler.withRetry(fn);

      expect(fn).toHaveBeenCalled();
    });
  });
});
