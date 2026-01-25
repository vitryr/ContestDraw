import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import * as usersController from './users.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', usersController.getCurrentUser);

/**
 * PATCH /api/users/me
 * Update current user profile
 */
router.patch(
  '/me',
  validate([
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
    body('language').optional().isIn(['en', 'fr', 'es', 'de']),
    body('timezone').optional().trim()
  ]),
  usersController.updateCurrentUser
);

/**
 * DELETE /api/users/me
 * Delete current user account (GDPR compliance)
 */
router.delete('/me', usersController.deleteCurrentUser);

/**
 * GET /api/users/stats
 * Get user usage statistics
 */
router.get('/stats', usersController.getUserStats);

export default router;
