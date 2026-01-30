# 🔧 SEO Technique - Cleack.io

## Checklist Complète

Guide technique pour une performance SEO optimale.

---

## 🚀 CORE WEB VITALS

### Objectifs

| Métrique | Objectif | Outil de mesure |
|----------|----------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | PageSpeed Insights |
| INP (Interaction to Next Paint) | < 200ms | PageSpeed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | PageSpeed Insights |
| TTFB (Time to First Byte) | < 800ms | WebPageTest |
| FCP (First Contentful Paint) | < 1.8s | Lighthouse |

### Optimisations Prioritaires

#### LCP
```
- [ ] Précharger l'image hero (rel="preload")
- [ ] Utiliser format WebP/AVIF
- [ ] CDN pour assets statiques
- [ ] Lazy loading images below the fold
- [ ] Optimiser fonts (font-display: swap)
- [ ] Inline critical CSS
```

#### INP
```
- [ ] Minimiser JavaScript main thread
- [ ] Code splitting / lazy loading JS
- [ ] Debounce événements utilisateur
- [ ] Web Workers pour calculs lourds
- [ ] Éviter layout thrashing
```

#### CLS
```
- [ ] Dimensions explicites sur images/vidéos
- [ ] Réserver espace pour ads/embeds
- [ ] Éviter insertion dynamique de contenu
- [ ] Font fallback avec métriques similaires
- [ ] Skeleton loaders pour contenu async
```

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Structure URL

```
✅ Bonnes pratiques :
/tirage-au-sort-instagram/          (slug descriptif)
/blog/comment-faire-tirage-sort/    (hiérarchie claire)
/en/instagram-giveaway-picker/      (préfixe langue)

❌ À éviter :
/page?id=123                        (paramètres)
/tirage_au_sort_instagram           (underscores)
/Tirage-Au-Sort-Instagram           (majuscules)
```

### Canonical Tags

```html
<!-- Page principale -->
<link rel="canonical" href="https://cleack.io/tirage-au-sort-instagram/">

<!-- Version avec paramètres -->
<!-- Sur /tirage-au-sort-instagram/?ref=header -->
<link rel="canonical" href="https://cleack.io/tirage-au-sort-instagram/">

<!-- Pagination -->
<!-- Sur /blog/page/2/ -->
<link rel="canonical" href="https://cleack.io/blog/page/2/">
<link rel="prev" href="https://cleack.io/blog/">
<link rel="next" href="https://cleack.io/blog/page/3/">
```

### Hreflang (Multilingue)

```html
<!-- Sur chaque page avec équivalent multilingue -->
<link rel="alternate" hreflang="fr" href="https://cleack.io/tirage-au-sort-instagram/">
<link rel="alternate" hreflang="en" href="https://cleack.io/en/instagram-giveaway-picker/">
<link rel="alternate" hreflang="es" href="https://cleack.io/es/sorteo-instagram/">
<link rel="alternate" hreflang="x-default" href="https://cleack.io/en/instagram-giveaway-picker/">
```

---

## 🗺️ SITEMAP & ROBOTS

### sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <url>
    <loc>https://cleack.io/</loc>
    <lastmod>2024-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="https://cleack.io/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://cleack.io/en/"/>
  </url>
  
  <url>
    <loc>https://cleack.io/tirage-au-sort-instagram/</loc>
    <lastmod>2024-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://cleack.io/images/tirage-instagram-og.jpg</image:loc>
      <image:title>Tirage au sort Instagram gratuit</image:title>
    </image:image>
  </url>
  
  <!-- Répéter pour toutes les pages importantes -->
</urlset>
```

### Sitemap Index (si > 50,000 URLs)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://cleack.io/sitemap-pages.xml</loc>
    <lastmod>2024-06-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://cleack.io/sitemap-blog.xml</loc>
    <lastmod>2024-06-01</lastmod>
  </sitemap>
</sitemapindex>
```

### robots.txt

```
User-agent: *
Allow: /

# Bloquer les pages non-SEO
Disallow: /api/
Disallow: /admin/
Disallow: /app/
Disallow: /_next/
Disallow: /checkout/
Disallow: /account/
Disallow: /*?ref=
Disallow: /*?utm_

# Sitemaps
Sitemap: https://cleack.io/sitemap.xml
Sitemap: https://cleack.io/sitemap-fr.xml
Sitemap: https://cleack.io/sitemap-en.xml

# Crawl-delay optionnel
# Crawl-delay: 1
```

---

## 📱 MOBILE & RESPONSIVE

### Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Checklist Mobile

```
- [ ] Touch targets minimum 48x48px
- [ ] Pas de scroll horizontal
- [ ] Text lisible sans zoom (16px min)
- [ ] Formulaires optimisés mobile
- [ ] Menu hamburger accessible
- [ ] Images responsive (srcset)
- [ ] Lazy loading images
- [ ] AMP pages (optionnel pour blog)
```

### Responsive Images

```html
<picture>
  <source 
    type="image/avif"
    srcset="image-400.avif 400w,
            image-800.avif 800w,
            image-1200.avif 1200w"
    sizes="(max-width: 600px) 100vw, 50vw">
  <source 
    type="image/webp"
    srcset="image-400.webp 400w,
            image-800.webp 800w,
            image-1200.webp 1200w"
    sizes="(max-width: 600px) 100vw, 50vw">
  <img 
    src="image-800.jpg"
    alt="Description image"
    width="800"
    height="600"
    loading="lazy"
    decoding="async">
</picture>
```

---

## 🔐 HTTPS & SÉCURITÉ

### Headers Sécurité

```
# .htaccess ou config serveur

# HSTS (après migration HTTPS complète)
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; img-src 'self' data: https:;

# X-Frame-Options
X-Frame-Options: SAMEORIGIN

# X-Content-Type-Options
X-Content-Type-Options: nosniff

# Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin
```

### Redirections HTTPS

```
# Forcer HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Forcer www ou non-www (choisir un)
RewriteCond %{HTTP_HOST} ^www\.cleack\.io [NC]
RewriteRule ^(.*)$ https://cleack.io/$1 [L,R=301]
```

---

## 📊 STRUCTURED DATA (Schema.org)

### Schema Organization (Site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://cleack.io/#organization",
  "name": "Cleack",
  "url": "https://cleack.io",
  "logo": {
    "@type": "ImageObject",
    "url": "https://cleack.io/logo.png",
    "width": 512,
    "height": 512
  },
  "sameAs": [
    "https://twitter.com/cleack_io",
    "https://www.instagram.com/cleack.io/",
    "https://www.linkedin.com/company/cleack/"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@cleack.io",
    "availableLanguage": ["French", "English"]
  }
}
```

### Schema WebSite + SearchAction

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://cleack.io/#website",
  "url": "https://cleack.io",
  "name": "Cleack - Tirage au Sort en Ligne",
  "description": "Outil gratuit de tirage au sort pour Instagram, TikTok, Facebook et YouTube",
  "publisher": {"@id": "https://cleack.io/#organization"},
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://cleack.io/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### Schema SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Cleack",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "priceValidUntil": "2025-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1523",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "Marie L."},
      "datePublished": "2024-03-15",
      "reviewBody": "Super outil, j'ai pu faire mon tirage au sort en 30 secondes !",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  ]
}
```

### Validation Schema

```
Outils de validation :
- https://validator.schema.org/
- https://search.google.com/test/rich-results
- https://developers.google.com/search/docs/appearance/structured-data
```

---

## ⚡ PERFORMANCE

### Compression

```
# Gzip/Brotli dans .htaccess
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Brotli (si disponible)
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/css
  AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json
</IfModule>
```

### Cache Headers

```
# Cache statique long (images, fonts, JS/CSS versionnés)
<FilesMatch "\.(ico|jpg|jpeg|png|gif|webp|avif|svg|woff2|js|css)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Cache HTML court
<FilesMatch "\.(html)$">
  Header set Cache-Control "public, max-age=3600, must-revalidate"
</FilesMatch>
```

### Preload Critical Resources

```html
<head>
  <!-- Preload critical font -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Preload hero image -->
  <link rel="preload" href="/images/hero.webp" as="image" type="image/webp">
  
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  
  <!-- Preload critical CSS -->
  <link rel="preload" href="/css/critical.css" as="style">
</head>
```

### JavaScript Optimization

```html
<!-- Defer non-critical JS -->
<script src="/js/analytics.js" defer></script>

<!-- Async for independent scripts -->
<script src="/js/chat-widget.js" async></script>

<!-- Module for modern browsers -->
<script type="module" src="/js/app.mjs"></script>
<script nomodule src="/js/app-legacy.js"></script>
```

---

## 🔍 INDEXATION

### Meta Robots

```html
<!-- Page indexable (défaut) -->
<meta name="robots" content="index, follow">

<!-- Page non-indexable -->
<meta name="robots" content="noindex, nofollow">

<!-- Indexer mais ne pas suivre les liens -->
<meta name="robots" content="index, nofollow">

<!-- Ne pas afficher en cache -->
<meta name="robots" content="index, follow, noarchive">

<!-- Contrôle snippet -->
<meta name="robots" content="max-snippet:150, max-image-preview:large">
```

### Google Search Console Setup

```
1. Vérifier propriété (DNS, HTML file, ou meta tag)
2. Soumettre sitemap.xml
3. Configurer hreflang si multilingue
4. Vérifier couverture d'indexation
5. Analyser Core Web Vitals
6. Surveiller erreurs crawl
```

### Checklist Indexation

```
- [ ] Sitemap.xml soumis à GSC
- [ ] Robots.txt vérifié
- [ ] Canonical tags corrects
- [ ] Pas de noindex accidentel
- [ ] Pages orphelines identifiées
- [ ] Redirect chains < 3 hops
- [ ] 404 monitorées et corrigées
- [ ] Soft 404 identifiées
```

---

## 🔗 REDIRECTIONS

### Types de Redirections

```
301 - Permanent (transfert SEO ~90-99%)
302 - Temporaire (pas de transfert SEO)
307 - Temporaire strict (POST preserved)
308 - Permanent strict (POST preserved)

→ Toujours utiliser 301 pour SEO
```

### Configuration Redirections

```
# .htaccess
Redirect 301 /ancienne-page/ https://cleack.io/nouvelle-page/

# Redirect pattern
RedirectMatch 301 ^/blog/([0-9]+)/(.*)$ https://cleack.io/blog/$2/

# Next.js (next.config.js)
module.exports = {
  async redirects() {
    return [
      {
        source: '/ancienne-page',
        destination: '/nouvelle-page',
        permanent: true,
      },
    ]
  },
}
```

### Redirect Map (à maintenir)

| Ancienne URL | Nouvelle URL | Date | Raison |
|--------------|--------------|------|--------|
| /giveaway-instagram/ | /tirage-au-sort-instagram/ | 2024-01 | Consolidation FR |
| /tools/picker/ | /tirage-au-sort-instagram/ | 2024-02 | Restructuration |

---

## 📈 MONITORING

### Outils Essentiels

| Outil | Usage | Fréquence |
|-------|-------|-----------|
| Google Search Console | Indexation, CTR, positions | Quotidien |
| Google Analytics 4 | Traffic, comportement | Quotidien |
| PageSpeed Insights | Core Web Vitals | Hebdo |
| Screaming Frog | Audit technique | Mensuel |
| Ahrefs/Semrush | Backlinks, positions | Hebdo |

### Alertes à Configurer

```
Search Console :
- [ ] Baisse indexation > 10%
- [ ] Nouvelles erreurs crawl
- [ ] Pénalité manuelle

Analytics :
- [ ] Baisse traffic > 20%
- [ ] Bounce rate > 70%
- [ ] Temps chargement > 3s

Uptime :
- [ ] Site down
- [ ] Erreurs 5xx
- [ ] SSL expiration
```

### KPIs Techniques

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Pages indexées | 100% pages importantes | - |
| Erreurs crawl | 0 | - |
| LCP mobile | < 2.5s | - |
| INP | < 200ms | - |
| CLS | < 0.1 | - |
| TTFB | < 800ms | - |

---

## ✅ CHECKLIST AUDIT TECHNIQUE

### Crawlabilité
- [ ] Robots.txt ne bloque pas pages importantes
- [ ] Sitemap.xml complet et à jour
- [ ] Pas de pages orphelines
- [ ] Profondeur de clic < 4
- [ ] Maillage interne cohérent

### Indexabilité
- [ ] Canonical tags corrects
- [ ] Pas de duplicate content
- [ ] Meta robots appropriés
- [ ] Hreflang si multilingue
- [ ] Pagination correcte

### Performance
- [ ] Core Web Vitals dans le vert
- [ ] TTFB < 800ms
- [ ] Images optimisées
- [ ] JS/CSS minifiés
- [ ] Compression activée
- [ ] Cache configuré

### Mobile
- [ ] Mobile-friendly test passé
- [ ] Viewport configuré
- [ ] Touch targets 48px+
- [ ] Pas de contenu tronqué

### Sécurité
- [ ] HTTPS forcé
- [ ] Certificat SSL valide
- [ ] Headers sécurité configurés
- [ ] Pas de mixed content

### Structured Data
- [ ] Schema Organization
- [ ] Schema WebSite
- [ ] Schema par type de page
- [ ] Validation sans erreurs

---

## 🛠️ OUTILS RECOMMANDÉS

### Gratuits
- Google Search Console
- Google Analytics 4
- PageSpeed Insights
- Mobile-Friendly Test
- Rich Results Test
- Lighthouse (DevTools)

### Payants
- Screaming Frog (£199/an)
- Ahrefs (€99+/mois)
- Semrush (€99+/mois)
- Sitebulb (£35/mois)

### Extensions Chrome
- SEO Meta in 1 Click
- Lighthouse
- Web Vitals
- Redirect Path
- NoFollow

---

*Dernière mise à jour : Juin 2025*
