import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import config from "./config/config";
import { logger } from "./utils/logger";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";

// Import essential routes only
import authRoutes from "./api/auth/auth.routes";
import usersRoutes from "./api/users/users.routes";
import drawsRoutes from "./api/draws/draws.routes";
import creditsRoutes from "./api/credits/credits.routes";
import publicRoutes from "./api/public/public.routes";

const app = express();

// Security & middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(config.security.cookieSecret));

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/draws", drawsRoutes);
app.use("/api/credits", creditsRoutes);
app.use("/api/public", publicRoutes);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Start server
const port = config.server.port;
app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${config.server.env} mode`);
  console.log(`✓ Backend server started on http://localhost:${port}`);
});

export default app;
