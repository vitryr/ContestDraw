import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  Users,
  Video,
  Bot,
  Clock,
  Star,
  ArrowRight,
  MessageCircle,
  Heart,
  BookOpen,
  Gift,
  Trophy,
  Sparkles,
  Filter,
  Download,
  Share2,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../components/seo';

// Constants
const CANONICAL_URL = 'https://cleack.io/tirage-au-sort-instagram/';

// Breadcrumb data
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Instagram', url: CANONICAL_URL },
];

// Table of contents
const tocItems: TOCItem[] = [
  { id: 'comment-ca-marche', title: 'Comment ça marche', level: 2 },
  { id: 'fonctionnalites', title: 'Fonctionnalités', level: 2 },
  { id: 'types-tirages', title: 'Types de tirages', level: 2 },
  { id: 'pourquoi-cleack', title: 'Pourquoi Cleack', level: 2 },
  { id: 'tutoriel', title: 'Tutoriel complet', level: 2 },
  { id: 'conseils', title: 'Conseils pour réussir', level: 2 },
  { id: 'faq', title: 'Questions fréquentes', level: 2 },
];

// FAQ data
const faqItems: FAQItem[] = [
  {
    question: "Le tirage au sort Instagram est-il vraiment gratuit ?",
    answer: "Oui, Cleack propose un tirage au sort Instagram <strong>100% gratuit</strong>. Vous pouvez sélectionner jusqu'à 3 gagnants gratuitement par tirage. Pour des fonctionnalités avancées (tirages illimités, export CSV, API), des plans premium sont disponibles à partir de 9€/mois."
  },
  {
    question: "Comment fonctionne le tirage au sort Instagram ?",
    answer: "C'est très simple : collez l'URL de votre publication Instagram dans Cleack. Notre outil récupère automatiquement tous les commentaires, puis sélectionne un ou plusieurs gagnants de manière totalement aléatoire. Une <strong>vidéo preuve</strong> est générée pour garantir la transparence du tirage."
  },
  {
    question: "Dois-je donner accès à mon compte Instagram ?",
    answer: "Non, <strong>aucune connexion</strong> à votre compte Instagram n'est requise. Cleack fonctionne uniquement avec l'URL publique de votre publication. Vos identifiants restent confidentiels et nous n'accédons jamais à votre compte."
  },
  {
    question: "Combien de commentaires Cleack peut-il analyser ?",
    answer: "Il n'y a <strong>pas de limite</strong>. Cleack peut analyser des publications avec des milliers, voire des dizaines de milliers de commentaires. Notre infrastructure est conçue pour traiter de gros volumes rapidement."
  },
  {
    question: "Puis-je filtrer les participants au tirage ?",
    answer: "Oui, vous disposez de filtres avancés : <ul><li>Mentions obligatoires (@ami)</li><li>Hashtags requis</li><li>Nombre minimum de mots</li><li>Exclusion des comptes privés</li><li>Détection des bots et faux comptes</li><li>Exclusion des doublons</li></ul>"
  },
  {
    question: "Le tirage fonctionne-t-il avec les Reels et Stories Instagram ?",
    answer: "Oui ! Cleack supporte tous les formats : <strong>posts classiques, Reels, carrousels</strong>, et même les <strong>Stories</strong> (pour les mentions et réponses). Consultez nos pages dédiées pour chaque format."
  },
  {
    question: "Est-ce légal d'organiser un tirage au sort sur Instagram ?",
    answer: "Oui, c'est parfaitement légal en France à condition de respecter certaines règles : rédiger un règlement clair, ne pas conditionner la participation à un achat, et déclarer les lots de plus de 1000€. Consultez notre <a href='/guide/reglement-jeu-concours/'>guide du règlement jeu concours</a> pour tous les détails."
  },
  {
    question: "Comment contacter le gagnant après le tirage ?",
    answer: "Une fois le tirage effectué, vous pouvez contacter le gagnant de plusieurs façons : <strong>commentaire public</strong> sous votre publication, <strong>message privé Instagram</strong>, ou en partageant la vidéo preuve en story et en le mentionnant."
  },
  {
    question: "Puis-je refaire un tirage si le gagnant ne répond pas ?",
    answer: "Absolument ! Conservez votre liste de participants et relancez un nouveau tirage en excluant le premier gagnant. C'est pour cela qu'il est recommandé de prévoir un délai de réponse dans votre règlement (généralement 48h à 7 jours)."
  },
  {
    question: "Cleack stocke-t-il mes données ou celles des participants ?",
    answer: "Non, Cleack <strong>ne stocke aucune donnée personnelle</strong>. Les commentaires sont analysés en temps réel et supprimés immédiatement après le tirage. Nous sommes 100% conformes au RGPD européen."
  },
];

// HowTo steps for Schema.org
const howToSteps = [
  {
    name: "Copiez le lien de votre publication Instagram",
    text: "Rendez-vous sur votre post Instagram (photo, carrousel ou Reel), cliquez sur les trois points (...) et sélectionnez 'Copier le lien'.",
  },
  {
    name: "Collez le lien dans Cleack",
    text: "Collez l'URL copiée dans le champ prévu sur Cleack. L'outil récupère automatiquement tous les commentaires de votre publication en quelques secondes.",
  },
  {
    name: "Configurez vos filtres",
    text: "Définissez le nombre de gagnants souhaités et activez les filtres optionnels : mentions obligatoires, hashtags requis, exclusion des doublons, détection des faux comptes.",
  },
  {
    name: "Lancez le tirage au sort",
    text: "Cliquez sur 'Tirer au sort'. Cleack sélectionne aléatoirement le ou les gagnants et génère automatiquement une vidéo preuve que vous pouvez partager.",
  },
];

// Software features for Schema.org
const softwareFeatures = [
  "Tirage au sort commentaires Instagram",
  "Tirage au sort likes Instagram",
  "Tirage au sort stories Instagram",
  "Tirage au sort Reels Instagram",
  "Preuve vidéo certifiée du tirage",
  "Détection automatique des faux comptes et bots",
  "Filtres avancés (mentions, hashtags, mots minimum)",
  "Export CSV des participants",
  "API pour automatisation",
  "Multi-gagnants en un clic",
];

// Reviews for Schema.org
const reviews = [
  {
    author: "Marie L.",
    datePublished: "2024-03-15",
    reviewBody: "Super outil ! J'ai pu faire mon tirage au sort Instagram en moins de 30 secondes. La vidéo preuve est top pour montrer que c'est transparent.",
    ratingValue: 5,
  },
  {
    author: "Thomas D.",
    datePublished: "2024-02-28",
    reviewBody: "Enfin un outil qui détecte les faux comptes ! Mes concours sont beaucoup plus équitables maintenant. Je recommande à 100%.",
    ratingValue: 5,
  },
  {
    author: "Sophie M.",
    datePublished: "2024-04-10",
    reviewBody: "Utilisé pour mon concours avec 5000+ commentaires. Rapide, fiable, et gratuit. Que demander de plus ?",
    ratingValue: 5,
  },
];

// Hreflang alternates
const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/instagram-giveaway-picker/' },
  { lang: 'es', url: 'https://cleack.io/es/sorteo-instagram/' },
  { lang: 'x-default', url: 'https://cleack.io/en/instagram-giveaway-picker/' },
];

const TirageInstagramPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Instagram Gratuit - Choisir un Gagnant Aléatoire | Cleack"
        description="Faites un tirage au sort Instagram gratuit en 30 secondes. Sélectionnez un gagnant parmi les commentaires, likes ou abonnés. Outil fiable avec preuve vidéo, utilisé par +50,000 créateurs."
        keywords="tirage au sort instagram, tirage au sort instagram gratuit, giveaway instagram, concours instagram, choisir gagnant instagram, comment picker instagram, tirage commentaire instagram, application tirage au sort instagram"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-instagram.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment faire un tirage au sort Instagram"
        howToDescription="Guide étape par étape pour sélectionner un gagnant aléatoire sur Instagram avec Cleack"
        howToTotalTime="PT2M"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={1523}
        softwareFeatures={softwareFeatures}
        reviews={reviews}
      />

      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Instagram className="w-4 h-4" />
                  Outil #1 en France
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Tirage au Sort Instagram{' '}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Gratuit
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Sélectionnez un <strong>gagnant aléatoire</strong> pour vos concours Instagram en 30 secondes. 
                  Commentaires, likes, stories ou Reels — Cleack gère tout avec une{' '}
                  <strong>preuve vidéo certifiée</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage gratuit
                  </Link>
                  <a
                    href="#comment-ca-marche"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-pink-300 hover:text-pink-600 transition-all"
                  >
                    Comment ça marche ?
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>100% Gratuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span>Sans inscription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span>+50,000 utilisateurs</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Tool Preview / CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-pink-500/10 p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Instagram className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Tirage au Sort Instagram</h2>
                    <p className="text-gray-500 mt-2">Collez votre lien et lancez le tirage</p>
                  </div>

                  {/* Simulated input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://www.instagram.com/p/..."
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        readOnly
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Instagram className="w-5 h-5" />
                      </span>
                    </div>

                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Tirer au sort gratuitement
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">30s</div>
                      <div className="text-sm text-gray-500">Durée moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">∞</div>
                      <div className="text-sm text-gray-500">Commentaires</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-gray-900">4.8</span>
                      </div>
                      <div className="text-sm text-gray-500">Note moyenne</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content with TOC */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} sticky />
            </aside>

            {/* Main Content */}
            <main className="min-w-0">
              {/* Intro paragraph for SEO */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Vous organisez un <strong>concours Instagram</strong> et cherchez un moyen simple, rapide et fiable 
                  de <strong>tirer au sort un gagnant</strong> parmi vos participants ? Cleack est l'outil de tirage 
                  au sort Instagram gratuit #1 en France, utilisé par plus de 50 000 créateurs de contenu, influenceurs 
                  et marques pour sélectionner des gagnants de manière transparente et équitable.
                </p>
                <p className="text-gray-600">
                  Que vous souhaitiez faire un tirage au sort des commentaires Instagram, des likes, des réponses en 
                  stories ou des commentaires sous vos Reels, Cleack s'adapte à tous les formats. Notre outil génère 
                  automatiquement une <strong>vidéo preuve</strong> que vous pouvez partager en story pour montrer à 
                  votre communauté que le tirage était 100% aléatoire et transparent.
                </p>
              </div>

              {/* Section: Comment ça marche */}
              <section id="comment-ca-marche" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Comment Faire un Tirage au Sort Instagram ?
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Faire un tirage au sort sur Instagram n'a jamais été aussi simple. En seulement 4 étapes et moins 
                  de 30 secondes, vous pouvez sélectionner un gagnant parmi des milliers de participants. Voici comment 
                  procéder :
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      step: 1,
                      title: "Copiez le lien de votre publication",
                      description: "Rendez-vous sur votre post Instagram (photo, carrousel ou Reel), cliquez sur les trois points (...) et sélectionnez « Copier le lien ». Vous pouvez aussi copier l'URL directement depuis votre navigateur si vous êtes sur ordinateur.",
                      icon: <Instagram className="w-6 h-6" />,
                    },
                    {
                      step: 2,
                      title: "Collez le lien dans Cleack",
                      description: "Rendez-vous sur Cleack et collez l'URL dans le champ prévu. Notre outil analyse automatiquement votre publication et récupère tous les commentaires en quelques secondes, même s'il y en a des milliers.",
                      icon: <Zap className="w-6 h-6" />,
                    },
                    {
                      step: 3,
                      title: "Configurez vos filtres",
                      description: "Définissez le nombre de gagnants que vous souhaitez sélectionner. Activez les filtres optionnels : mentions obligatoires (@ami), hashtags requis, exclusion des doublons, détection des bots et faux comptes.",
                      icon: <Filter className="w-6 h-6" />,
                    },
                    {
                      step: 4,
                      title: "Lancez le tirage et partagez",
                      description: "Cliquez sur « Tirer au sort ». Cleack sélectionne aléatoirement le ou les gagnants et génère une vidéo preuve que vous pouvez télécharger et partager en story Instagram pour prouver la transparence.",
                      icon: <Trophy className="w-6 h-6" />,
                    },
                  ].map((item) => (
                    <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-pink-600 mb-1">Étape {item.step}</div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <Clock className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Durée totale : moins de 30 secondes</h4>
                      <p className="text-gray-600 text-sm">
                        Contrairement aux méthodes manuelles qui prennent des heures, Cleack automatise tout le processus. 
                        Vous gagnez un temps précieux que vous pouvez consacrer à votre contenu et votre communauté.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Fonctionnalités */}
              <section id="fonctionnalites" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Pourquoi Choisir Cleack pour Vos Tirages Instagram ?
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Cleack n'est pas un simple générateur de nombres aléatoires. C'est un outil professionnel conçu 
                  spécifiquement pour les tirages au sort sur les réseaux sociaux, avec des fonctionnalités exclusives 
                  que vous ne trouverez nulle part ailleurs.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Preuve Vidéo Certifiée",
                      description: "Cleack est le seul outil qui génère automatiquement une vidéo du tirage au sort. Partagez-la en story Instagram pour prouver à votre communauté que le tirage était équitable et transparent.",
                      highlight: true,
                    },
                    {
                      icon: <Bot className="w-6 h-6" />,
                      title: "Détection des Faux Comptes",
                      description: "Notre algorithme d'intelligence artificielle identifie et exclut automatiquement les bots, les comptes suspects et les participants frauduleux pour garantir un tirage 100% équitable.",
                      highlight: true,
                    },
                    {
                      icon: <Zap className="w-6 h-6" />,
                      title: "Rapide et Sans Inscription",
                      description: "Pas besoin de créer un compte pour faire un tirage simple. Collez votre lien Instagram et obtenez un gagnant en moins de 30 secondes. Aucune connexion à votre compte Instagram n'est requise.",
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: "Sécurisé et Conforme RGPD",
                      description: "Vos données et celles de vos participants ne sont jamais stockées. Cleack est 100% conforme au Règlement Général sur la Protection des Données (RGPD) européen.",
                    },
                    {
                      icon: <Filter className="w-6 h-6" />,
                      title: "Filtres Avancés",
                      description: "Personnalisez votre tirage avec des filtres puissants : mentions obligatoires, hashtags requis, nombre minimum de mots, exclusion des comptes privés, et bien plus encore.",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Multi-Gagnants",
                      description: "Sélectionnez plusieurs gagnants en un seul tirage. Idéal pour les concours avec plusieurs lots ou les tirages au sort avec des gagnants de réserve.",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-xl p-6 border ${
                        feature.highlight ? 'border-pink-200 ring-2 ring-pink-100' : 'border-gray-100'
                      } hover:shadow-lg transition-shadow`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        feature.highlight 
                          ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                      {feature.highlight && (
                        <span className="inline-block mt-3 text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded">
                          Exclusif Cleack
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Types de tirages */}
              <section id="types-tirages" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Types de Tirages au Sort Instagram Supportés
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Cleack s'adapte à tous les formats de contenu Instagram. Que vous organisiez un concours sur un post 
                  classique, un Reel viral ou même en stories, notre outil récupère et analyse tous les participants.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Tirage au Sort des Commentaires Instagram",
                      description: "Le format le plus classique et le plus populaire. Sélectionnez un gagnant aléatoire parmi toutes les personnes qui ont commenté votre publication. Parfait pour les concours « commente pour participer » ou « tag un ami pour participer ».",
                      link: "/tirage-commentaires-instagram/",
                      stats: "Format le plus utilisé",
                    },
                    {
                      icon: <Heart className="w-6 h-6" />,
                      title: "Tirage au Sort des Likes Instagram",
                      description: "Récompensez l'engagement silencieux ! Sélectionnez un gagnant parmi les personnes qui ont aimé votre publication. Idéal pour les concours rapides où vous voulez maximiser la participation sans demander d'effort.",
                      link: "/tirage-likes-instagram/",
                      stats: "Engagement facile",
                    },
                    {
                      icon: <Play className="w-6 h-6" />,
                      title: "Tirage au Sort des Stories Instagram",
                      description: "Analysez les réponses à vos stories ou les mentions de votre compte. Parfait pour les concours interactifs type quiz, sondages ou « partage cette story pour participer ».",
                      link: "/tirage-stories-instagram/",
                      stats: "Format interactif",
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Tirage au Sort des Reels Instagram",
                      description: "Les Reels génèrent souvent des milliers de commentaires. Cleack analyse tous les commentaires de vos Reels, même les plus viraux, et sélectionne un gagnant de manière totalement aléatoire.",
                      link: "/tirage-reels-instagram/",
                      stats: "Forte viralité",
                    },
                  ].map((type, index) => (
                    <Link
                      key={index}
                      to={type.link}
                      className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center text-pink-600 flex-shrink-0 group-hover:from-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                              {type.title}
                            </h3>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {type.stats}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                          <span className="inline-flex items-center gap-1 text-pink-600 text-sm font-medium group-hover:gap-2 transition-all">
                            En savoir plus <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section: Comparatif */}
              <section id="pourquoi-cleack" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Cleack vs. La Concurrence : Comparatif Complet
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Il existe plusieurs outils de tirage au sort Instagram sur le marché. Voici pourquoi Cleack se 
                  démarque de la concurrence et pourquoi plus de 50 000 créateurs nous font confiance.
                </p>

                <div className="overflow-x-auto mb-8">
                  <table className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        <th className="px-6 py-4 text-left font-semibold">Fonctionnalité</th>
                        <th className="px-6 py-4 text-center font-semibold">Cleack</th>
                        <th className="px-6 py-4 text-center font-semibold">App-Sorteos</th>
                        <th className="px-6 py-4 text-center font-semibold">Wask</th>
                        <th className="px-6 py-4 text-center font-semibold">Comment Picker</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { feature: "Gratuit", cleack: true, appSorteos: "Limité", wask: "Limité", commentPicker: true },
                        { feature: "Preuve vidéo", cleack: true, appSorteos: false, wask: false, commentPicker: false },
                        { feature: "Détection bots", cleack: true, appSorteos: false, wask: false, commentPicker: false },
                        { feature: "Sans inscription", cleack: true, appSorteos: true, wask: false, commentPicker: true },
                        { feature: "Support Reels", cleack: true, appSorteos: true, wask: true, commentPicker: false },
                        { feature: "Support Stories", cleack: true, appSorteos: false, wask: false, commentPicker: false },
                        { feature: "Multi-gagnants", cleack: true, appSorteos: true, wask: true, commentPicker: false },
                        { feature: "Filtres avancés", cleack: true, appSorteos: "Basique", wask: "Basique", commentPicker: false },
                        { feature: "Export CSV", cleack: true, appSorteos: "Premium", wask: "Premium", commentPicker: false },
                        { feature: "API disponible", cleack: true, appSorteos: false, wask: false, commentPicker: false },
                      ].map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-3 font-medium text-gray-900">{row.feature}</td>
                          <td className="px-6 py-3 text-center">
                            {row.cleack === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.cleack === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.cleack}</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {row.appSorteos === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.appSorteos === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.appSorteos}</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {row.wask === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.wask === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.wask}</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {row.commentPicker === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.commentPicker === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.commentPicker}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Cleack : le choix des professionnels</h4>
                      <p className="text-gray-600 text-sm">
                        Avec la preuve vidéo, la détection des bots et les filtres avancés, Cleack est l'outil le plus 
                        complet et le plus fiable du marché. C'est pourquoi les plus grands influenceurs et marques 
                        l'utilisent pour leurs concours Instagram.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Tutoriel détaillé */}
              <section id="tutoriel" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tutoriel Complet : Organiser un Concours Instagram
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Au-delà du simple tirage au sort, voici un guide complet pour organiser un concours Instagram réussi, 
                  de la création du post à l'annonce du gagnant.
                </p>

                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      Définissez les règles de votre concours
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        Avant de publier votre concours, définissez clairement les règles de participation. Les conditions 
                        les plus courantes sont :
                      </p>
                      <ul>
                        <li><strong>Liker le post</strong> - Condition de base pour montrer son intérêt</li>
                        <li><strong>Commenter</strong> - Permet d'augmenter l'engagement et la visibilité</li>
                        <li><strong>Taguer des amis</strong> - Chaque tag = une participation, excellent pour la viralité</li>
                        <li><strong>S'abonner au compte</strong> - Pour gagner des abonnés qualifiés</li>
                        <li><strong>Partager en story</strong> - Pour maximiser la portée</li>
                      </ul>
                      <p>
                        <strong>Conseil :</strong> Ne surchargez pas les conditions. « Like + commente + tag 2 amis » 
                        est le format optimal pour maximiser la participation tout en gardant des règles simples.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      Rédigez un règlement légal
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        En France, tout jeu concours doit avoir un règlement disponible. Ce règlement doit inclure :
                      </p>
                      <ul>
                        <li>Le nom et les coordonnées de l'organisateur</li>
                        <li>Les dates de début et de fin du concours</li>
                        <li>Les conditions de participation</li>
                        <li>La description précise des lots</li>
                        <li>Les modalités de désignation du gagnant</li>
                        <li>Comment et quand le gagnant sera contacté</li>
                      </ul>
                      <p>
                        Utilisez notre <Link to="/outils/generateur-reglement/" className="text-pink-600 hover:underline">générateur de règlement gratuit</Link> pour 
                        créer un règlement conforme en 2 minutes.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      Créez un visuel attractif
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        Un bon visuel de concours doit être immédiatement reconnaissable et donner envie de participer :
                      </p>
                      <ul>
                        <li><strong>Mettez en avant le lot</strong> avec une belle photo</li>
                        <li>Utilisez des <strong>couleurs vives</strong> qui attirent l'œil</li>
                        <li>Ajoutez un texte clair : <strong>« CONCOURS »</strong> ou <strong>« GIVEAWAY »</strong></li>
                        <li>Indiquez les <strong>conditions principales</strong> directement sur l'image</li>
                        <li>Mentionnez la <strong>date de fin</strong> pour créer l'urgence</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                      Promouvez votre concours
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        Un concours ne se limite pas à un simple post. Pour maximiser la participation :
                      </p>
                      <ul>
                        <li><strong>Partagez en stories</strong> plusieurs fois pendant la durée du concours</li>
                        <li>Créez un <strong>Reel de présentation</strong> du lot</li>
                        <li><strong>Collaborez avec d'autres créateurs</strong> pour élargir votre audience</li>
                        <li>Programmez des <strong>rappels</strong> avant la fin du concours</li>
                        <li>Répondez aux commentaires pour <strong>booster l'algorithme</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">5</span>
                      Effectuez le tirage avec Cleack
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        Une fois le concours terminé, rendez-vous sur Cleack pour effectuer le tirage :
                      </p>
                      <ol>
                        <li>Copiez le lien de votre publication Instagram</li>
                        <li>Collez-le dans Cleack</li>
                        <li>Configurez les filtres si nécessaire (tags obligatoires, etc.)</li>
                        <li>Cliquez sur « Tirer au sort »</li>
                        <li>Téléchargez la vidéo preuve</li>
                      </ol>
                    </div>
                    <Link
                      to="/draw/new"
                      className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Faire mon tirage maintenant
                    </Link>
                  </div>

                  {/* Step 6 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">6</span>
                      Annoncez le gagnant publiquement
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        L'annonce du gagnant est aussi importante que le concours lui-même :
                      </p>
                      <ul>
                        <li><strong>Partagez la vidéo preuve</strong> Cleack en story</li>
                        <li><strong>Commentez votre propre post</strong> avec le nom du gagnant</li>
                        <li>Envoyez un <strong>message privé</strong> au gagnant</li>
                        <li>Demandez au gagnant de <strong>partager sa réception du lot</strong></li>
                        <li>Gardez des <strong>gagnants de réserve</strong> si le premier ne répond pas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Conseils */}
              <section id="conseils" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Conseils d'Experts pour un Concours Instagram Réussi
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      icon: <Gift className="w-6 h-6" />,
                      title: "Choisissez un lot pertinent",
                      description: "Le lot doit être en rapport avec votre audience et votre niche. Un lot tech pour une audience tech, un produit beauté pour une audience beauté. Évitez les lots trop génériques comme l'argent ou les cartes cadeaux qui attirent des participants non qualifiés.",
                    },
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: "Durée optimale : 5-7 jours",
                      description: "Un concours trop court ne laisse pas le temps à tout le monde de participer. Un concours trop long perd de son urgence. 5 à 7 jours est la durée idéale pour maximiser la participation tout en maintenant l'engagement.",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Limitez les tags obligatoires",
                      description: "Demander de taguer 2-3 amis est optimal. Au-delà, vous découragez la participation. Chaque tag supplémentaire réduit le taux de participation d'environ 20%.",
                    },
                    {
                      icon: <BookOpen className="w-6 h-6" />,
                      title: "Répondez aux questions",
                      description: "Les commentaires sous votre post concours boostent l'algorithme Instagram. Prenez le temps de répondre aux questions et de remercier les participants. Cela augmente la visibilité de votre post.",
                    },
                    {
                      icon: <Download className="w-6 h-6" />,
                      title: "Archivez tout",
                      description: "Faites des captures d'écran du post, des commentaires et du tirage. Conservez la vidéo preuve Cleack. En cas de contestation, vous aurez toutes les preuves nécessaires.",
                    },
                    {
                      icon: <Share2 className="w-6 h-6" />,
                      title: "Créez de la récurrence",
                      description: "Les concours réguliers fidélisent votre audience. Un concours mensuel crée une attente et une habitude chez vos abonnés. Ils reviendront naturellement voir si un nouveau concours est en cours.",
                    },
                  ].map((conseil, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-4">
                        {conseil.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{conseil.title}</h3>
                      <p className="text-gray-600 text-sm">{conseil.description}</p>
                    </div>
                  ))}
                </div>

                {/* Erreurs à éviter */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">❌ Erreurs à Éviter</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Ne pas rédiger de règlement officiel",
                      "Conditions de participation trop complexes",
                      "Oublier de mentionner les dates du concours",
                      "Ne pas annoncer le gagnant publiquement",
                      "Utiliser un outil non fiable ou manuel",
                      "Ignorer les commentaires des participants",
                      "Lot sans rapport avec votre audience",
                      "Ne pas prévoir de gagnants de réserve",
                    ].map((erreur, index) => (
                      <div key={index} className="flex items-start gap-2 text-red-700">
                        <span className="text-red-500 mt-1">✕</span>
                        <span className="text-sm">{erreur}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section: FAQ */}
              <section id="faq" className="mb-16">
                <FAQSection
                  items={faqItems}
                  title="Questions Fréquentes sur le Tirage au Sort Instagram"
                  subtitle="Tout ce que vous devez savoir pour organiser un concours Instagram réussi"
                />
              </section>

              {/* Internal Links */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ressources Utiles</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Guide : Organiser un jeu concours Instagram", url: "/guide/organiser-jeu-concours/", icon: <BookOpen className="w-5 h-5" /> },
                    { title: "Modèle de règlement jeu concours", url: "/guide/reglement-jeu-concours/", icon: <Shield className="w-5 h-5" /> },
                    { title: "10 idées de concours Instagram", url: "/blog/idees-concours-instagram/", icon: <Gift className="w-5 h-5" /> },
                    { title: "Générateur de règlement gratuit", url: "/outils/generateur-reglement/", icon: <Download className="w-5 h-5" /> },
                  ].map((link, index) => (
                    <Link
                      key={index}
                      to={link.url}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all group"
                    >
                      <span className="p-2 bg-pink-50 rounded-lg text-pink-600 group-hover:bg-pink-100 transition-colors">
                        {link.icon}
                      </span>
                      <span className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                        {link.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Other Platforms */}
              <PlatformLinks currentPlatform="instagram" />

              {/* Final CTA */}
              <section className="mt-16">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 md:p-12 text-white text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Prêt à Lancer Votre Tirage au Sort ?
                  </h2>
                  <p className="text-lg text-pink-100 mb-8 max-w-2xl mx-auto">
                    Rejoignez plus de 50 000 créateurs qui utilisent Cleack pour leurs concours Instagram. 
                    Gratuit, rapide et avec preuve vidéo.
                  </p>
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Commencer gratuitement
                  </Link>
                  <p className="text-sm text-pink-200 mt-4">
                    Sans inscription • Sans connexion Instagram • 100% gratuit
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default TirageInstagramPage;
