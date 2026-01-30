import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Video, CheckCircle2, Play, Shield, Zap, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-reels-instagram/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Instagram', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { name: 'Tirage Reels', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment tirer au sort parmi les commentaires d'un Reel Instagram ?",
    answer: "Le processus est identique aux posts classiques : copiez le lien de votre Reel, collez-le dans Cleack, et lancez le tirage. Cleack récupère tous les commentaires du Reel et sélectionne un gagnant aléatoire."
  },
  {
    question: "Les Reels génèrent-ils plus de participation que les posts ?",
    answer: "Oui, généralement ! Les Reels bénéficient d'une portée organique plus importante grâce à l'algorithme Instagram. Un Reel peut toucher des utilisateurs qui ne vous suivent pas encore, augmentant ainsi la participation."
  },
  {
    question: "Puis-je filtrer les commentaires sur un Reel viral avec des milliers de commentaires ?",
    answer: "Absolument ! Cleack peut analyser des Reels avec des dizaines de milliers de commentaires. Utilisez les filtres (mentions, hashtags, mots-clés) pour cibler les participants éligibles."
  },
];

const TirageReelsInstagramPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Reels Instagram Gratuit | Cleack"
        description="Faites un tirage au sort parmi les commentaires de vos Reels Instagram. Format viral pour des concours à forte portée. Gratuit avec preuve vidéo."
        keywords="tirage au sort reels instagram, tirage reel instagram, concours reels instagram, giveaway reels instagram"
        canonicalUrl={CANONICAL_URL}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        includeSoftwareSchema
      />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <TrendingUp className="w-4 h-4" />
                  Format Viral
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Tirage au Sort{' '}
                  <span className="text-orange-500">Reels Instagram</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Les <strong>Reels</strong> sont le format le plus viral sur Instagram. 
                  Profitez de leur portée pour des concours à très forte participation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Gratuit
                  </span>
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Portée virale
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Reels</h2>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    <Sparkles className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Avantages Reels */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Pourquoi les Reels pour vos Concours ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Portée Organique",
                  description: "Les Reels sont poussés par l'algorithme. Touchez des utilisateurs qui ne vous suivent pas encore.",
                },
                {
                  title: "Engagement Élevé",
                  description: "Le format vidéo court génère plus d'interactions que les posts statiques.",
                },
                {
                  title: "Viralité",
                  description: "Un bon Reel peut devenir viral et générer des milliers de participations.",
                },
              ].map((avantage, index) => (
                <div key={index} className="bg-orange-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{avantage.title}</h3>
                  <p className="text-gray-600 text-sm">{avantage.description}</p>
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Types de Tirages</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires", url: "/tirage-commentaires-instagram/" },
                { title: "Tirage Likes", url: "/tirage-likes-instagram/" },
                { title: "Tirage Stories", url: "/tirage-stories-instagram/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-all"
                >
                  <span className="font-medium">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to="/tirage-au-sort-instagram/" className="text-orange-600 font-medium">
              ← Retour au guide complet
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default TirageReelsInstagramPage;
