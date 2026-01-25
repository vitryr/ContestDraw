/**
 * Certificate Service Tests
 * Tests for PDF generation and cryptographic hashing
 */

import { CertificateService } from '../../backend/src/services/certificate.service';
import { DrawResult, DrawFilters } from '../../backend/src/types/draw.types';

describe('CertificateService', () => {
  let certificateService: CertificateService;

  beforeEach(() => {
    certificateService = new CertificateService();
  });

  describe('generateCertificate', () => {
    it('should generate certificate with hash', async () => {
      const drawResult: DrawResult = {
        drawId: 'test-draw-1',
        timestamp: new Date(),
        totalParticipants: 100,
        eligibleParticipants: 80,
        winners: [
          {
            participant: {
              id: '1',
              username: 'winner1',
              comment: 'I won!',
              timestamp: new Date(),
              mentions: [],
              hashtags: []
            },
            position: 1,
            selectedAt: new Date(),
            seed: 'test-seed-1'
          }
        ],
        alternates: [
          {
            participant: {
              id: '2',
              username: 'alternate1',
              comment: 'Almost won!',
              timestamp: new Date(),
              mentions: [],
              hashtags: []
            },
            position: 1,
            selectedAt: new Date(),
            seed: 'test-seed-2'
          }
        ],
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: 5,
          minMentions: 1,
          verifyFollowing: false
        },
        algorithm: 'Fisher-Yates Shuffle with Crypto Random'
      };

      const { buffer, hash } = await certificateService.generateCertificate(drawResult);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      expect(hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex string
    });

    it('should generate different hashes for different draws', async () => {
      const drawResult1: DrawResult = {
        drawId: 'test-draw-1',
        timestamp: new Date(),
        totalParticipants: 100,
        eligibleParticipants: 80,
        winners: [{
          participant: {
            id: '1',
            username: 'winner1',
            comment: 'Won',
            timestamp: new Date(),
            mentions: [],
            hashtags: []
          },
          position: 1,
          selectedAt: new Date(),
          seed: 'seed1'
        }],
        alternates: [],
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: false
        },
        algorithm: 'Fisher-Yates'
      };

      const drawResult2: DrawResult = {
        ...drawResult1,
        drawId: 'test-draw-2',
        winners: [{
          participant: {
            id: '2',
            username: 'winner2',
            comment: 'Won too',
            timestamp: new Date(),
            mentions: [],
            hashtags: []
          },
          position: 1,
          selectedAt: new Date(),
          seed: 'seed2'
        }]
      };

      const cert1 = await certificateService.generateCertificate(drawResult1);
      const cert2 = await certificateService.generateCertificate(drawResult2);

      expect(cert1.hash).not.toBe(cert2.hash);
    });

    it('should generate consistent hashes for identical data', async () => {
      const drawResult: DrawResult = {
        drawId: 'test-draw-1',
        timestamp: new Date('2024-01-01'),
        totalParticipants: 100,
        eligibleParticipants: 80,
        winners: [{
          participant: {
            id: '1',
            username: 'winner1',
            comment: 'Won',
            timestamp: new Date('2024-01-01'),
            mentions: [],
            hashtags: []
          },
          position: 1,
          selectedAt: new Date('2024-01-01'),
          seed: 'seed1'
        }],
        alternates: [],
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: false
        },
        algorithm: 'Fisher-Yates'
      };

      const cert1 = await certificateService.generateCertificate(drawResult);
      const cert2 = await certificateService.generateCertificate(drawResult);

      expect(cert1.hash).toBe(cert2.hash);
    });
  });

  describe('verifyCertificate', () => {
    it('should verify valid certificate', () => {
      const certificateData = {
        drawId: 'test-draw',
        timestamp: new Date(),
        totalParticipants: 100,
        eligibleParticipants: 80,
        winnersCount: 3,
        alternatesCount: 2,
        algorithm: 'Fisher-Yates',
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: false
        },
        winners: [],
        alternates: []
      };

      // Generate hash
      const hash = (certificateService as any).generateHash(certificateData);

      // Verify
      const isValid = certificateService.verifyCertificate(certificateData, hash);
      expect(isValid).toBe(true);
    });

    it('should reject tampered certificate', () => {
      const certificateData = {
        drawId: 'test-draw',
        timestamp: new Date(),
        totalParticipants: 100,
        eligibleParticipants: 80,
        winnersCount: 3,
        alternatesCount: 2,
        algorithm: 'Fisher-Yates',
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: false
        },
        winners: [],
        alternates: []
      };

      const hash = (certificateService as any).generateHash(certificateData);

      // Tamper with data
      certificateData.totalParticipants = 200;

      const isValid = certificateService.verifyCertificate(certificateData, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('PDF Generation', () => {
    it('should generate valid PDF buffer', async () => {
      const drawResult: DrawResult = {
        drawId: 'test-draw',
        timestamp: new Date(),
        totalParticipants: 50,
        eligibleParticipants: 45,
        winners: [
          {
            participant: {
              id: '1',
              username: 'winner1',
              comment: 'Great!',
              timestamp: new Date(),
              mentions: ['brand'],
              hashtags: ['contest']
            },
            position: 1,
            selectedAt: new Date(),
            seed: 'seed1'
          },
          {
            participant: {
              id: '2',
              username: 'winner2',
              comment: 'Awesome!',
              timestamp: new Date(),
              mentions: ['brand'],
              hashtags: ['contest']
            },
            position: 2,
            selectedAt: new Date(),
            seed: 'seed2'
          }
        ],
        alternates: [
          {
            participant: {
              id: '3',
              username: 'alternate1',
              comment: 'Next time!',
              timestamp: new Date(),
              mentions: ['brand'],
              hashtags: ['contest']
            },
            position: 1,
            selectedAt: new Date(),
            seed: 'seed3'
          }
        ],
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: 5,
          minMentions: 1,
          requiredHashtag: '#contest',
          verifyFollowing: false
        },
        algorithm: 'Fisher-Yates Shuffle'
      };

      const { buffer } = await certificateService.generateCertificate(drawResult);

      // Check PDF signature
      expect(buffer.toString('utf8', 0, 4)).toBe('%PDF');
      expect(buffer.length).toBeGreaterThan(1000); // Reasonable size check
    });
  });
});
