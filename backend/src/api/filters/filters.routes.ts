/**
 * Filters Routes
 * API routes for filter management
 */

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import * as filtersController from './filters.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/filters/capabilities
 * @desc    Get capabilities for a source (URL or CSV)
 * @access  Private
 */
router.post('/capabilities', filtersController.getCapabilities);

/**
 * @route   POST /api/filters/prescan
 * @desc    Pre-scan a post to validate draw eligibility
 * @access  Private
 */
router.post('/prescan', filtersController.preScan);

/**
 * @route   GET /api/filters/metadata
 * @desc    Get filter metadata (descriptions, tiers, etc.)
 * @access  Private
 */
router.get('/metadata', filtersController.getFilterMetadata);

/**
 * @route   GET /api/filters/:drawId
 * @desc    Get filters for a specific draw
 * @access  Private
 */
router.get('/:drawId', filtersController.getFilters);

/**
 * @route   PUT /api/filters/:drawId
 * @desc    Save filters for a draw
 * @access  Private
 */
router.put('/:drawId', filtersController.saveFilters);

/**
 * @route   POST /api/filters/:drawId/preview
 * @desc    Preview filter results (dry run)
 * @access  Private
 */
router.post('/:drawId/preview', filtersController.previewFilters);

export default router;
