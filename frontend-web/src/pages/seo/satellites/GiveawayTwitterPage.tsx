import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gift,
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
  Heart,
  Target,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/giveaway-twitter-x/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Twitter/X', url: 'https://cleack.io/tirage-au-sort-twitter/' },
  { name: 'Giveaway Twitter/X', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment organiser un giveaway Twitter/X réussi ?",
    answer: "Un giveaway réussi sur Twitter/X combine : un lot attractif, des règles simples (RT + Follow ou Like + Réponse), un visuel accrocheur, une durée optimale (5-7 jours), et un tirage transparent avec Cleack. Annoncez clairement la deadline et respectez-la."
  },
  {
    question: "Quelles sont les règles de Twitter/X pour les giveaways ?",
    answer: "Twitter/X autorise les giveaways mais interdit : la création de multiples comptes pour participer, le spam, la manipulation de tendances. Évitez de demander de RT en masse ou de taguer trop de personnes. Restez raisonnable et authentique."
  },
  {
    question: "Quel format de giveaway fonctionne le mieux sur Twitter ?",
    answer: "Le format classique « RT + Follow pour participer » reste le plus efficace pour la viralité. Pour plus d'engagement, ajoutez une question à répondre. Pour plus de participations simples, un simple « Like pour participer » fonctionne bien."
  },
  {
    question: "Combien de temps doit durer un giveaway Twitter ?",
    answer: "Durée idéale : 5-7 jours. Assez long pour accumuler des participations, assez court pour maintenir l'excitation. Pour les gros lots, vous pouvez aller jusqu'à 2 semaines. Évitez les durées trop longues qui font perdre l'urgence."
  },
  {
    question: "Comment choisir le gagnant d'un giveaway Twitter ?",
    answer: "Avec Cleack : copiez le lien du tweet, choisissez de tirer au sort parmi les RT, les likes, ou les réponses, appliquez vos filtres anti-bot, et lancez le tirage. Cleack génère une vidéo preuve à tweeter."
  },
  {
    question: "Comment éviter les bots et faux comptes ?",
    answer: "Cleack détecte automatiquement les comptes suspects. Vous pouvez aussi : exiger un follow (les bots suivent rarement), demander une réponse personnalisée, vérifier manuellement le compte gagnant avant annonce."
  },
  {
    question: "Faut-il un règlement pour un giveaway Twitter ?",
    answer: "En France, oui. Pour les giveaways avec tirage au sort, un règlement est légalement requis. Publiez-le en réponse à votre tweet ou sur une page externe. Incluez : organisateur, dates, conditions, lot, modalités du tirage."
  },
];

const howToSteps = [
  { name: "Créez votre tweet giveaway", text: "Rédigez un tweet clair avec le lot, les règles et la date de fin. Ajoutez un visuel." },
  { name: "Publiez et épinglez", text: "Tweetez, épinglez en haut de votre profil, et ajoutez le règlement en réponse." },
  { name: "Animez pendant la durée", text: "Retweetez, répondez aux questions, faites des rappels avant la fin." },
  { name: "Tirez au sort avec Cleack", text: "Collez le lien, filtrez les bots, tirez au sort et partagez la preuve." },
];

const GiveawayTwitterPage = () => {
  return (
    <>
      <SEOHead
        title="Giveaway Twitter/X : Guide Complet + Tirage Gratuit | Cleack"
        description="Organisez un giveaway Twitter/X réussi en 2024. Guide complet : formats, règles, timing optimal + outil de tirage au sort gratuit avec preuve vidéo."
        keywords="giveaway twitter, giveaway x, concours twitter, tirage au sort twitter, organiser giveaway twitter, giveaway twitter france"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-giveaway-twitter.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un giveaway Twitter/X réussi"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={567}
      />

      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-gray-50">
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
                <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Gift className="w-4 h-4" />
                  Guide Giveaway Twitter/X
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Giveaway Twitter/X :{' '}
                  <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                    Le Guide Ultime 2024
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Apprenez à organiser un <strong>giveaway Twitter/X</strong> qui explose : 
                  formats efficaces, règles légales, timing optimal et tirage au sort transparent.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-sky-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-sky-600 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                  <a
                    href="#guide"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-sky-300 transition-all"
                  >
                    Lire le guide
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Guide complet
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Conforme Twitter
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Tirage gratuit
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Giveaway Twitter</h2>
                  <p className="text-gray-500 text-sm mt-2">Votre giveaway est terminé ?</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://twitter.com/user/status/..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-600 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Désigner le gagnant
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      567+ giveaways
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

        {/* Formats de Giveaway */}
        <section id="guide" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                4 Formats de Giveaway Twitter qui Fonctionnent
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choisissez le format adapté à vos objectifs : viralité, engagement, ou croissance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Repeat className="w-6 h-6" />,
                  title: "RT + Follow (Classique)",
                  engagement: "Viralité",
                  description: "Le format le plus populaire. Maximise la portée grâce aux retweets tout en gagnant des followers.",
                  template: "🎁 GIVEAWAY !\n\nPour participer :\n🔄 RT ce tweet\n👤 Follow @compte\n\nTirage le [date] !",
                  pros: ["Viral", "Gain d'abonnés", "Simple"],
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Like + Réponse (Engagement)",
                  engagement: "Qualitatif",
                  description: "Génère des discussions et un engagement plus profond. Idéal pour créer une connexion.",
                  template: "🎁 À GAGNER : [Lot] !\n\n❤️ Like ce tweet\n💬 Réponds avec [question]\n\nTirage parmi les réponses !",
                  pros: ["Engagement fort", "Discussions", "Filtrage naturel"],
                },
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: "Quiz/Question (Créatif)",
                  engagement: "Interactif",
                  description: "Posez une question et tirez au sort parmi les bonnes réponses ou les plus créatives.",
                  template: "🧠 QUIZ GIVEAWAY !\n\n[Question]\n\n💬 Réponds en commentaire\nTirage parmi les bonnes réponses !\n\n⏰ Fin le [date]",
                  pros: ["Éducatif", "Créativité", "Interaction"],
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Tag un ami (Viralité)",
                  engagement: "Acquisition",
                  description: "Les participants taguent des amis, multipliant l'exposition de manière exponentielle.",
                  template: "🎁 GIVEAWAY x2 !\n\n🔄 RT\n👤 Follow @compte\n👥 Tag 1 ami en commentaire\n\nVous gagnez TOUS LES DEUX !",
                  pros: ["Double gagnant", "Viral", "Nouvelles audiences"],
                },
              ].map((format, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center">
                        {format.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{format.title}</h3>
                        <span className="text-xs text-sky-600">{format.engagement}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{format.description}</p>

                  <div className="bg-white rounded-lg p-3 mb-4 font-mono text-xs whitespace-pre-wrap text-gray-700">
                    {format.template}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {format.pros.map((pro, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        ✓ {pro}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timing et Bonnes Pratiques */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Timing Optimal pour vos Giveaways Twitter
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Calendar className="w-8 h-8 text-sky-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quand Publier ?</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Mardi - Jeudi</span>
                    <span className="text-green-600 font-medium">⭐ Optimal</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700">Vendredi - Samedi</span>
                    <span className="text-yellow-600 font-medium">Bon</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">Dimanche - Lundi</span>
                    <span className="text-orange-600 font-medium">Moyen</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-sky-50 rounded-lg">
                  <p className="text-sky-700 text-sm">
                    <strong>Heures optimales :</strong> 12h-14h et 17h-20h (heure française)
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Clock className="w-8 h-8 text-sky-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Durée Recommandée</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Giveaway Flash</span>
                      <span className="text-sky-600">24-48h</span>
                    </div>
                    <p className="text-gray-600 text-sm">Crée l'urgence, peu de participations mais engagement fort</p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-lg border-2 border-sky-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Giveaway Standard ⭐</span>
                      <span className="text-sky-600">5-7 jours</span>
                    </div>
                    <p className="text-gray-600 text-sm">Équilibre parfait entre participations et urgence</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Giveaway Long</span>
                      <span className="text-sky-600">2-3 semaines</span>
                    </div>
                    <p className="text-gray-600 text-sm">Pour les gros lots, perd en urgence mais max de participants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Règles Twitter */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Règles Twitter/X pour les Giveaways
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Autorisé ✅</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de RT, liker, follow, répondre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Tirage au sort aléatoire et gratuit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de taguer 1-2 amis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Lots en nature (produits, cartes cadeaux)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interdit ❌</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Encourager la création de multiples comptes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Demander de RT en masse (spam)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Manipuler les tendances (#hashtag abusif)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Fausses promesses / lots inexistants</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Organiser Votre Giveaway en 4 Étapes
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.name}</h3>
                    <p className="text-gray-600 text-sm">{step.text}</p>
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

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Giveaway Twitter/X"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Ressources Twitter/X</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Retweets", url: "/tirage-retweets/" },
                { title: "Tirage Likes Twitter", url: "/tirage-likes-twitter/" },
                { title: "Guide Complet Twitter", url: "/tirage-au-sort-twitter/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-sky-50 rounded-lg border border-sky-100 hover:border-sky-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-sky-600" />
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
              className="inline-flex items-center gap-2 text-sky-600 font-medium hover:text-sky-700 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort Twitter/X
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-sky-500 rounded-2xl p-8 text-white">
              <Gift className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Votre Giveaway Twitter est Prêt ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour tirer au sort le gagnant de manière 100% transparente. 
                Gratuit, anti-bot, avec vidéo preuve à tweeter.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold hover:bg-sky-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Tirer au sort maintenant
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GiveawayTwitterPage;
