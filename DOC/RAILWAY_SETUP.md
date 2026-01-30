# Railway Setup — Cleack

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Project                       │
│                        cleack                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Postgres   │  │    Redis     │  │   Backend    │   │
│  │    (DB)      │  │   (Cache)    │  │  (Node.js)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                │                  │            │
│         └────────────────┴──────────────────┘            │
│                          │                               │
│                  ┌──────────────┐                        │
│                  │  Frontend    │                        │
│                  │   (Vite)     │                        │
│                  └──────────────┘                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Services Created

| Service | Type | Status |
|---------|------|--------|
| Postgres | Database | ✅ Created |
| Redis | Database | ✅ Creating |
| Backend | Service | ⏳ To deploy |
| Frontend | Service | ⏳ To deploy |

## Environment Variables (Backend)

Railway auto-injects database URLs. Configure these manually:

```bash
# Core
NODE_ENV=production
PORT=3000

# JWT (generate secure secrets!)
JWT_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-32-char-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database (auto-injected by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (auto-injected by Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Resend Email
RESEND_API_KEY=re_L9yBqtrr_9Cq2nqsT8fbKN29sgPvUx8aM
RESEND_FROM_EMAIL=Cleack <support@cleack.io>
ENABLE_EMAIL=true

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx

# OAuth (optional)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx

# Frontend URL
FRONTEND_URL=https://cleack.io
CORS_ORIGIN=https://cleack.io
```

## Environment Variables (Frontend)

```bash
VITE_API_URL=https://api.cleack.io
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
```

## Deploy Commands

### Backend
```bash
cd backend
railway link  # Select cleack project
railway up    # Deploy
```

### Frontend
```bash
cd frontend-web
railway link  # Select cleack project, create new service
railway up    # Deploy
```

## Custom Domains

After deployment, add custom domains:

```bash
# Backend API
railway domain --service backend
# Then add: api.cleack.io

# Frontend
railway domain --service frontend
# Then add: cleack.io, www.cleack.io
```

## Post-Deploy Checklist

- [ ] Run Prisma migrations: `railway run npx prisma migrate deploy`
- [ ] Verify /health endpoint
- [ ] Test email sending
- [ ] Configure Stripe webhooks to `https://api.cleack.io/api/payments/webhook`
- [ ] Set up custom domains
- [ ] Enable SSL (automatic on Railway)

## Monitoring

```bash
# View logs
railway logs --service backend

# Connect to database
railway connect postgres

# Run commands in service context
railway run npm run prisma:studio
```

## Estimated Costs

| Service | Usage | ~Cost/month |
|---------|-------|-------------|
| Postgres | 1GB | $5 |
| Redis | 500MB | $3 |
| Backend | 512MB RAM | $5 |
| Frontend | Static | $0-5 |
| **Total** | | **~$13-18** |

*Costs vary based on usage. Railway has usage-based pricing.*
