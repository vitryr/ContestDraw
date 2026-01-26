import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JWTPayload } from "../types";
import config from "../config/config";
import { logger } from "../utils/logger";

/**
 * Middleware to authenticate JWT tokens
 * Extracts token from Authorization header and verifies it
 * Attaches user data to request object
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        status: "error",
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Attach user to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    logger.error("Authentication error", { error: error.message });

    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        status: "error",
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        status: "error",
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
      return;
    }

    res.status(401).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};

/**
 * Middleware to check if user has required role
 * Must be used after authenticate middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        message: "Not authenticated",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: "error",
        message: "Insufficient permissions",
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Tries to authenticate but doesn't fail if no token provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};
