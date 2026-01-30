# 🚀 Cleack - Production Readiness Report

**Date:** 26 Janvier 2026  
**Objectif:** Mise en production et génération de revenus

---

## 📊 Executive Summary

| Catégorie | Statut | Progression |
|-----------|--------|-------------|
| Backend API | 🟡 Partiel | 75% |
| Frontend Web | 🟢 OK | 90% |
| Mobile Apps | 🟡 Partiel | 70% |
| Paiements | 🔴 Bloquant | 40% |
| Infrastructure | 🔴 Bloquant | 20% |
| Tests | 🟡 Partiel | 60% |
| Legal/RGPD | 🟢 OK | 90% |

**Estimation pour MVP Production:** 2-3 semaines de dev

---

## 🔴 BLOQUANTS - À faire AVANT la mise en ligne

### 1. Configuration Stripe Products (2-3 jours)

**Problème:** Aucun produit/prix Stripe configuré dans le code.

**À faire:**
```bash
# Créer les produits dans Stripe Dashboard
- Credit Pack: One Shot (€2.49)
- Credit Pack: 5 Credits (€8)
- Credit Pack: 10 Credits (€15)
- Credit Pack: 20 Credits (€28)
- Subscription: Monthly (€19.99)
- Subscription: Annual (€199)
- Subscription: 48h Pass (€4.99)
```

**Fichiers à modifier:**
- `backend/src/services/pricing.service.ts` - Ajouter les price IDs
- `backend/src/services/stripe.service.ts` - Configurer les webhooks
- `backend/src/scripts/setup-stripe-products.ts` - Script d'init

### 2. Déploiement Infrastructure (3-5 jours)

**État actuel:** Docker Compose local uniquement.

**Options recommandées:**

| Option | Coût/mois | Complexité | Temps |
|--------|-----------|------------|-------|
| Railway | ~$20-50 | ⭐ Facile | 1 jour |
| Render | ~$25-50 | ⭐ Facile | 1 jour |
| AWS (ECS) | ~$50-100 | ⭐⭐⭐ Complexe | 3-5 jours |
| Vercel + Supabase | ~$30-60 | ⭐⭐ Moyen | 2 jours |

**Recommandation:** Railway ou Render pour MVP rapide.

**Checklist déploiement:**
- [ ] Provision PostgreSQL managé
- [ ] Provision Redis managé
- [ ] Configurer variables d'environnement
- [ ] SSL/HTTPS
- [ ] Domain name (cleack.io?)
- [ ] Configurer Stripe webhooks URL
- [ ] Backup automatique DB

### 3. OAuth Social Apps (1-2 jours)

**À créer/configurer:**

| Platform | Status | Console |
|----------|--------|---------|
| Instagram | ❌ À créer | Meta Business Suite |
| Facebook | ❌ À créer | Meta Business Suite |
| Google | ❌ À créer | Google Cloud Console |
| Twitter/X | ❌ À créer | Twitter Developer Portal |
| TikTok | ❌ À créer | TikTok for Developers |
| YouTube | ❌ À créer | Google Cloud Console |

**Note:** Instagram nécessite une app Meta approuvée (peut prendre 1-2 semaines).

---

## 🟡 IMPORTANTS - À faire pour une bonne UX

### 4. Correction Tests API (3-5 jours)

**État:** 50/85 tests passent

**Tests cassés:** Appellent des méthodes qui n'existent plus
- `DrawService.createDraw()` → refactorer tests
- `DrawService.executeDrawWithFilters()` → refactorer tests
- Integration tests → besoin d'une DB de test

### 5. Video Export Animation (3-5 jours)

**État:** `video.service.ts` est un placeholder.

**Options:**
1. **Remotion** (React) - Meilleure qualité, plus complexe
2. **FFmpeg + Canvas** - Plus simple, moins flexible
3. **Puppeteer recording** - Capture du frontend existant

**Impact business:** Feature différenciante pour le partage social.

### 6. E2E Tests (2-3 jours)

**État:** 21/51 tests passent (frontend only)

**Blockers:**
- Backend pas lancé pendant les tests
- MSW (Mock Service Worker) à configurer

### 7. Mobile App Store Submission (5-7 jours)

**Préparation iOS:**
- [ ] Apple Developer Account ($99/an)
- [ ] App Store Connect configuration
- [ ] Screenshots & descriptions
- [ ] Privacy policy URL
- [ ] Review guidelines compliance

**Préparation Android:**
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Play Console configuration
- [ ] Screenshots & descriptions
- [ ] Data safety form

---

## 🟢 OK - Déjà prêt

### Backend Services (22 services)
✅ Auth (JWT + OAuth)
✅ Draw engine (Fisher-Yates + certificat)
✅ Instagram API
✅ Facebook API
✅ Twitter API
✅ TikTok API
✅ YouTube API ← NEW
✅ Stripe payments
✅ Apple IAP
✅ Email (Resend)
✅ Blacklist
✅ Organizations
✅ Subscriptions

### Frontend Pages (14 pages)
✅ Landing page
✅ Auth (login/register)
✅ Dashboard
✅ New Draw
✅ Draw Config
✅ Draw Execution
✅ Results
✅ Pricing
✅ Profile
✅ FAQ
✅ Email Verification
✅ Public Verify (certificat)

### Legal/RGPD
✅ Terms of Service
✅ Privacy Policy
✅ DPO designation process
✅ Cookie consent (à vérifier frontend)

### CI/CD Pipelines
✅ GitHub Actions configuré
✅ Test pipeline
✅ Build pipeline
⚠️ Deploy pipeline (needs infra)

---

## 💰 Revenue-Ready Checklist

### Avant de pouvoir encaisser:

```
[ ] Stripe account vérifié (KYC)
[ ] Products/Prices créés dans Stripe
[ ] Webhooks configurés et testés
[ ] Frontend Checkout flow testé end-to-end
[ ] Email de confirmation achat
[ ] Gestion des remboursements
[ ] Facturation (optionnel mais recommandé)
```

### Business Model Recap:

| Produit | Prix | Marge estimée |
|---------|------|---------------|
| 1 crédit | €2.49 | ~95% |
| 5 crédits | €8 (€1.60/u) | ~95% |
| 10 crédits | €15 (€1.50/u) | ~95% |
| 20 crédits | €28 (€1.40/u) | ~95% |
| Monthly | €19.99 | ~90% |
| Annual | €199 | ~90% |
| 48h Pass | €4.99 | ~95% |

**Coûts fixes estimés:**
- Hébergement: €30-100/mois
- APIs (si quotas dépassés): €0-50/mois
- Stripe fees: 1.4% + €0.25/transaction
- Apple fees (iOS): 30% (15% small business)

---

## 📅 Roadmap Recommandée

### Semaine 1: Infrastructure & Paiements
- Jour 1-2: Déployer sur Railway/Render
- Jour 3: Configurer Stripe products
- Jour 4-5: Tester checkout flow complet

### Semaine 2: OAuth & Tests
- Jour 1-2: Créer apps Meta (Instagram/Facebook)
- Jour 3: Créer apps Google/Twitter
- Jour 4-5: Fixer tests critiques

### Semaine 3: Polish & Launch
- Jour 1-2: Video export (si temps)
- Jour 3: Bug fixes & polish
- Jour 4: Soft launch (beta users)
- Jour 5: Marketing prep

---

## 🎯 MVP Minimum pour Lancement

**Si tu veux lancer en 1 semaine, voici le strict minimum:**

1. ✅ Déployer backend + frontend
2. ✅ Configurer Stripe (1 seul pack pour tester)
3. ✅ Configurer Instagram OAuth (plateforme principale)
4. ⚠️ Skip mobile (web first)
5. ⚠️ Skip video export
6. ⚠️ Skip autres plateformes (Facebook, Twitter, etc.)

**Risques MVP minimal:**
- UX limitée (pas de video)
- Pas d'app mobile
- Une seule plateforme sociale

---

## 📞 Actions Immédiates

1. **Maintenant:** Créer compte Stripe si pas fait
2. **Demain:** Choisir hébergement (Railway recommandé)
3. **Cette semaine:** Déployer et configurer Stripe
4. **Semaine prochaine:** Soft launch

Tu veux que j'attaque quoi en premier ?
