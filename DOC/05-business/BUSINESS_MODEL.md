# 💰 Business Model

## Modèle de Revenus: Freemium + Credits

### Philosophie
- **1 crédit = 1 tirage** (simple à comprendre)
- 3 crédits gratuits à l'inscription (trial)
- Pas d'abonnement obligatoire

---

## 📊 Grille Tarifaire

### Crédits (One-shot)

| Pack | Prix | Prix/crédit | Discount |
|------|------|-------------|----------|
| 1 crédit | €2.49 | €2.49 | - |
| 5 crédits | €8.00 | €1.60 | -36% |
| 10 crédits | €15.00 | €1.50 | -40% |
| 20 crédits | €28.00 | €1.40 | -44% |

### Abonnements

| Plan | Prix/mois | Prix/an | Inclus |
|------|-----------|---------|--------|
| **48h Pass** | €4.99 | - | Tirages illimités 48h |
| **Monthly** | €19.99 | €199/an | Tirages illimités |
| **Enterprise** | €49.00 | €490/an | Multi-comptes (5) |

---

## 🧮 Économie Unitaire

### Coûts par tirage

| Poste | Coût |
|-------|------|
| Infrastructure | ~€0.01 |
| API calls (Instagram, etc.) | ~€0.02 |
| Stripe fees (2.9%) | ~€0.07 |
| **Total COGS** | **~€0.10** |

### Marges

| Produit | Prix | COGS | Marge |
|---------|------|------|-------|
| 1 crédit | €2.49 | €0.10 | **96%** |
| 48h Pass | €4.99 | €0.50 | **90%** |
| Monthly | €19.99 | €2.00 | **90%** |

---

## 📈 Projections Financières

### Hypothèses
- Conversion trial → paid: 15%
- ARPU (Average Revenue Per User): €8/mois
- Churn mensuel: 8%

### Scénarios

| Mois | Users | Paying | MRR | ARR |
|------|-------|--------|-----|-----|
| M1 | 500 | 75 | €600 | €7.2k |
| M3 | 2,000 | 300 | €2.4k | €28.8k |
| M6 | 5,000 | 750 | €6k | €72k |
| M12 | 15,000 | 2,250 | €18k | €216k |

### Break-even

| Poste | Coût/mois |
|-------|-----------|
| Hébergement | €50 |
| APIs | €50 |
| Outils (Sentry, etc.) | €30 |
| **Total fixe** | **€130** |

**Break-even: ~20 paying users** (€130 / €6.5 ARPU)

---

## 🎯 Stratégie Acquisition

### Canaux Principaux

| Canal | CAC estimé | Potentiel |
|-------|------------|-----------|
| SEO (content) | €5 | ⭐⭐⭐ |
| Influencer collab | €10 | ⭐⭐⭐ |
| Google Ads | €15-25 | ⭐⭐ |
| Meta Ads | €10-20 | ⭐⭐ |
| Product Hunt | €0 | ⭐⭐ |
| Affiliation | €5-10 | ⭐⭐ |

### Content Marketing (priorité)

1. **Guides SEO**
   - "Comment faire un tirage au sort Instagram légal"
   - "Meilleurs outils tirage au sort 2026"
   - "RGPD et jeux concours: le guide complet"

2. **Comparatifs**
   - ContestDraw vs Woobox
   - ContestDraw vs Gleam
   - ContestDraw vs tirage manuel

3. **Templates**
   - Règlement jeu concours (PDF)
   - Checklist légale

---

## 💳 Stripe Configuration

### Products à créer

```javascript
// Credits
const products = [
  { name: 'credit_1', price: 249, credits: 1 },
  { name: 'credit_5', price: 800, credits: 5 },
  { name: 'credit_10', price: 1500, credits: 10 },
  { name: 'credit_20', price: 2800, credits: 20 },
];

// Subscriptions
const subscriptions = [
  { name: 'pass_48h', price: 499, interval: null },
  { name: 'monthly', price: 1999, interval: 'month' },
  { name: 'annual', price: 19900, interval: 'year' },
  { name: 'enterprise', price: 4900, interval: 'month' },
];
```

### Webhooks à configurer

```
checkout.session.completed → Crédit ajouté
customer.subscription.created → Abo activé
customer.subscription.updated → Abo modifié
customer.subscription.deleted → Abo annulé
invoice.payment_failed → Relance paiement
```

---

## 🌍 Pricing International

### Ajustements régionaux

| Région | Ajustement | 1 crédit |
|--------|------------|----------|
| France/EU | Base | €2.49 |
| UK | +0% | £2.49 |
| US | +20% | $2.99 |
| LATAM | -30% | $1.99 |

### Apple IAP (iOS)
- +30% pour couvrir commission Apple
- 1 crédit iOS: €3.49 (vs €2.49 web)

---

## 📊 KPIs à Suivre

### Acquisition
- [ ] Signups/jour
- [ ] Source attribution
- [ ] CAC par canal

### Activation
- [ ] Trial → First draw (%)
- [ ] Time to first draw
- [ ] Onboarding completion

### Revenue
- [ ] MRR / ARR
- [ ] ARPU
- [ ] LTV
- [ ] Credits achetés/mois

### Retention
- [ ] Churn rate
- [ ] DAU/MAU
- [ ] Draws/user/mois

---

## 🚀 Roadmap Monétisation

### Phase 1 (Launch)
- ✅ Packs crédits
- ✅ 48h Pass
- ⬜ Abonnement mensuel

### Phase 2 (Growth)
- ⬜ Abonnement annuel (-17%)
- ⬜ Enterprise multi-comptes
- ⬜ Programme affiliation

### Phase 3 (Scale)
- ⬜ API payante (€0.10/tirage)
- ⬜ White-label
- ⬜ Marketplace templates
