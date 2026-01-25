import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../../middleware/error.middleware';
import { authService } from '../../services/auth.service';
import { logger } from '../../utils/logger';
import { RegisterData, LoginData } from '../../types';

/**
 * POST /api/auth/register
 * POST /api/auth/signup
 * Register a new user account with Prisma database integration
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body as RegisterData;

  // Register user using auth service
  const { user, tokens } = await authService.register({
    email,
    password,
    firstName,
    lastName
  });

  res.status(201).json({
    status: 'success',
    message: 'Registration successful. Please verify your email to unlock all features.',
    data: {
      user,
      ...tokens
    }
  });
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginData;

  // Login user using auth service
  const { user, tokens } = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user,
      ...tokens
    }
  });
});

/**
 * POST /api/auth/verify-email
 * Verify email address with token
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Verification token is required', 400, 'MISSING_TOKEN');
  }

  await authService.verifyEmail(token);

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully. You can now access all features.'
  });
});

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  await authService.requestPasswordReset(email);

  // Always return success to prevent email enumeration
  res.status(200).json({
    status: 'success',
    message: 'If the email exists, a reset link has been sent. Please check your inbox.'
  });
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new AppError('Token and password are required', 400, 'MISSING_FIELDS');
  }

  await authService.resetPassword(token, password);

  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully. You can now login with your new password.'
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400, 'MISSING_TOKEN');
  }

  const tokens = await authService.refreshToken(refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Token refreshed successfully',
    data: tokens
  });
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token deletion)
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // In a stateless JWT setup, logout is handled client-side by deleting tokens
  // For enhanced security, you could implement token blacklisting with Redis

  res.status(200).json({
    status: 'success',
    message: 'Logout successful. Please delete your tokens on the client side.'
  });
});

/**
 * GET /api/auth/oauth/google
 * Initiate Google OAuth flow
 */
export const googleAuth = (_req: Request, res: Response) => {
  // TODO: Implement Google OAuth
  res.status(501).json({
    status: 'error',
    message: 'Google OAuth not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
};

/**
 * GET /api/auth/oauth/google/callback
 * Google OAuth callback
 */
export const googleAuthCallback = asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implement Google OAuth callback
  res.status(501).json({
    status: 'error',
    message: 'Google OAuth callback not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
});

/**
 * GET /api/auth/oauth/facebook
 * Initiate Facebook OAuth flow
 */
export const facebookAuth = (_req: Request, res: Response) => {
  // TODO: Implement Facebook OAuth
  res.status(501).json({
    status: 'error',
    message: 'Facebook OAuth not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
};

/**
 * GET /api/auth/oauth/facebook/callback
 * Facebook OAuth callback
 */
export const facebookAuthCallback = asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implement Facebook OAuth callback
  res.status(501).json({
    status: 'error',
    message: 'Facebook OAuth callback not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
});
