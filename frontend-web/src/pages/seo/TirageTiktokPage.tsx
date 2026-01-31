import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
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
  Music,
  TrendingUp,
  Eye,
  Share2,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../components/seo';

// TikTok icon
const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const CANONICAL_URL = 'https://cleack.io/tirage-au-sort-tiktok/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort TikTok', url: CANONICAL_URL },
];

const tocItems: TOCItem[] = [
  { id: 'comment-ca-marche', title: 'Comment ça marche', level: 2 },
  { id: 'fonctionnalites', title: 'Fonctionnalités', level: 2 },
  { id: 'types-tirages', title: 'Types de tirages', level: 2 },
  { id: 'pourquoi-tiktok', title: 'Pourquoi TikTok', level: 2 },
  { id: 'tutoriel', title: 'Tutoriel complet', level: 2 },
  { id: 'conseils', title: 'Conseils pour viralité', level: 2 },
  { id: 'faq', title: 'Questions fréquentes', level: 2 },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort TikTok gratuitement ?",
    answer: "Avec Cleack, c'est très simple : copiez le lien de votre vidéo TikTok, collez-le dans notre outil, et cliquez sur « Tirer au sort ». En moins de 30 secondes, vous obtenez un gagnant aléatoire parmi tous les commentaires. <strong>100% gratuit</strong>, sans inscription."
  },
  {
    question: "Cleack fonctionne-t-il avec les vidéos TikTok privées ?",
    answer: "Non, Cleack ne peut analyser que les <strong>vidéos TikTok publiques</strong>. Assurez-vous que votre vidéo de concours est visible par tout le monde avant de lancer le tirage. Si votre compte est privé, vous devrez le passer en public temporairement."
  },
  {
    question: "Puis-je filtrer les participants par conditions (like, follow, etc.) ?",
    answer: "Cleack peut filtrer les commentaires par <strong>mentions</strong> (@ obligatoire), <strong>hashtags</strong> ou <strong>mots-clés</strong>. Cependant, nous ne pouvons pas vérifier automatiquement si un participant vous suit ou a liké la vidéo - c'est une limitation de l'API TikTok."
  },
  {
    question: "Combien de commentaires Cleack peut-il analyser sur TikTok ?",
    answer: "Il n'y a <strong>pas de limite</strong>. Que votre vidéo ait 100 ou 100 000 commentaires, Cleack les analyse tous. Les vidéos virales avec beaucoup de commentaires prennent un peu plus de temps, mais le résultat est toujours fiable."
  },
  {
    question: "Est-ce légal d'organiser un giveaway sur TikTok en France ?",
    answer: "Oui, c'est légal à condition de respecter les règles des jeux-concours : <ul><li>Rédiger un règlement accessible</li><li>Ne pas conditionner la participation à un achat</li><li>Déclarer les lots de plus de 1000€</li></ul> Consultez notre <a href='/guide/reglement-jeu-concours/'>guide complet</a>."
  },
  {
    question: "Dois-je connecter mon compte TikTok à Cleack ?",
    answer: "Non, <strong>aucune connexion</strong> n'est nécessaire. Cleack fonctionne uniquement avec le lien public de votre vidéo. Vos identifiants TikTok restent privés et sécurisés."
  },
  {
    question: "La vidéo preuve fonctionne-t-elle pour TikTok ?",
    answer: "Oui ! Cleack génère une <strong>vidéo preuve</strong> que vous pouvez télécharger et partager directement sur TikTok. C'est idéal pour montrer à votre communauté que le tirage était transparent et équitable."
  },
  {
    question: "Puis-je faire un tirage au sort pour un TikTok Live ?",
    answer: "Pour l'instant, Cleack supporte les <strong>vidéos postées</strong> (classiques, duos, stitches). Les commentaires en direct pendant un Live ne peuvent pas être analysés après coup. Nous travaillons sur cette fonctionnalité."
  },
  {
    question: "Comment exclure les bots et faux comptes sur TikTok ?",
    answer: "Cleack intègre un <strong>algorithme de détection</strong> qui identifie les comptes suspects : comptes sans photo de profil, noms générés aléatoirement, comptes créés récemment sans contenu. Activez cette option dans les filtres."
  },
  {
    question: "Quelle est la différence entre un giveaway TikTok et Instagram ?",
    answer: "Les giveaways TikTok ont souvent un <strong>taux de participation plus élevé</strong> grâce à la viralité de l'algorithme. Cependant, l'audience peut être plus jeune et moins qualifiée. Adaptez vos lots et conditions en conséquence."
  },
];

const howToSteps = [
  {
    name: "Copiez le lien de votre vidéo TikTok",
    text: "Ouvrez votre vidéo TikTok, appuyez sur 'Partager' puis 'Copier le lien'. Vous pouvez aussi copier l'URL depuis un navigateur web.",
  },
  {
    name: "Collez le lien dans Cleack",
    text: "Rendez-vous sur Cleack et collez l'URL de votre vidéo. Notre outil récupère automatiquement tous les commentaires en quelques secondes.",
  },
  {
    name: "Configurez vos filtres",
    text: "Choisissez le nombre de gagnants, activez les filtres optionnels (mentions, hashtags, détection des bots).",
  },
  {
    name: "Lancez le tirage et partagez la preuve",
    text: "Cliquez sur 'Tirer au sort'. Cleack sélectionne aléatoirement le gagnant et génère une vidéo preuve à partager sur TikTok.",
  },
];

const softwareFeatures = [
  "Tirage au sort commentaires TikTok",
  "Support vidéos, duos et stitches",
  "Preuve vidéo certifiée",
  "Détection des faux comptes TikTok",
  "Filtres par mentions et hashtags",
  "Multi-gagnants",
  "Aucune connexion requise",
  "100% gratuit",
];

const reviews = [
  {
    author: "Léa P.",
    datePublished: "2024-04-20",
    reviewBody: "J'ai fait mon premier giveaway TikTok avec Cleack. 3000 commentaires analysés en quelques secondes ! La vidéo preuve est parfaite pour montrer que c'est fair.",
    ratingValue: 5,
  },
  {
    author: "Maxime R.",
    datePublished: "2024-03-10",
    reviewBody: "Enfin un outil qui gère bien TikTok ! Les autres ne fonctionnaient pas ou étaient payants. Cleack est gratuit et super simple.",
    ratingValue: 5,
  },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-tiktok/' },
  { lang: 'en', url: 'https://cleack.io/en/tiktok-giveaway-picker/' },
  { lang: 'es', url: 'https://cleack.io/es/sorteo-tiktok/' },
  { lang: 'x-default', url: 'https://cleack.io/en/tiktok-giveaway-picker/' },
];

const TirageTiktokPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort TikTok Gratuit - Choisir un Gagnant de Concours | Cleack"
        description="Faites un tirage au sort TikTok gratuit en 30 secondes. Sélectionnez un gagnant aléatoire parmi les commentaires de vos vidéos. Outil fiable avec preuve vidéo pour vos giveaways TikTok."
        keywords="tirage au sort tiktok, giveaway tiktok, concours tiktok, tirage commentaire tiktok, comment picker tiktok, tirage au sort tiktok gratuit, gagnant tiktok"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-tiktok.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment faire un tirage au sort TikTok"
        howToDescription="Guide étape par étape pour sélectionner un gagnant aléatoire parmi les commentaires TikTok"
        howToTotalTime="PT2M"
        includeSoftwareSchema
        softwareRating={4.7}
        softwareRatingCount={892}
        softwareFeatures={softwareFeatures}
        reviews={reviews}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} className="text-ink-tertiary" />
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
                <div className="inline-flex items-center gap-2 bg-bg-elevated/10 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
                  <TikTokIcon className="w-4 h-4" />
                  Outil Giveaway #1
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-bg-primary0 bg-clip-text text-transparent">
                    TikTok
                  </span>{' '}
                  Gratuit
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Sélectionnez un <strong className="text-white">gagnant aléatoire</strong> parmi les commentaires 
                  de vos vidéos TikTok. Idéal pour vos <strong className="text-white">giveaways</strong> et concours. 
                  Preuve vidéo incluse pour la transparence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage gratuit
                  </Link>
                  <a
                    href="#comment-ca-marche"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-bg-elevated/20 transition-all"
                  >
                    Comment ça marche ?
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>100% Gratuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Sans inscription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    <span>Vidéos virales OK</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Tool Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-bg-elevated/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                      <TikTokIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tirage au Sort TikTok</h2>
                    <p className="text-ink-tertiary mt-2">Collez le lien de votre vidéo</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://www.tiktok.com/@user/video/..."
                        className="w-full px-4 py-4 bg-bg-elevated/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        readOnly
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
                        <TikTokIcon className="w-5 h-5" />
                      </span>
                    </div>

                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-bg-elevated text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Tirer au sort gratuitement
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">30s</div>
                      <div className="text-sm text-ink-tertiary">Durée moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">∞</div>
                      <div className="text-sm text-ink-tertiary">Commentaires</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-white">4.7</span>
                      </div>
                      <div className="text-sm text-ink-tertiary">Note</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} sticky className="bg-bg-elevated/5 border-white/10" />
            </aside>

            {/* Main Content */}
            <main className="min-w-0">
              {/* Intro */}
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                <p className="text-xl text-gray-300 leading-relaxed">
                  TikTok est devenu la plateforme incontournable pour les <strong className="text-white">giveaways</strong> et 
                  concours viraux. Avec son algorithme puissant, une vidéo de concours peut atteindre des millions de vues et 
                  générer des milliers de participants. Cleack vous aide à gérer ce flux massif de commentaires et à 
                  sélectionner un gagnant de manière <strong className="text-white">transparente et équitable</strong>.
                </p>
                <p className="text-ink-tertiary">
                  Que vous soyez un créateur de contenu, une marque ou un influenceur, notre outil de tirage au sort 
                  TikTok gratuit s'adapte à tous vos besoins. Pas besoin de connexion, pas de compte à créer — collez 
                  simplement le lien de votre vidéo et laissez Cleack faire le reste.
                </p>
              </div>

              {/* Section: Comment ça marche */}
              <section id="comment-ca-marche" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Comment Faire un Tirage au Sort TikTok ?
                </h2>
                
                <p className="text-ink-tertiary mb-8">
                  Organiser un giveaway TikTok et choisir un gagnant n'a jamais été aussi simple. 
                  Suivez ces 4 étapes pour un tirage au sort transparent et rapide.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      step: 1,
                      title: "Copiez le lien de votre vidéo TikTok",
                      description: "Ouvrez votre vidéo de concours sur TikTok, appuyez sur le bouton 'Partager' (flèche), puis sélectionnez 'Copier le lien'. Vous pouvez aussi accéder à la vidéo depuis un navigateur web et copier l'URL directement.",
                      icon: <TikTokIcon className="w-6 h-6" />,
                    },
                    {
                      step: 2,
                      title: "Collez le lien dans Cleack",
                      description: "Rendez-vous sur Cleack et collez l'URL de votre vidéo TikTok. Notre outil analyse automatiquement la publication et récupère tous les commentaires, même s'il y en a des dizaines de milliers.",
                      icon: <Zap className="w-6 h-6" />,
                    },
                    {
                      step: 3,
                      title: "Configurez les filtres",
                      description: "Définissez le nombre de gagnants souhaités. Activez les filtres optionnels : mentions obligatoires (@ami), hashtags requis, détection des bots et faux comptes, exclusion des doublons.",
                      icon: <Filter className="w-6 h-6" />,
                    },
                    {
                      step: 4,
                      title: "Lancez le tirage et partagez",
                      description: "Cliquez sur 'Tirer au sort'. Cleack sélectionne aléatoirement le ou les gagnants et génère une vidéo preuve que vous pouvez partager directement sur TikTok pour montrer la transparence.",
                      icon: <Trophy className="w-6 h-6" />,
                    },
                  ].map((item) => (
                    <div key={item.step} className="bg-bg-elevated/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-bg-primary0 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-cyan-400 mb-1">Étape {item.step}</div>
                          <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                          <p className="text-ink-tertiary text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Fonctionnalités */}
              <section id="fonctionnalites" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Fonctionnalités du Tirage au Sort TikTok
                </h2>
                
                <p className="text-ink-tertiary mb-8">
                  Cleack est conçu pour gérer les spécificités de TikTok : vidéos virales, milliers de commentaires, 
                  bots, et besoin de transparence.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Preuve Vidéo",
                      description: "Générez automatiquement une vidéo du tirage à partager sur TikTok. Prouvez à votre communauté que le tirage était équitable.",
                      highlight: true,
                    },
                    {
                      icon: <TrendingUp className="w-6 h-6" />,
                      title: "Vidéos Virales OK",
                      description: "Pas de limite de commentaires. Que votre vidéo ait 100 ou 100 000 commentaires, Cleack les analyse tous.",
                      highlight: true,
                    },
                    {
                      icon: <Bot className="w-6 h-6" />,
                      title: "Anti-Bots TikTok",
                      description: "Notre algorithme détecte et exclut les comptes suspects typiques de TikTok : bots, comptes vides, spam.",
                    },
                    {
                      icon: <Zap className="w-6 h-6" />,
                      title: "Rapide et Gratuit",
                      description: "Résultat en moins de 30 secondes. 100% gratuit, sans inscription ni connexion à votre compte TikTok.",
                    },
                    {
                      icon: <Music className="w-6 h-6" />,
                      title: "Tous Formats",
                      description: "Fonctionne avec les vidéos classiques, duos, stitches. Bientôt : support des Lives.",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Multi-Gagnants",
                      description: "Sélectionnez plusieurs gagnants en un seul tirage. Idéal pour les gros giveaways.",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-bg-elevated/5 rounded-xl p-6 border ${
                        feature.highlight ? 'border-cyan-500/50' : 'border-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        feature.highlight 
                          ? 'bg-gradient-to-br from-cyan-400 to-bg-primary0 text-white' 
                          : 'bg-bg-elevated/10 text-ink-tertiary'
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-ink-tertiary text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Types de tirages */}
              <section id="types-tirages" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Types de Giveaways TikTok
                </h2>
                
                <p className="text-ink-tertiary mb-8">
                  TikTok offre plusieurs formats pour organiser des concours. Voici les plus populaires et 
                  comment Cleack peut vous aider.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Giveaway Commentaires",
                      description: "Le format classique : « Commente pour participer ». Sélectionnez un gagnant parmi tous les commentaires. Ajoutez des conditions comme taguer un ami ou utiliser un hashtag spécifique pour augmenter la viralité.",
                      link: "/tirage-commentaires-tiktok/",
                      stats: "Le plus populaire",
                    },
                    {
                      icon: <Share2 className="w-6 h-6" />,
                      title: "Concours Duo/Stitch",
                      description: "Demandez aux participants de créer un duo ou un stitch de votre vidéo. Collectez les commentaires de ces vidéos participantes pour choisir un gagnant. Format très engageant qui génère du contenu UGC.",
                      link: "/giveaway-tiktok/",
                      stats: "Fort engagement",
                    },
                    {
                      icon: <Eye className="w-6 h-6" />,
                      title: "Challenge Hashtag",
                      description: "Créez un hashtag dédié à votre concours (#MonConcoursMarque). Les participants doivent utiliser ce hashtag. Analysez les commentaires de votre vidéo principale pour tirer au sort.",
                      link: "/concours-tiktok/",
                      stats: "Viralité maximale",
                    },
                  ].map((type, index) => (
                    <Link
                      key={index}
                      to={type.link}
                      className="block bg-bg-elevated/5 rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-bg-elevated/10 rounded-xl flex items-center justify-center text-ink-tertiary flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-bg-primary0 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {type.title}
                            </h3>
                            <span className="text-xs font-medium text-ink-tertiary bg-bg-elevated/10 px-2 py-1 rounded">
                              {type.stats}
                            </span>
                          </div>
                          <p className="text-ink-tertiary text-sm mb-3">{type.description}</p>
                          <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium group-hover:gap-2 transition-all">
                            En savoir plus <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section: Pourquoi TikTok */}
              <section id="pourquoi-tiktok" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Pourquoi Organiser un Giveaway sur TikTok ?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-bg-primary0/10 to-bg-primary0/10 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">📈 Avantages de TikTok</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">Algorithme viral</strong> : Une vidéo peut exploser même avec peu d'abonnés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">Audience jeune et engagée</strong> : Parfait pour les marques ciblant les 16-30 ans</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">Taux d'engagement élevé</strong> : 3-5x supérieur à Instagram</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">Formats créatifs</strong> : Duos, stitches, effets = participation ludique</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-bg-elevated/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">📊 TikTok en chiffres (France)</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink-tertiary">Utilisateurs actifs</span>
                          <span className="text-white font-semibold">21 millions</span>
                        </div>
                        <div className="h-2 bg-bg-elevated/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-bg-primary0 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink-tertiary">Temps moyen/jour</span>
                          <span className="text-white font-semibold">95 minutes</span>
                        </div>
                        <div className="h-2 bg-bg-elevated/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-bg-primary0 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink-tertiary">Taux d'engagement</span>
                          <span className="text-white font-semibold">5.96%</span>
                        </div>
                        <div className="h-2 bg-bg-elevated/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-bg-primary0 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Tutoriel */}
              <section id="tutoriel" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Tutoriel : Créer un Giveaway TikTok Viral
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-bg-elevated/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-bg-elevated0/20 text-cyan-400 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      Choisissez un lot qui résonne avec TikTok
                    </h3>
                    <p className="text-ink-tertiary mb-4">
                      L'audience TikTok est jeune et connectée. Les lots qui fonctionnent le mieux :
                    </p>
                    <ul className="grid md:grid-cols-2 gap-2 text-gray-300">
                      <li>✓ Tech : AirPods, consoles, smartphones</li>
                      <li>✓ Beauté : coffrets makeup, skincare</li>
                      <li>✓ Mode : sneakers, vêtements streetwear</li>
                      <li>✓ Gaming : jeux, accessoires, Robux</li>
                      <li>✓ Gift cards : Amazon, Uber Eats</li>
                      <li>✓ Expériences : concerts, festivals</li>
                    </ul>
                  </div>

                  <div className="bg-bg-elevated/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-bg-elevated0/20 text-cyan-400 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      Créez une vidéo de concours engageante
                    </h3>
                    <p className="text-ink-tertiary mb-4">
                      Votre vidéo de concours doit capter l'attention dans les 3 premières secondes :
                    </p>
                    <ul className="space-y-2 text-gray-300">
                      <li>• <strong className="text-white">Hook fort</strong> : « GIVEAWAY ÉNORME » ou « Je vous offre... »</li>
                      <li>• <strong className="text-white">Montrez le lot</strong> rapidement et de manière attractive</li>
                      <li>• <strong className="text-white">Conditions claires</strong> : « Like + commente + tag un ami »</li>
                      <li>• <strong className="text-white">Date de fin</strong> : créez l'urgence</li>
                      <li>• <strong className="text-white">Musique tendance</strong> : utilisez un son viral</li>
                    </ul>
                  </div>

                  <div className="bg-bg-elevated/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-bg-elevated0/20 text-cyan-400 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      Boostez la viralité
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Publiez aux <strong className="text-white">heures de pointe</strong> (18h-21h en France)</li>
                      <li>• Utilisez des <strong className="text-white">hashtags pertinents</strong> (#giveaway #concours + niche)</li>
                      <li>• Répondez aux commentaires pour <strong className="text-white">booster l'engagement</strong></li>
                      <li>• Faites des <strong className="text-white">rappels en stories</strong> et en vidéo</li>
                      <li>• <strong className="text-white">Collaborez</strong> avec d'autres créateurs</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section: Conseils */}
              <section id="conseils" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Conseils pour un Giveaway TikTok Réussi
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: "Durée optimale : 3-5 jours",
                      description: "TikTok est une plateforme rapide. Un concours de 3-5 jours crée l'urgence et maintient l'engagement. Au-delà, l'algorithme arrête de pousser votre vidéo.",
                    },
                    {
                      icon: <Gift className="w-6 h-6" />,
                      title: "Lot visible = participation",
                      description: "Filmez le lot en gros plan, montrez-le sous tous les angles. Sur TikTok, le visuel est roi. Une vidéo avec le lot bien mis en valeur génère 3x plus de participation.",
                    },
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Conditions simples",
                      description: "« Like + commente » suffit. Chaque condition supplémentaire réduit la participation de 30%. Sur TikTok, la simplicité gagne.",
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Partagez la vidéo preuve",
                      description: "Après le tirage avec Cleack, postez la vidéo preuve sur TikTok. Ça montre votre transparence et encourage la participation aux futurs concours.",
                    },
                  ].map((conseil, index) => (
                    <div key={index} className="bg-bg-elevated/5 rounded-xl p-6 border border-white/10">
                      <div className="w-12 h-12 bg-bg-elevated/10 rounded-xl flex items-center justify-center text-cyan-400 mb-4">
                        {conseil.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{conseil.title}</h3>
                      <p className="text-ink-tertiary text-sm">{conseil.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: FAQ */}
              <section id="faq" className="mb-16">
                <div className="bg-bg-elevated rounded-2xl p-8">
                  <FAQSection
                    items={faqItems}
                    title="Questions Fréquentes sur le Tirage au Sort TikTok"
                    subtitle="Tout ce que vous devez savoir pour organiser un giveaway TikTok réussi"
                  />
                </div>
              </section>

              {/* Other Platforms */}
              <div className="bg-bg-elevated rounded-2xl p-8 mb-16">
                <PlatformLinks currentPlatform="tiktok" />
              </div>

              {/* Final CTA */}
              <section className="mt-16">
                <div className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 md:p-12 text-white text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Prêt à Lancer Votre Giveaway TikTok ?
                  </h2>
                  <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                    Utilisez Cleack pour choisir un gagnant parmi vos commentaires TikTok. 
                    Gratuit, rapide et avec preuve vidéo.
                  </p>
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-bg-elevated text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Commencer gratuitement
                  </Link>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default TirageTiktokPage;
