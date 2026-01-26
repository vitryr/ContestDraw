/**
 * Verification Routes
 * API endpoints for follower/like verification
 */

import { Router } from "express";
import { body, query } from "express-validator";
import * as verificationController from "./verification.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";

const router = Router();

/**
 * POST /api/verification/instagram/follower
 * Verify Instagram follower
 */
router.post(
  "/instagram/follower",
  authenticate,
  [
    body("username").notEmpty().isString().trim(),
    body("targetAccountId").notEmpty().isString().trim(),
    body("accessToken").notEmpty().isString(),
  ],
  validate,
  verificationController.verifyInstagramFollower,
);

/**
 * POST /api/verification/facebook/page-like
 * Verify Facebook page like
 */
router.post(
  "/facebook/page-like",
  authenticate,
  [
    body("userId").notEmpty().isString().trim(),
    body("pageId").notEmpty().isString().trim(),
    body("accessToken").notEmpty().isString(),
  ],
  validate,
  verificationController.verifyFacebookPageLike,
);

/**
 * POST /api/verification/batch
 * Batch verify multiple users
 */
router.post(
  "/batch",
  authenticate,
  [
    body("drawId").notEmpty().isString(),
    body("requests").isArray().notEmpty(),
    body("requests.*.username").notEmpty().isString(),
    body("requests.*.platform").notEmpty().isIn(["instagram", "facebook"]),
    body("requests.*.targetAccount").notEmpty().isString(),
    body("accessTokens").isObject(),
  ],
  validate,
  verificationController.batchVerify,
);

/**
 * GET /api/verification/results/:drawId
 * Get verification results for a draw
 */
router.get(
  "/results/:drawId",
  authenticate,
  verificationController.getVerificationResults,
);

/**
 * GET /api/verification/instagram/followers-count
 * Get Instagram followers count
 */
router.get(
  "/instagram/followers-count",
  authenticate,
  [
    query("accountId").notEmpty().isString(),
    query("accessToken").notEmpty().isString(),
  ],
  validate,
  verificationController.getInstagramFollowersCount,
);

/**
 * GET /api/verification/facebook/page-likes-count
 * Get Facebook page likes count
 */
router.get(
  "/facebook/page-likes-count",
  authenticate,
  [
    query("pageId").notEmpty().isString(),
    query("accessToken").notEmpty().isString(),
  ],
  validate,
  verificationController.getFacebookPageLikesCount,
);

export default router;
