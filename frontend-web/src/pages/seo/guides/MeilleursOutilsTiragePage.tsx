import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Sparkles,
  Star,
  X,
  Zap,
  Shield,
  Video,
  Globe,
  CreditCard,
  Users,
  Clock,
  Award,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/guide/meilleurs-outils-tirage/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: 'https://cleack.io/guide/' },
  { name: 'Meilleurs Outils Tirage', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Quel est le meilleur outil gratuit pour tirer au sort sur Instagram ?",
    answer: "Cleack est l'outil gratuit le plus complet : tirage commentaires, likes, stories, abonnés, avec filtres avancés et vidéo preuve. Pas d'inscription requise, 100% gratuit pour les fonctionnalités de base."
  },
  {
    question: "Les outils de tirage au sort sont-ils fiables ?",
    answer: "Les outils réputés comme Cleack utilisent des algorithmes cryptographiques pour garantir un tirage 100% aléatoire et équitable. La vidéo preuve permet de montrer la transparence à votre communauté."
  },
  {
    question: "Faut-il payer pour un outil de tirage au sort ?",
    answer: "Pas nécessairement. Cleack offre toutes les fonctionnalités essentielles gratuitement. Les versions payantes des autres outils ajoutent souvent des fonctionnalités avancées (analytics, multi-tirages, API) utiles pour les professionnels."
  },
  {
    question: "Peut-on faire un tirage au sort manuellement ?",
    answer: "Techniquement oui (noter tous les participants et utiliser random.org), mais c'est très fastidieux et peu crédible pour votre audience. Un outil automatisé est plus rapide, plus fiable et plus professionnel."
  },
  {
    question: "Comment prouver que le tirage est équitable ?",
    answer: "Utilisez un outil qui génère une preuve visuelle (vidéo ou certificat). Cleack crée automatiquement une vidéo du tirage que vous pouvez partager en Story pour montrer la transparence."
  },
];

const tools = [
  {
    name: "Cleack",
    logo: "🏆",
    description: "Outil français complet pour tirages au sort sur tous les réseaux sociaux.",
    platforms: ["Instagram", "TikTok", "Facebook", "YouTube", "Twitter"],
    pricing: "Gratuit (options premium)",
    pros: [
      "100% gratuit pour l'essentiel",
      "Vidéo preuve automatique",
      "Filtres avancés (mentions, doublons, bots)",
      "Multi-plateforme",
      "Sans inscription",
      "Interface en français",
    ],
    cons: [
      "Premium pour certaines fonctionnalités avancées",
    ],
    rating: 4.9,
    best: true,
  },
  {
    name: "Comment Picker",
    logo: "🎯",
    description: "Outil simple pour tirer au sort dans les commentaires Instagram/YouTube.",
    platforms: ["Instagram", "YouTube"],
    pricing: "Gratuit (pub) / 4.99$/mois",
    pros: [
      "Gratuit avec pubs",
      "Interface simple",
      "Filtre doublons",
    ],
    cons: [
      "Publicités intrusives",
      "Limité à 2 plateformes",
      "Pas de vidéo preuve",
      "En anglais uniquement",
    ],
    rating: 3.8,
    best: false,
  },
  {
    name: "Woobox",
    logo: "📦",
    description: "Plateforme marketing complète avec module concours.",
    platforms: ["Facebook", "Instagram", "Twitter", "Pinterest"],
    pricing: "Gratuit limité / 37$/mois",
    pros: [
      "Suite marketing complète",
      "Nombreux types de concours",
      "Analytics avancés",
    ],
    cons: [
      "Gratuit très limité (100 participants)",
      "Cher pour les petits comptes",
      "Interface complexe",
      "Pas de vidéo preuve",
    ],
    rating: 3.5,
    best: false,
  },
  {
    name: "Gleam",
    logo: "✨",
    description: "Plateforme de giveaway avec actions multiples.",
    platforms: ["Multi-plateforme"],
    pricing: "Gratuit limité / 10$/mois",
    pros: [
      "Actions bonus (email, partage...)",
      "Widgets intégrables",
      "Viral loop intégré",
    ],
    cons: [
      "Gratuit limité (branding Gleam)",
      "Courbe d'apprentissage",
      "Peut sembler spam",
      "En anglais",
    ],
    rating: 3.7,
    best: false,
  },
  {
    name: "Easypromos",
    logo: "🎪",
    description: "Plateforme espagnole de promotions et concours.",
    platforms: ["Instagram", "Facebook", "Twitter", "TikTok"],
    pricing: "29€/mois minimum",
    pros: [
      "Nombreux templates",
      "Support en français",
      "Modération commentaires",
    ],
    cons: [
      "Pas de version gratuite",
      "Relativement cher",
      "Interface datée",
    ],
    rating: 3.6,
    best: false,
  },
];

const MeilleursOutilsTiragePage = () => {
  return (
    <>
      <SEOHead
        title="Meilleurs Outils de Tirage au Sort 2024 : Comparatif Complet | Cleack"
        description="Comparatif des meilleurs outils de tirage au sort pour Instagram, TikTok, Facebook. Gratuit ou payant, découvrez le meilleur pour vos concours."
        keywords="meilleur outil tirage au sort, comment picker, outil giveaway, comparatif tirage au sort, outil concours instagram, random comment picker"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-guide-outils.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Wrench className="w-4 h-4" />
                Comparatif 2024
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Les{' '}
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Meilleurs Outils
                </span>{' '}
                de Tirage au Sort
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comparatif complet des outils pour tirer au sort sur Instagram, TikTok, Facebook et plus. 
                Trouvez l'outil parfait pour vos concours.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  5 outils testés
                </span>
                <span className="flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  Mis à jour Juin 2024
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Critères */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nos Critères de Sélection
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: <CreditCard className="w-6 h-6" />, title: "Prix", desc: "Gratuit ou rapport qualité/prix" },
                { icon: <Globe className="w-6 h-6" />, title: "Plateformes", desc: "Nombre de réseaux supportés" },
                { icon: <Zap className="w-6 h-6" />, title: "Facilité", desc: "Simplicité d'utilisation" },
                { icon: <Video className="w-6 h-6" />, title: "Preuve", desc: "Vidéo ou certificat de tirage" },
              ].map((criterion, index) => (
                <div key={index} className="bg-violet-50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-white text-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {criterion.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{criterion.title}</h3>
                  <p className="text-gray-600 text-sm">{criterion.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparatif */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comparatif Détaillé
              </h2>
            </div>

            <div className="space-y-8">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-6 border-2 ${tool.best ? 'border-violet-400 shadow-lg shadow-violet-100' : 'border-gray-100'}`}
                >
                  {tool.best && (
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        <Trophy className="w-4 h-4" />
                        Notre Recommandation
                      </span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Info */}
                    <div className="md:col-span-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{tool.logo}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{tool.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.platforms.map((platform, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {platform}
                          </span>
                        ))}
                      </div>
                      <div className="text-violet-600 font-semibold">{tool.pricing}</div>
                    </div>

                    {/* Pros */}
                    <div className="md:col-span-1">
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Points Forts
                      </h4>
                      <ul className="space-y-2">
                        {tool.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="md:col-span-1">
                      <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        Points Faibles
                      </h4>
                      <ul className="space-y-2">
                        {tool.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      {tool.best ? (
                        <Link
                          to="/draw/new"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          <Sparkles className="w-5 h-5" />
                          Essayer Cleack
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">Voir le site</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tableau comparatif rapide */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tableau Comparatif Rapide
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 font-semibold text-gray-900">Outil</th>
                    <th className="text-center py-4 font-semibold text-gray-900">Gratuit</th>
                    <th className="text-center py-4 font-semibold text-gray-900">Vidéo Preuve</th>
                    <th className="text-center py-4 font-semibold text-gray-900">Multi-Plateforme</th>
                    <th className="text-center py-4 font-semibold text-gray-900">Français</th>
                    <th className="text-center py-4 font-semibold text-gray-900">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Cleack", free: true, video: true, multi: true, french: true, rating: "4.9/5" },
                    { name: "Comment Picker", free: true, video: false, multi: false, french: false, rating: "3.8/5" },
                    { name: "Woobox", free: false, video: false, multi: true, french: false, rating: "3.5/5" },
                    { name: "Gleam", free: false, video: false, multi: true, french: false, rating: "3.7/5" },
                    { name: "Easypromos", free: false, video: false, multi: true, french: true, rating: "3.6/5" },
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 font-medium text-gray-900">{row.name}</td>
                      <td className="py-4 text-center">
                        {row.free ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-4 text-center">
                        {row.video ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-4 text-center">
                        {row.multi ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-4 text-center">
                        {row.french ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-4 text-center font-medium text-gray-900">{row.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pourquoi Cleack */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Pourquoi Cleack est Notre #1</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: <CreditCard className="w-6 h-6" />, title: "100% Gratuit", desc: "Toutes les fonctionnalités essentielles sans payer un centime" },
                  { icon: <Video className="w-6 h-6" />, title: "Vidéo Preuve", desc: "Seul outil à générer automatiquement une vidéo du tirage" },
                  { icon: <Shield className="w-6 h-6" />, title: "Anti-Bot", desc: "Filtres avancés pour éliminer les faux comptes" },
                  { icon: <Globe className="w-6 h-6" />, title: "Multi-Plateforme", desc: "Instagram, TikTok, Facebook, YouTube, Twitter" },
                  { icon: <Zap className="w-6 h-6" />, title: "Sans Inscription", desc: "Lancez un tirage en 30 secondes, pas de compte requis" },
                  { icon: <Users className="w-6 h-6" />, title: "Fait en France", desc: "Support en français, conforme RGPD" },
                ].map((feature, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {feature.icon}
                      <h3 className="font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-violet-100 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/draw/new"
                  className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-xl font-semibold hover:bg-violet-50 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Essayer Cleack gratuitement
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection items={faqItems} title="Questions Fréquentes" />
          </div>
        </section>

        {/* Related Guides */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides Connexes</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Organiser un Jeu Concours", url: "/guide/organiser-jeu-concours/" },
                { title: "Augmenter l'Engagement", url: "/guide/augmenter-engagement/" },
                { title: "Rédiger le Règlement", url: "/guide/reglement-jeu-concours/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-violet-50 rounded-lg border border-violet-100 hover:border-violet-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MeilleursOutilsTiragePage;
