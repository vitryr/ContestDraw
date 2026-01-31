import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Repeat,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  ArrowRight,
  Trophy,
  Sparkles,
  Users,
  Award,
  Clock,
  TrendingUp,
  Twitter,
  Star,
  Share2,
  MessageCircle,
  Heart,
  Target,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-retweets/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Twitter/X', url: 'https://cleack.io/tirage-au-sort-twitter/' },
  { name: 'Tirage Retweets', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort parmi les retweets ?",
    answer: "Avec Cleack, copiez le lien de votre tweet, collez-le dans notre outil, et sélectionnez 'Retweets'. Cleack récupère la liste des personnes ayant retweeté et en tire une au sort de manière aléatoire et transparente."
  },
  {
    question: "Peut-on voir qui a retweeté un tweet ?",
    answer: "Oui, Cleack récupère automatiquement la liste des comptes ayant retweeté votre publication. Vous pouvez voir le nombre total et filtrer selon vos critères avant le tirage."
  },
  {
    question: "Comment filtrer les retweets de bots ou faux comptes ?",
    answer: "Cleack détecte les comptes suspects (créés récemment, sans photo de profil, peu de tweets). Vous pouvez aussi exiger un minimum de followers ou exclure les comptes créés il y a moins de X jours."
  },
  {
    question: "Le tirage inclut-il les quote tweets (retweets avec commentaire) ?",
    answer: "Par défaut, Cleack compte les retweets simples. Les quote tweets peuvent être inclus séparément ou combinés selon vos préférences - c'est configurable."
  },
  {
    question: "Combien de retweets Cleack peut-il analyser ?",
    answer: "Il n'y a pas de limite. Cleack peut analyser des tweets avec des milliers de retweets. Les tweets très populaires prennent simplement quelques secondes de plus."
  },
  {
    question: "Comment contacter le gagnant d'un tirage retweet ?",
    answer: "Une fois le gagnant désigné, vous pouvez : 1) Le mentionner dans un tweet d'annonce, 2) Lui envoyer un message privé (DM) s'il vous suit, 3) Répondre au tweet original en le taguant."
  },
  {
    question: "Un tirage retweet est-il légal sur Twitter/X ?",
    answer: "Oui, c'est légal tant que c'est gratuit et que vous respectez les règles de Twitter/X (pas de spam, pas de manipulation). Évitez de demander aux participants de créer plusieurs comptes."
  },
];

const howToSteps = [
  { name: "Copiez le lien du tweet", text: "Cliquez sur 'Copier le lien du tweet' depuis les options de partage." },
  { name: "Collez dans Cleack", text: "Rendez-vous sur Cleack et collez l'URL pour analyser les retweets." },
  { name: "Configurez les filtres", text: "Excluez les comptes suspects, définissez vos critères de participation." },
  { name: "Lancez le tirage", text: "Tirez au sort et partagez la vidéo preuve sur Twitter." },
];

const TirageRetweetsPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Retweets Twitter/X Gratuit | Cleack"
        description="Faites un tirage au sort parmi les retweets Twitter/X gratuit en 30 secondes. Excluez les bots, filtrez les comptes. Preuve vidéo incluse pour vos giveaways."
        keywords="tirage au sort retweet, tirage retweets, tirage au sort twitter retweet, random retweet picker, giveaway twitter retweet"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-retweets.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment tirer au sort parmi les retweets Twitter/X"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={645}
      />

      <div className="min-h-screen bg-gradient-to-b from-bg-primary via-bg-elevated to-bg-primary">
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
                <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Repeat className="w-4 h-4" />
                  Tirage Retweets
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-bg-primary0 to-blue-600 bg-clip-text text-transparent">
                    Retweets Twitter/X
                  </span>
                </h1>

                <p className="text-xl text-ink-secondary mb-8">
                  Sélectionnez un gagnant aléatoire parmi les personnes qui ont <strong>retweeté</strong> votre 
                  publication. Le format viral par excellence pour vos concours Twitter.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated0 text-white px-8 py-4 rounded-xl font-semibold hover:bg-sky-600 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                  <Link
                    to="/tirage-au-sort-twitter/"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated border-2 border-white/10 text-ink-secondary px-8 py-4 rounded-xl font-semibold hover:border-sky-300 transition-all"
                  >
                    Guide complet Twitter
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    100% Gratuit
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-secondary" />
                    Anti-bot
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
                className="bg-bg-elevated rounded-2xl shadow-xl p-8 border border-white/10"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-bg-elevated0 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Repeat className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Retweets</h2>
                  <p className="text-ink-tertiary text-sm mt-2">Collez le lien de votre tweet</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://twitter.com/user/status/..."
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-bg-elevated0 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-600 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-4 text-sm text-ink-tertiary">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      645+ utilisateurs
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      4.8/5
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pourquoi les Retweets */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pourquoi les Retweets sont Parfaits pour vos Giveaways
              </h2>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                Le retweet est l'action virale par excellence sur Twitter/X.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Viralité Maximum",
                  description: "Chaque retweet expose votre concours à l'audience de cette personne - effet boule de neige garanti.",
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Portée Organique",
                  description: "Touchez des personnes qui ne vous suivent pas encore grâce aux retweets de vos followers.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Engagement Public",
                  description: "Les retweets sont visibles par tous - social proof qui encourage d'autres participations.",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Action Simple",
                  description: "Un clic suffit pour retweeter - taux de participation élevé garanti.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-elevated rounded-xl p-6 hover:bg-sky-500/20 transition-all"
                >
                  <div className="w-12 h-12 bg-bg-elevated text-sky-400 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-ink-secondary text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Types de concours retweet */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Formats de Concours Retweet Populaires
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Repeat className="w-6 h-6" />,
                  title: "RT pour participer",
                  description: "Le format le plus simple : un retweet = une participation. Maximum de participations garanti.",
                  example: "« 🎁 GIVEAWAY ! RT pour participer. Tirage le DD/MM ! »",
                },
                {
                  icon: <Share2 className="w-6 h-6" />,
                  title: "RT + Follow",
                  description: "Combinez retweet et follow pour gagner des abonnés en plus de la viralité.",
                  example: "« RT + Follow @compte pour participer ! 🚀 »",
                },
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: "RT + Réponse",
                  description: "Ajoutez une question à répondre pour filtrer les participants sérieux.",
                  example: "« RT et réponds avec ta couleur préférée ! »",
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "RT + Like",
                  description: "Double action pour maximiser l'engagement sur votre tweet.",
                  example: "« Like ❤️ + RT 🔄 pour tenter de gagner ! »",
                },
              ].map((format, index) => (
                <div key={index} className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      {format.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{format.title}</h3>
                      <p className="text-ink-secondary text-sm mb-3">{format.description}</p>
                      <p className="text-sky-400 text-sm italic">{format.example}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Comment Tirer au Sort parmi les Retweets
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl p-6 border border-sky-100 h-full">
                    <div className="w-10 h-10 bg-bg-elevated0 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.name}</h3>
                    <p className="text-ink-secondary text-sm">{step.text}</p>
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-sky-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bonnes pratiques */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-bg-primary0 to-blue-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  Bonnes Pratiques pour un Giveaway Retweet Réussi
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Visuel Accrocheur",
                    tips: ["Image ou vidéo du lot", "Texte « GIVEAWAY » visible", "Format carré ou 16:9"],
                  },
                  {
                    title: "Tweet Optimal",
                    tips: ["Règles en 1-2 lignes max", "Date de fin claire", "Emojis pour la visibilité 🎁"],
                  },
                  {
                    title: "Timing",
                    tips: ["Mardi-jeudi, 17h-20h", "Durée 5-7 jours", "Rappels avant la fin"],
                  },
                ].map((section, index) => (
                  <div key={index} className="bg-bg-elevated/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">{section.title}</h3>
                    <ul className="space-y-2 text-white/90 text-sm">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Tirage Retweets"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Types de Tirages Twitter/X</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Likes Twitter", url: "/tirage-likes-twitter/" },
                { title: "Giveaway Twitter/X", url: "/giveaway-twitter-x/" },
                { title: "Guide Complet Twitter", url: "/tirage-au-sort-twitter/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-sky-100 hover:border-sky-300 transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-sky-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-twitter/"
              className="inline-flex items-center gap-2 text-sky-400 font-medium hover:text-sky-400 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort Twitter/X
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-bg-elevated0 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Tirage Retweet ?</h2>
              <p className="text-white/90 mb-6">
                Sélectionnez un gagnant parmi les retweets de votre tweet en 30 secondes. 
                Gratuit, anti-bot, avec vidéo preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-elevated text-sky-400 px-8 py-4 rounded-xl font-semibold hover:bg-bg-elevated transition-all"
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

export default TirageRetweetsPage;
