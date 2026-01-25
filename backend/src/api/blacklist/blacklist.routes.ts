/**
 * Blacklist Routes
 * API endpoints for blacklist management
 */

import { Router } from 'express';
import multer from 'multer';
import { body, query } from 'express-validator';
import * as blacklistController from './blacklist.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';

const router = Router();

// Configure multer for CSV upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

/**
 * GET /api/blacklist
 * Get all blacklisted users
 */
router.get(
  '/',
  authenticate,
  validate([
    query('platform').optional().isString(),
    query('search').optional().isString(),
  ]),
  (req, res, next) => blacklistController.getBlacklist(req, res, next)
);

/**
 * POST /api/blacklist
 * Add user to blacklist
 */
router.post(
  '/',
  authenticate,
  validate([
    body('username').notEmpty().isString().trim(),
    body('platform').optional().isString().trim(),
    body('reason').optional().isString().trim(),
  ]),
  blacklistController.addToBlacklist
);

/**
 * PUT /api/blacklist/:id
 * Update blacklist entry
 */
router.put(
  '/:id',
  authenticate,
  validate([
    body('username').optional().isString().trim(),
    body('platform').optional().isString().trim(),
    body('reason').optional().isString().trim(),
  ]),
  
  blacklistController.updateBlacklistEntry
);

/**
 * DELETE /api/blacklist/:id
 * Remove user from blacklist
 */
router.delete(
  '/:id',
  authenticate,
  blacklistController.removeFromBlacklist
);

/**
 * POST /api/blacklist/bulk
 * Bulk add users to blacklist
 */
router.post(
  '/bulk',
  authenticate,
  validate([
    body('entries').isArray().notEmpty(),
    body('entries.*.username').notEmpty().isString().trim(),
    body('entries.*.platform').optional().isString().trim(),
    body('entries.*.reason').optional().isString().trim(),
  ]),
  
  blacklistController.bulkAddToBlacklist
);

/**
 * POST /api/blacklist/import
 * Import blacklist from CSV
 */
router.post(
  '/import',
  authenticate,
  upload.single('file'),
  blacklistController.importFromCSV
);

/**
 * GET /api/blacklist/export
 * Export blacklist to CSV
 */
router.get(
  '/export',
  authenticate,
  [query('platform').optional().isString()],
  blacklistController.exportToCSV
);

/**
 * GET /api/blacklist/check
 * Check if username is blacklisted
 */
router.get(
  '/check',
  authenticate,
  validate([
    query('username').notEmpty().isString(),
    query('platform').optional().isString(),
  ]),
  
  blacklistController.checkBlacklisted
);

/**
 * GET /api/blacklist/stats
 * Get blacklist statistics
 */
router.get(
  '/stats',
  authenticate,
  blacklistController.getBlacklistStats
);

/**
 * DELETE /api/blacklist/clear
 * Clear all blacklist entries
 */
router.delete(
  '/clear',
  authenticate,
  [query('platform').optional().isString()],
  blacklistController.clearBlacklist
);

export default router;
