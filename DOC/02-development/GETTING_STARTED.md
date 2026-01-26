# 🚀 Getting Started - Guide Développeur

## Prérequis

| Outil | Version | Installation |
|-------|---------|--------------|
| Node.js | 20+ LTS | https://nodejs.org |
| PostgreSQL | 15+ | `brew install postgresql@15` |
| Redis | 7+ | `brew install redis` |
| Git | 2.40+ | `brew install git` |

---

## 🏁 Installation Rapide

### 1. Cloner le projet

```bash
git clone git@github.com:vitryr/ContestDraw.git
cd ContestDraw
```

### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer la base de données
# Éditer .env avec vos credentials PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/contestdraw"

# Créer la base de données
createdb contestdraw

# Appliquer les migrations
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Lancer le serveur
npm run dev
```

### 3. Frontend Web

```bash
cd frontend-web

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Lancer le serveur de dev
npm run dev
```

### 4. Accéder à l'application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Prisma Studio: `npx prisma studio`

---

## 🐳 Alternative: Docker

```bash
# Lancer tout l'environnement
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

---

## 📁 Structure du Projet

```
ContestDraw/
├── backend/           # API Node.js/Express
│   ├── src/
│   │   ├── api/       # Routes & Controllers
│   │   ├── services/  # Business logic
│   │   ├── jobs/      # Background jobs (Bull)
│   │   ├── middleware/# Auth, validation
│   │   └── utils/     # Helpers
│   ├── prisma/        # DB schema
│   └── tests/         # Tests unitaires
│
├── frontend-web/      # App React
│   ├── src/
│   │   ├── pages/     # Pages/Routes
│   │   ├── components/# Composants UI
│   │   ├── store/     # State (Zustand)
│   │   └── services/  # API client
│   └── tests/
│
├── mobile/            # App React Native
│   ├── src/
│   │   ├── screens/   # Écrans
│   │   ├── components/
│   │   └── navigation/
│   └── ios/ & android/
│
├── DOC/               # Documentation
├── tests/             # Tests E2E (Playwright)
└── docker-compose.yml
```

---

## 🔧 Scripts Utiles

### Backend

```bash
npm run dev          # Lancer en mode dev (watch)
npm run build        # Compiler TypeScript
npm run start        # Lancer en production
npm run test         # Lancer les tests
npm run lint         # Vérifier le code
npm run prisma:studio# Ouvrir Prisma Studio
```

### Frontend

```bash
npm run dev          # Lancer Vite dev server
npm run build        # Build production
npm run preview      # Preview du build
npm run test         # Tests Vitest
npm run lint         # ESLint
```

### Mobile

```bash
npm start            # Expo dev server
npm run ios          # Lancer sur iOS
npm run android      # Lancer sur Android
npm run build:ios    # Build iOS
npm run build:android# Build Android
```

---

## 🧪 Tests

### Lancer tous les tests

```bash
# Backend (Jest)
cd backend && npm test

# Frontend (Vitest)
cd frontend-web && npm test

# E2E (Playwright)
cd tests/e2e && npm test
```

### Coverage

```bash
cd backend && npm run test:coverage
```

---

## 📝 Conventions

### Git

- **Branches**: `feature/xxx`, `fix/xxx`, `chore/xxx`
- **Commits**: Conventional Commits
  ```
  feat: add YouTube comment fetching
  fix: resolve auth token refresh issue
  docs: update API documentation
  ```

### Code Style

- **ESLint** + **Prettier** configurés
- **TypeScript strict mode**
- **Pas de `any`** (sauf exceptions documentées)

### Naming

| Type | Convention | Exemple |
|------|------------|---------|
| Fichiers | kebab-case | `user-service.ts` |
| Classes | PascalCase | `UserService` |
| Fonctions | camelCase | `getUserById` |
| Constantes | UPPER_SNAKE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `UserProfile` |

---

## 🐛 Debugging

### Backend

```bash
# Logs détaillés
DEBUG=* npm run dev

# Inspecter avec Chrome DevTools
node --inspect dist/index.js
```

### Database

```bash
# Voir les queries Prisma
DEBUG="prisma:query" npm run dev

# Prisma Studio (GUI)
npx prisma studio
```

### Frontend

- React DevTools
- Redux DevTools (pour Zustand)
- Network tab pour les API calls

---

## 🆘 Problèmes Courants

### "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### "Port 3000 already in use"

```bash
lsof -i :3000 | grep LISTEN
kill -9 <PID>
```

### "Database connection refused"

```bash
# Vérifier que PostgreSQL tourne
pg_isready

# Ou avec Docker
docker-compose up -d postgres
```

### "Redis connection refused"

```bash
# Lancer Redis
redis-server

# Ou avec Docker
docker-compose up -d redis
```

---

## 📚 Ressources

- [Architecture](../01-architecture/SYSTEM_ARCHITECTURE.md)
- [API Reference](../08-api/API_REFERENCE.md)
- [Database Schema](../01-architecture/DATABASE_SCHEMA.md)
- [Deployment Guide](../03-deployment/DEPLOYMENT_GUIDE.md)
