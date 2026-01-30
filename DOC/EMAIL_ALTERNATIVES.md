# 📧 Alternatives Email à Resend - Comparatif

> Dernière mise à jour: 26 janvier 2025
> 
> Comparatif des services d'email transactionnel moins chers que Resend pour Cleack.

---

## 📊 Comparatif Rapide

| Service | Free Tier | Prix 10k emails | Prix 50k emails | Deliverability | Setup |
|---------|-----------|-----------------|-----------------|----------------|-------|
| **Resend** (actuel) | 300/jour | ~$25/mois | ~$65/mois | ⭐⭐⭐⭐ | Facile |
| **Resend** ⭐ | 3k/mois | $20/mois | $50/mois | ⭐⭐⭐⭐⭐ | Très facile |
| **Amazon SES** | 62k gratuits* | $1/mois | $5/mois | ⭐⭐⭐⭐ | Moyen |
| **MailerSend** | 3k/mois | $25/mois | $65/mois | ⭐⭐⭐⭐ | Facile |
| **Postmark** | 100/mois | $15/mois | $55/mois | ⭐⭐⭐⭐⭐ | Facile |
| **Elastic Email** | 100/jour | $9/mois | $25/mois | ⭐⭐⭐ | Facile |

*AWS SES: 62k gratuits/mois si envoyés depuis EC2

---

## 🏆 Recommandations

### Pour Cleack (volume faible-moyen)

#### 1. **Resend** - ⭐ RECOMMANDÉ
- **Prix:** 3k gratuits/mois, puis $20 pour 50k
- **Avantages:**
  - API moderne et simple (React Email compatible)
  - Excellente deliverability
  - Dashboard clair
  - SDK TypeScript natif
- **Inconvénients:**
  - Relativement nouveau (2023)
- **Setup:** 5 minutes

```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend('re_xxxxx');

await resend.emails.send({
  from: 'noreply@cleack.io',
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>Welcome!</p>'
});
```

---

#### 2. **Amazon SES** - 💰 LE MOINS CHER
- **Prix:** $0.10 par 1000 emails (= $5 pour 50k!)
- **Avantages:**
  - Le moins cher en volume
  - Très fiable (infrastructure AWS)
  - Déjà utilisé pour S3
- **Inconvénients:**
  - Configuration plus complexe
  - Faut sortir du "sandbox" manuellement
  - Dashboard moins user-friendly
- **Setup:** 30-60 minutes

```bash
npm install @aws-sdk/client-ses
```

```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: "eu-west-1" });
await client.send(new SendEmailCommand({
  Source: "noreply@cleack.io",
  Destination: { ToAddresses: ["user@example.com"] },
  Message: {
    Subject: { Data: "Hello" },
    Body: { Html: { Data: "<p>Welcome!</p>" } }
  }
}));
```

---

#### 3. **MailerSend** - 🔄 Alternative directe à Resend
- **Prix:** 3k gratuits/mois, puis $25/50k
- **Avantages:**
  - API similaire à Resend
  - Templates intégrés
  - Analytics détaillées
- **Inconvénients:**
  - Pas beaucoup moins cher que Resend
- **Setup:** 10 minutes

---

#### 4. **Postmark** - 📬 Meilleure deliverability
- **Prix:** $15/10k emails
- **Avantages:**
  - Deliverability exceptionnelle
  - Focus transactionnel (pas de spam)
  - Support réactif
- **Inconvénients:**
  - Plus cher que SES/Resend
  - Free tier très limité (100 emails)
- **Setup:** 10 minutes

---

## 💡 Ma Recommandation pour Cleack

### Option A: **Resend** (simplicité)
- Si tu veux un setup rapide et moderne
- Bon compromis prix/qualité
- API très propre

### Option B: **Amazon SES** (économies max)
- Si tu veux minimiser les coûts
- Déjà dans l'écosystème AWS (S3)
- Configuration initiale plus longue mais rentable

### Estimation des coûts mensuels

| Volume estimé | Resend | Resend | Amazon SES |
|---------------|-------|--------|------------|
| 1k emails/mois | $0 | $0 | $0.10 |
| 5k emails/mois | $25 | $0 | $0.50 |
| 10k emails/mois | $25 | $20 | $1 |
| 50k emails/mois | $65 | $50 | $5 |
| 100k emails/mois | $95 | $100 | $10 |

---

## 🔧 Migration depuis Resend

### Si tu choisis Resend:

1. **Installer:**
```bash
npm install resend
npm uninstall resend
```

2. **Créer le nouveau service:**
```typescript
// src/services/email-resend.service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@cleack.io',
    to,
    subject,
    html
  });
}
```

3. **Mettre à jour .env:**
```bash
# Remplacer RESEND_API_KEY par:
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

### Si tu choisis Amazon SES:

1. **Prérequis AWS:**
   - Vérifier le domaine cleack.io dans SES
   - Sortir du sandbox (demande à AWS)
   - Créer IAM user avec permissions SES

2. **Installer:**
```bash
npm install @aws-sdk/client-ses
npm uninstall resend
```

3. **Variables d'environnement:**
```bash
# Réutiliser les credentials AWS existants ou créer spécifiques
AWS_SES_REGION=eu-west-1
# AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY déjà configurés
```

---

## ✅ Checklist Migration

```
[ ] Choisir le nouveau provider
[ ] Créer un compte et vérifier le domaine
[ ] Installer le SDK
[ ] Créer le nouveau email.service.ts
[ ] Mettre à jour les variables d'environnement
[ ] Tester en dev
[ ] Déployer en production
[ ] Supprimer l'ancien SDK (resend)
```

---

## 📞 Contacts / Liens

- **Resend:** https://resend.com - hello@resend.com
- **Amazon SES:** https://aws.amazon.com/ses/
- **MailerSend:** https://www.mailersend.com
- **Postmark:** https://postmarkapp.com

---

*Document généré par Joe ⚡ - 26/01/2025*
