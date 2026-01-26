import { describe, it, expect } from 'vitest';
import {
  calculatePasswordStrength,
  isValidEmail,
  validatePassword,
  sanitizeName,
  passwordsMatch,
} from '@/utils/validation';

describe('Validation Utils', () => {
  describe('calculatePasswordStrength', () => {
    it('should return weak for empty password', () => {
      const result = calculatePasswordStrength('');
      expect(result.score).toBe(0);
      expect(result.label).toBe('Weak');
    });

    it('should return weak for short password', () => {
      const result = calculatePasswordStrength('abc');
      expect(result.label).toBe('Weak');
      expect(result.suggestions).toContain('Use at least 8 characters');
    });

    it('should increase score for length >= 8', () => {
      const result = calculatePasswordStrength('abcdefgh');
      expect(result.score).toBeGreaterThanOrEqual(1);
    });

    it('should increase score for mixed case', () => {
      const result = calculatePasswordStrength('AbCdEfGh');
      expect(result.score).toBeGreaterThanOrEqual(2);
    });

    it('should increase score for numbers', () => {
      const result = calculatePasswordStrength('AbCd1234');
      expect(result.score).toBeGreaterThanOrEqual(3);
    });

    it('should return strong for complex password', () => {
      const result = calculatePasswordStrength('MyP@ssw0rd!123');
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(['Strong', 'Very Strong']).toContain(result.label);
    });

    it('should have green color for strong passwords', () => {
      const result = calculatePasswordStrength('MyP@ssw0rd!123');
      expect(result.color).toContain('green');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should return true for email with subdomain', () => {
      expect(isValidEmail('test@mail.example.com')).toBe(true);
    });

    it('should return true for email with plus sign', () => {
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should return false for missing @', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('should return false for missing domain', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should return false for missing local part', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should return false for spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should fail for empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail for short password', () => {
      const result = validatePassword('Ab1@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should fail for very long password', () => {
      const result = validatePassword('A'.repeat(129) + 'a1@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be less than 128 characters');
    });

    it('should fail without lowercase', () => {
      const result = validatePassword('ABCD1234@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must contain lowercase letters');
    });

    it('should fail without uppercase', () => {
      const result = validatePassword('abcd1234@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must contain uppercase letters');
    });

    it('should fail without numbers', () => {
      const result = validatePassword('Abcdefgh@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must contain numbers');
    });

    it('should fail without special characters', () => {
      const result = validatePassword('Abcd1234');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must contain special characters (@$!%*?&#)');
    });

    it('should pass for valid password', () => {
      const result = validatePassword('MyP@ssw0rd');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('sanitizeName', () => {
    it('should trim whitespace', () => {
      expect(sanitizeName('  John  ')).toBe('John');
    });

    it('should collapse multiple spaces', () => {
      expect(sanitizeName('John    Doe')).toBe('John Doe');
    });

    it('should handle already clean names', () => {
      expect(sanitizeName('John Doe')).toBe('John Doe');
    });

    it('should handle empty string', () => {
      expect(sanitizeName('')).toBe('');
    });
  });

  describe('passwordsMatch', () => {
    it('should return true for matching passwords', () => {
      expect(passwordsMatch('password123', 'password123')).toBe(true);
    });

    it('should return false for non-matching passwords', () => {
      expect(passwordsMatch('password123', 'password456')).toBe(false);
    });

    it('should return false for empty passwords', () => {
      expect(passwordsMatch('', '')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(passwordsMatch('Password', 'password')).toBe(false);
    });
  });
});
