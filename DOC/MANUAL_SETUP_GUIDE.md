# 🛠️ Cleack - Guide de Configuration Manuelle

> Dernière mise à jour: **27 janvier 2026**
> 
> Ce document liste TOUTES les étapes manuelles à effectuer avant de pouvoir utiliser Cleack en production.
> 
> ⚠️ **AUDIT DU 27/01/2026:** Voir `AUDIT_REPORT.md` pour les problèmes critiques identifiés.

---

## 📊 État Actuel de la Configuration

### ✅ Déjà Configuré
| Service | Status | Notes |
|---------|--------|-------|
| PostgreSQL | ✅ | `cleack_dev` sur localhost |
| Redis | ✅ | localhost:6379 avec password |
| JWT Secrets | ✅ | Générés et configurés |
| Encryption | ✅ | Clés générées |
| Stripe API | ✅ | ⚠️ **CLÉS LIVE** configurées |
| Stripe Products | ✅ | 4 produits créés (48h, Monthly, Annual, Enterprise) |
| Resend (Email) | ✅ | API Key configurée |

### ❌ À Configurer
| Service | Priorité | Impact |
|---------|----------|--------|
| Facebook/Instagram API | 🔴 P0 | **Bloquant** - Core feature |
| Stripe Webhook | 🔴 P0 | **Bloquant** - Paiements |
| AWS S3 | 🟠 P1 | Stockage médias |
| Google OAuth | 🟡 P2 | Login social |
| Twitter API | 🟡 P2 | Tirages Twitter |
| TikTok API | 🟡 P2 | Tirages TikTok |
| YouTube API | 🟡 P2 | Tirages YouTube |
| Apple IAP | 🟡 P2 | Achats in-app iOS |
| Sentry | 🟢 P3 | Monitoring erreurs |

---

## 🚨 CORRECTIONS DE CODE REQUISES (Audit 27/01/2026)

### ⚠️ Auth Controller utilise Mock Database!

**Problème:** `backend/src/api/auth/auth.controller.ts` utilise des `Map<>` en mémoire au lieu de Prisma.
```typescript
// PROBLÈME - Lignes 14-16
const users = new Map<string, any>();  // ❌ Perdu au redémarrage!
```

**Solution:** Migrer vers Prisma comme dans `auth.controller.v2.ts`

---

### ⚠️ Emails non envoyés!

**Problème:** Les tokens de vérification sont juste loggés, pas envoyés.
```typescript
// Ligne 76
// TODO: Send verification email
logger.info(`Verification token for ${email}: ${verificationToken}`);
```

**Solution:** Appeler `emailService.sendVerificationEmail(email, token)`

---

### ⚠️ OAuth Callbacks retournent 501

**Fichiers:** 
- `auth.controller.ts` lignes 260-280
- `auth.controller.v2.ts` lignes 127, 160, 174, 188

**Solution:** Implémenter les callbacks Google/Facebook

---

## 🔴 Étapes Priorité 0 (Bloquantes)

### 1. Facebook/Instagram API (Meta for Developers)

**Pourquoi c'est bloquant:** Sans ça, impossible de récupérer les commentaires/participants des posts Instagram/Facebook.

**Temps estimé:** 1-2 heures

#### Étapes:

1. **Aller sur** https://developers.facebook.com/apps/

2. **Créer une nouvelle app:**
   - Type: "Business"
   - Nom: "Cleack" (ou nom de ton choix)
   - Email de contact

3. **Configurer Instagram Basic Display:**
   - Ajouter le produit "Instagram Basic Display"
   - Créer une nouvelle Instagram App
   - Récupérer:
     - `INSTAGRAM_CLIENT_ID`
     - `INSTAGRAM_CLIENT_SECRET`

4. **Configurer Facebook Login:**
   - Ajouter le produit "Facebook Login"
   - Settings > Valid OAuth Redirect URIs:
     - `http://localhost:8000/api/auth/facebook/callback` (dev)
     - `https://api.cleack.io/api/auth/facebook/callback` (prod)
   - Récupérer:
     - `FACEBOOK_APP_ID`
     - `FACEBOOK_APP_SECRET`

5. **Configurer les permissions (App Review):**
   - `instagram_basic`
   - `instagram_manage_comments`
   - `pages_read_engagement`
   - `pages_show_list`

6. **Mettre à jour le .env:**
```bash
INSTAGRAM_CLIENT_ID=<ton_app_id>
INSTAGRAM_CLIENT_SECRET=<ton_secret>
FACEBOOK_APP_ID=<ton_app_id>
FACEBOOK_APP_SECRET=<ton_secret>
```

7. **Passer l'app en Live Mode** (après tests)

---

### 2. Stripe Webhook

**Pourquoi c'est bloquant:** Sans webhook, Stripe ne peut pas notifier l'app des paiements réussis/échoués.

**Temps estimé:** 15 minutes

#### Étapes:

1. **Aller sur** https://dashboard.stripe.com/webhooks

2. **Créer un endpoint:**
   - URL: `https://api.cleack.io/api/webhooks/stripe`
   - Événements à écouter:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`

3. **Récupérer le Signing Secret** (commence par `whsec_`)

4. **Mettre à jour le .env:**
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

5. **Pour le dev local**, utiliser Stripe CLI:
```bash
stripe listen --forward-to localhost:8000/api/webhooks/stripe
```

---

## 🟠 Étapes Priorité 1 (Importantes)

### 3. AWS S3 (Stockage Médias)

**Pourquoi c'est important:** Stockage des certificats générés, avatars, etc.

**Temps estimé:** 30-45 minutes

#### Étapes:

1. **Créer un compte AWS** (si pas déjà fait): https://aws.amazon.com

2. **Créer un bucket S3:**
   - Région: `eu-west-1` (Irlande)
   - Nom: `cleack-prod-media` (ou similaire)
   - Block Public Access: ON (sécurité)
   - Versioning: Optional

3. **Configurer CORS sur le bucket:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://cleack.io", "http://localhost:3001"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. **Créer un IAM User:**
   - Nom: `cleack-s3-user`
   - Permissions: `AmazonS3FullAccess` (ou policy custom plus restrictive)
   - Récupérer Access Key ID + Secret

5. **(Optionnel) Créer une distribution CloudFront** pour CDN

6. **Mettre à jour le .env:**
```bash
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=cleack-prod-media
AWS_CLOUDFRONT_DOMAIN=dxxxxxxxxxx.cloudfront.net  # si CloudFront
```

---

## 🟡 Étapes Priorité 2 (Features Additionnelles)

### 4. Google OAuth (Login Social)

**Temps estimé:** 20 minutes

1. Aller sur https://console.cloud.google.com/apis/credentials
2. Créer un projet (ou utiliser existant)
3. Créer OAuth 2.0 Client ID (Application Web)
4. Ajouter les URIs de redirection:
   - `http://localhost:8000/api/auth/google/callback`
   - `https://api.cleack.io/api/auth/google/callback`
5. Mettre à jour le .env:
```bash
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

---

### 5. Twitter API v2 (Tirages Twitter)

**⚠️ Note:** Twitter API est maintenant payant (~$100/mois pour Basic tier)

**Temps estimé:** 30 minutes

1. Aller sur https://developer.twitter.com/en/portal/dashboard
2. Créer un projet + app
3. Souscrire au tier "Basic" ($100/mois) ou "Pro"
4. Récupérer les credentials:
```bash
TWITTER_API_KEY=xxxxxxxxxxxxxxxxxx
TWITTER_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_BEARER_TOKEN=AAAAAAAAAxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN=xxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 6. TikTok API

**Temps estimé:** 1 heure (approval process)

1. Aller sur https://developers.tiktok.com/
2. Créer une app
3. Demander les permissions nécessaires
4. Attendre l'approbation (peut prendre quelques jours)
5. Mettre à jour:
```bash
TIKTOK_CLIENT_KEY=xxxxxxxxxxxxxxxx
TIKTOK_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 7. YouTube Data API

**Temps estimé:** 15 minutes

1. Aller sur https://console.cloud.google.com/apis/library/youtube.googleapis.com
2. Activer YouTube Data API v3
3. Créer une API Key
4. Mettre à jour:
```bash
YOUTUBE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 8. Apple In-App Purchases (iOS)

**Prérequis:** Compte Apple Developer ($99/an)

**Temps estimé:** 1 heure

1. Aller sur https://appstoreconnect.apple.com
2. Créer l'app Cleack
3. Configurer les In-App Purchases
4. Générer Shared Secret (pour vérification serveur)
5. Mettre à jour:
```bash
APPLE_IAP_SHARED_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
APPLE_BUNDLE_ID=com.cleack.app
```

---

## 🟢 Étapes Priorité 3 (Optionnelles)

### 9. Sentry (Error Tracking)

**Temps estimé:** 10 minutes

1. Créer compte sur https://sentry.io
2. Créer projet Node.js
3. Récupérer DSN
4. Mettre à jour:
```bash
SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxxx
```

---

### 10. Mixpanel Analytics (User Tracking) ⭐ IMPORTANT

**Pourquoi c'est important:** Comprendre comment les utilisateurs utilisent l'outil, identifier les points de friction, optimiser les conversions.

**Temps estimé:** 15 minutes

#### Étapes:

1. **Créer un compte** sur https://mixpanel.com

2. **Créer un projet:**
   - Nom: "Cleack"
   - Data Residency: **EU** (pour GDPR)

3. **Récupérer le Project Token:**
   - Settings → Project Settings → Project Token

4. **Mettre à jour le .env:**
```bash
MIXPANEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
MIXPANEL_EU_ENDPOINT=true
```

#### Événements trackés automatiquement:

| Événement | Description |
|-----------|-------------|
| `User Signed Up` | Inscription d'un nouveau user |
| `User Logged In` | Connexion |
| `Social Account Connected` | Connexion Instagram/Facebook/etc |
| `Draw Created` | Création d'un tirage |
| `Draw Completed` | Tirage exécuté |
| `Payment Completed` | Paiement réussi |
| `Subscription Created` | Nouvel abonnement |
| `Subscription Cancelled` | Annulation |

#### Dashboard recommandés à créer:

1. **Funnel Conversion:**
   - Signup → Email Verified → First Draw → First Payment

2. **Feature Adoption:**
   - Filtres utilisés
   - Plateformes connectées

3. **Revenue:**
   - MRR, ARPU, Churn

**Google Analytics (optionnel):**
1. Créer propriété GA4 sur https://analytics.google.com
```bash
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 📝 Checklist Récapitulative

```
🚨 CORRECTIONS CODE (P0 - CRITIQUE)
[ ] Migrer auth.controller.ts vers Prisma (pas Map<>)
[ ] Activer envoi d'emails (verification, reset)
[ ] Implémenter OAuth Google callback
[ ] Implémenter OAuth Facebook callback

📡 SERVICES EXTERNES (P0 - BLOQUANT)
[ ] Facebook/Instagram API configurée
[ ] Stripe Webhook configuré
[ ] AWS S3 configuré
[ ] Domaine email vérifié (Resend)

🔐 FEATURES COMPLÈTES (P1)
[ ] Google OAuth
[ ] Twitter API (si tirages Twitter)
[ ] TikTok API (si tirages TikTok)  
[ ] YouTube API (si tirages YouTube)
[ ] Apple IAP (si app iOS)

📊 MONITORING (P2)
[ ] Sentry configuré
[ ] Mixpanel Analytics configuré ✅ (configuré 27/01/2026)

🧪 TESTS (P2)
[ ] Couverture backend > 85%
[ ] Tests E2E frontend
[ ] Tests E2E mobile
```

---

## ⚠️ Notes Importantes

### Clés Stripe LIVE détectées!
Le .env contient des clés Stripe **LIVE** (`sk_live_*`, `pk_live_*`). 
- ✅ OK si tu es prêt pour la production
- ⚠️ Attention aux tests qui créent de vrais paiements!

### Sécurité
- Ne JAMAIS commit le fichier `.env`
- Utiliser des secrets différents pour dev/staging/prod
- Activer 2FA sur tous les services externes

### Domaine Email
Pour que Resend fonctionne en production:
1. Vérifier le domaine `cleack.io` dans Resend
2. Ajouter les enregistrements DNS (SPF, DKIM, DMARC)

---

## 🚀 Commandes Post-Configuration

Une fois tout configuré:

```bash
# Vérifier la config
cd backend
npm run config:check  # si disponible

# Lancer les migrations
npm run migrate

# Démarrer en dev
npm run dev

# Tester le webhook Stripe (terminal séparé)
stripe listen --forward-to localhost:8000/api/webhooks/stripe
```

---

*Document mis à jour par Joe ⚡ - 27/01/2026*
