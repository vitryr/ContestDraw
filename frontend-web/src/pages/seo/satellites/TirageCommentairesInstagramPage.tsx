import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
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
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-commentaires-instagram/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Instagram', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { name: 'Tirage Commentaires', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment tirer au sort parmi les commentaires Instagram ?",
    answer: "Avec Cleack, copiez le lien de votre publication Instagram, collez-le dans notre outil, et cliquez sur « Tirer au sort ». Cleack récupère tous les commentaires et en sélectionne un de manière 100% aléatoire en moins de 30 secondes."
  },
  {
    question: "Puis-je filtrer les commentaires par mention (@ami) ?",
    answer: "Oui ! Activez le filtre « Mentions obligatoires » et définissez le nombre minimum de tags requis. Seuls les commentaires avec le bon nombre de mentions seront inclus dans le tirage."
  },
  {
    question: "Comment exclure les doublons (même personne qui commente plusieurs fois) ?",
    answer: "Cleack inclut une option « Exclure les doublons » qui ne compte qu'une seule participation par compte, même si la personne a commenté plusieurs fois."
  },
  {
    question: "Les réponses aux commentaires sont-elles incluses ?",
    answer: "Par défaut, oui. Vous pouvez choisir d'inclure ou exclure les réponses (threads) dans le tirage selon vos préférences."
  },
  {
    question: "Combien de commentaires Cleack peut-il analyser ?",
    answer: "Il n'y a pas de limite. Cleack peut analyser des publications avec des dizaines de milliers de commentaires. Les publications très populaires prennent simplement un peu plus de temps."
  },
];

const howToSteps = [
  { name: "Copiez le lien du post", text: "Ouvrez votre post Instagram et copiez le lien de partage." },
  { name: "Collez dans Cleack", text: "Rendez-vous sur Cleack et collez l'URL pour récupérer les commentaires." },
  { name: "Configurez les filtres", text: "Activez les filtres : mentions, hashtags, doublons, bots." },
  { name: "Tirez au sort", text: "Cliquez sur Tirer au sort et téléchargez la vidéo preuve." },
];

const TirageCommentairesInstagramPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Commentaires Instagram Gratuit | Cleack"
        description="Faites un tirage au sort parmi les commentaires Instagram gratuit en 30 secondes. Filtrez par mentions, hashtags et excluez les doublons. Preuve vidéo incluse."
        keywords="tirage au sort commentaire instagram, tirage commentaires instagram, comment picker instagram, tirage au sort instagram commentaire"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-commentaires-instagram.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment tirer au sort parmi les commentaires Instagram"
        includeSoftwareSchema
        softwareRating={4.9}
        softwareRatingCount={1245}
      />

      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="inline-flex items-center gap-2 bg-accent-primary/20 text-accent-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <MessageCircle className="w-4 h-4" />
                  Page Satellite
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 bg-clip-text text-transparent">
                    Commentaires Instagram
                  </span>
                </h1>

                <p className="text-xl text-ink-secondary mb-8">
                  Sélectionnez un gagnant aléatoire parmi les <strong>commentaires</strong> de vos 
                  publications Instagram. Filtres avancés et preuve vidéo incluse.
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
                    to="/tirage-au-sort-instagram/"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated border-2 border-white/10 text-ink-secondary px-8 py-4 rounded-xl font-semibold hover:border-accent-primary/50 transition-all"
                  >
                    Voir tous les types
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Gratuit
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
                  <div className="w-16 h-16 bg-gradient-to-br from-bg-primary0 to-bg-primary0 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Commentaires</h2>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full px-4 py-3 border border-white/10 rounded-xl"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-bg-primary0 to-bg-primary0 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    <Sparkles className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filtres */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Filtres Disponibles pour les Commentaires
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <AtSign className="w-6 h-6" />,
                  title: "Mentions Obligatoires",
                  description: "Exigez que les participants taguent un ou plusieurs amis (@ami) pour être éligibles.",
                },
                {
                  icon: <Hash className="w-6 h-6" />,
                  title: "Hashtags Requis",
                  description: "Filtrez les commentaires contenant un hashtag spécifique (#concours).",
                },
                {
                  icon: <Filter className="w-6 h-6" />,
                  title: "Exclusion Doublons",
                  description: "Une seule participation par personne, même si elle a commenté plusieurs fois.",
                },
              ].map((filter, index) => (
                <div key={index} className="bg-bg-elevated rounded-xl p-6">
                  <div className="w-12 h-12 bg-bg-elevated text-accent-primary rounded-xl flex items-center justify-center mb-4">
                    {filter.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{filter.title}</h3>
                  <p className="text-ink-secondary text-sm">{filter.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cas d'usage */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Cas d'Usage Courants
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Concours « Commente pour participer »",
                  description: "Le format classique : chaque commentaire = une participation. Idéal pour maximiser l'engagement.",
                },
                {
                  title: "Concours « Tag un ami »",
                  description: "Demandez de taguer 1, 2 ou 3 amis. Effet viral garanti, chaque tag ramène de nouveaux participants.",
                },
                {
                  title: "Concours « Réponds à la question »",
                  description: "Posez une question et tirez au sort parmi les bonnes réponses ou les réponses créatives.",
                },
                {
                  title: "Concours « Hashtag spécifique »",
                  description: "Demandez d'inclure un hashtag (#MonConcours) pour filtrer les participants sérieux.",
                },
              ].map((useCase, index) => (
                <div key={index} className="bg-bg-elevated rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                  <p className="text-ink-secondary">{useCase.description}</p>
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
              title="Questions Fréquentes"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Types de Tirages Instagram</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Likes Instagram", url: "/tirage-likes-instagram/" },
                { title: "Tirage Stories Instagram", url: "/tirage-stories-instagram/" },
                { title: "Tirage Reels Instagram", url: "/tirage-reels-instagram/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-white/10 hover:border-accent-primary/50 hover:shadow-md transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-accent-primary" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-instagram/"
              className="inline-flex items-center gap-2 text-accent-primary font-medium hover:text-pink-700"
            >
              ← Retour au guide complet Tirage au Sort Instagram
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Tirer au Sort ?</h2>
              <p className="text-white/90 mb-6">
                Sélectionnez un gagnant parmi les commentaires de votre post Instagram en 30 secondes.
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

export default TirageCommentairesInstagramPage;
