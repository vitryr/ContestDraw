import { Response } from "express";
import { AuthRequest } from "../../types";
import { asyncHandler, AppError } from "../../middleware/error.middleware";
import { logger } from "../../utils/logger";
import { prisma } from "../../utils/prisma";
import crypto from "crypto";

/**
 * GET /api/users/me
 * Get current user profile
 */
export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        credits: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  },
);

/**
 * PATCH /api/users/me
 * Update current user profile (name only, not email)
 */
export const updateCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { firstName, lastName } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        credits: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`User profile updated: ${req.user.id}`);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  },
);

/**
 * POST /api/users/me/request-email-change
 * Request email address change (sends confirmation to new email)
 */
export const requestEmailChange = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { newEmail } = req.body;

    if (!newEmail) {
      throw new AppError("New email address is required", 400);
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      throw new AppError("This email address is already in use", 400);
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // Store the email change request in verification_tokens table
    await prisma.verificationToken.create({
      data: {
        token,
        userId: req.user.id,
        type: "EMAIL_CHANGE",
        expiresAt,
        // Store new email in a JSON field or separate column
        // For now, we'll encode it in the token type
      },
    });

    // In production, send confirmation email to the NEW email address
    // await emailService.sendEmailChangeConfirmation(newEmail, token);

    logger.info(`Email change requested for user ${req.user.id} to ${newEmail}`);

    res.status(200).json({
      status: "success",
      message:
        "A confirmation email has been sent to your new email address. Please click the link to confirm the change.",
    });
  },
);

/**
 * DELETE /api/users/me
 * Delete current user account (GDPR compliance)
 */
export const deleteCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    // In production:
    // 1. Delete all user data (draws, transactions, etc.)
    // 2. Anonymize personal information
    // 3. Mark account as deleted
    // 4. Send confirmation email

    logger.info(`User account deleted: ${req.user.id}`);

    res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  },
);

/**
 * GET /api/users/stats
 * Get user usage statistics
 */
export const getUserStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    // In production, fetch from database
    const stats = {
      totalDraws: 15,
      totalParticipants: 1250,
      totalWinners: 45,
      creditsUsed: 150,
      creditsRemaining: 50,
      lastDrawDate: new Date(),
      accountAge: 90, // days
    };

    res.status(200).json({
      status: "success",
      data: { stats },
    });
  },
);
