import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Play, CheckCircle2, Shield, Zap, ArrowRight, Sparkles, Eye, Clock } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-stories-instagram/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Instagram', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { name: 'Tirage Stories', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment tirer au sort parmi les réponses aux stories Instagram ?",
    answer: "Avec Cleack, vous pouvez analyser les réponses (messages directs) à vos stories si vous avez accès à l'API Instagram Business. Pour les utilisateurs standard, vous pouvez exporter manuellement les réponses et les importer dans Cleack."
  },
  {
    question: "Puis-je tirer au sort parmi les mentions en stories ?",
    answer: "Oui ! Si votre concours demande de vous mentionner en story, vous pouvez collecter ces mentions via Instagram et les importer dans Cleack pour le tirage au sort."
  },
  {
    question: "Les stories disparaissent après 24h, comment faire ?",
    answer: "Organisez votre tirage pendant que les stories sont encore actives, ou demandez aux participants de vous mentionner/répondre avec un hashtag spécifique que vous pourrez tracker même après l'expiration."
  },
];

const TirageStoriesInstagramPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Stories Instagram Gratuit | Cleack"
        description="Faites un tirage au sort parmi les réponses et mentions en stories Instagram. Format interactif pour des concours engageants."
        keywords="tirage au sort stories instagram, tirage story instagram, concours stories instagram, giveaway story instagram"
        canonicalUrl={CANONICAL_URL}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        includeSoftwareSchema
      />

      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center gap-2 bg-accent-secondary/20 text-accent-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Eye className="w-4 h-4" />
                  Format Interactif
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Tirage au Sort{' '}
                  <span className="text-accent-secondary">Stories Instagram</span>
                </h1>

                <p className="text-xl text-ink-secondary mb-8">
                  Sélectionnez un gagnant parmi les <strong>réponses et mentions</strong> de vos stories Instagram. 
                  Format éphémère et engageant pour des concours interactifs.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Gratuit
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    24h de visibilité
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
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Stories</h2>
                </div>
                <Link
                  to="/draw/new"
                  className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  <Sparkles className="w-5 h-5" />
                  Commencer
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Types de concours Stories */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Types de Concours en Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Quiz en Story",
                  description: "Posez une question avec le sticker Quiz ou Poll. Tirez au sort parmi les bonnes réponses.",
                },
                {
                  title: "Mention pour participer",
                  description: "Demandez de vous mentionner en story. Collectez les mentions et tirez au sort.",
                },
                {
                  title: "Répondre à la story",
                  description: "Les participants répondent directement à votre story. Analysez les DM pour le tirage.",
                },
                {
                  title: "Partage de story",
                  description: "Demandez de partager votre story. Trackez les partages pour sélectionner un gagnant.",
                },
              ].map((type, index) => (
                <div key={index} className="bg-bg-elevated rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{type.title}</h3>
                  <p className="text-ink-secondary">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection items={faqItems} title="Questions Fréquentes" />
          </div>
        </section>

        {/* Related */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Types de Tirages</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires", url: "/tirage-commentaires-instagram/" },
                { title: "Tirage Likes", url: "/tirage-likes-instagram/" },
                { title: "Tirage Reels", url: "/tirage-reels-instagram/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg hover:bg-bg-elevated transition-all"
                >
                  <span className="font-medium">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-ink-tertiary" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to="/tirage-au-sort-instagram/" className="text-accent-secondary font-medium">
              ← Retour au guide complet
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default TirageStoriesInstagramPage;
