import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import * as socialPlatformsController from './social-platforms.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/social/connect/:platform
 * Connect a social media account (OAuth)
 */
router.post(
  '/connect/:platform',
  validate([
    param('platform').isIn(['instagram', 'facebook', 'twitter', 'tiktok', 'youtube']).withMessage('Invalid platform')
  ]),
  socialPlatformsController.connectPlatform
);

/**
 * DELETE /api/social/disconnect/:platform
 * Disconnect a social media account
 */
router.delete(
  '/disconnect/:platform',
  validate([
    param('platform').isIn(['instagram', 'facebook', 'twitter', 'tiktok', 'youtube']).withMessage('Invalid platform')
  ]),
  socialPlatformsController.disconnectPlatform
);

/**
 * GET /api/social/accounts
 * List all connected social media accounts
 */
router.get('/accounts', socialPlatformsController.listConnectedAccounts);

/**
 * POST /api/social/fetch-participants
 * Fetch participants from a social media post URL
 */
router.post(
  '/fetch-participants',
  validate([
    body('url').isURL().withMessage('Invalid URL'),
    body('platform').isIn(['instagram', 'facebook', 'twitter', 'tiktok', 'youtube']).withMessage('Invalid platform'),
    body('type').isIn(['comments', 'likes', 'shares', 'tags']).withMessage('Invalid participant type')
  ]),
  socialPlatformsController.fetchParticipants
);

export default router;
