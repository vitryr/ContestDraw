/**
 * Blacklist Service Tests
 */

import { PrismaClient } from '@prisma/client';
import blacklistService from '../../src/services/blacklist.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    blacklist: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('BlacklistService', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('addToBlacklist', () => {
    it('should add user to blacklist successfully', async () => {
      const mockBlacklist = {
        id: '1',
        userId: 'user1',
        username: 'testuser',
        platform: 'INSTAGRAM',
        reason: 'Spam',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.blacklist.create.mockResolvedValue(mockBlacklist);

      const result = await blacklistService.addToBlacklist('user1', {
        username: 'testuser',
        platform: 'INSTAGRAM',
        reason: 'Spam',
      });

      expect(result).toEqual(mockBlacklist);
      expect(prisma.blacklist.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          username: 'testuser',
          platform: 'INSTAGRAM',
          reason: 'Spam',
        },
      });
    });

    it('should throw error if user already exists', async () => {
      const error = new Error('Unique constraint violation');
      (error as any).code = 'P2002';
      prisma.blacklist.create.mockRejectedValue(error);

      await expect(
        blacklistService.addToBlacklist('user1', {
          username: 'testuser',
        })
      ).rejects.toThrow('User already exists in blacklist');
    });
  });

  describe('getBlacklist', () => {
    it('should retrieve all blacklisted users', async () => {
      const mockBlacklist = [
        {
          id: '1',
          userId: 'user1',
          username: 'testuser1',
          platform: 'INSTAGRAM',
          reason: 'Spam',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          username: 'testuser2',
          platform: 'INSTAGRAM',
          reason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prisma.blacklist.findMany.mockResolvedValue(mockBlacklist);

      const result = await blacklistService.getBlacklist('user1');

      expect(result).toEqual(mockBlacklist);
      expect(prisma.blacklist.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by platform', async () => {
      prisma.blacklist.findMany.mockResolvedValue([]);

      await blacklistService.getBlacklist('user1', { platform: 'FACEBOOK' });

      expect(prisma.blacklist.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1', platform: 'FACEBOOK' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should search by username', async () => {
      prisma.blacklist.findMany.mockResolvedValue([]);

      await blacklistService.getBlacklist('user1', { search: 'test' });

      expect(prisma.blacklist.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          username: { contains: 'test' },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('isBlacklisted', () => {
    it('should return true if user is blacklisted', async () => {
      prisma.blacklist.findFirst.mockResolvedValue({ id: '1' });

      const result = await blacklistService.isBlacklisted(
        'user1',
        'testuser',
        'INSTAGRAM'
      );

      expect(result).toBe(true);
    });

    it('should return false if user is not blacklisted', async () => {
      prisma.blacklist.findFirst.mockResolvedValue(null);

      const result = await blacklistService.isBlacklisted(
        'user1',
        'testuser',
        'INSTAGRAM'
      );

      expect(result).toBe(false);
    });
  });

  describe('bulkAddToBlacklist', () => {
    it('should add multiple users successfully', async () => {
      prisma.blacklist.create
        .mockResolvedValueOnce({ id: '1' })
        .mockResolvedValueOnce({ id: '2' });

      const entries = [
        { username: 'user1' },
        { username: 'user2' },
      ];

      const result = await blacklistService.bulkAddToBlacklist('user1', entries);

      expect(result.successCount).toBe(2);
      expect(result.errorCount).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle partial failures', async () => {
      prisma.blacklist.create
        .mockResolvedValueOnce({ id: '1' })
        .mockRejectedValueOnce(new Error('Failed'));

      const entries = [
        { username: 'user1' },
        { username: 'user2' },
      ];

      const result = await blacklistService.bulkAddToBlacklist('user1', entries);

      expect(result.successCount).toBe(1);
      expect(result.errorCount).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('filterParticipants', () => {
    it('should identify blacklisted participants', async () => {
      const mockBlacklist = [
        {
          username: 'blacklisted1',
          platform: 'INSTAGRAM',
        },
      ];

      prisma.blacklist.findMany.mockResolvedValue(mockBlacklist);

      const participants = [
        { username: 'blacklisted1' },
        { username: 'valid1' },
      ];

      const result = await blacklistService.filterParticipants(
        'user1',
        participants,
        'INSTAGRAM'
      );

      expect(result).toHaveLength(2);
      expect(result[0].isBlacklisted).toBe(true);
      expect(result[1].isBlacklisted).toBe(false);
    });
  });

  describe('getBlacklistStats', () => {
    it('should return statistics', async () => {
      const mockBlacklist = [
        { platform: 'INSTAGRAM' },
        { platform: 'INSTAGRAM' },
        { platform: 'FACEBOOK' },
      ];

      prisma.blacklist.findMany.mockResolvedValue(mockBlacklist);

      const result = await blacklistService.getBlacklistStats('user1');

      expect(result.totalCount).toBe(3);
      expect(result.byPlatform.INSTAGRAM).toBe(2);
      expect(result.byPlatform.FACEBOOK).toBe(1);
    });
  });

  describe('clearBlacklist', () => {
    it('should clear all entries', async () => {
      prisma.blacklist.deleteMany.mockResolvedValue({ count: 5 });

      const result = await blacklistService.clearBlacklist('user1');

      expect(result).toBe(5);
      expect(prisma.blacklist.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
    });

    it('should clear entries for specific platform', async () => {
      prisma.blacklist.deleteMany.mockResolvedValue({ count: 3 });

      const result = await blacklistService.clearBlacklist('user1', 'INSTAGRAM');

      expect(result).toBe(3);
      expect(prisma.blacklist.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user1', platform: 'INSTAGRAM' },
      });
    });
  });
});
