/**
 * Tests for Public Verification System
 * Run with: npm test tests/verification.test.ts
 */

import {
  generateDrawHash,
  verifyDrawHash,
  generateVerificationCode,
  formatHashForDisplay,
  generateRandomSeed,
} from '../backend/src/utils/hash.util';

import {
  generateShortCode,
  createShareableLink,
  resolveShortCode,
  generateSocialShareUrls,
  generateEmbedCode,
} from '../backend/src/services/sharing.service';

describe('Hash Verification System', () => {
  const mockDrawData = {
    drawId: 'test-draw-123',
    timestamp: '2025-11-05T10:00:00.000Z',
    participants: [
      { id: 'p1', name: 'User 1', username: 'user1' },
      { id: 'p2', name: 'User 2', username: 'user2' },
    ],
    winners: [
      { id: 'w1', position: 1, participantId: 'p1' },
    ],
    randomSeed: 'test-seed-123',
    filters: { minFollowers: 100 },
    algorithm: 'Cryptographically Secure PRNG',
  };

  describe('generateDrawHash', () => {
    it('should generate a 64-character SHA-256 hash', () => {
      const hash = generateDrawHash(mockDrawData);
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate the same hash for identical data', () => {
      const hash1 = generateDrawHash(mockDrawData);
      const hash2 = generateDrawHash(mockDrawData);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different data', () => {
      const hash1 = generateDrawHash(mockDrawData);
      const modifiedData = { ...mockDrawData, drawId: 'different-draw' };
      const hash2 = generateDrawHash(modifiedData);
      expect(hash1).not.toBe(hash2);
    });

    it('should be deterministic regardless of participant order', () => {
      const data1 = {
        ...mockDrawData,
        participants: [
          { id: 'p2', name: 'User 2', username: 'user2' },
          { id: 'p1', name: 'User 1', username: 'user1' },
        ],
      };
      const hash1 = generateDrawHash(mockDrawData);
      const hash2 = generateDrawHash(data1);
      // Should be the same because participants are sorted by ID
      expect(hash1).toBe(hash2);
    });
  });

  describe('verifyDrawHash', () => {
    it('should verify correct hash', () => {
      const hash = generateDrawHash(mockDrawData);
      const isValid = verifyDrawHash(mockDrawData, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect hash', () => {
      const incorrectHash = 'a'.repeat(64);
      const isValid = verifyDrawHash(mockDrawData, incorrectHash);
      expect(isValid).toBe(false);
    });

    it('should reject tampered data', () => {
      const originalHash = generateDrawHash(mockDrawData);
      const tamperedData = { ...mockDrawData, winnersCount: 999 };
      const isValid = verifyDrawHash(tamperedData, originalHash);
      expect(isValid).toBe(false);
    });
  });

  describe('generateVerificationCode', () => {
    it('should generate 12-character code', () => {
      const hash = 'a1b2c3d4e5f6' + '0'.repeat(52);
      const code = generateVerificationCode(hash);
      expect(code).toHaveLength(12);
      expect(code).toBe('A1B2C3D4E5F6');
    });

    it('should be uppercase', () => {
      const hash = generateDrawHash(mockDrawData);
      const code = generateVerificationCode(hash);
      expect(code).toMatch(/^[A-F0-9]{12}$/);
    });
  });

  describe('formatHashForDisplay', () => {
    it('should format hash in 4-character blocks', () => {
      const hash = 'a1b2c3d4e5f6';
      const formatted = formatHashForDisplay(hash);
      expect(formatted).toBe('a1b2 c3d4 e5f6');
    });
  });

  describe('generateRandomSeed', () => {
    it('should generate 64-character hex string', () => {
      const seed = generateRandomSeed();
      expect(seed).toHaveLength(64);
      expect(seed).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate different seeds each time', () => {
      const seed1 = generateRandomSeed();
      const seed2 = generateRandomSeed();
      expect(seed1).not.toBe(seed2);
    });
  });
});

describe('Shareable Links Service', () => {
  const mockDrawId = 'test-draw-123';
  const mockBaseUrl = 'https://contestdraw.com';

  describe('generateShortCode', () => {
    it('should generate 8-character code', () => {
      const code = generateShortCode(mockDrawId);
      expect(code).toHaveLength(8);
    });

    it('should be deterministic', () => {
      const code1 = generateShortCode(mockDrawId);
      const code2 = generateShortCode(mockDrawId);
      expect(code1).toBe(code2);
    });

    it('should generate different codes for different IDs', () => {
      const code1 = generateShortCode('draw-1');
      const code2 = generateShortCode('draw-2');
      expect(code1).not.toBe(code2);
    });
  });

  describe('createShareableLink', () => {
    it('should create link with all required fields', async () => {
      const link = await createShareableLink(mockDrawId, mockBaseUrl);

      expect(link).toHaveProperty('shortCode');
      expect(link).toHaveProperty('fullUrl');
      expect(link).toHaveProperty('qrCodeUrl');
      expect(link).toHaveProperty('drawId', mockDrawId);
    });

    it('should generate correct URLs', async () => {
      const link = await createShareableLink(mockDrawId, mockBaseUrl);

      expect(link.fullUrl).toContain('/v/');
      expect(link.qrCodeUrl).toContain('/api/public/qr/');
    });

    it('should support expiration', async () => {
      const link = await createShareableLink(mockDrawId, mockBaseUrl, 7);
      expect(link.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('resolveShortCode', () => {
    it('should resolve code to draw ID', async () => {
      const link = await createShareableLink(mockDrawId, mockBaseUrl);
      const resolvedId = resolveShortCode(link.shortCode);
      expect(resolvedId).toBe(mockDrawId);
    });

    it('should return null for invalid code', () => {
      const resolvedId = resolveShortCode('invalid-code');
      expect(resolvedId).toBeNull();
    });
  });

  describe('generateSocialShareUrls', () => {
    const mockTitle = 'Test Draw';

    it('should generate URLs for all platforms', () => {
      const urls = generateSocialShareUrls(mockDrawId, mockTitle, mockBaseUrl);

      expect(urls).toHaveProperty('twitter');
      expect(urls).toHaveProperty('facebook');
      expect(urls).toHaveProperty('linkedin');
      expect(urls).toHaveProperty('whatsapp');
      expect(urls).toHaveProperty('telegram');
    });

    it('should properly encode URLs', () => {
      const urls = generateSocialShareUrls(mockDrawId, mockTitle, mockBaseUrl);

      Object.values(urls).forEach(url => {
        expect(url).toContain('https://');
        expect(url).not.toContain(' ');
      });
    });

    it('should include verification URL', () => {
      const urls = generateSocialShareUrls(mockDrawId, mockTitle, mockBaseUrl);
      const verifyUrl = `${mockBaseUrl}/verify/${mockDrawId}`;

      Object.values(urls).forEach(url => {
        expect(url).toContain(encodeURIComponent(verifyUrl));
      });
    });
  });

  describe('generateEmbedCode', () => {
    it('should generate valid iframe code', () => {
      const embedCode = generateEmbedCode(
        { drawId: mockDrawId, width: 600, height: 400 },
        mockBaseUrl
      );

      expect(embedCode).toContain('<iframe');
      expect(embedCode).toContain('src=');
      expect(embedCode).toContain('width="600"');
      expect(embedCode).toContain('height="400"');
      expect(embedCode).toContain('</iframe>');
    });

    it('should support theme configuration', () => {
      const embedCode = generateEmbedCode(
        { drawId: mockDrawId, theme: 'dark' },
        mockBaseUrl
      );

      expect(embedCode).toContain('theme=dark');
    });

    it('should support participant visibility', () => {
      const embedCode = generateEmbedCode(
        { drawId: mockDrawId, showParticipants: true },
        mockBaseUrl
      );

      expect(embedCode).toContain('participants=true');
    });
  });
});

describe('Integration Tests', () => {
  it('should create complete verification flow', async () => {
    const mockDrawId = 'integration-test-draw';
    const mockBaseUrl = 'https://contestdraw.com';

    // 1. Generate hash
    const drawData = {
      drawId: mockDrawId,
      timestamp: new Date().toISOString(),
      participants: [
        { id: 'p1', name: 'User 1', username: 'user1' },
      ],
      winners: [
        { id: 'w1', position: 1, participantId: 'p1' },
      ],
      randomSeed: generateRandomSeed(),
      filters: {},
      algorithm: 'Cryptographically Secure PRNG',
    };

    const hash = generateDrawHash(drawData);
    const verificationCode = generateVerificationCode(hash);

    // 2. Create shareable link
    const shareableLink = await createShareableLink(mockDrawId, mockBaseUrl);

    // 3. Generate social share URLs
    const socialUrls = generateSocialShareUrls(
      mockDrawId,
      'Integration Test Draw',
      mockBaseUrl
    );

    // 4. Verify everything is connected
    expect(hash).toHaveLength(64);
    expect(verificationCode).toHaveLength(12);
    expect(shareableLink.drawId).toBe(mockDrawId);
    expect(Object.keys(socialUrls)).toHaveLength(5);

    // 5. Verify hash verification works
    const isValid = verifyDrawHash(drawData, hash);
    expect(isValid).toBe(true);
  });
});

describe('Edge Cases', () => {
  describe('Hash with special characters', () => {
    it('should handle special characters in participant names', () => {
      const data = {
        drawId: 'test',
        timestamp: '2025-11-05T10:00:00.000Z',
        participants: [
          { id: 'p1', name: 'User "Special" Name', username: 'user1' },
        ],
        winners: [],
        randomSeed: 'seed',
        filters: {},
        algorithm: 'PRNG',
      };

      const hash = generateDrawHash(data);
      expect(hash).toHaveLength(64);
      expect(verifyDrawHash(data, hash)).toBe(true);
    });
  });

  describe('Large datasets', () => {
    it('should handle many participants efficiently', () => {
      const participants = Array.from({ length: 10000 }, (_, i) => ({
        id: `p${i}`,
        name: `User ${i}`,
        username: `user${i}`,
      }));

      const data = {
        drawId: 'large-draw',
        timestamp: '2025-11-05T10:00:00.000Z',
        participants,
        winners: [{ id: 'w1', position: 1, participantId: 'p1' }],
        randomSeed: 'seed',
        filters: {},
        algorithm: 'PRNG',
      };

      const startTime = Date.now();
      const hash = generateDrawHash(data);
      const endTime = Date.now();

      expect(hash).toHaveLength(64);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in < 1s
    });
  });
});
