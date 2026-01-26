# 🔐 Variables d'Environnement

## Backend (.env)

### Server
```bash
NODE_ENV=development|staging|production
PORT=3000
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Database
```bash
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/contestdraw

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=           # optionnel en dev
```

### Authentication
```bash
# JWT secrets (générer avec: openssl rand -hex 32)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookie
COOKIE_SECRET=your-cookie-secret-key
```

### OAuth2 Providers
```bash
# Google
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/oauth/google/callback

# Facebook/Instagram (Meta)
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/oauth/facebook/callback
INSTAGRAM_CLIENT_ID=xxx
INSTAGRAM_CLIENT_SECRET=xxx

# Twitter/X
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx

# TikTok
TIKTOK_CLIENT_KEY=xxx
TIKTOK_CLIENT_SECRET=xxx

# YouTube (API key only, no OAuth needed)
YOUTUBE_API_KEY=xxx
```

### Payments
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx       # sk_live_xxx en prod
STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # pk_live_xxx en prod
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Email
```bash
# Brevo (ex-Sendinblue) - Primary
BREVO_API_KEY=xkeysib-xxx
BREVO_FROM_NAME=ContestDraw
BREVO_FROM_EMAIL=noreply@contestdraw.com

# SMTP Fallback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@contestdraw.com
```

### Security
```bash
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Storage
```bash
STORAGE_TYPE=local|s3
STORAGE_PATH=./uploads
MAX_FILE_SIZE=10485760         # 10MB

# Si S3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=eu-west-1
AWS_BUCKET=contestdraw-uploads
```

### Logging
```bash
LOG_LEVEL=debug|info|warn|error
LOG_DIR=./logs
```

---

## Frontend (.env.local)

```bash
# API
VITE_API_URL=http://localhost:3000

# Stripe (public key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Analytics (optionnel)
VITE_PLAUSIBLE_DOMAIN=contestdraw.com
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Mobile (app.config.js / .env)

```bash
# API
API_URL=http://localhost:3000

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Expo
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

## 🔒 Sécurité

### Règles

1. **JAMAIS** commiter les `.env` dans Git
2. **JAMAIS** logger les secrets
3. Utiliser des secrets différents par environnement
4. Rotation des secrets tous les 90 jours (prod)

### Génération des secrets

```bash
# JWT secrets
openssl rand -hex 32

# Cookie secret
openssl rand -base64 32
```

### Gestion des secrets en production

| Service | Recommandation |
|---------|----------------|
| Railway | Variables dans le dashboard |
| Vercel | Environment Variables |
| AWS | Secrets Manager ou Parameter Store |
| Kubernetes | Sealed Secrets ou External Secrets |

---

## 📋 Checklist par Environnement

### Development
```
[x] DATABASE_URL (local PostgreSQL)
[x] REDIS_HOST (localhost)
[x] JWT_SECRET (peut être simple)
[ ] OAuth keys (optionnel pour tester)
[ ] Stripe test keys
```

### Staging
```
[x] DATABASE_URL (managed DB)
[x] REDIS_URL (managed Redis)
[x] JWT secrets (générés)
[x] OAuth keys (dev apps)
[x] Stripe test keys
[x] Brevo API key
```

### Production
```
[x] DATABASE_URL (managed DB avec backup)
[x] REDIS_URL (managed Redis)
[x] JWT secrets (rotatés)
[x] OAuth keys (production apps)
[x] Stripe live keys
[x] Brevo API key
[x] Sentry DSN
[x] Rate limiting activé
```

---

## 🔗 Où obtenir les clés

| Service | URL |
|---------|-----|
| Stripe | https://dashboard.stripe.com/apikeys |
| Google OAuth | https://console.cloud.google.com/apis/credentials |
| Meta (FB/IG) | https://developers.facebook.com/apps |
| Twitter | https://developer.twitter.com/en/portal |
| TikTok | https://developers.tiktok.com |
| YouTube | https://console.cloud.google.com/apis/credentials |
| Brevo | https://app.brevo.com/settings/keys/api |
| Sentry | https://sentry.io/settings/account/api/auth-tokens |
