import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Heart, CheckCircle2, Play, Shield, Zap, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/tirage-likes-instagram/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Instagram', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { name: 'Tirage Likes', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment tirer au sort parmi les likes Instagram ?",
    answer: "Avec Cleack, copiez le lien de votre publication Instagram et collez-le dans notre outil. Sélectionnez « Likes » comme source de tirage et cliquez sur « Tirer au sort ». Un gagnant sera sélectionné aléatoirement parmi toutes les personnes qui ont aimé votre post."
  },
  {
    question: "Pourquoi faire un tirage parmi les likes plutôt que les commentaires ?",
    answer: "Le tirage parmi les likes génère plus de participation car liker est plus simple que commenter. C'est idéal pour les concours où vous voulez maximiser le nombre de participants avec un effort minimal de leur part."
  },
  {
    question: "Puis-je voir qui a liké ma publication avant le tirage ?",
    answer: "Cleack récupère la liste de tous les likes et vous montre le nombre total de participants. Pour des raisons de confidentialité, la liste complète n'est pas affichée, mais le tirage est effectué parmi tous les likes."
  },
  {
    question: "Les likes des comptes privés sont-ils inclus ?",
    answer: "Oui, tous les likes sont inclus, qu'ils proviennent de comptes publics ou privés. Instagram ne fait pas de distinction."
  },
];

const TirageLikesInstagramPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Likes Instagram Gratuit | Cleack"
        description="Faites un tirage au sort parmi les likes Instagram gratuit. Sélectionnez un gagnant aléatoire parmi toutes les personnes qui ont aimé votre publication."
        keywords="tirage au sort likes instagram, tirage likes instagram, giveaway likes instagram, tirage au sort like instagram"
        canonicalUrl={CANONICAL_URL}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={856}
      />

      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Heart className="w-4 h-4" />
                  Engagement Facile
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Tirage au Sort{' '}
                  <span className="text-red-500">Likes Instagram</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Sélectionnez un gagnant aléatoire parmi les personnes qui ont <strong>aimé</strong> votre 
                  publication Instagram. Format idéal pour maximiser la participation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-all"
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
                    <Shield className="w-5 h-5 text-blue-500" />
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
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Likes</h2>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    <Sparkles className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Avantages du Tirage Likes
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Participation Maximale",
                  description: "Liker est le geste le plus simple sur Instagram. Vous aurez plus de participants qu'avec les commentaires.",
                },
                {
                  title: "Engagement Rapide",
                  description: "Un like prend une seconde. Idéal pour les concours rapides ou en stories.",
                },
                {
                  title: "Tous les Comptes",
                  description: "Les likes des comptes privés sont inclus, contrairement aux commentaires qui peuvent être cachés.",
                },
              ].map((avantage, index) => (
                <div key={index} className="bg-red-50 rounded-xl p-6">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Types de Tirages Instagram</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires", url: "/tirage-commentaires-instagram/" },
                { title: "Tirage Stories", url: "/tirage-stories-instagram/" },
                { title: "Tirage Reels", url: "/tirage-reels-instagram/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-all"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to="/tirage-au-sort-instagram/" className="text-red-600 font-medium hover:text-red-700">
              ← Retour au guide complet Tirage au Sort Instagram
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default TirageLikesInstagramPage;
