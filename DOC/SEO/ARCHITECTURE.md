# 🏗️ Architecture SEO - Cleack.io

## Vue d'ensemble

Architecture en **cocons sémantiques** avec pages piliers et satellites pour maximiser l'autorité topique.

```
cleack.io/
├── 🏠 Homepage (tirage au sort, jeu concours)
├── 🎯 Pages Outils (par plateforme)
├── 📚 Hub Guides
├── 📝 Blog
├── 🛠️ Outils Gratuits
└── 💼 Pages Commerciales
```

---

## 🗺️ SITEMAP COMPLET

### Structure Française (Principal)

```
/                                    ← Homepage (tirage au sort en ligne)
│
├── /tirage-au-sort-instagram/       ← PILIER #1 (18,100 vol)
│   ├── /tirage-commentaires-instagram/
│   ├── /tirage-likes-instagram/
│   ├── /tirage-stories-instagram/
│   ├── /tirage-reels-instagram/
│   ├── /tirage-abonnes-instagram/
│   └── /giveaway-instagram/
│
├── /tirage-au-sort-tiktok/          ← PILIER #2 (4,400 vol)
│   ├── /tirage-commentaires-tiktok/
│   ├── /giveaway-tiktok/
│   └── /concours-tiktok/
│
├── /tirage-au-sort-facebook/        ← PILIER #3 (5,400 vol)
│   ├── /tirage-commentaires-facebook/
│   ├── /concours-page-facebook/
│   └── /tirage-groupe-facebook/
│
├── /tirage-au-sort-youtube/         ← PILIER #4 (3,600 vol)
│   ├── /tirage-commentaires-youtube/
│   ├── /giveaway-youtube-shorts/
│   └── /concours-youtube/
│
├── /tirage-au-sort-twitter/         ← PILIER #5 (720 vol)
│   ├── /tirage-retweets/
│   ├── /tirage-likes-twitter/
│   └── /giveaway-twitter-x/
│
├── /jeu-concours/                   ← HUB CONCOURS
│   ├── /jeu-concours-instagram/
│   ├── /jeu-concours-facebook/
│   ├── /jeu-concours-tiktok/
│   └── /jeu-concours-youtube/
│
├── /guide/                          ← HUB GUIDES
│   ├── /guide/organiser-jeu-concours/
│   ├── /guide/reglement-jeu-concours/
│   ├── /guide/legal-jeu-concours-france/
│   ├── /guide/augmenter-engagement/
│   └── /guide/meilleurs-outils-tirage/
│
├── /outils/                         ← OUTILS GRATUITS (Linkbait)
│   ├── /outils/generateur-reglement/
│   ├── /outils/compteur-participants/
│   ├── /outils/verificateur-compte/
│   └── /outils/calendrier-concours/
│
├── /blog/                           ← BLOG SEO
│   ├── /blog/comment-faire-tirage-au-sort-instagram/
│   ├── /blog/10-idees-concours-instagram/
│   ├── /blog/comparatif-outils-tirage-au-sort/
│   ├── /blog/regle-jeu-concours-instagram/
│   └── [50+ articles]
│
├── /tarifs/                         ← PAGE COMMERCIALE
├── /fonctionnalites/                ← FEATURES
├── /a-propos/                       ← ABOUT
├── /contact/                        ← CONTACT
├── /faq/                            ← FAQ (Schema)
├── /mentions-legales/               ← LEGAL
├── /politique-confidentialite/      ← PRIVACY
└── /conditions-utilisation/         ← CGU
```

### Structure Anglaise

```
/en/                                 ← Homepage EN
│
├── /en/instagram-giveaway-picker/   ← PILLAR #1
│   ├── /en/instagram-comment-picker/
│   ├── /en/instagram-story-picker/
│   ├── /en/instagram-reels-picker/
│   └── /en/instagram-likes-picker/
│
├── /en/tiktok-giveaway-picker/      ← PILLAR #2
├── /en/facebook-giveaway-picker/    ← PILLAR #3
├── /en/youtube-comment-picker/      ← PILLAR #4
├── /en/twitter-giveaway-picker/     ← PILLAR #5
│
├── /en/guide/
│   ├── /en/guide/instagram-giveaway-guide/
│   ├── /en/guide/giveaway-rules-template/
│   └── /en/guide/giveaway-legal-guide/
│
├── /en/tools/
│   ├── /en/tools/rules-generator/
│   └── /en/tools/winner-certificate/
│
├── /en/blog/
│   ├── /en/blog/how-to-pick-instagram-winner/
│   ├── /en/blog/best-giveaway-picker-tools/
│   └── [30+ articles]
│
└── /en/pricing/
```

---

## 🔗 COCONS SÉMANTIQUES

### Cocon #1: Instagram (Principal)

```
                    ┌─────────────────────────────────┐
                    │   TIRAGE AU SORT INSTAGRAM      │
                    │   (Page Pilier - 3000+ mots)    │
                    │   /tirage-au-sort-instagram/    │
                    └───────────────┬─────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Commentaires  │         │    Stories      │         │     Reels       │
│ /tirage-      │◄───────►│ /tirage-        │◄───────►│ /tirage-        │
│ commentaires- │         │ stories-        │         │ reels-          │
│ instagram/    │         │ instagram/      │         │ instagram/      │
└───────┬───────┘         └────────┬────────┘         └────────┬────────┘
        │                          │                           │
        │         ┌────────────────┼────────────────┐          │
        │         │                │                │          │
        ▼         ▼                ▼                ▼          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        ARTICLES BLOG                                │
│  • Comment faire tirage au sort Instagram                           │
│  • 10 idées concours Instagram                                      │
│  • Règles jeu concours Instagram                                    │
│  • Augmenter engagement Instagram                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Cocon #2: Multi-Plateforme

```
                         ┌─────────────────┐
                         │    HOMEPAGE     │
                         │  /             │
                         └────────┬────────┘
                                  │
    ┌─────────────┬───────────────┼───────────────┬─────────────┐
    │             │               │               │             │
    ▼             ▼               ▼               ▼             ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌─────────┐
│INSTAGRAM│  │  TIKTOK  │  │ FACEBOOK │  │ YOUTUBE │  │ TWITTER │
│(Pilier)│  │ (Pilier) │  │ (Pilier) │  │(Pilier) │  │(Pilier) │
└────┬───┘  └────┬─────┘  └────┬─────┘  └────┬────┘  └────┬────┘
     │           │             │             │            │
     └───────────┴──────┬──────┴─────────────┴────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   JEU CONCOURS  │
              │   (Hub)         │
              └─────────────────┘
```

### Cocon #3: Guides & Legal

```
                    ┌─────────────────────────────────┐
                    │         HUB GUIDES              │
                    │         /guide/                 │
                    └───────────────┬─────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Organiser   │         │   Règlement     │         │     Légal       │
│   Concours    │◄───────►│   Type          │◄───────►│   France        │
│               │         │                 │         │                 │
└───────────────┘         └─────────────────┘         └─────────────────┘
        │                          │                           │
        └──────────────────────────┼───────────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────────┐
                    │     GÉNÉRATEUR RÈGLEMENT        │
                    │     /outils/generateur-         │
                    │     reglement/                  │
                    └─────────────────────────────────┘
```

---

## 📄 TEMPLATES DE PAGES

### Template: Page Pilier Plateforme

```markdown
URL: /tirage-au-sort-{plateforme}/
Title: Tirage au Sort {Plateforme} Gratuit - Choisir un Gagnant | Cleack
H1: Tirage au Sort {Plateforme} - Sélectionnez vos Gagnants en 1 Clic

## Structure:
1. Hero + Outil intégré (above the fold)
2. Comment ça marche (3 étapes)
3. Fonctionnalités clés
4. Types de tirages supportés
5. Avantages Cleack vs concurrence
6. Tutoriel détaillé avec screenshots
7. FAQ (10+ questions Schema)
8. Témoignages utilisateurs
9. Articles connexes (maillage)
10. CTA final

Longueur: 3000-4000 mots
Médias: Vidéo démo, screenshots, infographie
```

### Template: Page Satellite

```markdown
URL: /tirage-{type}-{plateforme}/
Title: Tirage au Sort {Type} {Plateforme} Gratuit | Cleack
H1: Comment Faire un Tirage au Sort des {Type} sur {Plateforme}

## Structure:
1. Hero + Outil
2. Guide rapide
3. Cas d'usage spécifiques
4. Tutoriel étape par étape
5. FAQ (5-7 questions)
6. Lien vers pilier + autres satellites

Longueur: 1500-2000 mots
```

### Template: Article Blog

```markdown
URL: /blog/{slug}/
Title: {Titre Optimisé} | Blog Cleack
H1: {Titre H1 - inclure keyword}

## Structure:
1. Introduction (hook + promise)
2. Table des matières
3. Sections H2/H3 (8-12 sections)
4. Points clés / takeaways
5. CTA vers outil
6. Articles liés

Longueur: 2000-3000 mots
```

---

## 🔀 MAILLAGE INTERNE

### Règles de Maillage

1. **Pilier → Satellites**: Lien vers toutes les pages satellites
2. **Satellite → Pilier**: Toujours remonter vers le pilier
3. **Satellite ↔ Satellite**: Liens croisés entre pages du même cocon
4. **Blog → Outils**: Chaque article lie vers l'outil pertinent
5. **Homepage → Piliers**: Tous les piliers visibles depuis l'accueil

### Matrice de Liens

| From \ To | Home | Instagram | TikTok | Facebook | YouTube | Guides | Blog |
|-----------|------|-----------|--------|----------|---------|--------|------|
| Home | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Instagram | ✅ | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| TikTok | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| Facebook | ✅ | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| YouTube | ✅ | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| Guides | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| Blog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - |

### Anchor Texts Recommandés

| Page Cible | Anchors Primaires | Anchors Secondaires |
|------------|-------------------|---------------------|
| /tirage-au-sort-instagram/ | tirage au sort Instagram, outil tirage Instagram | sélectionner gagnant Instagram, concours Instagram |
| /tirage-au-sort-tiktok/ | tirage au sort TikTok, giveaway TikTok | concours TikTok, choisir gagnant TikTok |
| /guide/reglement-jeu-concours/ | règlement jeu concours, modèle règlement | créer règlement, conditions concours |
| Homepage | Cleack, tirage au sort en ligne | outil tirage au sort, giveaway picker |

---

## 🌐 INTERNATIONALISATION (i18n)

### Structure Hreflang

```html
<!-- Sur /tirage-au-sort-instagram/ -->
<link rel="alternate" hreflang="fr" href="https://cleack.io/tirage-au-sort-instagram/" />
<link rel="alternate" hreflang="en" href="https://cleack.io/en/instagram-giveaway-picker/" />
<link rel="alternate" hreflang="es" href="https://cleack.io/es/sorteo-instagram/" />
<link rel="alternate" hreflang="x-default" href="https://cleack.io/en/instagram-giveaway-picker/" />
```

### Mapping URL Multilingue

| Français | English | Español |
|----------|---------|---------|
| /tirage-au-sort-instagram/ | /en/instagram-giveaway-picker/ | /es/sorteo-instagram/ |
| /tirage-au-sort-tiktok/ | /en/tiktok-giveaway-picker/ | /es/sorteo-tiktok/ |
| /tirage-au-sort-facebook/ | /en/facebook-giveaway-picker/ | /es/sorteo-facebook/ |
| /guide/reglement-jeu-concours/ | /en/guide/giveaway-rules-template/ | /es/guia/reglas-sorteo/ |
| /blog/ | /en/blog/ | /es/blog/ |
| /tarifs/ | /en/pricing/ | /es/precios/ |

---

## 📊 MÉTRIQUES PAR PAGE

### Pages Prioritaires - Objectifs

| Page | Objectif Position | Sessions/mois | Conv. Rate |
|------|-------------------|---------------|------------|
| Homepage | Top 3 "tirage au sort" | 15,000 | 5% |
| /tirage-au-sort-instagram/ | #1 | 25,000 | 8% |
| /tirage-au-sort-tiktok/ | #1 | 8,000 | 8% |
| /tirage-au-sort-facebook/ | #1 | 10,000 | 7% |
| /tirage-au-sort-youtube/ | #1 | 6,000 | 7% |
| /jeu-concours-instagram/ | Top 3 | 5,000 | 6% |
| /guide/reglement-jeu-concours/ | Top 5 | 3,000 | 4% |

---

## ✅ CHECKLIST IMPLÉMENTATION

### Phase 1 - Core (Semaine 1-2)
- [ ] Créer structure dossiers/routes
- [ ] Page pilier Instagram
- [ ] Page pilier TikTok
- [ ] Page pilier Facebook
- [ ] Page pilier YouTube
- [ ] Optimiser Homepage

### Phase 2 - Satellites (Semaine 3-4)
- [ ] 4 satellites par pilier (16 pages)
- [ ] Hub Jeu Concours
- [ ] Maillage interne initial

### Phase 3 - Guides & Blog (Semaine 5-8)
- [ ] Hub Guides (5 guides)
- [ ] 10 premiers articles blog
- [ ] Outils gratuits (2-3)

### Phase 4 - International (Semaine 9-12)
- [ ] Version anglaise (top 10 pages)
- [ ] Hreflang configuration
- [ ] Version espagnole (optionnel)

---

*Document mis à jour: Juin 2025*
