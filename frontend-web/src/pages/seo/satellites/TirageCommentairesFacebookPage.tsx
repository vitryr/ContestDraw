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
  Users,
  Award,
  ThumbsUp,
  Share,
  Image,
  Clock,
  TrendingUp,
  Facebook,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-commentaires-facebook/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Facebook', url: 'https://cleack.io/tirage-au-sort-facebook/' },
  { name: 'Tirage Commentaires', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment tirer au sort parmi les commentaires Facebook ?",
    answer: "Avec Cleack, copiez le lien de votre publication Facebook, collez-le dans notre outil et lancez le tirage. Cleack récupère automatiquement tous les commentaires et sélectionne un gagnant de manière aléatoire et transparente en quelques secondes."
  },
  {
    question: "Peut-on filtrer les commentaires Facebook qui taguent des amis ?",
    answer: "Oui ! Activez le filtre « Mentions obligatoires » pour ne garder que les commentaires où les participants ont mentionné des amis. Vous pouvez définir le nombre minimum de tags requis."
  },
  {
    question: "Comment gérer les personnes qui commentent plusieurs fois ?",
    answer: "Cleack propose l'option « Exclure les doublons » qui ne compte qu'une seule participation par profil Facebook, même si la personne a commenté 20 fois sur votre publication."
  },
  {
    question: "Le tirage fonctionne-t-il avec les commentaires sur une Page Facebook ?",
    answer: "Oui, Cleack fonctionne avec les publications de Pages Facebook, les profils personnels et les groupes publics. Il suffit que la publication soit publique ou que vous en soyez l'administrateur."
  },
  {
    question: "Comment prouver que le tirage Facebook est équitable ?",
    answer: "Cleack génère automatiquement une vidéo preuve du tirage avec un certificat d'authenticité. Vous pouvez la partager directement sur Facebook pour montrer la transparence à vos participants."
  },
  {
    question: "Combien de commentaires Facebook peut-on analyser ?",
    answer: "Il n'y a pas de limite. Cleack peut analyser des publications avec des milliers de commentaires. Les très gros volumes prennent simplement quelques secondes de plus."
  },
  {
    question: "Peut-on tirer au sort parmi les réponses aux commentaires ?",
    answer: "Oui, vous pouvez choisir d'inclure ou d'exclure les réponses (sous-commentaires) selon vos règles. Par défaut, elles sont incluses dans le tirage."
  },
];

const howToSteps = [
  { name: "Copiez le lien Facebook", text: "Sur votre publication, cliquez sur les 3 points puis « Copier le lien »." },
  { name: "Collez dans Cleack", text: "Rendez-vous sur Cleack et collez l'URL pour récupérer les commentaires." },
  { name: "Appliquez vos filtres", text: "Activez les filtres : tags obligatoires, hashtags, exclusion doublons." },
  { name: "Tirez au sort", text: "Cliquez sur Tirer au sort et partagez la vidéo preuve sur Facebook." },
];

const TirageCommentairesFacebookPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Commentaires Facebook Gratuit | Cleack"
        description="Faites un tirage au sort parmi les commentaires Facebook gratuit en 30 secondes. Filtrez par mentions, excluez les doublons. Vidéo preuve incluse pour vos concours Facebook."
        keywords="tirage au sort commentaire facebook, tirage commentaires facebook, comment picker facebook, tirage au sort facebook commentaire, concours facebook commentaire"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-commentaires-facebook.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment tirer au sort parmi les commentaires Facebook"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={1567}
      />

      <div className="min-h-screen bg-bg-primary">
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
                <div className="inline-flex items-center gap-2 bg-accent-secondary/20 text-accent-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <MessageCircle className="w-4 h-4" />
                  Tirage Commentaires Facebook
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Commentaires Facebook
                  </span>
                </h1>

                <p className="text-xl text-ink-secondary mb-8">
                  Sélectionnez un gagnant aléatoire parmi les <strong>commentaires</strong> de vos 
                  publications Facebook. Idéal pour vos concours sur Page, profil ou groupe.
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
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated border-2 border-white/10 text-ink-secondary px-8 py-4 rounded-xl font-semibold hover:border-accent-secondary/50 transition-all"
                  >
                    Guide complet Facebook
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    100% Gratuit
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-secondary" />
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
                className="bg-bg-elevated rounded-2xl shadow-xl p-8 border border-white/10"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-bg-primary0 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Commentaires Facebook</h2>
                  <p className="text-ink-tertiary text-sm mt-2">Collez votre lien de publication</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.facebook.com/photo.php?..."
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-4 text-sm text-ink-tertiary">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      1,567+ utilisateurs
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      4.8/5
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pourquoi les commentaires Facebook */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pourquoi Organiser un Tirage sur les Commentaires Facebook ?
              </h2>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                Les commentaires restent le format le plus populaire et efficace pour les concours Facebook.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Boost Algorithme",
                  description: "Les commentaires signalent à Facebook que votre contenu est engageant = plus de portée.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Viralité Naturelle",
                  description: "Chaque tag d'ami notifie de nouvelles personnes et élargit votre audience.",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Facile à Participer",
                  description: "Un simple commentaire - pas besoin de quitter Facebook ou remplir un formulaire.",
                },
                {
                  icon: <Image className="w-6 h-6" />,
                  title: "Format Universel",
                  description: "Fonctionne sur photos, vidéos, statuts, et même les publications de groupe.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-elevated rounded-xl p-6 hover:bg-accent-secondary/20 transition-all"
                >
                  <div className="w-12 h-12 bg-bg-elevated text-accent-secondary rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-ink-secondary text-sm">{benefit.description}</p>
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
                Filtres Avancés pour vos Tirages Facebook
              </h2>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                Personnalisez votre tirage pour ne garder que les participants qui respectent vos règles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <AtSign className="w-6 h-6" />,
                  title: "Tags Obligatoires",
                  description: "Exigez que les participants mentionnent 1, 2 ou 3 amis pour être éligibles au tirage.",
                  color: "blue",
                },
                {
                  icon: <Filter className="w-6 h-6" />,
                  title: "Exclusion Doublons",
                  description: "Une seule participation par personne, même si elle a commenté plusieurs fois.",
                  color: "indigo",
                },
                {
                  icon: <Hash className="w-6 h-6" />,
                  title: "Mots-clés Requis",
                  description: "Filtrez les commentaires contenant un mot ou hashtag spécifique.",
                  color: "purple",
                },
              ].map((filter, index) => (
                <div key={index} className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-12 h-12 bg-${filter.color}-100 text-${filter.color}-600 rounded-xl flex items-center justify-center mb-4`}>
                    {filter.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{filter.title}</h3>
                  <p className="text-ink-secondary text-sm">{filter.description}</p>
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
                Comment Faire un Tirage au Sort Facebook en 4 Étapes
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl p-6 border border-blue-100 h-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.name}</h3>
                    <p className="text-ink-secondary text-sm">{step.text}</p>
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-blue-300" />
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
                Types de Concours Commentaires Facebook
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: "Concours « Commente pour participer »",
                  description: "Le format classique Facebook : chaque commentaire = une participation. Maximisez l'engagement rapidement.",
                  example: "Exemple : « Commente avec ton emoji préféré pour tenter de gagner ! 🎁 »",
                },
                {
                  icon: <AtSign className="w-6 h-6" />,
                  title: "Concours « Tag un ami »",
                  description: "Demandez de taguer des amis. Chaque tag notifie de nouvelles personnes de votre concours.",
                  example: "Exemple : « Tag 2 amis qui aimeraient ce cadeau pour participer ! »",
                },
                {
                  icon: <ThumbsUp className="w-6 h-6" />,
                  title: "Concours « Like + Commentaire »",
                  description: "Double action pour plus d'engagement. Les participants doivent liker ET commenter.",
                  example: "Exemple : « Like cette publication ET commente ta couleur préférée ! »",
                },
                {
                  icon: <Share className="w-6 h-6" />,
                  title: "Concours « Réponse à une question »",
                  description: "Posez une question et tirez au sort parmi ceux qui ont bien répondu.",
                  example: "Exemple : « Devinez le prix de ce produit ! Tirage parmi les bonnes réponses. »",
                },
              ].map((useCase, index) => (
                <div key={index} className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-secondary/20 text-accent-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                      <p className="text-ink-secondary text-sm mb-3">{useCase.description}</p>
                      <p className="text-accent-secondary text-sm italic">{useCase.example}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistiques Facebook */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <Facebook className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl font-bold mb-2">
                  Facebook en France (2024)
                </h2>
                <p className="text-blue-100">Pourquoi Facebook reste incontournable pour vos concours</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                {[
                  { value: "33M+", label: "Utilisateurs actifs mensuels en France" },
                  { value: "35-54 ans", label: "Tranche d'âge la plus active" },
                  { value: "58 min", label: "Temps moyen passé par jour" },
                  { value: "92%", label: "Des entreprises FR présentes" },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-blue-100 text-sm">{stat.label}</div>
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
              title="Questions Fréquentes - Tirage Commentaires Facebook"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Types de Tirages Facebook</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Concours Page Facebook", url: "/concours-page-facebook/" },
                { title: "Tirage Groupe Facebook", url: "/tirage-groupe-facebook/" },
                { title: "Guide Complet Facebook", url: "/tirage-au-sort-facebook/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-blue-100 hover:border-accent-secondary/50 transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-accent-secondary" />
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 mt-12">Tirages sur Autres Plateformes</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Tirage Instagram", url: "/tirage-au-sort-instagram/" },
                { title: "Tirage TikTok", url: "/tirage-au-sort-tiktok/" },
                { title: "Tirage YouTube", url: "/tirage-au-sort-youtube/" },
                { title: "Tirage Twitter/X", url: "/tirage-au-sort-twitter/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-white/10 hover:border-white/20 transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-ink-secondary" />
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
              className="inline-flex items-center gap-2 text-accent-secondary font-medium hover:text-blue-700 transition-colors"
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
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Tirage Facebook ?</h2>
              <p className="text-white/90 mb-6">
                Sélectionnez un gagnant parmi les commentaires de votre publication Facebook en 30 secondes. 
                Gratuit, sans inscription, avec vidéo preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-elevated text-accent-secondary px-8 py-4 rounded-xl font-semibold hover:bg-bg-elevated transition-all"
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

export default TirageCommentairesFacebookPage;
