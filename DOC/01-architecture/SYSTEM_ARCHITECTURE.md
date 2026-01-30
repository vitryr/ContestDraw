# 🏗️ Architecture Système

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────┬───────────────────┬───────────────────────────┤
│   Web App       │   Mobile App      │   Public Verify Page      │
│   (React)       │   (React Native)  │   (Embed Widget)          │
└────────┬────────┴─────────┬─────────┴─────────────┬─────────────┘
         │                  │                       │
         └──────────────────┼───────────────────────┘
                           │
                    [HTTPS / WSS]
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    NGINX / LOAD BALANCER                         │
│                    (SSL Termination)                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    BACKEND API (Node.js)                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────────┐  │
│  │   Auth      │   Draws     │   Payments  │   Social APIs   │  │
│  │   Service   │   Service   │   Service   │   Service       │  │
│  └─────────────┴─────────────┴─────────────┴─────────────────┘  │
│  ┌─────────────┬─────────────┬─────────────┬─────────────────┐  │
│  │   Users     │   Credits   │   Email     │   Certificate   │  │
│  │   Service   │   Service   │   Service   │   Service       │  │
│  └─────────────┴─────────────┴─────────────┴─────────────────┘  │
└────────┬────────────────┬────────────────┬──────────────────────┘
         │                │                │
    ┌────┴────┐     ┌─────┴─────┐    ┌─────┴─────┐
    │PostgreSQL│     │   Redis   │    │   Bull    │
    │(Database)│     │  (Cache)  │    │  (Queue)  │
    └─────────┘     └───────────┘    └───────────┘
```

---

## 📦 Stack Technique

### Backend
| Composant | Technologie | Version |
|-----------|-------------|---------|
| Runtime | Node.js | 20 LTS |
| Framework | Express.js | 4.18+ |
| Language | TypeScript | 5.0+ |
| ORM | Prisma | 5.0+ |
| Validation | Zod | 3.0+ |

### Database
| Composant | Technologie | Usage |
|-----------|-------------|-------|
| Primary DB | PostgreSQL | 15+ | Données principales |
| Cache | Redis | 7+ | Sessions, cache API |
| Queue | Bull | 4+ | Jobs asynchrones |

### Frontend Web
| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | React | 18+ |
| Language | TypeScript | 5.0+ |
| Styling | TailwindCSS | 3.0+ |
| State | Zustand | 4.0+ |
| Forms | React Hook Form | 7.0+ |
| Animations | Framer Motion | 10+ |

### Mobile
| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | React Native | 0.72+ |
| Platform | Expo | 49+ |
| Navigation | React Navigation | 6+ |

---

## 🔐 Authentification

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client     │────▶│   Backend    │────▶│   Database   │
│              │     │              │     │              │
│  JWT Token   │◀────│  Validate    │◀────│  User Data   │
└──────────────┘     └──────────────┘     └──────────────┘
        │
        │ OAuth2
        ▼
┌──────────────────────────────────────────────────────┐
│              Identity Providers                       │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────┐ │
│  │ Google │  │Facebook│  │ Apple  │  │Email/Pass  │ │
│  └────────┘  └────────┘  └────────┘  └────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Tokens
- **Access Token**: JWT, 15 min expiry
- **Refresh Token**: JWT, 7 jours expiry
- **Storage**: HttpOnly cookies (web), Secure Storage (mobile)

---

## 💳 Flux de Paiement

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───▶│  Backend │───▶│  Stripe  │───▶│ Webhook  │
│          │    │          │    │          │    │          │
│ Checkout │    │ Session  │    │ Payment  │    │ Confirm  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
                                                      ▼
                                               ┌──────────┐
                                               │ Credits  │
                                               │ Updated  │
                                               └──────────┘
```

---

## 📱 Intégrations Sociales

### APIs Utilisées

| Plateforme | API | Auth | Données |
|------------|-----|------|---------|
| Instagram | Graph API v18 | OAuth2 | Comments, followers |
| Facebook | Graph API v18 | OAuth2 | Comments, likes |
| Twitter/X | API v2 | OAuth2 | Replies, retweets |
| TikTok | Business API | OAuth2 | Comments |
| YouTube | Data API v3 | API Key | Comments |

### Flux d'Import

```
1. User fournit URL du post
2. Backend parse l'URL → identifie plateforme
3. Backend fetch comments via API sociale
4. Job asynchrone (Bull) pour gros imports
5. Filtrage et déduplication
6. Stockage participants en DB
```

---

## 🎲 Algorithme de Tirage

```javascript
// Fisher-Yates Shuffle avec seed cryptographique
function secureDraw(participants, numWinners, seed) {
  // 1. Générer seed crypto si non fourni
  const cryptoSeed = seed || crypto.randomBytes(32).toString('hex');
  
  // 2. Initialiser PRNG avec seed
  const rng = seedrandom(cryptoSeed);
  
  // 3. Fisher-Yates shuffle
  const shuffled = [...participants];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // 4. Sélectionner les N premiers
  const winners = shuffled.slice(0, numWinners);
  
  // 5. Générer certificat avec hash
  const certificate = generateCertificate(winners, cryptoSeed);
  
  return { winners, certificate, seed: cryptoSeed };
}
```

### Vérification Publique
- Hash SHA-256 du tirage stocké
- Page publique `/verify/:hash` pour vérifier
- Widget embeddable pour sites tiers

---

## 📁 Structure du Projet

```
cleack/
├── backend/
│   ├── src/
│   │   ├── api/           # Routes & Controllers
│   │   ├── services/      # Business logic
│   │   ├── jobs/          # Background jobs
│   │   ├── middleware/    # Auth, validation, etc.
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helpers
│   ├── prisma/            # DB schema & migrations
│   └── tests/             # Unit & integration tests
│
├── frontend-web/
│   ├── src/
│   │   ├── pages/         # Route pages
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API client
│   │   └── utils/         # Helpers
│   └── tests/
│
├── mobile/
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Native components
│   │   ├── navigation/    # React Navigation
│   │   └── services/      # API & state
│   └── ios/ & android/
│
├── DOC/                   # Documentation (ce dossier)
├── tests/                 # E2E tests (Playwright)
└── docker-compose.yml     # Local dev environment
```

---

## 🔄 Flux de Données Principal

```
User Action → API Request → Auth Middleware → Controller
                                                  │
                                                  ▼
                                             Service Layer
                                                  │
                              ┌───────────────────┼───────────────────┐
                              ▼                   ▼                   ▼
                          Database            Cache               Queue
                         (Prisma)            (Redis)             (Bull)
```
