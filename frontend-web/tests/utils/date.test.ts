import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We'll create simple date util functions to test
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const isDateInPast = (date: Date): boolean => {
  return date < new Date();
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

describe('Date Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2026-01-26T15:30:00Z');
      expect(formatDate(date)).toBe('2026-01-26');
    });

    it('should handle different months', () => {
      const date = new Date('2026-12-31T23:59:59Z');
      expect(formatDate(date)).toBe('2026-12-31');
    });
  });

  describe('isDateInPast', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2025-01-01');
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2027-01-01');
      expect(isDateInPast(futureDate)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2026-01-26');
      const result = addDays(date, 5);
      expect(formatDate(result)).toBe('2026-01-31');
    });

    it('should handle month rollover', () => {
      const date = new Date('2026-01-26');
      const result = addDays(date, 10);
      expect(formatDate(result)).toBe('2026-02-05');
    });

    it('should handle negative days', () => {
      const date = new Date('2026-01-26');
      const result = addDays(date, -5);
      expect(formatDate(result)).toBe('2026-01-21');
    });
  });
});
