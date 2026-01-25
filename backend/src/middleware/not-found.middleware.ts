import { Request, Response } from 'express';

/**
 * 404 Not Found middleware
 * Handles requests to non-existent routes
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND'
  });
};
