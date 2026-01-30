import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  ArrowRight,
  Trophy,
  Sparkles,
  Filter,
  ThumbsUp,
  Users,
  Award,
  Clock,
  TrendingUp,
  Youtube,
  Bell,
  Star,
  Video,
  AtSign,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-commentaires-youtube/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort YouTube', url: 'https://cleack.io/tirage-au-sort-youtube/' },
  { name: 'Tirage Commentaires', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment tirer au sort parmi les commentaires YouTube ?",
    answer: "Copiez l'URL de votre vidéo YouTube, collez-la dans Cleack, et cliquez sur « Tirer au sort ». Notre outil récupère automatiquement tous les commentaires et en sélectionne un de manière 100% aléatoire. Vous obtenez le nom du gagnant et une vidéo preuve en moins de 30 secondes."
  },
  {
    question: "Cleack fonctionne-t-il avec toutes les vidéos YouTube ?",
    answer: "Oui, Cleack fonctionne avec les vidéos publiques, les Shorts, les Premières et les Lives. La seule condition est que les commentaires soient activés sur la vidéo."
  },
  {
    question: "Comment filtrer les commentaires YouTube ?",
    answer: "Vous pouvez exclure les doublons (une seule participation par compte), filtrer par mots-clés obligatoires, ou exiger que le commentaire contienne un certain nombre de caractères minimum."
  },
  {
    question: "Peut-on tirer au sort parmi les réponses aux commentaires ?",
    answer: "Oui, par défaut les réponses sont incluses. Vous pouvez choisir de les exclure si vous souhaitez uniquement tirer au sort parmi les commentaires de premier niveau."
  },
  {
    question: "Combien de commentaires YouTube Cleack peut-il analyser ?",
    answer: "Il n'y a pas de limite. Cleack peut analyser des vidéos avec des dizaines de milliers de commentaires. Les vidéos très commentées prennent simplement quelques secondes de plus."
  },
  {
    question: "Le tirage est-il vraiment aléatoire ?",
    answer: "Oui, 100%. Cleack utilise un algorithme cryptographique pour garantir un tirage parfaitement équitable. Chaque participant a exactement la même chance de gagner."
  },
  {
    question: "Comment contacter le gagnant sur YouTube ?",
    answer: "Une fois le gagnant tiré au sort, vous pouvez : 1) Répondre à son commentaire pour le féliciter, 2) L'annoncer dans une vidéo dédiée, 3) Lui demander de vous contacter via les réseaux sociaux liés à votre chaîne."
  },
];

const howToSteps = [
  { name: "Copiez l'URL YouTube", text: "Depuis votre vidéo, copiez l'URL dans la barre d'adresse ou via le bouton Partager." },
  { name: "Collez dans Cleack", text: "Rendez-vous sur Cleack et collez le lien pour récupérer les commentaires." },
  { name: "Configurez vos filtres", text: "Excluez les doublons, filtrez par mots-clés si nécessaire." },
  { name: "Lancez le tirage", text: "Cliquez sur Tirer au sort et téléchargez la vidéo preuve pour votre communauté." },
];

const TirageCommentairesYoutubePage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Commentaires YouTube Gratuit | Cleack"
        description="Faites un tirage au sort parmi les commentaires YouTube gratuit en 30 secondes. Excluez les doublons, filtrez par mots-clés. Vidéo preuve incluse pour vos giveaways."
        keywords="tirage au sort commentaire youtube, tirage commentaires youtube, youtube comment picker, tirage au sort youtube commentaire, giveaway youtube commentaire"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-commentaires-youtube.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment tirer au sort parmi les commentaires YouTube"
        includeSoftwareSchema
        softwareRating={4.9}
        softwareRatingCount={1123}
      />

      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <MessageCircle className="w-4 h-4" />
                  Tirage Commentaires YouTube
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    Commentaires YouTube
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Sélectionnez un gagnant aléatoire parmi les <strong>commentaires</strong> de vos 
                  vidéos YouTube. Parfait pour vos giveaways et concours de chaîne.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                  <Link
                    to="/tirage-au-sort-youtube/"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-red-300 transition-all"
                  >
                    Guide complet YouTube
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    100% Gratuit
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Sans inscription
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    30 secondes
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Commentaires YouTube</h2>
                  <p className="text-gray-500 text-sm mt-2">Collez le lien de votre vidéo</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      1,123+ utilisateurs
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      4.9/5
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pourquoi les commentaires YouTube */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi les Commentaires YouTube pour vos Giveaways ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Les concours en commentaires sont le format préféré des YouTubers pour récompenser leur communauté.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Boost l'Algorithme",
                  description: "Plus de commentaires = signal positif pour YouTube = meilleur référencement de votre vidéo.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Engagement Réel",
                  description: "Les commentaires génèrent des discussions et renforcent la communauté autour de votre chaîne.",
                },
                {
                  icon: <Bell className="w-6 h-6" />,
                  title: "Notifications",
                  description: "Chaque commentaire notifie le créateur, les réponses créent un fil de discussion visible.",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Durée de Vie",
                  description: "Une vidéo YouTube reste accessible des années - votre concours peut attirer des participants longtemps.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-red-50 rounded-xl p-6 hover:bg-red-100 transition-all"
                >
                  <div className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtres Disponibles */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Filtres Disponibles pour les Commentaires YouTube
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Filter className="w-6 h-6" />,
                  title: "Exclusion Doublons",
                  description: "Une seule participation par compte YouTube, même si la personne a commenté plusieurs fois.",
                },
                {
                  icon: <AtSign className="w-6 h-6" />,
                  title: "Mots-clés Requis",
                  description: "Exigez que les commentaires contiennent un mot ou une phrase spécifique pour valider la participation.",
                },
                {
                  icon: <ThumbsUp className="w-6 h-6" />,
                  title: "Longueur Minimum",
                  description: "Filtrez les commentaires trop courts (ex: minimum 10 caractères) pour éviter les participations vides.",
                },
              ].map((filter, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                    {filter.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{filter.title}</h3>
                  <p className="text-gray-600 text-sm">{filter.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment Faire un Tirage au Sort YouTube en 4 Étapes
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100 h-full">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.name}</h3>
                    <p className="text-gray-600 text-sm">{step.text}</p>
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-red-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cas d'usage */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Types de Concours YouTube Populaires
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: "Concours « Commente pour participer »",
                  description: "Le format classique YouTube : laissez un commentaire pour participer. Simple et efficace.",
                  example: "Exemple : « Commente ce que tu aimerais voir dans ma prochaine vidéo pour participer ! 🎁 »",
                },
                {
                  icon: <ThumbsUp className="w-6 h-6" />,
                  title: "Concours « Like + Commentaire »",
                  description: "Demandez un like ET un commentaire. Double action pour maximiser l'engagement.",
                  example: "Exemple : « Like cette vidéo ET commente ta console préférée ! »",
                },
                {
                  icon: <Bell className="w-6 h-6" />,
                  title: "Concours « Abonne-toi + Commente »",
                  description: "Parfait pour faire grandir votre chaîne tout en récompensant l'engagement.",
                  example: "Exemple : « Abonne-toi, active la cloche 🔔 et commente pour participer ! »",
                },
                {
                  icon: <Video className="w-6 h-6" />,
                  title: "Concours « Question/Réponse »",
                  description: "Posez une question et tirez au sort parmi les bonnes réponses ou les plus créatives.",
                  example: "Exemple : « Devine le nombre de vues que fera cette vidéo ! Tirage parmi les plus proches. »",
                },
              ].map((useCase, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{useCase.description}</p>
                      <p className="text-red-600 text-sm italic">{useCase.example}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistiques YouTube */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <Youtube className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  YouTube en France (2024)
                </h2>
                <p className="text-red-100">La plateforme vidéo #1 pour engager votre audience</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                {[
                  { value: "49M+", label: "Visiteurs uniques mensuels" },
                  { value: "40 min", label: "Temps moyen par session" },
                  { value: "18-49 ans", label: "Audience principale" },
                  { value: "500h", label: "De vidéos uploadées/minute" },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-red-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Tirage Commentaires YouTube"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Types de Tirages YouTube</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Giveaway YouTube Shorts", url: "/giveaway-youtube-shorts/" },
                { title: "Concours YouTube", url: "/concours-youtube/" },
                { title: "Guide Complet YouTube", url: "/tirage-au-sort-youtube/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100 hover:border-red-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Tirages sur Autres Plateformes</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Tirage Instagram", url: "/tirage-au-sort-instagram/" },
                { title: "Tirage TikTok", url: "/tirage-au-sort-tiktok/" },
                { title: "Tirage Facebook", url: "/tirage-au-sort-facebook/" },
                { title: "Tirage Twitter/X", url: "/tirage-au-sort-twitter/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-youtube/"
              className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort YouTube
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-red-600 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Tirage YouTube ?</h2>
              <p className="text-white/90 mb-6">
                Sélectionnez un gagnant parmi les commentaires de votre vidéo YouTube en 30 secondes. 
                Gratuit, sans inscription, avec vidéo preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TirageCommentairesYoutubePage;
