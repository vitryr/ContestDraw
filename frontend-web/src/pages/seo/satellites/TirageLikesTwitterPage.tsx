import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
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
  Star,
  Repeat,
  MessageCircle,
  Target,
  Eye,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-likes-twitter/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Twitter/X', url: 'https://cleack.io/tirage-au-sort-twitter/' },
  { name: 'Tirage Likes Twitter', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort parmi les likes Twitter/X ?",
    answer: "Copiez le lien de votre tweet, collez-le dans Cleack, et sélectionnez 'Likes'. Notre outil récupère la liste des comptes ayant liké et en tire un au sort de manière aléatoire. Vous obtenez le pseudo du gagnant et une vidéo preuve."
  },
  {
    question: "Peut-on voir la liste des personnes qui ont liké ?",
    answer: "Oui, Cleack récupère automatiquement tous les comptes ayant liké votre tweet. Vous pouvez voir le nombre total et appliquer des filtres avant le tirage."
  },
  {
    question: "Quelle est la différence entre tirage likes et tirage retweets ?",
    answer: "Le like est une action plus discrète (visible seulement sur le profil), tandis que le retweet est public et viral. Les tirages likes génèrent souvent plus de participations car c'est plus simple, mais moins de viralité."
  },
  {
    question: "Comment filtrer les bots et faux comptes ?",
    answer: "Cleack détecte automatiquement les comptes suspects : créés récemment, sans photo, sans tweets, ratio followers suspect. Vous pouvez configurer des filtres personnalisés."
  },
  {
    question: "Combien de likes Cleack peut-il analyser ?",
    answer: "Pas de limite ! Cleack peut analyser des tweets avec des milliers de likes. Pour les tweets très populaires, l'analyse prend quelques secondes de plus."
  },
  {
    question: "Peut-on combiner likes ET retweets dans un même tirage ?",
    answer: "Oui ! Cleack peut fusionner les participants qui ont liké ET retweeté, ou vous pouvez tirer au sort dans chaque liste séparément selon vos règles."
  },
  {
    question: "Comment contacter le gagnant ?",
    answer: "Une fois le gagnant tiré au sort : 1) Mentionnez-le dans un tweet d'annonce (@pseudo), 2) Envoyez-lui un DM si vos paramètres le permettent, 3) Demandez-lui de vous contacter en réponse à votre tweet."
  },
];

const howToSteps = [
  { name: "Copiez le lien du tweet", text: "Cliquez sur les 3 points puis 'Copier le lien du tweet'." },
  { name: "Collez dans Cleack", text: "Rendez-vous sur Cleack, collez l'URL et sélectionnez 'Likes'." },
  { name: "Appliquez vos filtres", text: "Excluez les comptes suspects, configurez vos critères." },
  { name: "Tirez au sort", text: "Lancez le tirage et partagez la vidéo preuve." },
];

const TirageLikesTwitterPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Likes Twitter/X Gratuit | Cleack"
        description="Faites un tirage au sort parmi les likes Twitter/X gratuit en 30 secondes. Filtrez les bots, excluez les faux comptes. Vidéo preuve incluse pour vos giveaways."
        keywords="tirage au sort likes twitter, tirage likes twitter, tirage au sort twitter like, random like picker twitter, giveaway twitter likes"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-likes-twitter.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment tirer au sort parmi les likes Twitter/X"
        includeSoftwareSchema
        softwareRating={4.7}
        softwareRatingCount={423}
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
                <div className="inline-flex items-center gap-2 bg-accent-primary/20 text-accent-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Heart className="w-4 h-4" />
                  Tirage Likes Twitter
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 bg-clip-text text-transparent">
                    Likes Twitter/X
                  </span>
                </h1>

                <p className="text-xl text-ink-secondary mb-8">
                  Sélectionnez un gagnant aléatoire parmi les personnes qui ont <strong>liké</strong> votre 
                  tweet. L'action la plus simple pour maximiser les participations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-bg-primary0 to-bg-primary0 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                  <Link
                    to="/tirage-au-sort-twitter/"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated border-2 border-white/10 text-ink-secondary px-8 py-4 rounded-xl font-semibold hover:border-accent-primary/50 transition-all"
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
                  <div className="w-16 h-16 bg-gradient-to-br from-bg-primary0 to-bg-primary0 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Likes Twitter</h2>
                  <p className="text-ink-tertiary text-sm mt-2">Collez le lien de votre tweet</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://twitter.com/user/status/..."
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
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

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-4 text-sm text-ink-tertiary">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      423+ utilisateurs
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      4.7/5
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Likes vs Retweets */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Likes vs Retweets : Quel Type de Tirage Choisir ?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl p-6 border border-pink-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-bg-elevated0 text-white rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Tirage Likes ❤️</h3>
                </div>
                <ul className="space-y-3 text-ink-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Plus de participations</strong> - Action simple, un clic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Action discrète</strong> - Moins de « spam » perçu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Bonne pour débuter</strong> - Moins intimidant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">−</span>
                    <span>Moins de viralité (pas de partage)</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-accent-primary font-medium">
                  Idéal pour : maximiser les participations, concours rapides
                </p>
              </div>

              <div className="bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl p-6 border border-sky-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-bg-elevated0 text-white rounded-xl flex items-center justify-center">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Tirage Retweets 🔄</h3>
                </div>
                <ul className="space-y-3 text-ink-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Viralité maximum</strong> - Partage à tous les followers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Portée étendue</strong> - Touche de nouvelles audiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Social proof</strong> - Nombre de RT visible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">−</span>
                    <span>Moins de participations (action plus engageante)</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-sky-400 font-medium">
                  Idéal pour : viralité, notoriété, gros lots
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-ink-secondary">
                <strong>💡 Pro tip :</strong> Combinez les deux ! « Like ❤️ + RT 🔄 pour doubler tes chances ! »
              </p>
            </div>
          </div>
        </section>

        {/* Avantages Likes */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pourquoi les Likes sont Efficaces pour vos Concours
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Barrière Basse",
                  description: "Un simple clic suffit - taux de participation maximum.",
                },
                {
                  icon: <Eye className="w-6 h-6" />,
                  title: "Discrétion",
                  description: "Moins intrusif qu'un RT, certains préfèrent.",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Signal Algorithme",
                  description: "Les likes comptent pour le référencement du tweet.",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Rapide",
                  description: "Accumule des participations très rapidement.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-accent-primary/20 text-accent-primary rounded-xl flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-ink-secondary text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Comment Tirer au Sort parmi les Likes
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl p-6 border border-pink-100 h-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.name}</h3>
                    <p className="text-ink-secondary text-sm">{step.text}</p>
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-pink-300" />
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
                Exemples de Tweets Giveaway avec Likes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  type: "Simple",
                  tweet: "🎁 GIVEAWAY !\n\nLike ❤️ ce tweet pour participer !\n\nTirage le [date]\n\n#Giveaway #Concours",
                  note: "Maximum de participations, minimum d'effort",
                },
                {
                  type: "Like + Follow",
                  tweet: "🎁 À GAGNER : [Lot] !\n\nPour participer :\n❤️ Like ce tweet\n👤 Follow @compte\n\nTirage le [date] !",
                  note: "Gagne des abonnés en plus",
                },
                {
                  type: "Like + RT",
                  tweet: "🚀 MEGA GIVEAWAY !\n\nDouble tes chances :\n❤️ Like\n🔄 Retweet\n\nTirage parmi les participants !",
                  note: "Combine participation max + viralité",
                },
                {
                  type: "Like + Réponse",
                  tweet: "🎁 CONCOURS !\n\n❤️ Like ce tweet\n💬 Réponds avec ton [X] préféré\n\nTirage le [date] !",
                  note: "Filtre les participants sérieux",
                },
              ].map((example, index) => (
                <div key={index} className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-accent-primary/20 text-accent-primary text-sm font-medium rounded-full">
                      {example.type}
                    </span>
                  </div>
                  <div className="bg-bg-elevated rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap">
                    {example.tweet}
                  </div>
                  <p className="text-ink-secondary text-sm italic">{example.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Tirage Likes Twitter"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Types de Tirages Twitter/X</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Retweets", url: "/tirage-retweets/" },
                { title: "Giveaway Twitter/X", url: "/giveaway-twitter-x/" },
                { title: "Guide Complet Twitter", url: "/tirage-au-sort-twitter/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-pink-100 hover:border-accent-primary/50 transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-accent-primary" />
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
              className="inline-flex items-center gap-2 text-accent-primary font-medium hover:text-pink-700 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort Twitter/X
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Tirage Likes ?</h2>
              <p className="text-white/90 mb-6">
                Sélectionnez un gagnant parmi les likes de votre tweet en 30 secondes. 
                Gratuit, anti-bot, avec vidéo preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-elevated text-accent-primary px-8 py-4 rounded-xl font-semibold hover:bg-bg-elevated transition-all"
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

export default TirageLikesTwitterPage;
