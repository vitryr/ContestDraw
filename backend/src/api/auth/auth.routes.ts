import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../../middleware/validation.middleware";
import {
  authLimiter,
  emailLimiter,
} from "../../middleware/rate-limit.middleware";
import * as authController from "./auth.controller";

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post(
  "/register",
  authLimiter,
  validate([
    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      )
      .withMessage(
        "Password must contain uppercase, lowercase, number and special character",
      ),
    body("firstName").optional().trim().isLength({ min: 1, max: 50 }),
    body("lastName").optional().trim().isLength({ min: 1, max: 50 }),
  ]),
  authController.register,
);

/**
 * POST /api/auth/signup
 * Alias for /register - supports mobile app compatibility
 */
router.post(
  "/signup",
  authLimiter,
  validate([
    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      )
      .withMessage(
        "Password must contain uppercase, lowercase, number and special character",
      ),
    body("firstName").optional().trim().isLength({ min: 1, max: 50 }),
    body("lastName").optional().trim().isLength({ min: 1, max: 50 }),
  ]),
  authController.register,
);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  "/login",
  authLimiter,
  validate([
    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  authController.login,
);

/**
 * POST /api/auth/verify-email
 * Verify email address with token
 */
router.post(
  "/verify-email",
  validate([
    body("token").notEmpty().withMessage("Verification token is required"),
  ]),
  authController.verifyEmail,
);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post(
  "/forgot-password",
  emailLimiter,
  validate([
    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),
  ]),
  authController.forgotPassword,
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post(
  "/reset-password",
  validate([
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      )
      .withMessage(
        "Password must contain uppercase, lowercase, number and special character",
      ),
  ]),
  authController.resetPassword,
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  "/refresh",
  validate([
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
  ]),
  authController.refreshToken,
);

/**
 * GET /api/auth/oauth/google
 * Initiate Google OAuth flow
 */
router.get("/oauth/google", authController.googleAuth);

/**
 * GET /api/auth/oauth/google/callback
 * Google OAuth callback
 */
router.get("/oauth/google/callback", authController.googleAuthCallback);

/**
 * GET /api/auth/oauth/facebook
 * Initiate Facebook OAuth flow
 */
router.get("/oauth/facebook", authController.facebookAuth);

/**
 * GET /api/auth/oauth/facebook/callback
 * Facebook OAuth callback
 */
router.get("/oauth/facebook/callback", authController.facebookAuthCallback);

export default router;
