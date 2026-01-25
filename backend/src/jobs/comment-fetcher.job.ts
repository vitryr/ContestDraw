/**
 * Comment Fetcher Background Job
 * Fetches comments/participants from social media posts
 * Supports Instagram, Facebook, Twitter, TikTok, YouTube
 */

import { PrismaClient } from '@prisma/client';
import Queue, { Job } from 'bull';
import { InstagramService } from '../services/instagram.service';
import { FacebookService } from '../services/facebook.service';
import { TwitterService } from '../services/twitter.service';
import { TikTokService } from '../services/tiktok.service';
import { logger } from '../utils/logger';
import config from '../config/config';

const prisma = new PrismaClient();

// Service instances
const instagramService = new InstagramService();
const facebookService = new FacebookService();
const twitterService = new TwitterService();
const tiktokService = new TikTokService();

// Create Bull queue for comment fetching
export const commentFetcherQueue = new Queue('comment-fetcher', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'youtube';

interface CommentFetcherJobData {
  drawId: string;
  userId: string;
  platform: SocialPlatform;
  postUrl: string;
  accessToken?: string;
  maxComments?: number;
  filters?: {
    excludeDuplicates?: boolean;
    requireFollowing?: boolean;
    minMentions?: number;
    requiredHashtags?: string[];
    excludeKeywords?: string[];
  };
}

interface FetchedComment {
  id: string;
  text: string;
  username: string;
  userId?: string;
  timestamp: Date;
  likes?: number;
  mentions?: string[];
  hashtags?: string[];
}

interface FetchResult {
  total: number;
  valid: number;
  duplicates: number;
  filtered: number;
}

/**
 * Process comment fetching job
 */
async function processCommentFetcher(job: Job<CommentFetcherJobData>): Promise<FetchResult> {
  const { drawId, userId, platform, postUrl, accessToken, maxComments, filters } = job.data;

  const result: FetchResult = {
    total: 0,
    valid: 0,
    duplicates: 0,
    filtered: 0,
  };

  try {
    logger.info(`Starting comment fetch for draw ${drawId}`, {
      drawId,
      platform,
      postUrl,
    });

    // Update draw status to PROCESSING
    await prisma.draw.update({
      where: { id: drawId },
      data: { status: 'PROCESSING' },
    });

    await job.progress(10);

    // Fetch comments from the appropriate platform
    const comments = await fetchComments(platform, postUrl, accessToken, maxComments);
    result.total = comments.length;

    await job.progress(40);

    // Apply filters
    const { validComments, filteredCount, duplicateCount } = await applyFilters(
      drawId,
      comments,
      filters
    );
    result.filtered = filteredCount;
    result.duplicates = duplicateCount;

    await job.progress(70);

    // Store participants in database
    const storedCount = await storeParticipants(drawId, platform, validComments);
    result.valid = storedCount;

    await job.progress(90);

    // Update draw status to READY
    await prisma.draw.update({
      where: { id: drawId },
      data: { status: 'READY' },
    });

    await job.progress(100);

    logger.info(`Comment fetch completed for draw ${drawId}`, {
      drawId,
      ...result,
    });

    return result;
  } catch (error) {
    // Update draw status to FAILED
    await prisma.draw.update({
      where: { id: drawId },
      data: { status: 'FAILED' },
    });

    logger.error(`Comment fetch failed for draw ${drawId}`, {
      drawId,
      platform,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Fetch comments from the specified social platform
 */
async function fetchComments(
  platform: SocialPlatform,
  postUrl: string,
  accessToken?: string,
  maxComments?: number
): Promise<FetchedComment[]> {
  switch (platform) {
    case 'instagram':
      return fetchInstagramComments(postUrl, accessToken!, maxComments);

    case 'facebook':
      return fetchFacebookComments(postUrl, accessToken!, maxComments);

    case 'twitter':
      return fetchTwitterComments(postUrl, accessToken, maxComments);

    case 'tiktok':
      return fetchTikTokComments(postUrl, accessToken, maxComments);

    case 'youtube':
      return fetchYouTubeComments(postUrl, maxComments);

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Fetch Instagram comments
 */
async function fetchInstagramComments(
  postUrl: string,
  accessToken: string,
  maxComments?: number
): Promise<FetchedComment[]> {
  const response = await instagramService.fetchComments(postUrl, accessToken, maxComments);

  return response.data.map((comment) => ({
    id: comment.id,
    text: comment.text,
    username: comment.username,
    userId: comment.userId,
    timestamp: comment.timestamp,
    likes: comment.likes,
    mentions: extractMentions(comment.text),
    hashtags: extractHashtags(comment.text),
  }));
}

/**
 * Fetch Facebook comments
 */
async function fetchFacebookComments(
  postUrl: string,
  accessToken: string,
  maxComments?: number
): Promise<FetchedComment[]> {
  const response = await facebookService.fetchComments(postUrl, accessToken, maxComments);

  return response.data.map((comment) => ({
    id: comment.id,
    text: comment.text,
    username: comment.username,
    userId: comment.userId,
    timestamp: comment.timestamp,
    likes: comment.likes,
    mentions: extractMentions(comment.text),
    hashtags: extractHashtags(comment.text),
  }));
}

/**
 * Fetch Twitter/X comments (replies)
 */
async function fetchTwitterComments(
  postUrl: string,
  accessToken?: string,
  maxComments?: number
): Promise<FetchedComment[]> {
  const response = await twitterService.fetchReplies(postUrl, accessToken, maxComments);

  return response.data.map((reply) => ({
    id: reply.id,
    text: reply.text,
    username: reply.username,
    userId: reply.userId,
    timestamp: reply.timestamp,
    likes: reply.likes,
    mentions: extractMentions(reply.text),
    hashtags: extractHashtags(reply.text),
  }));
}

/**
 * Fetch TikTok comments
 */
async function fetchTikTokComments(
  postUrl: string,
  accessToken?: string,
  maxComments?: number
): Promise<FetchedComment[]> {
  const response = await tiktokService.fetchComments(postUrl, accessToken, maxComments);

  return response.data.map((comment) => ({
    id: comment.id,
    text: comment.text,
    username: comment.username,
    userId: comment.userId,
    timestamp: comment.timestamp,
    likes: comment.likes,
    mentions: extractMentions(comment.text),
    hashtags: extractHashtags(comment.text),
  }));
}

/**
 * Fetch YouTube comments
 * Note: YouTube API doesn't require user access token, uses API key
 */
async function fetchYouTubeComments(
  postUrl: string,
  maxComments?: number
): Promise<FetchedComment[]> {
  // TODO: Implement YouTube Data API v3 integration
  logger.warn('YouTube comment fetching not yet implemented');
  return [];
}

/**
 * Extract @mentions from text
 */
function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map((m) => m.slice(1).toLowerCase()) : [];
}

/**
 * Extract #hashtags from text
 */
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map((h) => h.slice(1).toLowerCase()) : [];
}

/**
 * Apply filters to comments
 */
async function applyFilters(
  drawId: string,
  comments: FetchedComment[],
  filters?: CommentFetcherJobData['filters']
): Promise<{
  validComments: FetchedComment[];
  filteredCount: number;
  duplicateCount: number;
}> {
  let validComments = [...comments];
  let filteredCount = 0;
  let duplicateCount = 0;

  // 1. Remove duplicates (same username)
  if (filters?.excludeDuplicates !== false) {
    const seen = new Set<string>();
    const deduped: FetchedComment[] = [];

    for (const comment of validComments) {
      const key = comment.username.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(comment);
      } else {
        duplicateCount++;
      }
    }
    validComments = deduped;
  }

  // 2. Filter by minimum mentions
  if (filters?.minMentions && filters.minMentions > 0) {
    const before = validComments.length;
    validComments = validComments.filter(
      (c) => c.mentions && c.mentions.length >= filters.minMentions!
    );
    filteredCount += before - validComments.length;
  }

  // 3. Filter by required hashtags
  if (filters?.requiredHashtags && filters.requiredHashtags.length > 0) {
    const requiredLower = filters.requiredHashtags.map((h) => h.toLowerCase());
    const before = validComments.length;
    validComments = validComments.filter((c) => {
      if (!c.hashtags) return false;
      return requiredLower.every((req) => c.hashtags!.includes(req));
    });
    filteredCount += before - validComments.length;
  }

  // 4. Filter by excluded keywords
  if (filters?.excludeKeywords && filters.excludeKeywords.length > 0) {
    const excludeLower = filters.excludeKeywords.map((k) => k.toLowerCase());
    const before = validComments.length;
    validComments = validComments.filter((c) => {
      const textLower = c.text.toLowerCase();
      return !excludeLower.some((kw) => textLower.includes(kw));
    });
    filteredCount += before - validComments.length;
  }

  // 5. Check for existing participants (already in this draw)
  const existingParticipants = await prisma.participant.findMany({
    where: { drawId },
    select: { identifier: true },
  });
  const existingSet = new Set(existingParticipants.map((p) => p.identifier.toLowerCase()));

  const newComments: FetchedComment[] = [];
  for (const comment of validComments) {
    if (!existingSet.has(comment.username.toLowerCase())) {
      newComments.push(comment);
    } else {
      duplicateCount++;
    }
  }
  validComments = newComments;

  return { validComments, filteredCount, duplicateCount };
}

/**
 * Store participants in database
 */
async function storeParticipants(
  drawId: string,
  platform: SocialPlatform,
  comments: FetchedComment[]
): Promise<number> {
  let storedCount = 0;

  for (const comment of comments) {
    try {
      await prisma.participant.create({
        data: {
          drawId,
          name: comment.username,
          identifier: comment.username,
          source: platform.toUpperCase(),
          metadata: {
            commentId: comment.id,
            commentText: comment.text,
            timestamp: comment.timestamp.toISOString(),
            likes: comment.likes,
            mentions: comment.mentions,
            hashtags: comment.hashtags,
          },
        },
      });
      storedCount++;
    } catch (error) {
      logger.error('Failed to store participant', {
        drawId,
        username: comment.username,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return storedCount;
}

/**
 * Schedule comment fetching for a draw
 */
export async function scheduleCommentFetch(
  drawId: string,
  userId: string,
  platform: SocialPlatform,
  postUrl: string,
  accessToken?: string,
  options?: {
    maxComments?: number;
    filters?: CommentFetcherJobData['filters'];
    delay?: number; // Delay in ms before starting
  }
): Promise<Job<CommentFetcherJobData>> {
  const jobData: CommentFetcherJobData = {
    drawId,
    userId,
    platform,
    postUrl,
    accessToken,
    maxComments: options?.maxComments,
    filters: options?.filters,
  };

  const job = await commentFetcherQueue.add(jobData, {
    jobId: `comment-fetch-${drawId}-${Date.now()}`,
    delay: options?.delay || 0,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });

  logger.info('Scheduled comment fetch job', {
    drawId,
    jobId: job.id,
    platform,
    postUrl,
  });

  return job;
}

/**
 * Get comment fetch job status
 */
export async function getCommentFetchStatus(drawId: string): Promise<{
  isActive: boolean;
  progress: number;
  participantCount: number;
}> {
  // Find any active job for this draw
  const jobs = await commentFetcherQueue.getJobs(['active', 'waiting', 'delayed']);
  const activeJob = jobs.find((j) => j.data.drawId === drawId);

  const participantCount = await prisma.participant.count({
    where: { drawId },
  });

  return {
    isActive: !!activeJob,
    progress: activeJob ? await activeJob.progress() : 0,
    participantCount,
  };
}

/**
 * Cancel comment fetch for a draw
 */
export async function cancelCommentFetch(drawId: string): Promise<boolean> {
  const jobs = await commentFetcherQueue.getJobs(['active', 'waiting', 'delayed']);
  const matchingJobs = jobs.filter((j) => j.data.drawId === drawId);

  for (const job of matchingJobs) {
    await job.remove();
    logger.info('Cancelled comment fetch job', { drawId, jobId: job.id });
  }

  return matchingJobs.length > 0;
}

// Initialize worker to process jobs using Bull v4 API
commentFetcherQueue.process(3, processCommentFetcher); // concurrency: 3

commentFetcherQueue.on('completed', (job, result) => {
  logger.info('Comment fetch job completed', {
    jobId: job.id,
    drawId: job.data.drawId,
    result,
  });
});

commentFetcherQueue.on('failed', (job, error) => {
  logger.error('Comment fetch job failed', {
    jobId: job?.id,
    drawId: job?.data.drawId,
    error: error.message,
  });
});

commentFetcherQueue.on('progress', (job, progress) => {
  logger.debug('Comment fetch progress', {
    jobId: job.id,
    drawId: job.data.drawId,
    progress,
  });
});

export default commentFetcherQueue;
