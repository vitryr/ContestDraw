/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // WebSocket URL
  readonly VITE_WS_URL: string;

  // Public URLs
  readonly VITE_PUBLIC_URL: string;
  readonly VITE_CDN_URL: string;

  // Stripe Configuration
  readonly VITE_STRIPE_PUBLIC_KEY: string;

  // OAuth Configuration
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_FACEBOOK_APP_ID: string;

  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_SOCIAL_SHARE: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_48H_PASS: string;
  readonly VITE_ENABLE_WHITE_LABEL: string;

  // Analytics (Optional)
  readonly VITE_MIXPANEL_TOKEN?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;

  // Sentry (Error Tracking)
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT: string;

  // Environment
  readonly VITE_NODE_ENV: string;
  readonly VITE_APP_VERSION: string;

  // Localization
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_SUPPORTED_LANGUAGES: string;

  // Map Configuration
  readonly VITE_MAPBOX_TOKEN?: string;

  // File Upload
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ALLOWED_FORMATS: string;

  // Session
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_TOKEN_REFRESH_INTERVAL: string;

  // UI Configuration
  readonly VITE_THEME_PRIMARY: string;
  readonly VITE_THEME_ACCENT: string;
  readonly VITE_ANIMATION_DURATION: string;

  // Support
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_SUPPORT_PHONE: string;

  // Social Media
  readonly VITE_TWITTER_HANDLE: string;
  readonly VITE_FACEBOOK_PAGE: string;
  readonly VITE_INSTAGRAM_HANDLE: string;

  // Legal
  readonly VITE_COMPANY_NAME: string;
  readonly VITE_COMPANY_ADDRESS: string;
  readonly VITE_DPO_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
