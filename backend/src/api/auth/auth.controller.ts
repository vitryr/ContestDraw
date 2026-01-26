import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler, AppError } from "../../middleware/error.middleware";
import { logger } from "../../utils/logger";
import config from "../../config/config";
import {
  RegisterData,
  LoginData,
  TokenResponse,
  JWTPayload,
} from "../../types";

// Mock database - replace with actual Prisma calls in production
const users = new Map<string, any>();
const verificationTokens = new Map<string, string>();
const resetTokens = new Map<string, string>();

/**
 * Generate JWT access and refresh tokens
 */
const generateTokens = (
  userId: string,
  email: string,
  role: string = "user",
): TokenResponse => {
  const accessToken = jwt.sign(
    { userId, email, role } as JWTPayload,
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );

  const refreshToken = jwt.sign(
    { userId, email, role } as JWTPayload,
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn },
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
  };
};

/**
 * POST /api/auth/register
 * Register a new user account
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body as RegisterData;

  // Check if user already exists
  if (users.has(email)) {
    throw new AppError("Email already registered", 409, "EMAIL_EXISTS");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    config.security.bcryptRounds,
  );

  // Create user
  const userId = crypto.randomUUID();
  const user = {
    id: userId,
    email,
    password: hashedPassword,
    firstName: firstName || null,
    lastName: lastName || null,
    emailVerified: false,
    role: "user",
    credits: 3, // Welcome bonus: 3 free credits
    trial_used: false, // Track if user has used their free trial
    createdAt: new Date(),
  };

  users.set(email, user);

  // Log welcome bonus
  logger.info(`Welcome bonus: 3 credits granted to new user ${email}`);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  verificationTokens.set(verificationToken, email);

  // TODO: Send verification email
  logger.info(`Verification token for ${email}: ${verificationToken}`);

  // Generate tokens
  const tokens = generateTokens(userId, email);

  res.status(201).json({
    status: "success",
    message: "Registration successful. Please verify your email.",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    },
  });
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginData;

  // Find user
  const user = users.get(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  // Generate tokens
  const tokens = generateTokens(user.id, user.email, user.role);

  logger.info(`User logged in: ${email}`);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    },
  });
});

/**
 * POST /api/auth/verify-email
 * Verify email address with token
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const email = verificationTokens.get(token);
  if (!email) {
    throw new AppError(
      "Invalid or expired verification token",
      400,
      "INVALID_TOKEN",
    );
  }

  const user = users.get(email);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  user.emailVerified = true;
  verificationTokens.delete(token);

  logger.info(`Email verified: ${email}`);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = users.get(email);
    if (!user) {
      // Don't reveal if user exists
      res.status(200).json({
        status: "success",
        message: "If the email exists, a reset link has been sent",
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    resetTokens.set(resetToken, email);

    // TODO: Send reset email
    logger.info(`Password reset token for ${email}: ${resetToken}`);

    res.status(200).json({
      status: "success",
      message: "If the email exists, a reset link has been sent",
    });
  },
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const email = resetTokens.get(token);
    if (!email) {
      throw new AppError(
        "Invalid or expired reset token",
        400,
        "INVALID_TOKEN",
      );
    }

    const user = users.get(email);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Hash new password
    user.password = await bcrypt.hash(password, config.security.bcryptRounds);
    resetTokens.delete(token);

    logger.info(`Password reset: ${email}`);

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  },
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret,
    ) as JWTPayload;

    // Generate new tokens
    const tokens = generateTokens(decoded.userId, decoded.email, decoded.role);

    res.status(200).json({
      status: "success",
      data: tokens,
    });
  },
);

/**
 * GET /api/auth/oauth/google
 * Initiate Google OAuth flow
 */
export const googleAuth = (_req: Request, res: Response) => {
  // Redirect to Google OAuth consent screen
  const params = new URLSearchParams({
    client_id: config.oauth.google.clientId,
    redirect_uri: config.oauth.google.callbackURL,
    response_type: "code",
    scope: "email profile",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

/**
 * GET /api/auth/oauth/google/callback
 * Google OAuth callback
 */
export const googleAuthCallback = asyncHandler(
  async (_req: Request, res: Response) => {
    // TODO: Implement Google OAuth callback
    // Exchange code for tokens, get user info, create/login user

    res.status(501).json({
      status: "error",
      message: "Google OAuth not fully implemented",
      code: "NOT_IMPLEMENTED",
    });
  },
);

/**
 * GET /api/auth/oauth/facebook
 * Initiate Facebook OAuth flow
 */
export const facebookAuth = (_req: Request, res: Response) => {
  // Redirect to Facebook OAuth dialog
  const params = new URLSearchParams({
    client_id: config.oauth.facebook.appId,
    redirect_uri: config.oauth.facebook.callbackURL,
    scope: "email,public_profile",
  });

  res.redirect(`https://www.facebook.com/v12.0/dialog/oauth?${params}`);
};

/**
 * GET /api/auth/oauth/facebook/callback
 * Facebook OAuth callback
 */
export const facebookAuthCallback = asyncHandler(
  async (_req: Request, res: Response) => {
    // TODO: Implement Facebook OAuth callback
    // Exchange code for tokens, get user info, create/login user

    res.status(501).json({
      status: "error",
      message: "Facebook OAuth not fully implemented",
      code: "NOT_IMPLEMENTED",
    });
  },
);
