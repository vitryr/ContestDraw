# 🚀 Guide de Déploiement

## Options d'Hébergement

### Recommandation: Railway (MVP)

| Critère | Railway | Render | Hetzner | AWS |
|---------|---------|--------|---------|-----|
| Setup | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐ |
| Coût | €30-50/mois | €40-70/mois | €15-30/mois | €50-150/mois |
| Scaling | Auto | Auto | Manual | Auto |
| DB Managée | ✅ | ✅ | ❌ | ✅ |
| Redis | ✅ | ✅ | ❌ | ✅ |

---

## 🚂 Déploiement Railway

### 1. Prérequis

- Compte Railway (https://railway.app)
- Repo GitHub connecté
- Variables d'environnement prêtes

### 2. Setup Initial

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Créer le projet
railway init
```

### 3. Services à Créer

```
┌─────────────────────────────────────────────┐
│              Railway Project                 │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Backend │  │PostgreSQL│  │  Redis  │     │
│  │ (Node)  │  │         │  │         │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                             │
│  ┌─────────────────────────────────┐       │
│  │    Frontend (Static/Vercel)     │       │
│  └─────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

### 4. Configuration Backend

**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  }
}
```

**Variables d'environnement Railway:**
```bash
# Database (auto-généré par Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (auto-généré par Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# App
NODE_ENV=production
PORT=3000
API_URL=https://api.cleack.io
FRONTEND_URL=https://cleack.io

# Auth
JWT_SECRET=<générer avec openssl rand -hex 32>
JWT_REFRESH_SECRET=<générer avec openssl rand -hex 32>

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
RESEND_API_KEY=xkeysib-xxx

# OAuth (à configurer)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
INSTAGRAM_CLIENT_ID=xxx
INSTAGRAM_CLIENT_SECRET=xxx
```

### 5. Deploy

```bash
# Deploy backend
cd backend
railway up

# Vérifier les logs
railway logs
```

---

## 🌐 Frontend (Vercel)

### 1. Setup

```bash
# Installer Vercel CLI
npm install -g vercel

# Deploy
cd frontend-web
vercel
```

### 2. Configuration

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3. Variables d'environnement Vercel

```bash
VITE_API_URL=https://api.cleack.io
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## 🔧 Configuration DNS

### Domaines recommandés
- `cleack.io` → Frontend (Vercel)
- `api.cleack.io` → Backend (Railway)

### Cloudflare (recommandé)
```
Type  Name    Content              Proxy
A     @       76.76.21.21          ✅
CNAME api     xxx.railway.app      ✅
CNAME www     cname.vercel-dns.com ✅
```

---

## 🔒 SSL/HTTPS

- **Railway**: SSL automatique
- **Vercel**: SSL automatique
- **Custom domain**: Certificat Let's Encrypt auto

---

## 📊 Monitoring

### Health Check Endpoint

```typescript
// backend/src/api/health.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime()
  });
});
```

### Recommandations
- **Uptime**: BetterUptime ou UptimeRobot (gratuit)
- **Errors**: Sentry
- **Analytics**: Plausible ou Mixpanel

---

## 🔄 CI/CD Pipeline

### GitHub Actions (existant)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/railway-github-action@v1
        with:
          service: backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📋 Checklist Production

```
[ ] Database migrée
[ ] Variables d'environnement configurées
[ ] Stripe webhook URL configuré
[ ] OAuth apps créées (Google, Meta)
[ ] DNS configuré
[ ] SSL vérifié
[ ] Health check fonctionnel
[ ] Monitoring configuré
[ ] Backup DB activé
[ ] Rate limiting activé
```

---

## 🆘 Rollback

```bash
# Railway
railway rollback

# Vercel
vercel rollback
```

---

## 💰 Coûts Estimés (Railway)

| Service | Usage | Coût/mois |
|---------|-------|-----------|
| Backend | 2GB RAM, 1 vCPU | ~$20 |
| PostgreSQL | 1GB | ~$7 |
| Redis | 256MB | ~$5 |
| Egress | 50GB | ~$5 |
| **Total** | | **~$37** |

*Coûts pour ~1000 users actifs*
