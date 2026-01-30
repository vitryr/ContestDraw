import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { asyncHandler, AppError } from "../../middleware/error.middleware";
import { logger } from "../../utils/logger";
import config from "../../config/config";
import { emailService } from "../../services/resend-email.service";
import {
  RegisterData,
  LoginData,
  TokenResponse,
  JWTPayload,
} from "../../types";

const prisma = new PrismaClient();

// Token expiration times
const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
const RESET_TOKEN_EXPIRY_HOURS = 1;

/**
 * Generate JWT access and refresh tokens
 */
const generateTokens = (
  userId: string,
  email: string,
  role: string = "user",
): TokenResponse => {
  // Cast expiresIn to satisfy jsonwebtoken types (StringValue branded type)
  const accessOptions = { expiresIn: config.jwt.expiresIn } as SignOptions;
  const refreshOptions = { expiresIn: config.jwt.refreshExpiresIn } as SignOptions;

  const accessToken = jwt.sign(
    { userId, email, role } as JWTPayload,
    config.jwt.secret,
    accessOptions,
  );

  const refreshToken = jwt.sign(
    { userId, email, role } as JWTPayload,
    config.jwt.refreshSecret,
    refreshOptions,
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
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already registered", 409, "EMAIL_EXISTS");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    config.security.bcryptRounds,
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      emailVerified: false,
      role: "user",
      credits: 3, // Welcome bonus: 3 free credits
      trial_used: false,
    },
  });

  // Log welcome bonus
  logger.info(`Welcome bonus: 3 credits granted to new user ${email}`);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS);

  await prisma.verificationToken.create({
    data: {
      token: verificationToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(email, verificationToken);
  } catch (error) {
    logger.error(`Failed to send verification email to ${email}`, { error });
    // Don't fail registration if email fails
  }

  // Generate tokens
  const tokens = generateTokens(user.id, email);

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
        credits: user.credits,
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
  const user = await prisma.user.findUnique({ where: { email } });
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

  // Find verification token
  const verificationRecord = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationRecord) {
    throw new AppError(
      "Invalid or expired verification token",
      400,
      "INVALID_TOKEN",
    );
  }

  // Check if token is expired
  if (new Date() > verificationRecord.expiresAt) {
    // Delete expired token
    await prisma.verificationToken.delete({ where: { id: verificationRecord.id } });
    throw new AppError(
      "Verification token has expired",
      400,
      "TOKEN_EXPIRED",
    );
  }

  // Update user as verified
  await prisma.user.update({
    where: { id: verificationRecord.userId },
    data: { emailVerified: true },
  });

  // Delete used token
  await prisma.verificationToken.delete({ where: { id: verificationRecord.id } });

  logger.info(`Email verified: ${verificationRecord.user.email}`);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});

/**
 * POST /api/auth/resend-verification
 * Resend email verification token
 */
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if user exists
    res.status(200).json({
      status: "success",
      message: "If the email exists, a verification link has been sent",
    });
    return;
  }

  if (user.emailVerified) {
    throw new AppError("Email is already verified", 400, "ALREADY_VERIFIED");
  }

  // Delete any existing verification tokens for this user
  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS);

  await prisma.verificationToken.create({
    data: {
      token: verificationToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(email, verificationToken);
  } catch (error) {
    logger.error(`Failed to resend verification email to ${email}`, { error });
    throw new AppError("Failed to send verification email", 500, "EMAIL_FAILED");
  }

  res.status(200).json({
    status: "success",
    message: "If the email exists, a verification link has been sent",
  });
});

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      res.status(200).json({
        status: "success",
        message: "If the email exists, a reset link has been sent",
      });
      return;
    }

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}`, { error });
      // Don't fail the request if email fails
    }

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

    // Find reset token
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord) {
      throw new AppError(
        "Invalid or expired reset token",
        400,
        "INVALID_TOKEN",
      );
    }

    // Check if token is expired
    if (new Date() > resetRecord.expiresAt) {
      // Delete expired token
      await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });
      throw new AppError(
        "Reset token has expired",
        400,
        "TOKEN_EXPIRED",
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

    // Update user password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });

    logger.info(`Password reset: ${resetRecord.user.email}`);

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
