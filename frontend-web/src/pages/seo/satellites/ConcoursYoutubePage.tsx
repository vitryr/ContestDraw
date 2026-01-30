import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  ArrowRight,
  Trophy,
  Sparkles,
  Users,
  Clock,
  TrendingUp,
  Youtube,
  Star,
  Video,
  MessageSquare,
  Bell,
  Scale,
  FileText,
  AlertCircle,
  Gift,
  Target,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/concours-youtube/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort YouTube', url: 'https://cleack.io/tirage-au-sort-youtube/' },
  { name: 'Concours YouTube', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment organiser un concours YouTube conforme aux règles ?",
    answer: "Pour être conforme : 1) Rédigez un règlement clair (organisateur, dates, conditions, lot, modalités), 2) Respectez les CGU de YouTube (pas de fausse urgence, pas de spam), 3) Ne demandez pas d'achat pour participer, 4) Tirez au sort de manière équitable et transparente."
  },
  {
    question: "Quels sont les meilleurs formats de concours YouTube ?",
    answer: "Les formats populaires : concours en commentaires (le plus simple), concours avec création vidéo (challenge), concours quiz dans une vidéo dédiée, concours Cross-platform (YT + autres réseaux), et les concours pendant un live stream."
  },
  {
    question: "Combien de temps doit durer un concours YouTube ?",
    answer: "Durée recommandée : 7-14 jours pour un concours classique, 24-48h pour un concours flash (urgence), jusqu'à 30 jours pour un concours avec création de contenu. Annoncez toujours une date et heure de fin précises."
  },
  {
    question: "Comment annoncer le gagnant d'un concours YouTube ?",
    answer: "Meilleures pratiques : 1) Créez une vidéo d'annonce montrant le tirage (avec Cleack), 2) Mentionnez le gagnant en répondant à son commentaire, 3) Ajoutez le résultat en Community Post, 4) Épinglez un commentaire avec le nom du gagnant."
  },
  {
    question: "Faut-il un règlement pour un concours YouTube ?",
    answer: "Oui, c'est obligatoire légalement en France pour les loteries publicitaires. Publiez le règlement en description de vidéo, dans un commentaire épinglé, ou sur une page dédiée de votre site. Incluez les mentions légales requises."
  },
  {
    question: "Peut-on demander de s'abonner pour participer ?",
    answer: "Oui, c'est autorisé tant que c'est gratuit. Vous pouvez demander : s'abonner, activer la cloche, liker, commenter, partager la vidéo. Ce qui est interdit : demander un achat ou une contrepartie financière."
  },
  {
    question: "Comment éviter les faux comptes dans un concours YouTube ?",
    answer: "Cleack détecte automatiquement les comptes suspects. Vous pouvez aussi : exiger des commentaires substantiels (pas juste un emoji), vérifier l'ancienneté des comptes gagnants, demander une interaction supplémentaire (question à répondre)."
  },
];

const howToSteps = [
  { name: "Planifiez votre concours", text: "Définissez le lot, les règles, la durée et rédigez le règlement officiel." },
  { name: "Créez votre vidéo", text: "Annoncez le concours avec énergie, présentez le lot et expliquez les règles." },
  { name: "Animez pendant la durée", text: "Répondez aux commentaires, faites des rappels en Community Post." },
  { name: "Tirez au sort avec Cleack", text: "Sélectionnez le gagnant de manière transparente et publiez la preuve." },
];

const ConcoursYoutubePage = () => {
  return (
    <>
      <SEOHead
        title="Concours YouTube : Guide Complet + Tirage au Sort Gratuit | Cleack"
        description="Organisez un concours YouTube réussi en 2024. Guide complet : formats, règles légales, bonnes pratiques + outil de tirage au sort gratuit avec preuve vidéo."
        keywords="concours youtube, organiser concours youtube, tirage au sort concours youtube, règles concours youtube, jeu concours youtube france"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-concours-youtube.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un concours YouTube réussi"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={789}
      />

      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
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
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Award className="w-4 h-4" />
                  Guide Concours YouTube
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Concours YouTube :{' '}
                  <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    Le Guide Complet 2024
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Tout ce que vous devez savoir pour organiser un <strong>concours YouTube</strong> réussi : 
                  formats, règles légales, bonnes pratiques et tirage au sort transparent.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Tirer au sort le gagnant
                  </Link>
                  <a
                    href="#formats"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-red-300 transition-all"
                  >
                    Voir les formats
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Conforme YouTube
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Légal en France
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
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Concours YouTube</h2>
                  <p className="text-gray-500 text-sm mt-2">Votre concours est terminé ? Tirez au sort !</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Désigner le gagnant
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      789+ concours
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

        {/* Formats de Concours */}
        <section id="formats" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                5 Formats de Concours YouTube qui Fonctionnent
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choisissez le format adapté à vos objectifs et votre audience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <MessageSquare className="w-8 h-8" />,
                  title: "Concours Commentaires",
                  difficulty: "Facile",
                  description: "Le format classique : les viewers commentent pour participer au tirage au sort.",
                  pros: ["Facile à organiser", "Beaucoup de participations", "Boost l'engagement"],
                  example: "« Commente ta console préférée pour participer ! »",
                },
                {
                  icon: <Video className="w-8 h-8" />,
                  title: "Concours Création Vidéo",
                  difficulty: "Avancé",
                  description: "Les participants créent et postent leur propre vidéo avec un hashtag dédié.",
                  pros: ["Contenu UGC", "Engagement fort", "Communauté active"],
                  example: "« Fais ta vidéo reaction avec #MonConcours ! »",
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Concours Quiz",
                  difficulty: "Moyen",
                  description: "Posez des questions dans la vidéo, tirez au sort parmi les bonnes réponses.",
                  pros: ["Éducatif", "Encourage le visionnage", "Engagement qualitatif"],
                  example: "« Réponds aux 5 questions dans les commentaires ! »",
                },
                {
                  icon: <Bell className="w-8 h-8" />,
                  title: "Concours Abonnement",
                  difficulty: "Facile",
                  description: "S'abonner + activer la cloche + commenter pour participer.",
                  pros: ["Croissance chaîne", "Fidélisation", "Simple"],
                  example: "« Abonne-toi et commente pour gagner ! »",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Concours Live",
                  difficulty: "Moyen",
                  description: "Tirage au sort en direct pendant un live stream YouTube.",
                  pros: ["Interactif", "Excitant", "Engagement live"],
                  example: "« Tirage à 1000 spectateurs en live ! »",
                },
                {
                  icon: <Gift className="w-8 h-8" />,
                  title: "Concours Multi-Créateurs",
                  difficulty: "Avancé",
                  description: "Collaboration avec d'autres YouTubers pour un mega giveaway.",
                  pros: ["Audience croisée", "Buzz", "Gros lots possibles"],
                  example: "« Collab giveaway avec @Autre ! »",
                },
              ].map((format, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center shadow-sm">
                      {format.icon}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      format.difficulty === 'Facile' ? 'bg-green-100 text-green-700' :
                      format.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {format.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{format.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{format.description}</p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {format.pros.map((pro, i) => (
                        <span key={i} className="px-2 py-1 bg-white text-gray-600 text-xs rounded-full">
                          ✓ {pro}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-red-600 text-sm italic">{format.example}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Règles Légales */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Règles Légales pour un Concours YouTube en France
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ce qui est Autorisé ✅</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Tirage au sort gratuit parmi les participants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de s'abonner, liker, commenter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de partager la vidéo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Lots en nature (produits, cartes cadeaux)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Concours avec sélection sur critères (meilleur commentaire)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ce qui est Interdit ❌</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Obligation d'achat pour participer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Fausses promesses ou lots inexistants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Collecter des données sans consentement RGPD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Impliquer que YouTube sponsorise le concours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Cibler les mineurs sans précautions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Règlement */}
            <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <FileText className="w-10 h-10 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Rédiger un Règlement Conforme</h3>
                  <p className="text-gray-600 mb-4">
                    Un règlement est obligatoire pour tout concours avec tirage au sort. Voici les éléments à inclure :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Identité de l'organisateur (nom, adresse)</li>
                      <li>• Dates de début et de fin précises</li>
                      <li>• Conditions de participation</li>
                      <li>• Description exacte du lot</li>
                    </ul>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Modalités du tirage au sort</li>
                      <li>• Comment le gagnant sera contacté</li>
                      <li>• Délai de réponse exigé</li>
                      <li>• Clause « YouTube n'est pas associé »</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <Link
                      to="/outils/generateur-reglement/"
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      <Scale className="w-4 h-4" />
                      Utiliser notre générateur de règlement gratuit →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guide étape par étape */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Organiser Votre Concours YouTube en 4 Étapes
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100 h-full">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.name}</h3>
                    <p className="text-gray-600 text-sm">{step.text}</p>
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-red-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Concours YouTube"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Ressources YouTube</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires YouTube", url: "/tirage-commentaires-youtube/" },
                { title: "Giveaway YouTube Shorts", url: "/giveaway-youtube-shorts/" },
                { title: "Guide Complet YouTube", url: "/tirage-au-sort-youtube/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100 hover:border-red-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-youtube/"
              className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort YouTube
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-red-600 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Concours YouTube ?</h2>
              <p className="text-white/90 mb-6">
                Organisez votre concours et utilisez Cleack pour désigner le gagnant de manière 
                100% transparente. Gratuit, sans inscription.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-all"
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

export default ConcoursYoutubePage;
