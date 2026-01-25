/**
 * Follower Verification Service Tests
 */

import followerVerificationService from '../../src/services/follower-verification.service';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    followerVerification: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('FollowerVerificationService', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('verifyInstagramFollower', () => {
    it('should verify follower successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', username: 'testuser' },
            { id: '2', username: 'otheruser' },
          ],
          paging: {
            cursors: { after: null },
            next: null,
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await followerVerificationService.verifyInstagramFollower(
        'testuser',
        'account123',
        'token'
      );

      expect(result).toBe(true);
    });

    it('should return false if user not found in followers', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', username: 'otheruser' },
          ],
          paging: {
            cursors: { after: null },
            next: null,
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await followerVerificationService.verifyInstagramFollower(
        'testuser',
        'account123',
        'token'
      );

      expect(result).toBe(false);
    });
  });

  describe('verifyFacebookPageLike', () => {
    it('should verify page like successfully', async () => {
      const mockResponse = {
        data: { data: true },
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await followerVerificationService.verifyFacebookPageLike(
        'user123',
        'page456',
        'token'
      );

      expect(result).toBe(true);
    });

    it('should return false for 404 error', async () => {
      const error = {
        response: { status: 404 },
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      } as any);
      mockedAxios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = await followerVerificationService.verifyFacebookPageLike(
        'user123',
        'page456',
        'token'
      );

      expect(result).toBe(false);
    });
  });

  describe('batchVerify', () => {
    it('should verify multiple users', async () => {
      const requests = [
        {
          username: 'user1',
          platform: 'instagram' as const,
          targetAccount: 'account1',
        },
        {
          username: 'user2',
          platform: 'instagram' as const,
          targetAccount: 'account1',
        },
      ];

      jest.spyOn(followerVerificationService, 'verifyInstagramFollower')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      prisma.followerVerification.create.mockResolvedValue({});

      const results = await followerVerificationService.batchVerify(
        'draw123',
        requests,
        { instagram: 'token' }
      );

      expect(results).toHaveLength(2);
      expect(results[0].isFollowing).toBe(true);
      expect(results[1].isFollowing).toBe(false);
    });

    it('should handle verification errors', async () => {
      const requests = [
        {
          username: 'user1',
          platform: 'instagram' as const,
          targetAccount: 'account1',
        },
      ];

      jest.spyOn(followerVerificationService, 'verifyInstagramFollower')
        .mockRejectedValue(new Error('API Error'));

      prisma.followerVerification.create.mockResolvedValue({});

      const results = await followerVerificationService.batchVerify(
        'draw123',
        requests,
        { instagram: 'token' }
      );

      expect(results).toHaveLength(1);
      expect(results[0].error).toBeDefined();
      expect(results[0].isFollowing).toBe(false);
    });
  });

  describe('getVerificationResults', () => {
    it('should retrieve verification results', async () => {
      const mockResults = [
        {
          username: 'user1',
          platform: 'instagram',
          targetAccount: 'account1',
          isFollowing: true,
          verifiedAt: new Date(),
          metadata: null,
        },
      ];

      prisma.followerVerification.findMany.mockResolvedValue(mockResults);

      const results = await followerVerificationService.getVerificationResults(
        'draw123'
      );

      expect(results).toHaveLength(1);
      expect(results[0].username).toBe('user1');
      expect(results[0].isFollowing).toBe(true);
    });
  });

  describe('filterVerifiedFollowers', () => {
    it('should filter participants by verification status', async () => {
      const mockVerifications = [
        {
          username: 'user1',
          isFollowing: true,
        },
        {
          username: 'user2',
          isFollowing: false,
        },
      ];

      prisma.followerVerification.findMany.mockResolvedValue(mockVerifications);

      const participants = [
        { username: 'user1' },
        { username: 'user2' },
        { username: 'user3' },
      ];

      const results = await followerVerificationService.filterVerifiedFollowers(
        'draw123',
        participants
      );

      expect(results).toHaveLength(3);
      expect(results[0].isFollowing).toBe(true);
      expect(results[1].isFollowing).toBe(false);
      expect(results[2].isFollowing).toBe(false); // Not verified
    });
  });
});
