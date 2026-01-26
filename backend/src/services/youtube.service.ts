/**
 * YouTube Data API v3 Integration Service
 * Handles fetching comments from YouTube videos for contest draws
 */

import axios, { AxiosInstance } from 'axios';
import { PaginatedResponse, Comment, APIError } from '../types/social.types';
import { RetryHandler } from '../utils/retry.util';
import { Cache } from '../utils/cache.util';
import { logger } from '../utils/logger';

interface YouTubeComment {
  id: string;
  snippet: {
    topLevelComment: {
      id: string;
      snippet: {
        authorDisplayName: string;
        authorChannelId: {
          value: string;
        };
        textDisplay: string;
        textOriginal: string;
        likeCount: number;
        publishedAt: string;
        updatedAt: string;
      };
    };
    totalReplyCount: number;
  };
}

interface YouTubeCommentThreadResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeComment[];
}

interface YouTubeVideoResponse {
  kind: string;
  items: Array<{
    id: string;
    snippet: {
      title: string;
      channelId: string;
      channelTitle: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
  }>;
}

export class YouTubeService {
  private client: AxiosInstance;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
    
    if (!this.apiKey) {
      logger.warn('YouTube API key not configured. YouTube features will be disabled.');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      params: {
        key: this.apiKey,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Check if YouTube service is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Extract video ID from various YouTube URL formats
   * Supports:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   * - https://www.youtube.com/v/VIDEO_ID
   * - https://www.youtube.com/shorts/VIDEO_ID
   */
  parseVideoUrl(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    throw new Error('Invalid YouTube URL or video ID');
  }

  /**
   * Get video information
   */
  async getVideoInfo(videoUrl: string): Promise<{
    id: string;
    title: string;
    channelId: string;
    channelTitle: string;
    commentCount: number;
  }> {
    if (!this.isConfigured()) {
      throw new Error('YouTube API key not configured');
    }

    const videoId = this.parseVideoUrl(videoUrl);
    const cacheKey = `youtube:video:${videoId}`;

    return Cache.getOrSet(cacheKey, async () => {
      return RetryHandler.withRetry(async () => {
        const response = await this.client.get<YouTubeVideoResponse>('/videos', {
          params: {
            part: 'snippet,statistics',
            id: videoId,
          },
        });

        if (!response.data.items || response.data.items.length === 0) {
          throw new Error('Video not found');
        }

        const video = response.data.items[0];

        return {
          id: video.id,
          title: video.snippet.title,
          channelId: video.snippet.channelId,
          channelTitle: video.snippet.channelTitle,
          commentCount: parseInt(video.statistics.commentCount, 10) || 0,
        };
      });
    }, 300); // Cache for 5 minutes
  }

  /**
   * Fetch comments from a YouTube video
   * @param videoUrl - YouTube video URL or ID
   * @param maxComments - Maximum number of comments to fetch (default: all)
   * @returns Paginated comments
   */
  async fetchComments(
    videoUrl: string,
    maxComments?: number
  ): Promise<PaginatedResponse<Comment>> {
    if (!this.isConfigured()) {
      throw new Error('YouTube API key not configured');
    }

    const videoId = this.parseVideoUrl(videoUrl);
    const cacheKey = `youtube:comments:${videoId}:${maxComments || 'all'}`;

    // Check cache first
    const cached = Cache.get<PaginatedResponse<Comment>>(cacheKey);
    if (cached) {
      return cached;
    }

    return RetryHandler.withRetry(async () => {
      const allComments: Comment[] = [];
      let nextPageToken: string | undefined;
      let hasMore = true;

      while (hasMore && (!maxComments || allComments.length < maxComments)) {
        const params: any = {
          part: 'snippet',
          videoId: videoId,
          maxResults: 100, // Max allowed by API
          order: 'time', // Most recent first
          textFormat: 'plainText',
        };

        if (nextPageToken) {
          params.pageToken = nextPageToken;
        }

        const response = await this.client.get<YouTubeCommentThreadResponse>(
          '/commentThreads',
          { params }
        );

        const comments = response.data.items.map((item) => this.mapComment(item));
        allComments.push(...comments);

        // Check for pagination
        nextPageToken = response.data.nextPageToken;
        hasMore = !!nextPageToken;

        // Respect max comments limit
        if (maxComments && allComments.length >= maxComments) {
          hasMore = false;
        }

        // Log progress for large fetches
        if (allComments.length % 500 === 0) {
          logger.info(`YouTube comment fetch progress: ${allComments.length} comments`, {
            videoId,
          });
        }

        // Small delay between requests to be nice to the API
        if (hasMore) {
          await this.delay(100);
        }
      }

      const result: PaginatedResponse<Comment> = {
        data: maxComments ? allComments.slice(0, maxComments) : allComments,
        pagination: {
          nextCursor: nextPageToken,
          hasMore: !!nextPageToken,
          total: allComments.length,
        },
      };

      // Cache for 5 minutes
      Cache.set(cacheKey, result, 300);

      logger.info(`Fetched ${result.data.length} comments from YouTube video`, {
        videoId,
        total: result.data.length,
      });

      return result;
    });
  }

  /**
   * Fetch comment replies (for contests that count replies)
   */
  async fetchCommentReplies(
    commentId: string,
    maxReplies?: number
  ): Promise<Comment[]> {
    if (!this.isConfigured()) {
      throw new Error('YouTube API key not configured');
    }

    return RetryHandler.withRetry(async () => {
      const allReplies: Comment[] = [];
      let nextPageToken: string | undefined;
      let hasMore = true;

      while (hasMore && (!maxReplies || allReplies.length < maxReplies)) {
        const params: any = {
          part: 'snippet',
          parentId: commentId,
          maxResults: 100,
          textFormat: 'plainText',
        };

        if (nextPageToken) {
          params.pageToken = nextPageToken;
        }

        const response = await this.client.get('/comments', { params });

        const replies = response.data.items.map((item: any) => ({
          id: item.id,
          text: item.snippet.textOriginal,
          username: item.snippet.authorDisplayName,
          userId: item.snippet.authorChannelId?.value,
          timestamp: new Date(item.snippet.publishedAt),
          likes: item.snippet.likeCount,
        }));

        allReplies.push(...replies);

        nextPageToken = response.data.nextPageToken;
        hasMore = !!nextPageToken;
      }

      return maxReplies ? allReplies.slice(0, maxReplies) : allReplies;
    });
  }

  /**
   * Search for comments containing specific text
   */
  async searchComments(
    videoUrl: string,
    searchTerms: string[],
    maxComments?: number
  ): Promise<Comment[]> {
    const allComments = await this.fetchComments(videoUrl, maxComments);
    
    const searchLower = searchTerms.map(t => t.toLowerCase());
    
    return allComments.data.filter(comment => {
      const textLower = comment.text.toLowerCase();
      return searchLower.some(term => textLower.includes(term));
    });
  }

  /**
   * Get unique commenters (for duplicate filtering)
   */
  async getUniqueCommenters(
    videoUrl: string,
    maxComments?: number
  ): Promise<Map<string, Comment>> {
    const allComments = await this.fetchComments(videoUrl, maxComments);
    
    const uniqueMap = new Map<string, Comment>();
    
    for (const comment of allComments.data) {
      const key = comment.username.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, comment);
      }
    }
    
    return uniqueMap;
  }

  /**
   * Map YouTube comment to standard Comment format
   */
  private mapComment(item: YouTubeComment): Comment {
    const snippet = item.snippet.topLevelComment.snippet;
    
    return {
      id: item.snippet.topLevelComment.id,
      text: snippet.textOriginal,
      username: snippet.authorDisplayName,
      userId: snippet.authorChannelId?.value,
      timestamp: new Date(snippet.publishedAt),
      likes: snippet.likeCount,
      replies: item.snippet.totalReplyCount > 0 
        ? [] // Replies fetched separately if needed
        : undefined,
    };
  }

  /**
   * Handle API errors and convert to standard format
   */
  private handleError(error: any): never {
    const apiError: APIError = {
      code: error.response?.data?.error?.code?.toString() || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || error.message,
      statusCode: error.response?.status || 500,
      retryable: error.response?.status >= 500 || error.response?.status === 429,
    };

    // Handle specific YouTube API errors
    if (error.response?.status === 403) {
      const reason = error.response?.data?.error?.errors?.[0]?.reason;
      
      if (reason === 'quotaExceeded') {
        apiError.code = 'QUOTA_EXCEEDED';
        apiError.message = 'YouTube API daily quota exceeded. Try again tomorrow.';
        apiError.retryable = false;
      } else if (reason === 'commentsDisabled') {
        apiError.code = 'COMMENTS_DISABLED';
        apiError.message = 'Comments are disabled for this video.';
        apiError.retryable = false;
      }
    }

    if (error.response?.status === 404) {
      apiError.code = 'NOT_FOUND';
      apiError.message = 'Video not found or is private.';
      apiError.retryable = false;
    }

    // Log error
    logger.error('YouTube API error', {
      code: apiError.code,
      message: apiError.message,
      statusCode: apiError.statusCode,
    });

    throw apiError;
  }

  /**
   * Helper to add delay between API calls
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
