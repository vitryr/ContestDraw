import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

console.log('✓ Environment variables loaded');

// Import config and logger
import config from './config/config';
import { logger } from './utils/logger';

console.log('✓ Config and logger loaded');

// Import middleware
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';

console.log('✓ Middleware loaded');

// Import routes
import authRoutes from './api/auth/auth.routes';
import usersRoutes from './api/users/users.routes';
import creditsRoutes from './api/credits/credits.routes';
import drawsRoutes from './api/draws/draws.routes';
import socialPlatformsRoutes from './api/social-platforms/social-platforms.routes';
import publicRoutes from './api/public/public.routes';
import blacklistRoutes from './api/blacklist/blacklist.routes';
import verificationRoutes from './api/verification/verification.routes';
import organizationsRoutes from './api/organizations/organizations.routes';
import brandsRoutes from './api/brands/brands.routes';
import brandingRoutes from './api/branding/branding.routes';

console.log('✓ All routes imported');

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.security.cookieSecret));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

console.log('✓ Middleware configured');

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/draws', drawsRoutes);
app.use('/api/social', socialPlatformsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/blacklist', blacklistRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/branding', brandingRoutes);

console.log('✓ Routes mounted');

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

console.log('✓ Error handlers configured');

// Start server
const port = config.server.port;
app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${config.server.env} mode`);
  logger.info(`API available at ${config.server.apiUrl}`);
  console.log(`✓ Server started successfully on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
