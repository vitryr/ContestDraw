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
  AtSign,
  Hash,
  Music,
  TrendingUp,
  Users,
  Video,
  Clock,
  Award,
  Target,
  Heart,
  Share2,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-commentaires-tiktok/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort TikTok', url: 'https://cleack.io/tirage-au-sort-tiktok/' },
  { name: 'Tirage Commentaires', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort des commentaires TikTok ?",
    answer: "Avec Cleack, copiez simplement le lien de votre vidéo TikTok, collez-le dans notre outil, et cliquez sur « Tirer au sort ». Cleack récupère automatiquement tous les commentaires et sélectionne un gagnant de manière 100% aléatoire et transparente en moins de 30 secondes."
  },
  {
    question: "Peut-on filtrer les commentaires TikTok par mentions (@ami) ?",
    answer: "Oui ! Activez le filtre « Mentions obligatoires » pour ne garder que les commentaires où les participants ont tagué des amis. Vous pouvez même définir un nombre minimum de tags requis (ex: 2 amis minimum)."
  },
  {
    question: "Comment exclure les comptes qui commentent plusieurs fois ?",
    answer: "Cleack propose une option « Exclure les doublons » qui compte une seule participation par compte TikTok, même si la personne a commenté 10 fois. C'est plus équitable pour tous les participants."
  },
  {
    question: "Les réponses aux commentaires TikTok sont-elles incluses ?",
    answer: "Par défaut, oui. Vous pouvez choisir d'inclure ou d'exclure les réponses (threads de discussion) selon les règles de votre concours TikTok."
  },
  {
    question: "Combien de commentaires TikTok Cleack peut-il analyser ?",
    answer: "Il n'y a pas de limite technique. Cleack peut analyser des vidéos TikTok virales avec des dizaines de milliers de commentaires. Les vidéos très populaires prennent simplement quelques secondes de plus."
  },
  {
    question: "Comment prouver que le tirage TikTok est équitable ?",
    answer: "Cleack génère automatiquement une vidéo preuve du tirage avec un certificat d'authenticité unique. Vous pouvez la partager en Story TikTok pour prouver la transparence à votre communauté."
  },
  {
    question: "Peut-on filtrer par hashtag dans les commentaires ?",
    answer: "Oui, vous pouvez exiger qu'un hashtag spécifique soit présent dans le commentaire (ex: #TeamConcours). Seuls les commentaires contenant ce hashtag seront inclus dans le tirage."
  },
];

const howToSteps = [
  { name: "Copiez le lien TikTok", text: "Ouvrez votre vidéo TikTok, cliquez sur Partager puis Copier le lien." },
  { name: "Collez dans Cleack", text: "Rendez-vous sur Cleack et collez l'URL pour récupérer tous les commentaires." },
  { name: "Configurez vos filtres", text: "Activez les filtres souhaités : mentions, hashtags, doublons, comptes vérifiés." },
  { name: "Lancez le tirage", text: "Cliquez sur Tirer au sort et téléchargez votre vidéo preuve à partager." },
];

const TirageCommentairesTiktokPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Commentaires TikTok Gratuit | Cleack"
        description="Faites un tirage au sort parmi les commentaires TikTok gratuit en 30 secondes. Filtrez par mentions, hashtags et excluez les doublons. Vidéo preuve incluse pour vos giveaways."
        keywords="tirage au sort commentaire tiktok, tirage commentaires tiktok, comment picker tiktok, tirage au sort tiktok commentaire, giveaway tiktok commentaire"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-commentaires-tiktok.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment tirer au sort parmi les commentaires TikTok"
        includeSoftwareSchema
        softwareRating={4.9}
        softwareRatingCount={892}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-pink-950">
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-bg-primary0/20 to-bg-primary0/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
                  <MessageCircle className="w-4 h-4" />
                  Tirage Commentaires TikTok
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-bg-primary0 via-red-500 to-cyan-400 bg-clip-text text-transparent">
                    Commentaires TikTok
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-8">
                  Sélectionnez un gagnant aléatoire parmi les <strong className="text-white">commentaires</strong> de vos 
                  vidéos TikTok. Filtres avancés, exclusion des doublons et vidéo preuve incluse pour vos concours.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-bg-primary0 to-bg-primary0 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                  <Link
                    to="/tirage-au-sort-tiktok/"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-bg-elevated/20 transition-all"
                  >
                    Guide complet TikTok
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    100% Gratuit
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Sans inscription
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    30 secondes
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-bg-primary0 to-bg-primary0 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Commentaires TikTok</h2>
                  <p className="text-ink-tertiary text-sm mt-2">Collez votre lien TikTok</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.tiktok.com/@user/video/..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-bg-primary0 to-bg-primary0 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-4 text-sm text-ink-tertiary">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      892+ utilisateurs
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      4.9/5
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pourquoi choisir les commentaires TikTok */}
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pourquoi Organiser un Tirage sur les Commentaires TikTok ?
              </h2>
              <p className="text-ink-tertiary max-w-2xl mx-auto">
                Les commentaires TikTok sont le format idéal pour maximiser l'engagement et la viralité de vos concours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Algorithme Favorable",
                  description: "Plus de commentaires = meilleur référencement dans le For You Page de TikTok.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Effet Viral",
                  description: "Chaque tag d'ami dans les commentaires expose votre contenu à de nouvelles audiences.",
                },
                {
                  icon: <Video className="w-6 h-6" />,
                  title: "Format Natif",
                  description: "Les concours en commentaires sont familiers aux utilisateurs TikTok.",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Facile à Participer",
                  description: "Un simple commentaire suffit - pas besoin de quitter l'application.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-pink-500/50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-bg-primary0/20 to-bg-primary0/20 text-pink-400 rounded-xl flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-ink-tertiary text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtres Disponibles */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Filtres Avancés pour vos Tirages TikTok
              </h2>
              <p className="text-ink-tertiary max-w-2xl mx-auto">
                Personnalisez votre tirage avec nos filtres pour ne garder que les participants qui respectent vos règles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <AtSign className="w-6 h-6" />,
                  title: "Mentions Obligatoires",
                  description: "Exigez que les participants taguent 1, 2 ou 3 amis (@pseudo) pour être éligibles au tirage.",
                  color: "pink",
                },
                {
                  icon: <Hash className="w-6 h-6" />,
                  title: "Hashtags Requis",
                  description: "Filtrez les commentaires contenant un hashtag spécifique (#GiveawayTikTok, #TeamVous).",
                  color: "cyan",
                },
                {
                  icon: <Filter className="w-6 h-6" />,
                  title: "Exclusion Doublons",
                  description: "Une seule participation par compte, même si quelqu'un a commenté 50 fois.",
                  color: "purple",
                },
              ].map((filter, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className={`w-12 h-12 bg-${filter.color}-500/20 text-${filter.color}-400 rounded-xl flex items-center justify-center mb-4`}>
                    {filter.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{filter.title}</h3>
                  <p className="text-ink-tertiary text-sm">{filter.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche - Tutoriel détaillé */}
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Comment Faire un Tirage au Sort TikTok en 4 Étapes
              </h2>
              <p className="text-ink-tertiary max-w-2xl mx-auto">
                Suivez ce guide simple pour organiser votre tirage au sort parmi les commentaires TikTok.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.name}</h3>
                    <p className="text-ink-tertiary text-sm">{step.text}</p>
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-ink-secondary" />
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
              <h2 className="text-3xl font-bold text-white mb-4">
                Types de Concours TikTok Populaires
              </h2>
              <p className="text-ink-tertiary max-w-2xl mx-auto">
                Découvrez les formats de concours qui fonctionnent le mieux sur TikTok.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: "Concours « Commente pour participer »",
                  description: "Le format classique TikTok : chaque commentaire = une chance de gagner. Simple et efficace pour maximiser l'engagement de votre vidéo.",
                  tips: "Astuce : Posez une question dans votre vidéo pour encourager des commentaires plus longs.",
                },
                {
                  icon: <AtSign className="w-6 h-6" />,
                  title: "Concours « Tag 2 amis »",
                  description: "Demandez aux participants de taguer des amis. Effet viral garanti car chaque tag notifie de nouvelles personnes de votre concours.",
                  tips: "Astuce : Limitez à 2-3 tags pour éviter le spam et garder la qualité.",
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Concours « Like + Commentaire »",
                  description: "Combinez les actions : demandez un like ET un commentaire. Double l'engagement et booste votre vidéo dans l'algorithme.",
                  tips: "Astuce : Cleack vérifie automatiquement que le commentaire existe.",
                },
                {
                  icon: <Share2 className="w-6 h-6" />,
                  title: "Concours « Réponse créative »",
                  description: "Posez une question ou lancez un défi créatif. Tirez au sort parmi les meilleures réponses pour récompenser la créativité.",
                  tips: "Astuce : Idéal pour générer du contenu UGC (User Generated Content).",
                },
              ].map((useCase, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-bg-elevated0/20 text-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                      <p className="text-ink-tertiary text-sm mb-3">{useCase.description}</p>
                      <p className="text-cyan-400 text-sm italic">{useCase.tips}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistiques TikTok */}
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-bg-primary0/10 to-bg-primary0/10 rounded-2xl p-8 border border-pink-500/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  TikTok en Chiffres (France 2024)
                </h2>
                <p className="text-ink-tertiary">Pourquoi TikTok est incontournable pour vos concours</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                {[
                  { value: "21M+", label: "Utilisateurs actifs mensuels en France" },
                  { value: "52 min", label: "Temps moyen passé par jour" },
                  { value: "67%", label: "Des utilisateurs ont entre 16 et 24 ans" },
                  { value: "2x", label: "Plus d'engagement que Instagram" },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-ink-tertiary text-sm">{stat.label}</div>
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
              title="Questions Fréquentes - Tirage Commentaires TikTok"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Types de Tirages TikTok</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Giveaway TikTok Complet", url: "/giveaway-tiktok/" },
                { title: "Concours TikTok", url: "/concours-tiktok/" },
                { title: "Guide Complet TikTok", url: "/tirage-au-sort-tiktok/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-pink-400" />
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 mt-12">Tirages sur Autres Plateformes</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Tirage Instagram", url: "/tirage-au-sort-instagram/" },
                { title: "Tirage Facebook", url: "/tirage-au-sort-facebook/" },
                { title: "Tirage YouTube", url: "/tirage-au-sort-youtube/" },
                { title: "Tirage Twitter/X", url: "/tirage-au-sort-twitter/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-cyan-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-tiktok/"
              className="inline-flex items-center gap-2 text-pink-400 font-medium hover:text-pink-300 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort TikTok
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Tirage TikTok ?</h2>
              <p className="text-white/90 mb-6">
                Sélectionnez un gagnant parmi les commentaires de votre vidéo TikTok en moins de 30 secondes. 
                Gratuit, sans inscription, avec vidéo preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-elevated text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
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

export default TirageCommentairesTiktokPage;
