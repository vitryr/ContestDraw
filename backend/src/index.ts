import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";

import { logger } from "./utils/logger";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import config from "./config/config";

// Routes
import authRoutes from "./api/auth/auth.routes";
import usersRoutes from "./api/users/users.routes";
import creditsRoutes from "./api/credits/credits.routes";
import drawsRoutes from "./api/draws/draws.routes";
import socialPlatformsRoutes from "./api/social-platforms/social-platforms.routes";
import publicRoutes from "./api/public/public.routes";
import blacklistRoutes from "./api/blacklist/blacklist.routes";
import verificationRoutes from "./api/verification/verification.routes";
import organizationsRoutes from "./api/organizations/organizations.routes";
import brandsRoutes from "./api/brands/brands.routes";
import brandingRoutes from "./api/branding/branding.routes";
import paymentsRoutes from "./api/payments/payments.routes";

// Load environment variables
dotenv.config();

/**
 * Initialize Express application with middleware and routes
 */
class App {
  public app: Application;
  private server: ReturnType<typeof createServer>;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize Express middleware
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(cookieParser(config.security.cookieSecret));

    // Request logging
    this.app.use((req, _res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
      next();
    });
  }

  /**
   * Initialize API routes
   */
  private initializeRoutes(): void {
    // Health check
    this.app.get("/health", (_req, res) => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // API routes
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/users", usersRoutes);
    this.app.use("/api/credits", creditsRoutes);
    this.app.use("/api/draws", drawsRoutes);
    this.app.use("/api/social", socialPlatformsRoutes);
    this.app.use("/api/public", publicRoutes); // Public verification routes (no auth)
    this.app.use("/api/blacklist", blacklistRoutes);
    this.app.use("/api/verification", verificationRoutes);
    // Payments & Subscriptions
    this.app.use("/api/payments", paymentsRoutes);
    // Enterprise features
    this.app.use("/api/organizations", organizationsRoutes);
    this.app.use("/api/brands", brandsRoutes);
    this.app.use("/api/branding", brandingRoutes);
  }

  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  /**
   * Start the Express server
   */
  public listen(): void {
    const port = config.server.port;

    this.server.listen(port, () => {
      logger.info(
        `Server running on port ${port} in ${config.server.env} mode`,
      );
      logger.info(`API available at ${config.server.apiUrl}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => this.shutdown());
    process.on("SIGINT", () => this.shutdown());
  }

  /**
   * Gracefully shutdown the server
   */
  private shutdown(): void {
    logger.info("Shutting down gracefully...");

    this.server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error("Forced shutdown");
      process.exit(1);
    }, 10000);
  }
}

// Start the application
const app = new App();
app.listen();

export default app.app;
