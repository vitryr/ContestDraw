import { Response } from 'express';
import { AuthRequest, SocialPlatform } from '../../types';
import { asyncHandler, AppError } from '../../middleware/error.middleware';
import { logger } from '../../utils/logger';

// Mock database for connected accounts
const connectedAccounts = new Map<string, any[]>();

/**
 * POST /api/social/connect/:platform
 * Connect a social media account (OAuth)
 */
export const connectPlatform = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { platform } = req.params;
  const platformUpper = platform.toUpperCase() as SocialPlatform;

  // In production:
  // 1. Initiate OAuth flow for the platform
  // 2. Exchange code for access token
  // 3. Store encrypted tokens in database
  // 4. Fetch and store user's platform profile

  const userAccounts = connectedAccounts.get(req.user.id) || [];

  // Check if already connected
  if (userAccounts.some(acc => acc.platform === platformUpper)) {
    throw new AppError('Platform already connected', 400, 'PLATFORM_ALREADY_CONNECTED');
  }

  const account = {
    platform: platformUpper,
    platformUserId: `${platform}_user_123`,
    platformUsername: `@${platform}user`,
    connectedAt: new Date(),
    accessToken: 'encrypted_token', // In production, encrypt this
    refreshToken: 'encrypted_refresh_token'
  };

  userAccounts.push(account);
  connectedAccounts.set(req.user.id, userAccounts);

  logger.info(`Platform connected: ${platform} by user ${req.user.id}`);

  res.status(200).json({
    status: 'success',
    message: `${platform} account connected successfully`,
    data: {
      platform: platformUpper,
      username: account.platformUsername,
      connectedAt: account.connectedAt
    }
  });
});

/**
 * DELETE /api/social/disconnect/:platform
 * Disconnect a social media account
 */
export const disconnectPlatform = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { platform } = req.params;
  const platformUpper = platform.toUpperCase() as SocialPlatform;

  const userAccounts = connectedAccounts.get(req.user.id) || [];
  const accountIndex = userAccounts.findIndex(acc => acc.platform === platformUpper);

  if (accountIndex === -1) {
    throw new AppError('Platform not connected', 404, 'PLATFORM_NOT_CONNECTED');
  }

  userAccounts.splice(accountIndex, 1);
  connectedAccounts.set(req.user.id, userAccounts);

  logger.info(`Platform disconnected: ${platform} by user ${req.user.id}`);

  res.status(200).json({
    status: 'success',
    message: `${platform} account disconnected successfully`
  });
});

/**
 * GET /api/social/accounts
 * List all connected social media accounts
 */
export const listConnectedAccounts = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const userAccounts = connectedAccounts.get(req.user.id) || [];

  const accounts = userAccounts.map(acc => ({
    platform: acc.platform,
    username: acc.platformUsername,
    connectedAt: acc.connectedAt
  }));

  res.status(200).json({
    status: 'success',
    data: { accounts }
  });
});

/**
 * POST /api/social/fetch-participants
 * Fetch participants from a social media post URL
 */
export const fetchParticipants = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { url, platform, type } = req.body;
  const platformUpper = platform.toUpperCase() as SocialPlatform;

  // Check if platform is connected
  const userAccounts = connectedAccounts.get(req.user.id) || [];
  const account = userAccounts.find(acc => acc.platform === platformUpper);

  if (!account) {
    throw new AppError(`${platform} account not connected`, 400, 'PLATFORM_NOT_CONNECTED');
  }

  // In production:
  // 1. Parse URL to extract post ID
  // 2. Call platform API with access token
  // 3. Fetch comments/likes/shares/tags
  // 4. Filter and deduplicate participants
  // 5. Return formatted participant list

  // Mock participant data
  const participants = Array.from({ length: 50 }, (_, i) => ({
    name: `User ${i + 1}`,
    identifier: `@user${i + 1}`,
    source: platformUpper,
    metadata: {
      profileUrl: `https://${platform}.com/user${i + 1}`,
      fetchedAt: new Date(),
      type
    }
  }));

  logger.info(`Participants fetched from ${platform}: ${participants.length} by user ${req.user.id}`);

  res.status(200).json({
    status: 'success',
    message: 'Participants fetched successfully',
    data: {
      count: participants.length,
      platform: platformUpper,
      type,
      participants
    }
  });
});
