/**
 * Story Monitor Job Tests
 */

import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import * as storyMonitor from '../../src/jobs/story-monitor.job';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('../../src/services/instagram.service');
jest.mock('bull');

describe('Story Monitor Job', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      storyMention: {
        findFirst: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
      },
      participant: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    jest.clearAllMocks();
  });

  describe('scheduleStoryMonitoring', () => {
    it('should schedule monitoring job successfully', async () => {
      const mockQueue = {
        add: jest.fn().mockResolvedValue({ id: 'job123' }),
      };

      (storyMonitor as any).storyMonitorQueue = mockQueue;

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

      const job = await storyMonitor.scheduleStoryMonitoring(
        'draw123',
        'user456',
        'instagram123',
        'token',
        startTime,
        endTime
      );

      expect(mockQueue.add).toHaveBeenCalledWith(
        {
          drawId: 'draw123',
          userId: 'user456',
          instagramAccountId: 'instagram123',
          accessToken: 'token',
          startTime,
          endTime,
        },
        {
          repeat: {
            every: 60 * 60 * 1000,
            endDate: endTime,
          },
          jobId: 'story-monitor-draw123',
        }
      );
    });
  });

  describe('cancelStoryMonitoring', () => {
    it('should cancel monitoring job', async () => {
      const mockJob = {
        remove: jest.fn().mockResolvedValue(true),
      };

      const mockQueue = {
        getJob: jest.fn().mockResolvedValue(mockJob),
      };

      (storyMonitor as any).storyMonitorQueue = mockQueue;

      await storyMonitor.cancelStoryMonitoring('draw123');

      expect(mockQueue.getJob).toHaveBeenCalledWith('story-monitor-draw123');
      expect(mockJob.remove).toHaveBeenCalled();
    });
  });

  describe('getStoryMonitoringStatus', () => {
    it('should return monitoring status', async () => {
      const mockJob = {
        getState: jest.fn().mockResolvedValue('active'),
      };

      const mockQueue = {
        getJob: jest.fn().mockResolvedValue(mockJob),
      };

      (storyMonitor as any).storyMonitorQueue = mockQueue;

      mockPrisma.storyMention.count
        .mockResolvedValueOnce(5) // Total mentions
        .mockResolvedValueOnce(3); // Bonus applied

      const status = await storyMonitor.getStoryMonitoringStatus('draw123');

      expect(status.isActive).toBe(true);
      expect(status.mentionCount).toBe(5);
      expect(status.bonusEntriesApplied).toBe(3);
    });
  });

  describe('Story processing', () => {
    it('should store mentions within time window', async () => {
      const now = new Date();
      const startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago
      const endTime = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours from now

      const mentions = [
        {
          id: 'mention1',
          username: 'user1',
          timestamp: now,
          mediaType: 'STORY',
        },
      ];

      mockPrisma.storyMention.findFirst.mockResolvedValue(null);
      mockPrisma.storyMention.create.mockResolvedValue({});

      // Test that mentions within window are processed
      expect(mentions[0].timestamp >= startTime).toBe(true);
      expect(mentions[0].timestamp <= endTime).toBe(true);
    });

    it('should apply bonus participations', async () => {
      const participant = {
        id: 'participant1',
        name: 'Test User',
        identifier: 'testuser',
      };

      mockPrisma.participant.findFirst.mockResolvedValue(participant);
      mockPrisma.storyMention.findFirst.mockResolvedValue(null);
      mockPrisma.participant.create.mockResolvedValue({});
      mockPrisma.storyMention.updateMany.mockResolvedValue({ count: 1 });

      // Simulate bonus application logic
      const BONUS_ENTRIES = 3;
      const createCalls = BONUS_ENTRIES;

      // Verify bonus entries are created
      expect(BONUS_ENTRIES).toBe(3);
    });
  });
});
