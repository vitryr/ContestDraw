import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
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
  Instagram,
  Star,
  Heart,
  MessageCircle,
  Lock,
  Eye,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-abonnes-instagram/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Instagram', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { name: 'Tirage Abonnés', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort parmi mes abonnés Instagram ?",
    answer: "Avec Cleack, connectez votre compte Instagram, sélectionnez 'Tirage parmi les abonnés', et lancez le tirage. Cleack sélectionne aléatoirement un ou plusieurs gagnants parmi la liste de vos followers."
  },
  {
    question: "Peut-on voir la liste de ses abonnés pour le tirage ?",
    answer: "Cleack récupère automatiquement votre liste d'abonnés via l'API Instagram. Pour les comptes avec beaucoup de followers, l'analyse prend quelques secondes. Vous verrez le nombre total avant le tirage."
  },
  {
    question: "Comment filtrer les abonnés pour le tirage ?",
    answer: "Vous pouvez filtrer par : ancienneté de l'abonnement, comptes vérifiés, comptes avec photo de profil, ou exclure les comptes suspects (bots). Idéal pour récompenser vos vrais fans."
  },
  {
    question: "Ce tirage fonctionne-t-il pour les comptes privés ?",
    answer: "Oui, si c'est votre propre compte. Vous devez être connecté à Cleack avec votre compte Instagram pour accéder à votre liste d'abonnés, que votre compte soit public ou privé."
  },
  {
    question: "Combien d'abonnés Cleack peut-il analyser ?",
    answer: "Il n'y a pas de limite. Cleack peut analyser des comptes avec des millions d'abonnés. Les très gros comptes prennent simplement plus de temps (quelques minutes pour 1M+ followers)."
  },
  {
    question: "Comment contacter le gagnant abonné ?",
    answer: "Une fois le gagnant tiré au sort, vous pouvez : 1) Le mentionner en Story, 2) Lui envoyer un DM, 3) Commenter sur son dernier post. Demandez-lui de confirmer pour valider."
  },
  {
    question: "Pourquoi faire un tirage parmi les abonnés plutôt que les commentaires ?",
    answer: "Le tirage abonnés récompense la fidélité de votre communauté existante, pas seulement ceux qui ont vu un post spécifique. Idéal pour remercier vos followers de longue date."
  },
];

const howToSteps = [
  { name: "Connectez votre compte", text: "Authentifiez-vous avec votre compte Instagram professionnel ou créateur." },
  { name: "Choisissez le tirage abonnés", text: "Sélectionnez l'option 'Tirer au sort parmi mes abonnés'." },
  { name: "Appliquez vos filtres", text: "Filtrez par ancienneté, excluez les bots ou comptes suspects." },
  { name: "Lancez le tirage", text: "Tirez au sort et annoncez le gagnant en Story avec la preuve." },
];

const TirageAbonnesInstagramPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Abonnés Instagram Gratuit | Cleack"
        description="Faites un tirage au sort parmi vos abonnés Instagram gratuit. Récompensez votre communauté fidèle. Filtres anti-bots inclus. Parfait pour remercier vos followers."
        keywords="tirage au sort abonnés instagram, tirage followers instagram, tirage au sort instagram abonnés, random follower picker instagram, concours abonnés instagram"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-abonnes-instagram.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment tirer au sort parmi ses abonnés Instagram"
        includeSoftwareSchema
        softwareRating={4.7}
        softwareRatingCount={312}
      />

      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
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
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <UserPlus className="w-4 h-4" />
                  Tirage Abonnés Instagram
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Abonnés Instagram
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Récompensez votre communauté en tirant au sort parmi vos <strong>abonnés Instagram</strong>. 
                  L'idéal pour remercier vos followers fidèles.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                  <Link
                    to="/tirage-au-sort-instagram/"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-pink-300 transition-all"
                  >
                    Guide complet Instagram
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    100% Gratuit
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Anti-bots
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Tous les comptes
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Abonnés</h2>
                  <p className="text-gray-500 text-sm mt-2">Récompensez vos followers</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-pink-50 rounded-xl text-center">
                    <Instagram className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Connectez votre compte Instagram</p>
                  </div>
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Commencer le tirage
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      312+ utilisateurs
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

        {/* Pourquoi tirer au sort les abonnés */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi Tirer au Sort parmi vos Abonnés ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Différent d'un tirage commentaires, le tirage abonnés récompense votre communauté existante.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Récompense la Fidélité",
                  description: "Remerciez ceux qui vous suivent depuis longtemps, pas seulement les opportunistes.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Engagement Communauté",
                  description: "Crée un sentiment d'appartenance - « Je peux gagner juste en étant abonné ! »",
                },
                {
                  icon: <Eye className="w-6 h-6" />,
                  title: "Pas de Post Requis",
                  description: "Pas besoin de créer un post spécifique - tirez au sort quand vous voulez.",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Surprise Effect",
                  description: "Annoncez le tirage en Story pour créer l'excitation chez tous vos followers.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-pink-50 rounded-xl p-6 hover:bg-pink-100 transition-all"
                >
                  <div className="w-12 h-12 bg-white text-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Abonnés vs Commentaires */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tirage Abonnés vs Tirage Commentaires
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-500 text-white rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Tirage Abonnés 👥</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Récompense la fidélité</strong> - Pas besoin d'action spécifique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Tous ont une chance</strong> - Même ceux qui n'ont pas vu le post</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Effet surprise</strong> - Tirage spontané possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">−</span>
                    <span>Pas de viralité (pas de partage)</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-pink-600 font-medium">
                  Idéal pour : remercier votre communauté, célébrer un cap
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Tirage Commentaires 💬</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Boost l'engagement</strong> - Augmente les stats du post</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Viral avec tags</strong> - Amis tagués = nouvelles audiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Visible</strong> - Nombre de commentaires affiché</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">−</span>
                    <span>Exclut ceux qui n'ont pas vu le post</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-purple-600 font-medium">
                  Idéal pour : acquisition, engagement, viralité
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment Tirer au Sort parmi vos Abonnés
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100 h-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.name}</h3>
                    <p className="text-gray-600 text-sm">{step.text}</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quand Faire un Tirage Abonnés ?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Célébration de Palier",
                  description: "Vous atteignez 10K, 50K, 100K followers ? Remerciez-les en offrant un cadeau !",
                  emoji: "🎉",
                },
                {
                  title: "Anniversaire de Compte",
                  description: "1 an, 2 ans, 5 ans sur Instagram ? Célébrez avec votre communauté fidèle.",
                  emoji: "🎂",
                },
                {
                  title: "Remerciement Spontané",
                  description: "Envie de faire plaisir à un follower au hasard ? Tirage surprise !",
                  emoji: "🎁",
                },
                {
                  title: "Lancement de Produit",
                  description: "Offrez votre nouveau produit à un follower fidèle avant la sortie officielle.",
                  emoji: "🚀",
                },
                {
                  title: "Fin d'Année",
                  description: "Noël, Nouvel An... Remerciez ceux qui vous ont suivi toute l'année.",
                  emoji: "✨",
                },
                {
                  title: "Engagement Communauté",
                  description: "Créez de l'excitation régulière : « Chaque mois, un abonné gagne ! »",
                  emoji: "💫",
                },
              ].map((useCase, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <span className="text-3xl mb-4 block">{useCase.emoji}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm">{useCase.description}</p>
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
              title="Questions Fréquentes - Tirage Abonnés Instagram"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Types de Tirages Instagram</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires Instagram", url: "/tirage-commentaires-instagram/" },
                { title: "Tirage Likes Instagram", url: "/tirage-likes-instagram/" },
                { title: "Giveaway Instagram", url: "/giveaway-instagram/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-100 hover:border-pink-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-instagram/"
              className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort Instagram
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Récompenser vos Abonnés ?</h2>
              <p className="text-white/90 mb-6">
                Tirez au sort parmi vos followers Instagram et faites un heureux dans votre communauté. 
                Gratuit, transparent, avec preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-all"
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

export default TirageAbonnesInstagramPage;
