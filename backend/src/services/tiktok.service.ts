/**
 * TikTok Integration Service
 * Due to limited official API access, implements scraping-based approach
 * with Playwright for reliability
 */

import axios, { AxiosInstance } from 'axios';
import { PaginatedResponse, Comment, SocialAccount } from '../types/social.types';
import { RetryHandler } from '../utils/retry.util';
import { Cache } from '../utils/cache.util';

interface TikTokVideo {
  id: string;
  desc: string;
  author: {
    id: string;
    uniqueId: string;
    nickname: string;
  };
  stats: {
    diggCount: number;
    commentCount: number;
    shareCount: number;
    playCount: number;
  };
  createTime: number;
}

interface TikTokComment {
  cid: string;
  text: string;
  user: {
    uid: string;
    unique_id: string;
    nickname: string;
  };
  create_time: number;
  digg_count: number;
  reply_comment_total?: number;
}

export class TikTokService {
  private client: AxiosInstance;
  private readonly baseUrl = 'https://www.tiktok.com/api';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });
  }

  /**
   * Fetch comments from a TikTok video using scraping
   * Note: TikTok has limited official API access
   * @param videoUrl - TikTok video URL
   * @param maxComments - Maximum number of comments to fetch
   * @returns Paginated comments
   */
  async fetchComments(
    videoUrl: string,
    maxComments?: number
  ): Promise<PaginatedResponse<Comment>> {
    const videoId = this.parseVideoUrl(videoUrl);
    const cacheKey = `tiktok:comments:${videoId}`;

    // Check cache first
    const cached = Cache.get<PaginatedResponse<Comment>>(cacheKey);
    if (cached) {
      return cached;
    }

    return RetryHandler.withRetry(async () => {
      // TikTok web API endpoint for comments
      // This may require additional headers or cookies for authentication
      const allComments: Comment[] = [];
      let cursor = 0;
      let hasMore = true;

      try {
        while (hasMore && (!maxComments || allComments.length < maxComments)) {
          const response = await this.client.get('/comment/list/', {
            params: {
              aweme_id: videoId,
              cursor: cursor,
              count: 50,
            },
          });

          if (!response.data.comments || response.data.comments.length === 0) {
            hasMore = false;
            break;
          }

          const comments = response.data.comments.map((comment: TikTokComment) => ({
            id: comment.cid,
            text: comment.text,
            username: comment.user.unique_id || comment.user.nickname,
            userId: comment.user.uid,
            timestamp: new Date(comment.create_time * 1000),
            likes: comment.digg_count,
          }));

          allComments.push(...comments);

          // Check pagination
          cursor = response.data.cursor;
          hasMore = response.data.has_more === 1;

          // Respect max comments limit
          if (maxComments && allComments.length >= maxComments) {
            hasMore = false;
          }
        }
      } catch (error: any) {
        // If API fails, fall back to Playwright scraping
        console.warn('TikTok API failed, falling back to scraping:', error.message);
        return this.fetchCommentsWithPlaywright(videoUrl, maxComments);
      }

      const result: PaginatedResponse<Comment> = {
        data: maxComments ? allComments.slice(0, maxComments) : allComments,
        pagination: {
          hasMore: false,
          total: allComments.length,
        },
      };

      // Cache for 5 minutes
      Cache.set(cacheKey, result, 300);

      return result;
    });
  }

  /**
   * Fetch comments using Playwright for scraping
   * Fallback method when API is not accessible
   * @param videoUrl - TikTok video URL
   * @param maxComments - Maximum number of comments
   * @returns Paginated comments
   */
  private async fetchCommentsWithPlaywright(
    videoUrl: string,
    maxComments?: number
  ): Promise<PaginatedResponse<Comment>> {
    // This requires Playwright to be installed
    // npm install playwright

    try {
      const { chromium } = await import('playwright');

      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      });
      const page = await context.newPage();

      await page.goto(videoUrl, { waitUntil: 'networkidle' });

      // Wait for comments to load
      await page.waitForSelector('[data-e2e="comment-item"]', { timeout: 10000 });

      // Scroll to load more comments
      const scrollCount = maxComments ? Math.ceil(maxComments / 20) : 10;
      for (let i = 0; i < scrollCount; i++) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(1000);
      }

      // Extract comments
      const comments = await page.$$eval('[data-e2e="comment-item"]', (elements) => {
        return elements.map((el) => {
          const username = el.querySelector('[data-e2e="comment-username"]')?.textContent || 'unknown';
          const text = el.querySelector('[data-e2e="comment-text"]')?.textContent || '';
          const likes = el.querySelector('[data-e2e="comment-like-count"]')?.textContent || '0';

          return {
            id: Math.random().toString(36).substring(7), // Generate random ID
            text: text.trim(),
            username: username.trim(),
            userId: username.trim(),
            timestamp: new Date(),
            likes: parseInt(likes) || 0,
          };
        });
      });

      await browser.close();

      return {
        data: maxComments ? comments.slice(0, maxComments) : comments,
        pagination: {
          hasMore: false,
          total: comments.length,
        },
      };
    } catch (error: any) {
      console.error('Playwright scraping failed:', error.message);
      throw new Error(
        'TikTok comments unavailable. Please install Playwright: npm install playwright'
      );
    }
  }

  /**
   * Parse TikTok video URL to extract video ID
   * @param url - TikTok video URL
   * @returns Video ID
   */
  parseVideoUrl(url: string): string {
    // TikTok URL formats:
    // https://www.tiktok.com/@username/video/1234567890123456789
    // https://vm.tiktok.com/ZMxxxxx/ (short link)

    // Long format
    let match = url.match(/\/video\/(\d+)/);
    if (match) {
      return match[1];
    }

    // Short link - needs to be resolved
    match = url.match(/vm\.tiktok\.com\/([A-Za-z0-9]+)/);
    if (match) {
      throw new Error(
        'Short TikTok URLs need to be resolved to full URLs first. Please use the full video URL.'
      );
    }

    throw new Error('Invalid TikTok video URL');
  }

  /**
   * Get video information
   * @param videoUrl - TikTok video URL
   * @returns Video information
   */
  async getVideoInfo(videoUrl: string): Promise<TikTokVideo | null> {
    const videoId = this.parseVideoUrl(videoUrl);
    const cacheKey = `tiktok:video:${videoId}`;

    return Cache.getOrSet(cacheKey, async () => {
      return RetryHandler.withRetry(async () => {
        try {
          const response = await this.client.get('/item/detail/', {
            params: {
              itemId: videoId,
            },
          });

          return response.data.itemInfo?.itemStruct || null;
        } catch (error) {
          console.warn('Failed to fetch TikTok video info:', error);
          return null;
        }
      });
    }, 600);
  }

  /**
   * Resolve short TikTok URL to full URL
   * @param shortUrl - Short TikTok URL (vm.tiktok.com)
   * @returns Full video URL
   */
  async resolveShortUrl(shortUrl: string): Promise<string> {
    return RetryHandler.withRetry(async () => {
      const response = await axios.get(shortUrl, {
        maxRedirects: 0,
        validateStatus: (status) => status === 301 || status === 302,
      });

      return response.headers.location || shortUrl;
    });
  }

  /**
   * Note: TikTok OAuth and official API features
   *
   * TikTok Login Kit requires:
   * 1. Approved developer account
   * 2. Client Key and Client Secret
   * 3. Proper OAuth 2.0 flow implementation
   *
   * For production use, implement proper OAuth flow:
   * - Authorization: https://www.tiktok.com/auth/authorize/
   * - Token exchange: https://open-api.tiktok.com/oauth/access_token/
   *
   * Required scopes for contest features:
   * - user.info.basic
   * - video.list
   * - video.comment
   */
  async connectAccount(userId: string, authCode: string): Promise<SocialAccount> {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    if (!clientKey || !clientSecret) {
      throw new Error(
        'TikTok OAuth not configured. Please set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET'
      );
    }

    // Placeholder for OAuth implementation
    throw new Error(
      'TikTok OAuth integration requires approved developer account. ' +
      'Please apply at https://developers.tiktok.com/'
    );
  }

  /**
   * Rate limiting helper
   * TikTok has strict rate limits - implement conservative delays
   */
  private async respectRateLimit(): Promise<void> {
    // Add 2-second delay between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
