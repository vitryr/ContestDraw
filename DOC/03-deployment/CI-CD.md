# 🔄 CI/CD Pipeline Documentation

## Overview

Cleack utilise GitHub Actions pour l'intégration continue (CI) et le déploiement continu (CD).

## Workflows

### 📦 CI Pipeline (`ci.yml`)

**Triggers:** `push` et `pull_request` sur `main` et `develop`

| Job | Description | Dépendances |
|-----|-------------|-------------|
| `lint` | ESLint + Prettier check (backend + frontend) | - |
| `typecheck` | TypeScript compilation check | - |
| `test-backend` | Tests unitaires backend avec coverage | - |
| `test-frontend` | Tests unitaires frontend avec coverage | - |
| `test-integration` | Tests d'intégration | lint, typecheck, tests |
| `security` | npm audit + Snyk scan | - |
| `build` | Build Docker images | test-integration, security |

### 🧪 Test Suite (`test.yml`)

**Triggers:** `push` et `pull_request` sur `main` et `develop`

| Job | Description |
|-----|-------------|
| `backend-tests` | Jest + Postgres + coverage |
| `frontend-tests` | Vitest + coverage |
| `e2e-tests` | Playwright E2E |
| `performance-tests` | k6 load tests (main only) |

### 🚀 CD Backend (`cd-backend.yml`)

**Triggers:** `push` sur `main` (paths: `backend/**`)

| Stage | Environment | Actions |
|-------|-------------|---------|
| Build | - | Build Docker → Push ECR |
| Staging | `develop` branch | Migrate DB → Update ECS → Health check |
| Production | `main` branch | Backup DB → Migrate → Blue/Green deploy → Smoke tests → Auto-rollback on failure |

### 🌐 CD Frontend (`cd-frontend.yml`)

**Triggers:** `push` sur `main` (paths: `frontend-web/**`)

| Stage | Environment | Actions |
|-------|-------------|---------|
| Build | - | npm build → Upload artifacts |
| Deploy | Vercel/S3 | CDN invalidation |

### 📱 Mobile Build (`mobile-build.yml`)

**Triggers:** Manual ou tags `v*`

| Platform | Output |
|----------|--------|
| iOS | TestFlight upload |
| Android | Play Store internal track |

---

## Scripts NPM

### Backend

```bash
# Development
npm run dev              # Start with nodemon
npm run build            # TypeScript compilation
npm run start            # Production start
npm run start:prod       # Production with NODE_ENV

# Testing
npm test                 # All tests with coverage
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests (sequential)
npm run test:watch       # Watch mode

# Quality
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format:check     # Prettier check
npm run format           # Prettier fix
npm run typecheck        # TypeScript check

# Database
npm run migrate          # Run migrations (production)
npm run prisma:migrate   # Create migration (dev)
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma Studio
```

### Frontend

```bash
# Development
npm run dev              # Vite dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run tests once
npm run test:unit        # With coverage
npm run test:watch       # Watch mode

# Quality
npm run lint             # ESLint check
npm run lint:fix         # ESLint fix
npm run format:check     # Prettier check
npm run format           # Prettier fix
npm run typecheck        # TypeScript check
```

---

## Structure des Tests

```
cleack/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── __tests__/           # Unit tests services
│   │   │       └── random.service.test.ts
│   │   └── utils/
│   │       └── __tests__/           # Unit tests utils
│   │           └── cache.test.ts
│   └── tests/
│       ├── setup.ts                 # Jest setup
│       ├── unit/                    # Unit tests
│       ├── integration/             # Integration tests
│       └── services/                # Service tests
│
├── frontend-web/
│   └── tests/
│       ├── setup.ts                 # Vitest setup
│       ├── utils/                   # Utils tests
│       │   ├── validation.test.ts
│       │   └── date.test.ts
│       └── components/              # Component tests
│
└── tests/
    ├── e2e/                         # Playwright E2E tests
    ├── performance/                 # k6 load tests
    └── verification.test.ts         # Draw verification tests
```

---

## Coverage Requirements

### Backend (Jest)
```javascript
coverageThreshold: {
  global: {
    branches: 10,
    functions: 10,
    lines: 10,
    statements: 10,
  },
}
```

### Frontend (Vitest)
```javascript
thresholds: {
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80,
}
```

> ⚠️ Frontend thresholds sont élevés - à ajuster selon la couverture réelle.

---

## Secrets GitHub Required

### AWS (Production)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Monitoring
- `SNYK_TOKEN` - Security scanning
- `CODECOV_TOKEN` - Coverage reports (optional)
- `SLACK_WEBHOOK` - Deployment notifications

### Staging
- `STAGING_URL` - Pour les tests de performance

---

## Local Development

### Lancer les tests

```bash
# Backend
cd backend
npm install
npm test

# Frontend
cd frontend-web
npm install
npm test
```

### Vérifier avant commit

```bash
# Backend
cd backend
npm run lint && npm run typecheck && npm run format:check && npm test

# Frontend
cd frontend-web
npm run lint && npm run typecheck && npm run format:check && npm test
```

### Pre-commit hook recommandé

```bash
# .husky/pre-commit
npm run lint
npm run typecheck
npm test -- --passWithNoTests
```

---

## Troubleshooting

### CI échoue sur lint
```bash
npm run lint:fix
npm run format
git add -A && git commit --amend
```

### Tests timeout
- Vérifier `testTimeout` dans jest.config.js
- Les tests d'intégration nécessitent Postgres/Redis

### Coverage trop basse
- Ajouter des tests unitaires pour les services
- Focus sur les branches non couvertes

---

## Roadmap CI/CD

- [ ] Ajouter semantic-release pour versioning automatique
- [ ] Configurer Renovate pour updates de dépendances
- [ ] Ajouter tests de contrat API (Pact)
- [ ] Configurer preview deployments sur PR
