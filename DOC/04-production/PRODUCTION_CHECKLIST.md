# ✅ Production Checklist

> Checklist complète avant mise en production de Cleack

---

## 🔴 BLOQUANTS (Must Have)

### Infrastructure
- [ ] Hébergement choisi et configuré (Railway/Render/AWS)
- [ ] PostgreSQL managé avec backup automatique
- [ ] Redis configuré
- [ ] SSL/HTTPS sur tous les domaines
- [ ] DNS configuré (cleack.io, api.cleack.io)

### Paiements
- [ ] Compte Stripe vérifié (KYC complété)
- [ ] Products/Prices créés dans Stripe Dashboard
- [ ] Webhook endpoint configuré et testé
- [ ] Mode Live activé (sortir du mode Test)

### Authentification
- [ ] JWT secrets générés (production)
- [ ] OAuth app Google créée et approuvée
- [ ] OAuth app Meta (Instagram/Facebook) soumise pour review
- [ ] Cookies sécurisés (HttpOnly, Secure, SameSite)

### Email
- [ ] Domaine vérifié dans Resend
- [ ] Templates emails créés (welcome, reset password, receipt)
- [ ] SPF/DKIM/DMARC configurés

### Légal
- [ ] CGU publiées et accessibles
- [ ] Politique de confidentialité publiée
- [ ] Bandeau cookies RGPD
- [ ] Mentions légales

---

## 🟡 IMPORTANTS (Should Have)

### Monitoring
- [ ] Health check endpoint `/health`
- [ ] Uptime monitoring (BetterUptime/UptimeRobot)
- [ ] Error tracking (Sentry)
- [ ] Alertes configurées (downtime, errors)

### Performance
- [ ] Rate limiting activé
- [ ] Compression gzip activée
- [ ] Cache headers configurés
- [ ] Images optimisées

### Sécurité
- [ ] Headers de sécurité (Helmet.js)
- [ ] CORS configuré correctement
- [ ] Input validation sur tous les endpoints
- [ ] SQL injection protection (Prisma = OK)
- [ ] XSS protection

### Backup
- [ ] Backup DB automatique quotidien
- [ ] Rétention 30 jours minimum
- [ ] Test de restauration effectué

### CI/CD
- [ ] Pipeline de test automatisé
- [ ] Pipeline de déploiement automatisé
- [ ] Rollback possible en 1 commande

---

## 🟢 NICE TO HAVE (Could Have)

### Analytics
- [ ] Plausible ou Google Analytics
- [ ] Event tracking (signups, purchases, draws)
- [ ] Funnel analysis configuré

### SEO
- [ ] Meta tags sur toutes les pages
- [ ] Sitemap.xml généré
- [ ] Robots.txt configuré
- [ ] Open Graph tags
- [ ] Schema.org markup

### Performance avancée
- [ ] CDN pour assets statiques
- [ ] Lazy loading images
- [ ] Code splitting
- [ ] Service Worker (PWA)

### Mobile
- [ ] App Store listing préparé
- [ ] Play Store listing préparé
- [ ] Screenshots et descriptions
- [ ] App Review soumise

---

## 📋 Tests Pré-Production

### Tests Fonctionnels
- [ ] Inscription/Connexion
- [ ] Connexion OAuth (Google, Facebook)
- [ ] Achat de crédits (Stripe)
- [ ] Création d'un tirage
- [ ] Import de commentaires Instagram
- [ ] Exécution du tirage
- [ ] Téléchargement du certificat
- [ ] Vérification publique du certificat

### Tests de Charge
- [ ] 100 utilisateurs simultanés
- [ ] Import de 10,000 commentaires
- [ ] Tirage avec 10,000 participants

### Tests de Sécurité
- [ ] Scan OWASP ZAP
- [ ] Test des rate limits
- [ ] Test injection SQL
- [ ] Test XSS

---

## 🚀 Jour J - Launch

### T-24h
- [ ] Freeze du code
- [ ] Tests complets en staging
- [ ] Communication équipe

### T-1h
- [ ] Deploy en production
- [ ] Vérification des logs
- [ ] Test manuel du flow complet

### T+0
- [ ] Monitoring actif
- [ ] Support disponible
- [ ] Annonce (si prévu)

### T+24h
- [ ] Review des erreurs
- [ ] Review des feedbacks
- [ ] Hotfixes si nécessaire

---

## 📊 Métriques à Surveiller (Semaine 1)

| Métrique | Seuil d'alerte |
|----------|---------------|
| Uptime | < 99% |
| Response time | > 500ms |
| Error rate | > 1% |
| Signups/jour | < 10 (si marketing actif) |
| Conversion rate | < 5% |

---

## 🆘 Plan de Rollback

```bash
# Railway
railway rollback

# Vercel
vercel rollback

# Database (si migration cassée)
npx prisma migrate reset --skip-seed
# Puis restaurer depuis backup
```

### Contacts d'urgence
- Tech Lead: [contact]
- DevOps: [contact]
- Stripe Support: https://support.stripe.com
- Railway Support: https://railway.app/help
