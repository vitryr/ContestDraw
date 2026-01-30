# 📚 Cleack Documentation

> Documentation complète du projet Cleack - Plateforme SaaS de tirage au sort pour réseaux sociaux

---

## 🗂️ Structure de la Documentation

| Dossier | Description |
|---------|-------------|
| [00-overview](./00-overview/) | Vision projet, résumé exécutif |
| [01-architecture](./01-architecture/) | Architecture technique, schémas, stack |
| [02-development](./02-development/) | Guide développeur, setup, conventions |
| [03-deployment](./03-deployment/) | Infrastructure, CI/CD, déploiement |
| [04-production](./04-production/) | Monitoring, sécurité, maintenance |
| [05-business](./05-business/) | Business model, pricing, roadmap |
| [06-legal](./06-legal/) | CGU, politique de confidentialité, RGPD |
| [07-user-guide](./07-user-guide/) | Guides utilisateurs |
| [08-api](./08-api/) | Documentation API (OpenAPI) |

---

## 🚀 Quick Links

### Pour démarrer rapidement
- [Guide d'installation](./02-development/GETTING_STARTED.md)
- [Variables d'environnement](./03-deployment/ENVIRONMENT_VARIABLES.md)
- [Architecture système](./01-architecture/SYSTEM_ARCHITECTURE.md)

### Pour la mise en production
- [Checklist production](./04-production/PRODUCTION_CHECKLIST.md)
- [Guide de déploiement](./03-deployment/DEPLOYMENT_GUIDE.md)
- [Configuration Stripe](./05-business/STRIPE_SETUP.md)

### Ressources business
- [Business Model](./05-business/BUSINESS_MODEL.md)
- [Roadmap](./05-business/ROADMAP.md)
- [Analyse concurrentielle](./05-business/COMPETITIVE_ANALYSIS.md)

---

## 📊 État du Projet

| Composant | Status | Documentation |
|-----------|--------|---------------|
| Backend API | ✅ 90% | [Architecture](./01-architecture/BACKEND.md) |
| Frontend Web | ✅ 90% | [Architecture](./01-architecture/FRONTEND.md) |
| Mobile Apps | 🟡 70% | [Architecture](./01-architecture/MOBILE.md) |
| Infrastructure | 🔴 20% | [Deployment](./03-deployment/DEPLOYMENT_GUIDE.md) |
| Paiements | 🟡 40% | [Stripe Setup](./05-business/STRIPE_SETUP.md) |

---

## 🛠️ Stack Technique

```
Backend:     Node.js + TypeScript + Express
Database:    PostgreSQL + Prisma ORM
Cache:       Redis
Frontend:    React + TypeScript + TailwindCSS
Mobile:      React Native + Expo
Payments:    Stripe + Apple IAP
Auth:        JWT + OAuth2 (Google, Facebook)
CI/CD:       GitHub Actions
```

---

## 📅 Dernière mise à jour

**Date:** 26 Janvier 2026  
**Version:** 1.0.0-beta
