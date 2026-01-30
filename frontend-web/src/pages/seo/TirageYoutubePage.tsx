import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Youtube,
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
  Trophy,
  Sparkles,
  Filter,
  Bell,
  ThumbsUp,
  Tv,
  Film,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-au-sort-youtube/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort YouTube', url: CANONICAL_URL },
];

const tocItems: TOCItem[] = [
  { id: 'comment-ca-marche', title: 'Comment ça marche', level: 2 },
  { id: 'fonctionnalites', title: 'Fonctionnalités', level: 2 },
  { id: 'types-tirages', title: 'Types de tirages', level: 2 },
  { id: 'youtube-shorts', title: 'YouTube Shorts', level: 2 },
  { id: 'tutoriel', title: 'Tutoriel complet', level: 2 },
  { id: 'conseils', title: 'Conseils créateurs', level: 2 },
  { id: 'faq', title: 'Questions fréquentes', level: 2 },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort YouTube gratuitement ?",
    answer: "Avec Cleack, c'est très simple : copiez le lien de votre vidéo YouTube, collez-le dans notre outil, et cliquez sur « Tirer au sort ». En moins d'une minute, vous obtenez un gagnant aléatoire parmi tous les commentaires. <strong>100% gratuit</strong>, sans inscription."
  },
  {
    question: "Cleack peut-il analyser des vidéos avec des milliers de commentaires ?",
    answer: "Oui ! Cleack peut analyser des vidéos avec <strong>des dizaines de milliers de commentaires</strong>. Les vidéos très populaires prennent un peu plus de temps, mais nous récupérons tous les commentaires pour un tirage équitable."
  },
  {
    question: "Comment filtrer les abonnés uniquement ?",
    answer: "Malheureusement, l'API YouTube ne permet pas de vérifier automatiquement si un commentateur est abonné. Cependant, vous pouvez demander aux participants d'inclure un <strong>mot-clé spécifique</strong> ou un emoji 🔔 dans leur commentaire et filtrer sur ce critère."
  },
  {
    question: "Le tirage fonctionne-t-il avec les YouTube Shorts ?",
    answer: "Oui ! Cleack supporte les <strong>vidéos classiques</strong>, les <strong>Shorts</strong>, et les <strong>Premieres</strong>. Tous les formats YouTube sont compatibles."
  },
  {
    question: "Puis-je exclure mes propres réponses du tirage ?",
    answer: "Oui, Cleack permet d'<strong>exclure automatiquement</strong> vos propres commentaires et réponses du tirage. Vous pouvez aussi exclure des utilisateurs spécifiques si nécessaire."
  },
  {
    question: "Dois-je connecter ma chaîne YouTube à Cleack ?",
    answer: "Non, <strong>aucune connexion</strong> n'est nécessaire. Cleack fonctionne uniquement avec le lien public de votre vidéo. Vos identifiants et données YouTube restent privés."
  },
  {
    question: "Comment contacter le gagnant sur YouTube ?",
    answer: "Vous pouvez : <ul><li>Répondre directement à son commentaire</li><li>Le mentionner dans un commentaire épinglé</li><li>L'inviter à vous contacter par email ou réseaux sociaux</li><li>Publier une vidéo d'annonce avec son pseudo</li></ul>"
  },
  {
    question: "Est-ce conforme aux règles YouTube d'organiser un giveaway ?",
    answer: "Oui, YouTube autorise les giveaways à condition de respecter les <a href='https://support.google.com/youtube/answer/1620498' target='_blank'>règles de la communauté</a>. Vous devez notamment : ne pas tromper les utilisateurs, ne pas manipuler les métriques, et respecter les lois locales sur les jeux-concours."
  },
  {
    question: "Cleack génère-t-il une preuve vidéo pour YouTube ?",
    answer: "Oui ! Cleack génère une <strong>vidéo preuve</strong> du tirage que vous pouvez télécharger et publier dans votre prochaine vidéo ou en Community Post pour montrer la transparence."
  },
  {
    question: "Puis-je faire un tirage au sort pendant un Live YouTube ?",
    answer: "Cleack analyse les commentaires <strong>déjà publiés</strong> sous une vidéo. Pour les Lives, attendez la fin du stream et analysez les rediffusions, ou utilisez les commentaires du chat sauvegardé."
  },
];

const howToSteps = [
  {
    name: "Copiez le lien de votre vidéo YouTube",
    text: "Cliquez sur 'Partager' sous votre vidéo, puis 'Copier'. Vous pouvez aussi copier l'URL depuis la barre d'adresse.",
  },
  {
    name: "Collez le lien dans Cleack",
    text: "Rendez-vous sur Cleack et collez l'URL de votre vidéo. Notre outil récupère automatiquement tous les commentaires.",
  },
  {
    name: "Configurez vos filtres",
    text: "Choisissez le nombre de gagnants, activez les filtres (mots-clés, exclusion de certains comptes, détection bots).",
  },
  {
    name: "Lancez le tirage et annoncez",
    text: "Cliquez sur 'Tirer au sort'. Téléchargez la vidéo preuve et annoncez le gagnant dans votre prochaine vidéo !",
  },
];

const softwareFeatures = [
  "Tirage au sort commentaires YouTube",
  "Support vidéos classiques et Shorts",
  "Analyse de milliers de commentaires",
  "Preuve vidéo certifiée",
  "Détection des bots et spam",
  "Filtres par mots-clés",
  "Exclusion des réponses du créateur",
  "Multi-gagnants",
  "100% gratuit",
];

const reviews = [
  {
    author: "Gaming France",
    datePublished: "2024-04-05",
    reviewBody: "Super outil pour nos giveaways gaming ! On avait 15 000 commentaires et Cleack a tout analysé. La vidéo preuve est top pour montrer que c'est fair.",
    ratingValue: 5,
  },
  {
    author: "Marie Tech",
    datePublished: "2024-03-18",
    reviewBody: "Enfin un outil gratuit et fiable pour les tirages YouTube. Je l'utilise tous les mois pour mes concours d'abonnés.",
    ratingValue: 5,
  },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-youtube/' },
  { lang: 'en', url: 'https://cleack.io/en/youtube-comment-picker/' },
  { lang: 'es', url: 'https://cleack.io/es/sorteo-youtube/' },
  { lang: 'x-default', url: 'https://cleack.io/en/youtube-comment-picker/' },
];

const TirageYoutubePage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort YouTube Gratuit - Choisir un Gagnant de Commentaires | Cleack"
        description="Faites un tirage au sort YouTube gratuit parmi les commentaires de vos vidéos. Sélectionnez un gagnant aléatoire pour vos giveaways. Fonctionne avec les vidéos classiques et Shorts."
        keywords="tirage au sort youtube, tirage commentaire youtube, giveaway youtube, concours youtube, youtube comment picker, choisir gagnant youtube, tirage youtube gratuit"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-youtube.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment faire un tirage au sort YouTube"
        howToDescription="Guide pour sélectionner un gagnant parmi les commentaires YouTube"
        howToTotalTime="PT2M"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={956}
        softwareFeatures={softwareFeatures}
        reviews={reviews}
      />

      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
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
                <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Youtube className="w-4 h-4" />
                  Vidéos & Shorts
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Tirage au Sort{' '}
                  <span className="text-red-600">YouTube</span>{' '}
                  Gratuit
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Sélectionnez un <strong>gagnant aléatoire</strong> parmi les commentaires de vos vidéos YouTube. 
                  Idéal pour récompenser vos abonnés et créer de l'engagement. Fonctionne avec les{' '}
                  <strong>vidéos classiques</strong> et les <strong>Shorts</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage gratuit
                  </Link>
                  <a
                    href="#comment-ca-marche"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-red-300 transition-all"
                  >
                    Comment ça marche ?
                  </a>
                </div>

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
                    <Film className="w-5 h-5 text-red-500" />
                    <span>Shorts supportés</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-red-500/10 p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Youtube className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Tirage au Sort YouTube</h2>
                    <p className="text-gray-500 mt-2">Collez le lien de votre vidéo</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                      readOnly
                    />
                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Tirer au sort gratuitement
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">1min</div>
                      <div className="text-sm text-gray-500">Durée</div>
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
                      <div className="text-sm text-gray-500">Note</div>
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
                <p className="text-xl text-gray-600 leading-relaxed">
                  YouTube est la plateforme idéale pour organiser des <strong>giveaways</strong> et fidéliser 
                  votre audience. Avec plus de <strong>2 milliards d'utilisateurs actifs</strong> par mois, 
                  les concours YouTube permettent d'augmenter l'engagement, les commentaires et les abonnements.
                </p>
                <p className="text-gray-600">
                  Cleack analyse tous les commentaires de vos vidéos, même celles avec des dizaines de milliers 
                  de participations, et sélectionne un gagnant de manière 100% aléatoire. Plus besoin de passer 
                  des heures à copier-coller des noms dans un fichier Excel !
                </p>
              </div>

              {/* Section: Comment ça marche */}
              <section id="comment-ca-marche" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Comment Faire un Tirage au Sort YouTube ?
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      step: 1,
                      title: "Copiez le lien de votre vidéo",
                      description: "Ouvrez votre vidéo YouTube, cliquez sur « Partager » puis « Copier ». Vous pouvez aussi copier l'URL directement depuis la barre d'adresse de votre navigateur.",
                      icon: <Youtube className="w-6 h-6" />,
                    },
                    {
                      step: 2,
                      title: "Collez le lien dans Cleack",
                      description: "Rendez-vous sur Cleack et collez l'URL de votre vidéo. Notre outil récupère automatiquement tous les commentaires, même les plus anciens.",
                      icon: <Zap className="w-6 h-6" />,
                    },
                    {
                      step: 3,
                      title: "Configurez les filtres",
                      description: "Définissez le nombre de gagnants. Activez les filtres : mots-clés obligatoires, exclusion de vos propres commentaires, détection des bots et spam.",
                      icon: <Filter className="w-6 h-6" />,
                    },
                    {
                      step: 4,
                      title: "Lancez le tirage et annoncez",
                      description: "Cliquez sur « Tirer au sort ». Téléchargez la vidéo preuve et annoncez le gagnant dans votre prochaine vidéo ou en post communautaire !",
                      icon: <Trophy className="w-6 h-6" />,
                    },
                  ].map((item) => (
                    <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-red-600 mb-1">Étape {item.step}</div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Fonctionnalités */}
              <section id="fonctionnalites" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Fonctionnalités du Tirage au Sort YouTube
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Tous les Commentaires",
                      description: "Analyse complète de tous les commentaires, y compris les réponses aux commentaires (threads).",
                      highlight: true,
                    },
                    {
                      icon: <Film className="w-6 h-6" />,
                      title: "Shorts & Vidéos",
                      description: "Fonctionne avec les vidéos classiques, les YouTube Shorts, les Premieres et les Lives.",
                      highlight: true,
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Preuve Vidéo",
                      description: "Générez une vidéo du tirage à intégrer dans votre prochaine vidéo ou Community Post.",
                    },
                    {
                      icon: <Bot className="w-6 h-6" />,
                      title: "Anti-Spam",
                      description: "Détection et exclusion automatique des commentaires spam et des bots.",
                    },
                    {
                      icon: <Filter className="w-6 h-6" />,
                      title: "Filtres Avancés",
                      description: "Filtrez par mots-clés, émojis (🔔), ou excluez vos propres commentaires.",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Multi-Gagnants",
                      description: "Sélectionnez plusieurs gagnants en un seul tirage pour vos gros giveaways.",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-xl p-6 border ${
                        feature.highlight ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        feature.highlight ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Types de tirages */}
              <section id="types-tirages" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Types de Giveaways YouTube
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Giveaway Commentaires Classique",
                      description: "Le format le plus populaire sur YouTube. Demandez aux viewers de commenter pour participer. Vous pouvez exiger un mot-clé spécifique, une réponse à une question, ou simplement un commentaire libre.",
                      link: "/tirage-commentaires-youtube/",
                      badge: "Le plus courant",
                    },
                    {
                      icon: <Bell className="w-6 h-6" />,
                      title: "Giveaway Abonnés (Cloche)",
                      description: "Demandez aux participants de s'abonner et d'activer la cloche 🔔. Faites-leur inclure l'emoji cloche dans leur commentaire pour pouvoir filtrer. Format idéal pour augmenter les abonnés fidèles.",
                      link: "/giveaway-abonnes-youtube/",
                      badge: "Croissance abonnés",
                    },
                    {
                      icon: <ThumbsUp className="w-6 h-6" />,
                      title: "Giveaway Like + Commentaire",
                      description: "Combinez le like et le commentaire pour maximiser l'engagement. Note : Cleack ne peut pas vérifier les likes, mais demander les deux booste votre vidéo dans l'algorithme.",
                      link: "/giveaway-youtube/",
                      badge: "Boost algorithme",
                    },
                  ].map((type, index) => (
                    <Link
                      key={index}
                      to={type.link}
                      className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">
                              {type.title}
                            </h3>
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                              {type.badge}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                          <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                            En savoir plus <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section: YouTube Shorts */}
              <section id="youtube-shorts" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Tirage au Sort pour YouTube Shorts
                </h2>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                      <Tv className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Les Shorts : un format en explosion
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Les YouTube Shorts génèrent des <strong>millions de vues</strong> et d'engagement. 
                        Ils sont parfaits pour des giveaways rapides et viraux. Cleack analyse les commentaires 
                        des Shorts exactement comme les vidéos classiques.
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Portée organique massive</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Format court = participation facile</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Touchez une nouvelle audience</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Link
                  to="/giveaway-youtube-shorts/"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                  Guide complet : Giveaway Shorts <ArrowRight className="w-4 h-4" />
                </Link>
              </section>

              {/* Section: Tutoriel */}
              <section id="tutoriel" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Tutoriel : Organiser un Giveaway YouTube Réussi
                </h2>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      Choisissez un lot attractif pour votre niche
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Le lot doit être pertinent pour votre audience :
                    </p>
                    <ul className="grid md:grid-cols-2 gap-2 text-gray-600">
                      <li>🎮 Gaming : jeux, consoles, accessoires</li>
                      <li>💄 Beauté : produits, coffrets makeup</li>
                      <li>📱 Tech : gadgets, smartphones, écouteurs</li>
                      <li>📚 Education : cours, livres, formations</li>
                      <li>🎨 Créatif : matériel, logiciels</li>
                      <li>💳 Polyvalent : cartes cadeaux</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      Créez une vidéo dédiée au giveaway
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• <strong>Annoncez clairement le giveaway</strong> dès le titre et la miniature</li>
                      <li>• <strong>Montrez le lot</strong> de manière attractive (unboxing, démonstration)</li>
                      <li>• <strong>Expliquez les conditions</strong> de participation de façon claire</li>
                      <li>• <strong>Précisez la date de fin</strong> pour créer l'urgence</li>
                      <li>• <strong>Épinglez un commentaire</strong> avec toutes les règles</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      Définissez des conditions simples
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Les conditions les plus efficaces sur YouTube :
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li>✓ « Abonnez-vous et activez la cloche 🔔 » (mentionnez l'emoji dans le commentaire)</li>
                      <li>✓ « Likez la vidéo et commentez [réponse à une question] »</li>
                      <li>✓ « Commentez votre [jeu/produit/film] préféré »</li>
                      <li>✗ Évitez les conditions trop complexes (partage, multi-plateforme)</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                      Promouvez et rappellez
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Publiez un <strong>Community Post</strong> de rappel</li>
                      <li>• Mentionnez le giveaway dans vos <strong>autres vidéos</strong></li>
                      <li>• Faites un <strong>compte à rebours</strong> avant la fin</li>
                      <li>• Interagissez avec les commentaires pour <strong>booster l'engagement</strong></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section: Conseils */}
              <section id="conseils" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Conseils pour Créateurs YouTube
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: "Durée optimale : 7-14 jours",
                      description: "Laissez le temps aux viewers de découvrir la vidéo via l'algorithme. 7-14 jours est idéal pour maximiser la participation.",
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Annoncez en vidéo",
                      description: "Créez une vidéo dédiée à l'annonce du gagnant. Intégrez la vidéo preuve Cleack pour montrer la transparence. Ça génère des vues supplémentaires !",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Prévoyez des remplaçants",
                      description: "Tirez au sort 3-5 gagnants potentiels. Si le premier ne répond pas sous 48h, passez au suivant. Mentionnez-le dans les règles.",
                    },
                    {
                      icon: <Bell className="w-6 h-6" />,
                      title: "Astuce : l'emoji cloche 🔔",
                      description: "Demandez d'inclure 🔔 dans le commentaire. Vous pourrez filtrer ces commentaires dans Cleack pour ne garder que les vrais abonnés engagés.",
                    },
                  ].map((conseil, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
                        {conseil.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{conseil.title}</h3>
                      <p className="text-gray-600 text-sm">{conseil.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-16">
                <FAQSection
                  items={faqItems}
                  title="Questions Fréquentes sur le Tirage au Sort YouTube"
                />
              </section>

              {/* Other Platforms */}
              <PlatformLinks currentPlatform="youtube" />

              {/* Final CTA */}
              <section className="mt-16">
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Prêt à Lancer Votre Giveaway YouTube ?
                  </h2>
                  <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
                    Utilisez Cleack pour choisir un gagnant parmi vos commentaires YouTube. 
                    Gratuit, rapide et avec preuve vidéo.
                  </p>
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
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

export default TirageYoutubePage;
