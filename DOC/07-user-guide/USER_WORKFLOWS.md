# 🎯 ContestDraw - Workflows & Scénarios Utilisateur

Ce document décrit tous les parcours utilisateur de A à Z, utilisables comme base pour les tests E2E et la documentation.

---

## 📋 Table des Scénarios

| # | Scénario | Priorité | Complexité |
|---|----------|----------|------------|
| 1 | Inscription & Onboarding | 🔴 Critique | Simple |
| 2 | Connexion (Email/OAuth) | 🔴 Critique | Simple |
| 3 | Connexion compte Instagram | 🔴 Critique | Moyenne |
| 4 | Création d'un tirage manuel | 🔴 Critique | Moyenne |
| 5 | Création d'un tirage Instagram | 🔴 Critique | Complexe |
| 6 | Exécution du tirage | 🔴 Critique | Simple |
| 7 | Achat de crédits (Stripe) | 🔴 Critique | Moyenne |
| 8 | Souscription abonnement | 🟠 Important | Moyenne |
| 9 | Achat 48h Pass | 🟠 Important | Simple |
| 10 | Dashboard & Analytics | 🟡 Normal | Simple |
| 11 | Vérification publique du tirage | 🟡 Normal | Simple |
| 12 | Export certificat PDF | 🟡 Normal | Simple |
| 13 | Gestion du profil | 🟢 Optionnel | Simple |
| 14 | Mot de passe oublié | 🟢 Optionnel | Simple |

---

## 🔐 Scénario 1: Inscription & Onboarding

### Pré-requis
- Aucun compte existant
- Email valide

### Étapes

```
1. Landing Page (/)
   → Clic "Commencer gratuitement" ou "S'inscrire"
   
2. Page Auth (/auth)
   → Onglet "Inscription"
   → Saisie: Prénom, Email, Mot de passe
   → Validation password: min 8 chars, 1 majuscule, 1 chiffre, 1 spécial
   → Clic "Créer mon compte"

3. Email de vérification
   → Email envoyé avec lien de vérification
   → Clic sur le lien → /verify-email?token=xxx

4. Vérification email (/verify-email)
   → Token validé
   → Redirection automatique vers /dashboard
   → Toast: "Email vérifié ! Bienvenue sur ContestDraw"

5. Dashboard (/dashboard)
   → Modal onboarding (première connexion)
   → Explication: "3 crédits offerts pour commencer"
   → CTA: "Créer mon premier tirage"
```

### Validations
- [ ] Email unique en BDD
- [ ] Password respecte les règles
- [ ] Token de vérification valide 24h
- [ ] 3 crédits attribués automatiquement
- [ ] Email de bienvenue envoyé

### Données de test
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@test.com",
  "password": "Test123!@#"
}
```

---

## 🔑 Scénario 2: Connexion (Email & OAuth)

### 2a. Connexion Email

```
1. Page Auth (/auth)
   → Onglet "Connexion"
   → Saisie: Email, Mot de passe
   → Clic "Se connecter"

2. Validation
   → JWT généré (access + refresh token)
   → Stockage localStorage
   → Redirection /dashboard

3. Dashboard (/dashboard)
   → Affichage nom utilisateur
   → Affichage crédits restants
```

### 2b. Connexion Google OAuth

```
1. Page Auth (/auth)
   → Clic "Continuer avec Google"
   
2. Popup Google
   → Sélection compte Google
   → Autorisation scopes (email, profile)

3. Callback (/auth/oauth/google/callback)
   → Token échangé
   → Création/liaison compte
   → Redirection /dashboard
```

### 2c. Connexion Facebook OAuth

```
1. Page Auth (/auth)
   → Clic "Continuer avec Facebook"
   
2. Popup Facebook
   → Autorisation app
   
3. Callback (/auth/oauth/facebook/callback)
   → Redirection /dashboard
```

### Validations
- [ ] Rate limiting: 5 tentatives / 15 min
- [ ] Account lockout après 10 échecs
- [ ] Remember me (30 jours)
- [ ] Session expiration (7 jours)

---

## 📱 Scénario 3: Connexion compte Instagram

### Pré-requis
- Utilisateur connecté
- Compte Instagram Business ou Creator

### Étapes

```
1. Dashboard (/dashboard)
   → Section "Comptes connectés"
   → Clic "Connecter Instagram"

2. Popup Instagram/Facebook OAuth
   → Login Instagram via Facebook
   → Autorisation: basic, pages_show_list, instagram_basic
   
3. Sélection page
   → Liste des pages Instagram liées
   → Sélection de la page à connecter

4. Confirmation
   → Toast: "Compte @username connecté"
   → Compte visible dans la liste
   → Permissions: lecture commentaires, likes
```

### Validations
- [ ] Token stocké chiffré en BDD
- [ ] Refresh token automatique
- [ ] Gestion expiration (60 jours)
- [ ] Multi-comptes possible (plan Enterprise)

### Données de test
```json
{
  "platform": "instagram",
  "username": "@test_influencer",
  "accountType": "BUSINESS",
  "followers": 10000
}
```

---

## ✏️ Scénario 4: Création d'un tirage manuel

### Pré-requis
- Utilisateur connecté
- Au moins 1 crédit disponible

### Étapes

```
1. Dashboard (/dashboard)
   → Clic "Nouveau tirage"

2. Page création (/draws/new)
   → Étape 1: Configuration
     - Titre du tirage (obligatoire)
     - Description (optionnel)
     - Nombre de gagnants (1-100)
   
3. Étape 2: Participants
   → Mode "Manuel"
   → Import CSV ou saisie manuelle
   → Format: Nom, Email/Pseudo (1 par ligne)
   → Validation: min 2 participants
   → Détection doublons

4. Étape 3: Options
   → Autoriser doublons (non par défaut)
   → Animation de tirage (oui/non)
   → Suppléants (0-10)

5. Étape 4: Récapitulatif
   → Résumé de la configuration
   → Coût: 1 crédit
   → Clic "Créer le tirage"

6. Confirmation
   → Tirage créé (status: READY)
   → Redirection /draws/:id
   → CTA: "Lancer le tirage"
```

### Validations
- [ ] Titre: max 200 caractères
- [ ] Description: max 1000 caractères
- [ ] Gagnants ≤ Participants
- [ ] Doublons détectés et signalés
- [ ] Draft sauvegardé automatiquement

### Données de test
```json
{
  "title": "Tirage Saint-Valentin 2026",
  "description": "Gagnez un dîner pour 2",
  "numberOfWinners": 1,
  "participants": [
    {"name": "Alice", "identifier": "alice@test.com"},
    {"name": "Bob", "identifier": "bob@test.com"},
    {"name": "Charlie", "identifier": "charlie@test.com"}
  ]
}
```

---

## 📸 Scénario 5: Création d'un tirage Instagram

### Pré-requis
- Utilisateur connecté
- Compte Instagram connecté
- Post Instagram public avec commentaires

### Étapes

```
1. Page création (/draws/new)
   → Sélection source: "Instagram"
   
2. Sélection du post
   → Coller URL du post Instagram
   → Format: https://www.instagram.com/p/XXXXX/
   → Validation URL

3. Import des participants
   → Clic "Récupérer les commentaires"
   → Loading: "Récupération en cours..."
   → Affichage: X commentaires trouvés
   → Preview liste participants

4. Filtrage (optionnel)
   → Filtrer par hashtag requis
   → Filtrer par mention (@ami)
   → Exclure bots (détection auto)
   → Exclure comptes < X followers
   → Exclure comptes < X jours

5. Configuration
   → Nombre de gagnants
   → Vérifier follow (oui/non)
   → Vérifier like (oui/non)

6. Création
   → Récapitulatif avec stats
   → Coût: 1 crédit
   → Clic "Créer le tirage"
```

### Validations
- [ ] URL Instagram valide
- [ ] Post public (non privé)
- [ ] Compte connecté = propriétaire du post
- [ ] Rate limiting API Instagram
- [ ] Cache participants (1h)

### Données de test
```json
{
  "platform": "instagram",
  "postUrl": "https://www.instagram.com/p/ABC123/",
  "filters": {
    "requireHashtag": "#concours",
    "requireMention": true,
    "excludeBots": true,
    "minFollowers": 100,
    "minAccountAge": 30
  }
}
```

---

## 🎲 Scénario 6: Exécution du tirage

### Pré-requis
- Tirage créé (status: READY)
- Crédits suffisants

### Étapes

```
1. Page tirage (/draws/:id)
   → Vérification status: READY
   → Affichage récapitulatif
   → CTA: "Lancer le tirage"

2. Modal confirmation
   → "Cette action va consommer 1 crédit"
   → "Le tirage est définitif et non modifiable"
   → Checkbox: "Je comprends"
   → Clic "Confirmer"

3. Animation (si activée)
   → Fullscreen animation
   → Roulette/Slot machine effect
   → Durée: 5-10 secondes
   → Révélation progressive des gagnants

4. Résultats
   → Liste des gagnants
   → Liste des suppléants
   → Hash de vérification SHA-256
   → Seed utilisé (si custom)
   → Timestamp exact

5. Actions post-tirage
   → Télécharger certificat PDF
   → Exporter CSV/XLSX
   → Partager lien public de vérification
   → Copier résultats
```

### Validations
- [ ] Algorithme: Fisher-Yates (cryptographique)
- [ ] Seed: crypto.randomBytes ou custom
- [ ] Hash: SHA-256(participants + seed + timestamp)
- [ ] Résultats immuables
- [ ] Crédit débité atomiquement

### Algorithme de tirage
```typescript
// Fisher-Yates shuffle avec seed cryptographique
function secureShuffle(array: string[], seed?: string) {
  const rng = seed 
    ? seedrandom(seed) 
    : () => crypto.randomInt(0, 2**32) / 2**32;
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```

---

## 💳 Scénario 7: Achat de crédits (Stripe)

### Pré-requis
- Utilisateur connecté
- Carte bancaire valide

### Étapes

```
1. Dashboard ou modal "Plus de crédits"
   → Clic "Acheter des crédits"

2. Page tarifs (/pricing)
   → Affichage packs disponibles:
     - 1 crédit: €2.49
     - 5 crédits: €8.00 (-36%)
     - 10 crédits: €15.00 (-40%)
     - 20 crédits: €28.00 (-44%)
   → Clic "Acheter" sur un pack

3. Stripe Checkout
   → Redirection vers checkout.stripe.com
   → Saisie carte bancaire
   → Email de facturation
   → Clic "Payer €X.XX"

4. Webhook Stripe
   → Event: checkout.session.completed
   → Crédits ajoutés au compte
   → Facture générée

5. Confirmation (/success)
   → "Paiement réussi !"
   → Affichage nouveau solde
   → Clic "Retour au dashboard"

6. Email confirmation
   → Reçu de paiement
   → Facture PDF en pièce jointe
```

### Validations
- [ ] Idempotency key (éviter doublons)
- [ ] Webhook signature vérifiée
- [ ] Crédits ajoutés atomiquement
- [ ] Facture conforme (TVA, mentions légales)
- [ ] Rollback si erreur

### Données de test Stripe
```json
{
  "card": "4242424242424242",
  "expiry": "12/28",
  "cvc": "123",
  "country": "FR"
}
```

---

## 📅 Scénario 8: Souscription abonnement

### Pré-requis
- Utilisateur connecté
- Pas d'abonnement actif

### Étapes

```
1. Page tarifs (/pricing)
   → Section "Abonnements"
   → Plans: Monthly (€19.99/mois), Enterprise (€49/mois)
   → Clic "S'abonner"

2. Stripe Checkout (subscription mode)
   → Saisie carte
   → Confirmation récurrence mensuelle
   → Clic "S'abonner"

3. Activation
   → Webhook: customer.subscription.created
   → Plan activé immédiatement
   → Tirages illimités débloqués

4. Dashboard mis à jour
   → Badge "Pro" ou "Enterprise"
   → Compteur crédits → "Illimité"
   → Date de renouvellement visible

5. Gestion abonnement
   → Accès portail Stripe (/billing)
   → Modifier carte
   → Annuler abonnement
   → Télécharger factures
```

### Validations
- [ ] Proration si upgrade mid-cycle
- [ ] Grace period 3 jours si paiement échoué
- [ ] Downgrade effectif à la fin du cycle
- [ ] Emails: confirmation, renouvellement, échec

---

## ⚡ Scénario 9: Achat 48h Pass

### Pré-requis
- Utilisateur connecté
- Pas de pass actif

### Étapes

```
1. Dashboard ou Pricing
   → Clic "48h Pass - €4.99"
   → Modal: "Tirages illimités pendant 48h"

2. Stripe Checkout (one-time)
   → Paiement €4.99
   → Confirmation

3. Activation
   → Pass actif immédiatement
   → Expiration: now + 48h
   → Timer visible dans header

4. Pendant le pass
   → Tous les tirages gratuits
   → Compteur: "Pass expire dans Xh"
   → Notification 1h avant expiration

5. Expiration
   → Retour au mode crédits
   → Option: "Renouveler le pass"
```

### Validations
- [ ] Un seul pass actif à la fois
- [ ] Pas de cumul (48h max)
- [ ] Timer précis (secondes)
- [ ] Graceful expiration mid-tirage

---

## 📊 Scénario 10: Dashboard & Analytics

### Étapes

```
1. Dashboard (/dashboard)
   → Stats globales:
     - Tirages effectués (total)
     - Participants traités (total)
     - Crédits restants
   
2. Liste des tirages récents
   → 10 derniers tirages
   → Status: Draft, Ready, Completed
   → Quick actions: Voir, Supprimer

3. Graphiques (si disponibles)
   → Tirages par mois
   → Plateformes utilisées (pie chart)

4. Actions rapides
   → "Nouveau tirage"
   → "Acheter des crédits"
   → "Connecter un compte"
```

---

## ✅ Scénario 11: Vérification publique du tirage

### Pré-requis
- Tirage complété
- URL de vérification

### Étapes

```
1. Page publique (/verify/:hash)
   → Accessible sans connexion
   → Affichage:
     - Titre du tirage
     - Date d'exécution
     - Nombre de participants
     - Gagnants (masqués partiellement: J***n D.)
     - Hash de vérification

2. Vérification du hash
   → Bouton "Vérifier l'intégrité"
   → Recalcul SHA-256
   → ✅ "Hash valide - Tirage authentique"
   → ou ❌ "Hash invalide"

3. Certificat public
   → Télécharger PDF (version publique)
   → QR code vers cette page
```

### Validations
- [ ] Pas de données personnelles exposées
- [ ] Rate limiting (éviter scraping)
- [ ] SEO noindex

---

## 📄 Scénario 12: Export certificat PDF

### Étapes

```
1. Page résultats (/draws/:id)
   → Clic "Télécharger certificat"

2. Génération PDF
   → Loading: "Génération en cours..."
   → Contenu:
     - Logo ContestDraw
     - Titre du tirage
     - Date et heure exactes
     - Liste des gagnants
     - Liste complète participants
     - Hash SHA-256
     - QR code vérification
     - Mentions légales

3. Téléchargement
   → Auto-download: "certificat-tirage-XXXXX.pdf"
   → Format A4, optimisé impression
```

---

## 👤 Scénario 13: Gestion du profil

### Étapes

```
1. Profile (/profile)
   → Informations personnelles
     - Modifier nom, prénom
     - Modifier email (re-vérification)
     - Photo de profil
   
2. Sécurité
   → Changer mot de passe
   → Activer 2FA (optionnel)
   → Sessions actives
   → Déconnexion tous appareils

3. Préférences
   → Langue (FR/EN)
   → Notifications email
   → Newsletter

4. Danger zone
   → Supprimer compte
   → Export données (RGPD)
```

---

## 🔒 Scénario 14: Mot de passe oublié

### Étapes

```
1. Page Auth (/auth)
   → Clic "Mot de passe oublié"

2. Formulaire reset
   → Saisie email
   → Clic "Envoyer le lien"
   → Message: "Si ce compte existe, un email a été envoyé"

3. Email reçu
   → Lien valide 1h
   → Clic → /reset-password?token=xxx

4. Nouveau mot de passe
   → Saisie nouveau password (x2)
   → Validation règles
   → Clic "Réinitialiser"

5. Confirmation
   → "Mot de passe modifié"
   → Redirection /auth
   → Toutes sessions invalidées
```

---

## 🧪 Matrice de Tests E2E

| Scénario | Happy Path | Edge Cases | Erreurs |
|----------|------------|------------|---------|
| Inscription | ✅ | Email existant, Password faible | API down |
| Connexion | ✅ | Mauvais password, Account locked | Rate limit |
| Instagram Connect | ✅ | Token expiré, Permissions refusées | API Instagram down |
| Tirage manuel | ✅ | 1 participant, 1000 participants | Timeout |
| Tirage Instagram | ✅ | Post privé, 0 commentaires | API limit |
| Exécution | ✅ | 0 crédits, Tirage déjà fait | Concurrent execution |
| Paiement | ✅ | Carte refusée, 3DS required | Webhook fail |
| Abonnement | ✅ | Déjà abonné, Downgrade | Payment fail |

---

## 📁 Fichiers de fixtures pour tests

### users.fixture.json
```json
[
  {
    "id": "user-free",
    "email": "free@test.com",
    "password": "Test123!@#",
    "credits": 3,
    "plan": "FREE"
  },
  {
    "id": "user-pro",
    "email": "pro@test.com",
    "password": "Test123!@#",
    "credits": 0,
    "plan": "MONTHLY"
  },
  {
    "id": "user-enterprise",
    "email": "enterprise@test.com",
    "password": "Test123!@#",
    "credits": 0,
    "plan": "ENTERPRISE"
  }
]
```

### draws.fixture.json
```json
[
  {
    "id": "draw-draft",
    "title": "Tirage Draft",
    "status": "DRAFT",
    "participants": []
  },
  {
    "id": "draw-ready",
    "title": "Tirage Prêt",
    "status": "READY",
    "participants": [
      {"name": "Alice", "identifier": "alice@test.com"},
      {"name": "Bob", "identifier": "bob@test.com"}
    ]
  },
  {
    "id": "draw-completed",
    "title": "Tirage Terminé",
    "status": "COMPLETED",
    "winners": ["Alice"],
    "hash": "abc123..."
  }
]
```

---

## 🚀 Prochaines étapes

1. [ ] Implémenter tests E2E Playwright pour chaque scénario
2. [ ] Créer seeds de données pour environnement test
3. [ ] Configurer CI pour exécuter tests sur chaque PR
4. [ ] Ajouter screenshots automatiques pour documentation
5. [ ] Intégrer rapports de couverture
