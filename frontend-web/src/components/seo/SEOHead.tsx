import { Helmet } from 'react-helmet-async';

// Types for structured data
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface ReviewData {
  author: string;
  datePublished: string;
  reviewBody: string;
  ratingValue: number;
}

interface SEOHeadProps {
  // Basic meta tags
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  
  // Twitter
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  
  // Multilingual
  hrefLangAlternates?: { lang: string; url: string }[];
  
  // Structured Data
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: FAQItem[];
  howToSteps?: HowToStep[];
  howToName?: string;
  howToDescription?: string;
  howToTotalTime?: string;
  
  // Software Application schema
  includeSoftwareSchema?: boolean;
  softwareRating?: number;
  softwareRatingCount?: number;
  softwareFeatures?: string[];
  
  // Article schema (for blog)
  articleData?: {
    datePublished: string;
    dateModified: string;
    author?: string;
    image?: string;
  };
  
  // Reviews
  reviews?: ReviewData[];
  
  // Additional
  noIndex?: boolean;
  noFollow?: boolean;
}

// Organization schema (constant)
const organizationSchema = {
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
    "availableLanguage": ["French", "English", "Spanish"]
  }
};

// Website schema (constant)
const websiteSchema = {
  "@type": "WebSite",
  "@id": "https://cleack.io/#website",
  "url": "https://cleack.io",
  "name": "Cleack - Tirage au Sort en Ligne",
  "description": "Outil gratuit de tirage au sort pour Instagram, TikTok, Facebook et YouTube",
  "publisher": { "@id": "https://cleack.io/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://cleack.io/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = 'https://cleack.io/images/og-default.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  hrefLangAlternates,
  breadcrumbs,
  faqItems,
  howToSteps,
  howToName,
  howToDescription,
  howToTotalTime = 'PT2M',
  includeSoftwareSchema = false,
  softwareRating = 4.8,
  softwareRatingCount = 1523,
  softwareFeatures = [],
  articleData,
  reviews,
  noIndex = false,
  noFollow = false,
}) => {
  // Build structured data graph
  const structuredDataGraph: object[] = [
    organizationSchema,
    websiteSchema,
  ];

  // WebPage schema
  const webPageSchema: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    "url": canonicalUrl,
    "name": title,
    "description": description,
    "isPartOf": { "@id": "https://cleack.io/#website" },
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    webPageSchema.breadcrumb = { "@id": `${canonicalUrl}#breadcrumb` };
  }

  structuredDataGraph.push(webPageSchema);

  // Breadcrumb schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@id": item.url,
          "name": item.name
        }
      }))
    };
    structuredDataGraph.push(breadcrumbSchema);
  }

  // FAQ schema
  if (faqItems && faqItems.length > 0) {
    const faqSchema = {
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    structuredDataGraph.push(faqSchema);
  }

  // HowTo schema
  if (howToSteps && howToSteps.length > 0 && howToName) {
    const howToSchema: Record<string, unknown> = {
      "@type": "HowTo",
      "name": howToName,
      "description": howToDescription || description,
      "totalTime": howToTotalTime,
      "step": howToSteps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        ...(step.image && { "image": step.image })
      }))
    };
    structuredDataGraph.push(howToSchema);
  }

  // Software Application schema
  if (includeSoftwareSchema) {
    const softwareSchema: Record<string, unknown> = {
      "@type": "SoftwareApplication",
      "@id": `${canonicalUrl}#software`,
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
        "ratingValue": softwareRating.toString(),
        "ratingCount": softwareRatingCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    if (softwareFeatures.length > 0) {
      softwareSchema.featureList = softwareFeatures;
    }

    if (reviews && reviews.length > 0) {
      softwareSchema.review = reviews.map(review => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": review.author },
        "datePublished": review.datePublished,
        "reviewBody": review.reviewBody,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.ratingValue.toString(),
          "bestRating": "5"
        }
      }));
    }

    structuredDataGraph.push(softwareSchema);
  }

  // Article schema (for blog posts)
  if (articleData) {
    const articleSchema = {
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": articleData.image || ogImage,
      "author": {
        "@type": "Organization",
        "name": articleData.author || "Cleack",
        "url": "https://cleack.io"
      },
      "publisher": { "@id": "https://cleack.io/#organization" },
      "datePublished": articleData.datePublished,
      "dateModified": articleData.dateModified,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      }
    };
    structuredDataGraph.push(articleSchema);
  }

  // Build robots meta content
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-snippet:300',
    'max-image-preview:large'
  ].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robotsContent} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Cleack" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@cleack_io" />

      {/* Hreflang alternates for multilingual */}
      {hrefLangAlternates?.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": structuredDataGraph
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
