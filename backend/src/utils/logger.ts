import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import config from "../config/config";

/**
 * Custom log format
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

/**
 * Console format for development
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  }),
);

/**
 * Create rotating file transport
 */
const createRotatingFileTransport = (filename: string, level: string) => {
  return new DailyRotateFile({
    filename: path.join(config.logging.dir, `${filename}-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level,
  });
};

/**
 * Winston logger instance
 */
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: "cleack-api" },
  transports: [
    // Console transport (always enabled for container/cloud logs)
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // File transports for local development only
    ...(config.server.env !== "production"
      ? [
          createRotatingFileTransport("error", "error"),
          createRotatingFileTransport("combined", "info"),
        ]
      : []),
  ],
  exceptionHandlers: [
    new winston.transports.Console({ format: consoleFormat }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({ format: consoleFormat }),
  ],
});

/**
 * Stream for Morgan HTTP logger
 */
export const httpLoggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

/**
 * Log helper functions
 */
export const logError = (message: string, error: any, meta?: any) => {
  logger.error(message, {
    error: {
      message: error.message,
      stack: error.stack,
      ...error,
    },
    ...meta,
  });
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// Default export for convenience
export default logger;
