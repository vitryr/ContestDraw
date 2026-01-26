import dotenv from "dotenv";

dotenv.config();

/**
 * Application configuration
 * All configuration values are loaded from environment variables
 */
const config = {
  server: {
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    apiUrl: process.env.API_URL || "http://localhost:3000",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  },

  database: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://user:password@localhost:5432/contestdraw",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  email: {
    brevo: {
      apiKey: process.env.BREVO_API_KEY || "",
      fromName: process.env.BREVO_FROM_NAME || "Contest Draw",
      fromEmail: process.env.BREVO_FROM_EMAIL || "noreply@contestdraw.com",
    },
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASSWORD || "",
      },
    },
    from: process.env.EMAIL_FROM || "noreply@contestdraw.com",
  },

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/auth/oauth/google/callback",
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || "",
      appSecret: process.env.FACEBOOK_APP_SECRET || "",
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ||
        "http://localhost:3000/api/auth/oauth/facebook/callback",
    },
  },

  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || "",
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
      prices: {
        pass48h: process.env.STRIPE_PRICE_PASS_48H || "",
        monthly: process.env.STRIPE_PRICE_MONTHLY || "",
        annual: process.env.STRIPE_PRICE_ANNUAL || "",
        enterprise: process.env.STRIPE_PRICE_ENTERPRISE || "",
      },
      products: {
        pass48h: process.env.STRIPE_PRODUCT_48H || "",
        monthly: process.env.STRIPE_PRODUCT_MONTHLY || "",
        annual: process.env.STRIPE_PRODUCT_ANNUAL || "",
        enterprise: process.env.STRIPE_PRODUCT_ENTERPRISE || "",
      },
    },
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  storage: {
    type: process.env.STORAGE_TYPE || "local",
    path: process.env.STORAGE_PATH || "./uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
  },

  social: {
    instagram: {
      clientId: process.env.INSTAGRAM_CLIENT_ID || "",
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "",
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY || "",
      apiSecret: process.env.TWITTER_API_SECRET || "",
    },
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY || "",
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || "",
    },
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
    cookieSecret: process.env.COOKIE_SECRET || "your-cookie-secret",
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    dir: process.env.LOG_DIR || "./logs",
  },

  cors: {
    origin: (() => {
      const corsOrigin =
        process.env.CORS_ORIGIN ||
        process.env.FRONTEND_URL ||
        "http://localhost:5173";
      const origins = corsOrigin.split(",").map((origin) => origin.trim());
      return origins.length === 1 ? origins[0] : origins;
    })(),
  },
};

export default config;
