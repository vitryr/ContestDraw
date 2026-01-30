import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users2,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  ArrowRight,
  Trophy,
  Sparkles,
  Users,
  Award,
  Lock,
  Globe,
  Clock,
  TrendingUp,
  MessageSquare,
  Star,
  AlertCircle,
  Heart,
  Eye,
  UserPlus,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-groupe-facebook/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Facebook', url: 'https://cleack.io/tirage-au-sort-facebook/' },
  { name: 'Tirage Groupe Facebook', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort dans un Groupe Facebook ?",
    answer: "Publiez votre concours dans le groupe, récupérez le lien de la publication, et collez-le dans Cleack. Notre outil analysera les commentaires et tirera au sort un gagnant. Fonctionne pour les groupes publics et les groupes privés dont vous êtes membre/admin."
  },
  {
    question: "Le tirage fonctionne-t-il avec les groupes privés ?",
    answer: "Oui, si vous êtes membre du groupe et avez accès à la publication. Pour les groupes privés, vous devrez vous connecter à Facebook via Cleack pour autoriser l'accès aux commentaires."
  },
  {
    question: "Puis-je organiser un concours dans un groupe dont je ne suis pas admin ?",
    answer: "Cela dépend des règles du groupe. Certains groupes autorisent les concours de membres, d'autres les réservent aux admins. Vérifiez toujours les règles du groupe et demandez l'autorisation aux admins si nécessaire."
  },
  {
    question: "Comment limiter le tirage aux membres du groupe ?",
    answer: "Comme seuls les membres du groupe peuvent commenter, le tirage est automatiquement limité aux membres. Vous pouvez ajouter des filtres supplémentaires (ancienneté du compte, nombre de tags, etc.)."
  },
  {
    question: "Faut-il un règlement pour un concours de groupe Facebook ?",
    answer: "Oui, c'est obligatoire légalement en France. Publiez le règlement dans un commentaire épinglé ou dans une publication séparée. Incluez : organisateur, dates, conditions, lot, modalités de tirage."
  },
  {
    question: "Comment booster la participation dans un groupe Facebook ?",
    answer: "Épinglez la publication du concours, faites des rappels avant la fin, encouragez les membres à taguer leurs amis (qui devront rejoindre le groupe), et choisissez un lot en rapport avec la thématique du groupe."
  },
  {
    question: "Les groupes Facebook sont-ils adaptés aux concours ?",
    answer: "Excellents ! Les groupes ont généralement un engagement supérieur aux Pages car les membres sont vraiment intéressés par la thématique. Les notifications sont aussi plus visibles pour les membres."
  },
];

const howToSteps = [
  { name: "Publiez dans le groupe", text: "Créez une publication concours avec les règles claires et le lot présenté." },
  { name: "Épinglez si vous êtes admin", text: "Épinglez la publication en haut du groupe pour maximiser la visibilité." },
  { name: "Copiez le lien", text: "Cliquez sur les 3 points de la publication > Copier le lien." },
  { name: "Tirez au sort avec Cleack", text: "Collez le lien, appliquez vos filtres et lancez le tirage transparent." },
];

const TirageGroupeFacebookPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Groupe Facebook Gratuit | Cleack"
        description="Faites un tirage au sort parmi les commentaires d'un Groupe Facebook en 30 secondes. Fonctionne avec groupes publics et privés. Vidéo preuve incluse."
        keywords="tirage au sort groupe facebook, concours groupe facebook, tirage groupe fb, tirage au sort facebook groupe privé, giveaway groupe facebook"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-groupe-facebook.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment faire un tirage au sort dans un Groupe Facebook"
        includeSoftwareSchema
        softwareRating={4.7}
        softwareRatingCount={687}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
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
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Users2 className="w-4 h-4" />
                  Tirage Groupe Facebook
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Groupe Facebook
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Organisez des concours engageants dans vos <strong>Groupes Facebook</strong>. 
                  Tirez au sort parmi les commentaires des membres - groupes publics ou privés.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                  <Link
                    to="/tirage-au-sort-facebook/"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-300 transition-all"
                  >
                    Guide complet Facebook
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Groupes publics
                  </span>
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-500" />
                    Groupes privés
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    100% gratuit
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Groupe Facebook</h2>
                  <p className="text-gray-500 text-sm mt-2">Collez le lien de la publication du groupe</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.facebook.com/groups/.../posts/..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      687+ tirages
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

        {/* Avantages Groupes */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi les Groupes Facebook sont Parfaits pour les Concours
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Les Groupes Facebook offrent des avantages uniques pour vos jeux concours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Engagement Supérieur",
                  description: "Les membres de groupes sont plus engagés car ils ont choisi de rejoindre la communauté.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Audience Ciblée",
                  description: "Les membres partagent un intérêt commun - vos concours sont plus pertinents.",
                },
                {
                  icon: <Eye className="w-6 h-6" />,
                  title: "Meilleure Visibilité",
                  description: "Les notifications de groupe sont prioritaires dans le fil d'actualité Facebook.",
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Communauté Active",
                  description: "Les groupes créent un sentiment d'appartenance qui booste la participation.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                >
                  <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Types de Groupes */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cleack Fonctionne avec Tous les Types de Groupes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Groupes Publics</h3>
                    <span className="text-sm text-green-600">Accès direct</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Tout le monde peut voir les publications. Cleack peut analyser les commentaires 
                  directement sans authentification.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Pas de connexion requise
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Analyse instantanée
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Idéal pour l'acquisition
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Groupes Privés</h3>
                    <span className="text-sm text-blue-600">Connexion requise</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Seuls les membres peuvent voir le contenu. Connectez votre compte Facebook 
                  pour que Cleack accède aux commentaires.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    Connexion Facebook sécurisée
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    Vous devez être membre
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    Parfait pour les communautés VIP
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Guide étape par étape */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment Organiser un Concours dans un Groupe Facebook
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {howToSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.name}</h3>
                      <p className="text-gray-600">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Bonnes Pratiques pour les Groupes</h3>
                <ul className="space-y-4">
                  {[
                    { icon: <MessageSquare className="w-5 h-5" />, text: "Prévenez les admins avant de lancer un concours" },
                    { icon: <Clock className="w-5 h-5" />, text: "Publiez aux heures de forte activité du groupe" },
                    { icon: <Award className="w-5 h-5" />, text: "Choisissez un lot en lien avec la thématique" },
                    { icon: <UserPlus className="w-5 h-5" />, text: "Encouragez les tags pour faire grandir le groupe" },
                    { icon: <Shield className="w-5 h-5" />, text: "Respectez les règles du groupe" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Types de concours pour groupes */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Idées de Concours pour Groupes Facebook
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Concours de Bienvenue",
                  description: "Réservé aux nouveaux membres du mois. Encourage les inscriptions au groupe.",
                  ideal: "Groupes en croissance",
                },
                {
                  title: "Concours Thématique",
                  description: "En lien avec la thématique du groupe. Génère du contenu pertinent.",
                  ideal: "Groupes de niche",
                },
                {
                  title: "Concours Photo/Création",
                  description: "Les membres partagent leurs créations. Crée de l'UGC pour le groupe.",
                  ideal: "Groupes créatifs",
                },
                {
                  title: "Concours Quiz",
                  description: "Questions sur la thématique. Éducatif et engageant pour la communauté.",
                  ideal: "Groupes d'apprentissage",
                },
                {
                  title: "Concours Anniversaire",
                  description: "Célébrez les 1 an, 10K membres, etc. Renforce le sentiment de communauté.",
                  ideal: "Tous les groupes",
                },
                {
                  title: "Concours Parrainage",
                  description: "Invitez des amis à rejoindre le groupe. Accélère la croissance.",
                  ideal: "Groupes publics",
                },
              ].map((idea, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    Idéal pour : {idea.ideal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Attention / Règles */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Points d'Attention pour les Groupes</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• <strong>Demandez toujours l'accord des admins</strong> avant de lancer un concours si vous n'êtes pas admin</li>
                    <li>• <strong>Respectez les règles du groupe</strong> - certains interdisent les concours</li>
                    <li>• <strong>Ne spammez pas</strong> - un concours de temps en temps, pas toutes les semaines</li>
                    <li>• <strong>Restez dans la thématique</strong> - un lot hors sujet attire les mauvais participants</li>
                    <li>• <strong>Soyez transparent</strong> - publiez le règlement et montrez le tirage au sort</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Tirage Groupe Facebook"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Ressources Facebook</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires Facebook", url: "/tirage-commentaires-facebook/" },
                { title: "Concours Page Facebook", url: "/concours-page-facebook/" },
                { title: "Guide Complet Facebook", url: "/tirage-au-sort-facebook/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-facebook/"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort Facebook
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Tirage de Groupe ?</h2>
              <p className="text-white/90 mb-6">
                Sélectionnez un gagnant parmi les commentaires de votre groupe Facebook en 30 secondes. 
                Groupes publics ou privés, gratuit et transparent.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all"
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

export default TirageGroupeFacebookPage;
