import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
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
  Share2,
  UserCheck,
  Building2,
  UsersRound,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-au-sort-facebook/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Facebook', url: CANONICAL_URL },
];

const tocItems: TOCItem[] = [
  { id: 'comment-ca-marche', title: 'Comment ça marche', level: 2 },
  { id: 'fonctionnalites', title: 'Fonctionnalités', level: 2 },
  { id: 'types-tirages', title: 'Types de tirages', level: 2 },
  { id: 'pages-vs-groupes', title: 'Pages vs Groupes', level: 2 },
  { id: 'tutoriel', title: 'Tutoriel complet', level: 2 },
  { id: 'regles-facebook', title: 'Règles Facebook', level: 2 },
  { id: 'faq', title: 'Questions fréquentes', level: 2 },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort Facebook gratuitement ?",
    answer: "Avec Cleack, c'est simple et gratuit : copiez le lien de votre publication Facebook, collez-le dans notre outil, et cliquez sur « Tirer au sort ». En moins de 30 secondes, vous obtenez un gagnant aléatoire parmi tous les commentaires ou réactions."
  },
  {
    question: "Cleack fonctionne-t-il avec les groupes Facebook ?",
    answer: "Oui ! Cleack supporte les publications sur les <strong>pages Facebook publiques</strong> et les <strong>groupes publics</strong>. Pour les groupes privés, la publication doit être partageable publiquement pour que nous puissions y accéder."
  },
  {
    question: "Puis-je faire un tirage parmi les likes/réactions Facebook ?",
    answer: "Oui, Cleack peut analyser à la fois les <strong>commentaires</strong> et les <strong>réactions</strong> (likes, love, haha, etc.). Vous pouvez choisir de tirer au sort parmi l'un ou l'autre, ou les deux combinés."
  },
  {
    question: "Comment exclure les participants qui n'ont pas tagué un ami ?",
    answer: "Cleack intègre un <strong>filtre de mentions</strong>. Activez-le et définissez le nombre minimum de mentions (@) requises. Seuls les commentaires avec des tags seront inclus dans le tirage."
  },
  {
    question: "Est-ce conforme aux règles de Facebook d'organiser un concours ?",
    answer: "Oui, Facebook autorise les concours à condition de : <ul><li>Ne pas demander de partager sur les profils personnels</li><li>Ne pas utiliser les fonctionnalités Facebook de manière abusive</li><li>Inclure un règlement avec les conditions</li><li>Mentionner que Facebook n'est pas associé au concours</li></ul>"
  },
  {
    question: "Dois-je connecter ma page Facebook à Cleack ?",
    answer: "Non, <strong>aucune connexion</strong> n'est nécessaire. Cleack fonctionne uniquement avec le lien public de votre publication. Vos identifiants restent privés."
  },
  {
    question: "Combien de commentaires Facebook Cleack peut-il traiter ?",
    answer: "Il n'y a <strong>pas de limite</strong>. Cleack peut analyser des publications avec des milliers de commentaires. Les publications très populaires prennent simplement un peu plus de temps."
  },
  {
    question: "Puis-je faire un tirage au sort pour une publication sponsorisée ?",
    answer: "Oui, Cleack fonctionne avec tous les types de publications : organiques, sponsorisées, événements. Tant que la publication est accessible publiquement, nous pouvons analyser les commentaires."
  },
  {
    question: "Comment contacter le gagnant sur Facebook ?",
    answer: "Après le tirage, vous pouvez : <ul><li>Répondre au commentaire du gagnant</li><li>Le mentionner dans un nouveau commentaire</li><li>Le contacter via Messenger</li><li>Publier la vidéo preuve et le taguer</li></ul>"
  },
  {
    question: "La vidéo preuve fonctionne-t-elle pour Facebook ?",
    answer: "Oui ! Cleack génère une <strong>vidéo preuve</strong> que vous pouvez télécharger et publier directement sur Facebook pour montrer la transparence du tirage."
  },
];

const howToSteps = [
  {
    name: "Copiez le lien de votre publication Facebook",
    text: "Cliquez sur les trois points (...) de votre publication, puis 'Copier le lien'. Ou copiez l'URL depuis la barre d'adresse de votre navigateur.",
  },
  {
    name: "Collez le lien dans Cleack",
    text: "Rendez-vous sur Cleack et collez l'URL. Notre outil récupère automatiquement tous les commentaires et réactions.",
  },
  {
    name: "Choisissez le type de tirage",
    text: "Sélectionnez si vous voulez tirer au sort parmi les commentaires, les réactions, ou les deux. Configurez les filtres optionnels.",
  },
  {
    name: "Lancez le tirage et partagez",
    text: "Cliquez sur 'Tirer au sort'. Partagez la vidéo preuve sur votre page pour montrer la transparence.",
  },
];

const softwareFeatures = [
  "Tirage au sort commentaires Facebook",
  "Tirage au sort réactions/likes Facebook",
  "Support pages et groupes",
  "Preuve vidéo certifiée",
  "Détection des faux comptes",
  "Filtres avancés (mentions, hashtags)",
  "Multi-gagnants",
  "100% gratuit",
];

const reviews = [
  {
    author: "Restaurant Le Bistrot",
    datePublished: "2024-04-15",
    reviewBody: "Parfait pour nos tirages mensuels sur notre page Facebook ! Simple, rapide et la vidéo preuve rassure nos clients.",
    ratingValue: 5,
  },
  {
    author: "Julien M.",
    datePublished: "2024-03-22",
    reviewBody: "J'ai testé plusieurs outils pour mes concours Facebook. Cleack est le seul gratuit qui fonctionne vraiment bien.",
    ratingValue: 5,
  },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-facebook/' },
  { lang: 'en', url: 'https://cleack.io/en/facebook-giveaway-picker/' },
  { lang: 'es', url: 'https://cleack.io/es/sorteo-facebook/' },
  { lang: 'x-default', url: 'https://cleack.io/en/facebook-giveaway-picker/' },
];

const TirageFacebookPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Facebook Gratuit - Choisir un Gagnant de Concours | Cleack"
        description="Faites un tirage au sort Facebook gratuit en 30 secondes. Sélectionnez un gagnant parmi les commentaires ou likes de vos publications. Fonctionne avec les pages et groupes Facebook."
        keywords="tirage au sort facebook, concours facebook, tirage commentaire facebook, giveaway facebook, concours page facebook, tirage groupe facebook, choisir gagnant facebook"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-facebook.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment faire un tirage au sort Facebook"
        howToDescription="Guide étape par étape pour sélectionner un gagnant sur Facebook"
        howToTotalTime="PT2M"
        includeSoftwareSchema
        softwareRating={4.7}
        softwareRatingCount={1087}
        softwareFeatures={softwareFeatures}
        reviews={reviews}
      />

      <div className="min-h-screen bg-bg-primary">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Facebook className="w-4 h-4" />
                  Pages & Groupes
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Tirage au Sort{' '}
                  <span className="text-accent-secondary">Facebook</span>{' '}
                  Gratuit
                </h1>

                <p className="text-xl text-ink-secondary mb-8 leading-relaxed">
                  Sélectionnez un <strong>gagnant aléatoire</strong> parmi les commentaires ou réactions 
                  de vos publications Facebook. Fonctionne avec les <strong>pages</strong> et les{' '}
                  <strong>groupes</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage gratuit
                  </Link>
                  <a
                    href="#comment-ca-marche"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated border-2 border-white/10 text-ink-secondary px-8 py-4 rounded-xl font-semibold text-lg hover:border-accent-secondary/50 transition-all"
                  >
                    Comment ça marche ?
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>100% Gratuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-secondary" />
                    <span>Sans inscription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    <span>Pages & Groupes</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-bg-elevated rounded-2xl shadow-2xl shadow-accent-secondary/20 p-8 border border-white/10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Facebook className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tirage au Sort Facebook</h2>
                    <p className="text-ink-tertiary mt-2">Collez le lien de votre publication</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="https://www.facebook.com/..."
                      className="w-full px-4 py-4 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Tirer au sort gratuitement
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">30s</div>
                      <div className="text-sm text-ink-tertiary">Durée</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">∞</div>
                      <div className="text-sm text-ink-tertiary">Participants</div>
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
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} sticky />
            </aside>

            <main className="min-w-0">
              {/* Intro */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-ink-secondary leading-relaxed">
                  Facebook reste la plateforme incontournable pour les <strong>concours et jeux</strong> en ligne, 
                  particulièrement pour les entreprises locales, commerces et marques. Avec plus de 
                  <strong> 40 millions d'utilisateurs actifs</strong> en France, c'est l'endroit idéal pour 
                  engager votre communauté et attirer de nouveaux clients.
                </p>
                <p className="text-ink-secondary">
                  Cleack vous permet de faire un tirage au sort Facebook en quelques clics, que ce soit sur 
                  votre page professionnelle ou dans un groupe. Notre outil analyse tous les commentaires et 
                  réactions pour sélectionner un gagnant de manière 100% aléatoire et transparente.
                </p>
              </div>

              {/* Section: Comment ça marche */}
              <section id="comment-ca-marche" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Comment Faire un Tirage au Sort Facebook ?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      step: 1,
                      title: "Copiez le lien de votre publication",
                      description: "Sur Facebook, cliquez sur les trois points (...) de votre publication, puis « Copier le lien ». Vous pouvez aussi copier l'URL directement depuis la barre d'adresse.",
                      icon: <Facebook className="w-6 h-6" />,
                    },
                    {
                      step: 2,
                      title: "Collez le lien dans Cleack",
                      description: "Rendez-vous sur Cleack et collez l'URL de votre publication. Notre outil récupère automatiquement tous les commentaires et réactions.",
                      icon: <Zap className="w-6 h-6" />,
                    },
                    {
                      step: 3,
                      title: "Choisissez le type de tirage",
                      description: "Sélectionnez si vous voulez tirer parmi les commentaires, les réactions (likes, love, etc.), ou les deux. Configurez les filtres optionnels.",
                      icon: <Filter className="w-6 h-6" />,
                    },
                    {
                      step: 4,
                      title: "Lancez le tirage et partagez",
                      description: "Cliquez sur « Tirer au sort ». Téléchargez la vidéo preuve et partagez-la sur votre page pour montrer la transparence à votre communauté.",
                      icon: <Trophy className="w-6 h-6" />,
                    },
                  ].map((item) => (
                    <div key={item.step} className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-accent-secondary mb-1">Étape {item.step}</div>
                          <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                          <p className="text-ink-secondary text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Fonctionnalités */}
              <section id="fonctionnalites" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Fonctionnalités du Tirage au Sort Facebook
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Commentaires",
                      description: "Tirez au sort parmi tous les commentaires de votre publication. Filtrez par mentions ou hashtags.",
                    },
                    {
                      icon: <Heart className="w-6 h-6" />,
                      title: "Réactions/Likes",
                      description: "Sélectionnez un gagnant parmi les personnes qui ont réagi (like, love, haha, wow, sad, angry).",
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Preuve Vidéo",
                      description: "Générez une vidéo du tirage à partager sur Facebook pour prouver la transparence.",
                    },
                    {
                      icon: <Building2 className="w-6 h-6" />,
                      title: "Pages Pro",
                      description: "Fonctionne avec toutes les pages Facebook professionnelles et commerciales.",
                    },
                    {
                      icon: <UsersRound className="w-6 h-6" />,
                      title: "Groupes",
                      description: "Supportez les groupes Facebook publics. Les groupes privés nécessitent un lien partageable.",
                    },
                    {
                      icon: <Bot className="w-6 h-6" />,
                      title: "Anti-Faux Comptes",
                      description: "Détection automatique des comptes suspects et des bots pour un tirage équitable.",
                    },
                  ].map((feature, index) => (
                    <div key={index} className="bg-bg-elevated rounded-xl p-6 border border-white/10">
                      <div className="w-12 h-12 bg-bg-elevated rounded-xl flex items-center justify-center text-accent-secondary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-ink-secondary text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Types de tirages */}
              <section id="types-tirages" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Types de Tirages Facebook
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Tirage au Sort des Commentaires",
                      description: "Le classique « Commente pour participer ». Idéal pour maximiser l'engagement et la visibilité de votre publication. Vous pouvez exiger des mentions (@ami) ou des hashtags spécifiques pour filtrer les participants sérieux.",
                      link: "/tirage-commentaires-facebook/",
                    },
                    {
                      icon: <Heart className="w-6 h-6" />,
                      title: "Tirage au Sort des Likes/Réactions",
                      description: "Pour les concours simples où vous voulez récompenser l'engagement passif. Particulièrement adapté aux publications avec beaucoup de réactions mais peu de commentaires.",
                      link: "/tirage-likes-facebook/",
                    },
                    {
                      icon: <UsersRound className="w-6 h-6" />,
                      title: "Concours dans un Groupe Facebook",
                      description: "Organisez des concours exclusifs pour les membres de votre groupe. Renforcez le sentiment de communauté et récompensez vos membres les plus actifs.",
                      link: "/tirage-groupe-facebook/",
                    },
                  ].map((type, index) => (
                    <Link
                      key={index}
                      to={type.link}
                      className="block bg-bg-elevated rounded-xl p-6 border border-white/10 hover:border-accent-secondary/50 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-bg-elevated rounded-xl flex items-center justify-center text-accent-secondary flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-secondary">
                            {type.title}
                          </h3>
                          <p className="text-ink-secondary text-sm mb-3">{type.description}</p>
                          <span className="inline-flex items-center gap-1 text-accent-secondary text-sm font-medium">
                            En savoir plus <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section: Pages vs Groupes */}
              <section id="pages-vs-groupes" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Pages Facebook vs Groupes : Quel Format Choisir ?
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-bg-elevated rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Pages Facebook</h3>
                    </div>
                    <ul className="space-y-2 text-ink-secondary mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Idéal pour les marques et entreprises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Touchez des non-abonnés via le partage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Possibilité de sponsoriser le post</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Statistiques détaillées disponibles</span>
                      </li>
                    </ul>
                    <p className="text-sm text-ink-tertiary">
                      <strong>Recommandé pour :</strong> acquisition de nouveaux fans, visibilité de marque
                    </p>
                  </div>

                  <div className="bg-bg-elevated rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <UsersRound className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Groupes Facebook</h3>
                    </div>
                    <ul className="space-y-2 text-ink-secondary mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Engagement plus élevé (communauté active)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Concours exclusifs pour membres</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Renforce le sentiment d'appartenance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Discussion et interaction facilitées</span>
                      </li>
                    </ul>
                    <p className="text-sm text-ink-tertiary">
                      <strong>Recommandé pour :</strong> fidélisation, communauté, engagement local
                    </p>
                  </div>
                </div>
              </section>

              {/* Section: Tutoriel */}
              <section id="tutoriel" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Tutoriel : Organiser un Concours Facebook Réussi
                </h2>

                <div className="space-y-6">
                  <div className="bg-bg-elevated rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-accent-secondary/20 text-accent-secondary rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      Créez un visuel attractif
                    </h3>
                    <p className="text-ink-secondary mb-4">
                      Sur Facebook, le visuel est crucial pour attirer l'attention dans le fil d'actualité :
                    </p>
                    <ul className="space-y-2 text-ink-secondary">
                      <li>• <strong>Format carré (1080x1080)</strong> ou portrait pour mobile</li>
                      <li>• Mettez le lot en évidence avec une belle photo</li>
                      <li>• Ajoutez "CONCOURS" ou "GIVEAWAY" bien visible</li>
                      <li>• Incluez les conditions principales sur l'image</li>
                      <li>• Utilisez vos couleurs de marque pour la reconnaissance</li>
                    </ul>
                  </div>

                  <div className="bg-bg-elevated rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-accent-secondary/20 text-accent-secondary rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      Rédigez une description claire
                    </h3>
                    <p className="text-ink-secondary mb-4">
                      La description doit inclure toutes les informations essentielles :
                    </p>
                    <ul className="space-y-2 text-ink-secondary">
                      <li>• Description du lot et sa valeur</li>
                      <li>• Conditions de participation claires</li>
                      <li>• Date de début et de fin du concours</li>
                      <li>• Comment le gagnant sera contacté</li>
                      <li>• Lien vers le règlement complet</li>
                      <li>• Mention légale : "Ce concours n'est pas associé à Facebook"</li>
                    </ul>
                  </div>

                  <div className="bg-bg-elevated rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-accent-secondary/20 text-accent-secondary rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      Promouvez votre concours
                    </h3>
                    <ul className="space-y-2 text-ink-secondary">
                      <li>• <strong>Épinglez le post</strong> en haut de votre page</li>
                      <li>• Partagez dans les groupes pertinents (si autorisé)</li>
                      <li>• Sponsorisez pour toucher plus de monde</li>
                      <li>• Cross-postez sur Instagram si vous avez le compte lié</li>
                      <li>• Relancez à mi-parcours et avant la fin</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section: Règles Facebook */}
              <section id="regles-facebook" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Règles Facebook pour les Concours
                </h2>

                <div className="bg-bg-elevated rounded-xl p-6 border border-blue-100 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">✅ Ce qui est autorisé</h3>
                  <ul className="space-y-2 text-ink-secondary">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Demander de liker, commenter ou réagir à un post</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Demander de taguer des amis dans les commentaires</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Demander de partager sur la page du participant (avec son consentement)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Organiser des concours via Facebook Apps</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-bg-elevated rounded-xl p-6 border border-red-100">
                  <h3 className="text-lg font-semibold text-white mb-4">❌ Ce qui est interdit</h3>
                  <ul className="space-y-2 text-ink-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Demander de partager sur le profil personnel pour participer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Demander de taguer sur des photos (tag-to-enter)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Utiliser les listes d'amis pour notifier du concours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Suggérer que Facebook sponsorise ou approuve le concours</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-16">
                <FAQSection
                  items={faqItems}
                  title="Questions Fréquentes sur le Tirage au Sort Facebook"
                />
              </section>

              {/* Other Platforms */}
              <PlatformLinks currentPlatform="facebook" />

              {/* Final CTA */}
              <section className="mt-16">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Prêt à Lancer Votre Concours Facebook ?
                  </h2>
                  <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                    Utilisez Cleack pour choisir un gagnant parmi vos commentaires ou réactions. 
                    Gratuit, rapide et transparent.
                  </p>
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-bg-elevated text-accent-secondary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-bg-elevated transition-all"
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

export default TirageFacebookPage;
