import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/error.middleware";
import { logger } from "../utils/logger";
import config from "../config/config";
import { emailService } from "./email.service";
import { JWTPayload, TokenResponse } from "../types";

const prisma = new PrismaClient();

/**
 * Token expiration times
 */
const TOKEN_EXPIRATION = {
  VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
};

/**
 * Authentication service
 * Handles user registration, login, email verification, and password reset
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{
    user: Partial<User>;
    tokens: TokenResponse;
    verificationToken: string;
  }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email already registered", 409, "EMAIL_EXISTS");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      data.password,
      config.security.bcryptRounds,
    );

    // Create user with welcome bonus
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        emailVerified: false,
        role: "user",
        credits: 3, // Welcome bonus: 3 free credits
        trial_used: false,
        bonus_granted: true,
      },
    });

    // Log credit transaction for welcome bonus
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        type: "PURCHASE",
        credits: 3,
        description: "Welcome bonus - 3 free credits",
      },
    });

    logger.info(`User registered: ${user.email} (ID: ${user.id})`);
    logger.info(`Welcome bonus: 3 credits granted to ${user.email}`);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION.VERIFICATION);

    // Store verification token in database (we'll create a VerificationToken model)
    // For now, we'll use a simple approach with metadata
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // We'll need to add verification token fields to the User model
        // or create a separate VerificationToken model
      },
    });

    // Send verification email asynchronously (if enabled)
    if (process.env.ENABLE_EMAIL !== "false") {
      emailService
        .sendVerificationEmail(user.email, verificationToken)
        .catch((err) => {
          logger.error("Failed to send verification email", {
            error: err.message,
            email: user.email,
          });
        });

      // Send welcome email
      emailService
        .sendWelcomeEmail(user.email, user.firstName || undefined)
        .catch((err) => {
          logger.error("Failed to send welcome email", {
            error: err.message,
            email: user.email,
          });
        });
    } else {
      logger.info(
        `Email sending disabled - Skipping verification and welcome emails for ${user.email}`,
      );
    }

    // Generate JWT tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      tokens,
      verificationToken, // Only for development/testing
    };
  }

  /**
   * Login user with email and password
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ user: Partial<User>; tokens: TokenResponse }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    logger.info(`User logged in: ${email} (ID: ${user.id})`);

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    // In production, we should store tokens in database with expiration
    // For now, this is a placeholder implementation

    // Find user by verification token (requires database schema update)
    // This is a simplified version - in production, use a separate VerificationToken model

    throw new AppError(
      "Email verification not fully implemented",
      501,
      "NOT_IMPLEMENTED",
    );
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      logger.info(`Password reset requested for non-existent email: ${email}`);
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION.PASSWORD_RESET);

    // Store hashed token (requires schema update)
    // For now, this is a placeholder

    // Send reset email
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    logger.info(`Password reset email sent to: ${email}`);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Hash the provided token to match stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by reset token (requires database schema update)
    // This is a simplified version - in production, use a separate PasswordResetToken model

    throw new AppError(
      "Password reset not fully implemented",
      501,
      "NOT_IMPLEMENTED",
    );
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret,
      ) as JWTPayload;

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      // Generate new tokens
      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Invalid refresh token", 401, "INVALID_TOKEN");
      }
      throw error;
    }
  }

  /**
   * Generate JWT access and refresh tokens
   */
  private generateTokens(
    userId: string,
    email: string,
    role: string,
  ): TokenResponse {
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
  }

  /**
   * Sanitize user object (remove sensitive data)
   */
  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Cleanup expired tokens (should be run as a cron job)
   */
  async cleanupExpiredTokens(): Promise<void> {
    // Implementation requires VerificationToken and PasswordResetToken models
    logger.info("Token cleanup job started");
  }
}

// Export singleton instance
export const authService = new AuthService();
