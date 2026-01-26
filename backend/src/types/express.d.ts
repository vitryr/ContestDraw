/**
 * Type declarations for Express
 * Extends Express Request to include authenticated user
 */

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
