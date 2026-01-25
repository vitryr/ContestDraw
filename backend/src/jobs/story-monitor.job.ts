/**
 * Story Share Detection Background Job
 * Monitors Instagram Mentions API for story shares during contest period
 * Implements 24h time window tracking and bonus participation logic
 */

import { PrismaClient } from '@prisma/client';
import { Queue, Worker, Job } from 'bull';
import { InstagramService } from '../services/instagram.service';
import logger from '../utils/logger';
import config from '../config/config';

const prisma = new PrismaClient();
const instagramService = new InstagramService();

// Create Bull queue for story monitoring
export const storyMonitorQueue = new Queue('story-monitor', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

interface StoryMonitorJobData {
  drawId: string;
  userId: string;
  instagramAccountId: string;
  accessToken: string;
  startTime: Date;
  endTime: Date;
}

interface StoryMentionData {
  id: string;
  username: string;
  userId?: string;
  timestamp: Date;
  mediaType: string;
}

/**
 * Process story monitoring job
 * Fetches mentions from Instagram API and stores them in database
 */
async function processStoryMonitor(job: Job<StoryMonitorJobData>): Promise<void> {
  const { drawId, userId, instagramAccountId, accessToken, startTime, endTime } = job.data;

  try {
    logger.info(`Processing story monitor for draw ${drawId}`, {
      drawId,
      userId,
      instagramAccountId,
    });

    // Update job progress
    await job.progress(10);

    // Fetch story mentions from Instagram API
    const mentions = await fetchStoryMentions(instagramAccountId, accessToken);
    await job.progress(40);

    // Filter mentions within the 24h time window
    const validMentions = filterMentionsByTimeWindow(mentions, startTime, endTime);
    await job.progress(60);

    // Store mentions in database
    const storedCount = await storeMentions(drawId, validMentions);
    await job.progress(80);

    // Apply bonus participations for users who shared
    await applyBonusParticipations(drawId, validMentions);
    await job.progress(100);

    logger.info(`Story monitor completed for draw ${drawId}`, {
      drawId,
      totalMentions: mentions.length,
      validMentions: validMentions.length,
      storedCount,
    });
  } catch (error) {
    logger.error(`Story monitor failed for draw ${drawId}`, {
      drawId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Fetch story mentions from Instagram Mentions API
 */
async function fetchStoryMentions(
  accountId: string,
  accessToken: string
): Promise<StoryMentionData[]> {
  try {
    const response = await instagramService.fetchStoryMentions(accountId, accessToken);

    return response.data.map((mention) => ({
      id: mention.id,
      username: mention.username,
      timestamp: new Date(mention.timestamp),
      mediaType: mention.media_type,
    }));
  } catch (error) {
    logger.error('Failed to fetch story mentions from Instagram', {
      accountId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error('Failed to fetch story mentions from Instagram API');
  }
}

/**
 * Filter mentions that fall within the 24h time window
 */
function filterMentionsByTimeWindow(
  mentions: StoryMentionData[],
  startTime: Date,
  endTime: Date
): StoryMentionData[] {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return mentions.filter((mention) => {
    const mentionTime = new Date(mention.timestamp);

    // Check if mention is within the contest period
    const inContestPeriod = mentionTime >= startTime && mentionTime <= endTime;

    // Check if mention is within last 24 hours (Instagram story lifespan)
    const withinStoryWindow = mentionTime >= twentyFourHoursAgo;

    return inContestPeriod && withinStoryWindow;
  });
}

/**
 * Store story mentions in database
 */
async function storeMentions(
  drawId: string,
  mentions: StoryMentionData[]
): Promise<number> {
  let storedCount = 0;

  for (const mention of mentions) {
    try {
      // Check if mention already exists
      const existing = await prisma.storyMention.findFirst({
        where: {
          drawId,
          instagramMediaId: mention.id,
          username: mention.username,
        },
      });

      if (!existing) {
        await prisma.storyMention.create({
          data: {
            drawId,
            instagramMediaId: mention.id,
            username: mention.username,
            userId: mention.userId,
            mentionedAt: mention.timestamp,
            verified: true,
            bonusApplied: false,
            metadata: {
              mediaType: mention.mediaType,
            },
          },
        });
        storedCount++;
      }
    } catch (error) {
      logger.error('Failed to store story mention', {
        drawId,
        mentionId: mention.id,
        username: mention.username,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return storedCount;
}

/**
 * Apply bonus participations for users who shared to stories
 * Adds bonus entries to increase their winning chances
 */
async function applyBonusParticipations(
  drawId: string,
  mentions: StoryMentionData[]
): Promise<void> {
  const BONUS_ENTRIES = 3; // Each story share gives 3 bonus entries

  for (const mention of mentions) {
    try {
      // Find existing participant
      const participant = await prisma.participant.findFirst({
        where: {
          drawId,
          identifier: mention.username,
        },
      });

      if (participant) {
        // Check if bonus already applied
        const storyMention = await prisma.storyMention.findFirst({
          where: {
            drawId,
            username: mention.username,
            bonusApplied: true,
          },
        });

        if (!storyMention) {
          // Create bonus entries (duplicate participant entries)
          for (let i = 0; i < BONUS_ENTRIES; i++) {
            await prisma.participant.create({
              data: {
                drawId,
                name: participant.name,
                identifier: participant.identifier,
                source: 'STORY_BONUS',
                metadata: {
                  originalParticipantId: participant.id,
                  storyMentionId: mention.id,
                  bonusEntry: true,
                },
              },
            });
          }

          // Mark bonus as applied
          await prisma.storyMention.updateMany({
            where: {
              drawId,
              username: mention.username,
            },
            data: {
              bonusApplied: true,
            },
          });

          logger.info('Applied bonus participations for story share', {
            drawId,
            username: mention.username,
            bonusEntries: BONUS_ENTRIES,
          });
        }
      }
    } catch (error) {
      logger.error('Failed to apply bonus participation', {
        drawId,
        username: mention.username,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

/**
 * Schedule story monitoring for a draw
 */
export async function scheduleStoryMonitoring(
  drawId: string,
  userId: string,
  instagramAccountId: string,
  accessToken: string,
  startTime: Date,
  endTime: Date
): Promise<Job<StoryMonitorJobData>> {
  const jobData: StoryMonitorJobData = {
    drawId,
    userId,
    instagramAccountId,
    accessToken,
    startTime,
    endTime,
  };

  // Schedule job to run every hour during the contest period
  const job = await storyMonitorQueue.add(jobData, {
    repeat: {
      every: 60 * 60 * 1000, // Every hour
      endDate: endTime,
    },
    jobId: `story-monitor-${drawId}`,
  });

  logger.info('Scheduled story monitoring job', {
    drawId,
    jobId: job.id,
    startTime,
    endTime,
  });

  return job;
}

/**
 * Cancel story monitoring for a draw
 */
export async function cancelStoryMonitoring(drawId: string): Promise<void> {
  const jobId = `story-monitor-${drawId}`;
  const job = await storyMonitorQueue.getJob(jobId);

  if (job) {
    await job.remove();
    logger.info('Cancelled story monitoring job', { drawId, jobId });
  }
}

/**
 * Get story monitoring status for a draw
 */
export async function getStoryMonitoringStatus(drawId: string): Promise<{
  isActive: boolean;
  mentionCount: number;
  bonusEntriesApplied: number;
}> {
  const jobId = `story-monitor-${drawId}`;
  const job = await storyMonitorQueue.getJob(jobId);

  const mentions = await prisma.storyMention.count({
    where: { drawId },
  });

  const bonusApplied = await prisma.storyMention.count({
    where: { drawId, bonusApplied: true },
  });

  return {
    isActive: !!job && (await job.getState()) === 'active',
    mentionCount: mentions,
    bonusEntriesApplied: bonusApplied,
  };
}

// Initialize worker to process jobs
const storyMonitorWorker = new Worker('story-monitor', processStoryMonitor, {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
  concurrency: 5,
});

storyMonitorWorker.on('completed', (job) => {
  logger.info('Story monitor job completed', { jobId: job.id });
});

storyMonitorWorker.on('failed', (job, error) => {
  logger.error('Story monitor job failed', {
    jobId: job?.id,
    error: error.message,
  });
});

export default storyMonitorWorker;
