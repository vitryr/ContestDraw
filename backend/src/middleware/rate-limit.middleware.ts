import rateLimit from "express-rate-limit";
import config from "../config/config";

/**
 * General API rate limiter
 * Limits each IP to configured number of requests per window
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  message: {
    status: "error",
    message: "Too many authentication attempts, please try again later",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
});

/**
 * Rate limiter for draw execution
 * Prevents abuse of computational resources
 */
export const drawExecutionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 draws per hour
  message: {
    status: "error",
    message: "Draw execution limit reached, please try again later",
    code: "DRAW_LIMIT_EXCEEDED",
  },
});

/**
 * Rate limiter for email operations
 * Prevents email spam
 */
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 emails per hour
  message: {
    status: "error",
    message: "Email limit reached, please try again later",
    code: "EMAIL_LIMIT_EXCEEDED",
  },
});
