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
  Instagram,
  Star,
  Heart,
  MessageCircle,
  AtSign,
  Image,
  Calendar,
  Target,
  AlertCircle,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/giveaway-instagram/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Instagram', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { name: 'Giveaway Instagram', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment organiser un giveaway Instagram réussi ?",
    answer: "Un giveaway Instagram réussi combine : un lot attractif lié à votre niche, des règles simples (follow + like + tag 2 amis), un visuel accrocheur, une durée optimale (5-10 jours), et un tirage transparent avec Cleack. Annoncez clairement les règles et la date de fin."
  },
  {
    question: "Quelles sont les règles Instagram pour les giveaways ?",
    answer: "Instagram autorise les giveaways mais exige : 1) Mentionner qu'Instagram n'est pas sponsor, 2) Ne pas demander de taguer des contenus non appropriés, 3) Respecter les CGU (pas de faux comptes, pas de manipulation). Publiez un règlement accessible."
  },
  {
    question: "Quel format de giveaway fonctionne le mieux sur Instagram ?",
    answer: "Le format classique « Follow + Like + Tag 2 amis » reste le plus efficace. Pour les Reels, ajoutez « Sauvegarder ». Pour les Stories, utilisez les stickers de question/sondage. Adaptez les règles au format du post."
  },
  {
    question: "Combien de temps doit durer un giveaway Instagram ?",
    answer: "Durée idéale : 7-10 jours pour un giveaway classique, 3-5 jours pour un giveaway flash. Pour un très gros lot, vous pouvez aller jusqu'à 2 semaines. Faites des rappels en Stories avant la fin."
  },
  {
    question: "Comment choisir le gagnant d'un giveaway Instagram ?",
    answer: "Avec Cleack : copiez le lien du post, choisissez de tirer au sort parmi les commentaires ou les likes, appliquez vos filtres (tags, doublons...), et lancez le tirage. Cleack génère une vidéo preuve à partager en Story."
  },
  {
    question: "Faut-il un règlement pour un giveaway Instagram ?",
    answer: "Oui, c'est obligatoire légalement en France. Publiez le règlement : dans la description du post, dans un commentaire épinglé, ou via un lien dans votre bio. Incluez toutes les mentions légales requises."
  },
  {
    question: "Comment maximiser les participations à un giveaway Instagram ?",
    answer: "Astuces : publiez aux heures de pointe (12h-14h, 18h-21h), utilisez un visuel avec le lot bien visible, simplifiez les règles, faites des rappels en Stories, partagez en Reels pour plus de portée, collaborez avec d'autres comptes."
  },
];

const howToSteps = [
  { name: "Choisissez le lot parfait", text: "En lien avec votre niche, valeur perçue élevée, exclusif si possible." },
  { name: "Créez le post giveaway", text: "Visuel attractif, règles claires, date de fin précise, hashtags stratégiques." },
  { name: "Animez pendant la durée", text: "Stories de rappel, réponses aux questions, partage en Reels." },
  { name: "Tirez au sort avec Cleack", text: "Collez le lien, filtrez, tirez au sort et annoncez avec la vidéo preuve." },
];

const GiveawayInstagramPage = () => {
  return (
    <>
      <SEOHead
        title="Giveaway Instagram : Guide Complet + Tirage Gratuit | Cleack"
        description="Organisez un giveaway Instagram réussi en 2024. Guide complet : formats, règles légales, timing + outil de tirage au sort gratuit avec preuve vidéo."
        keywords="giveaway instagram, concours instagram, tirage au sort instagram, organiser giveaway instagram, giveaway instagram france, jeu concours instagram"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-giveaway-instagram.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un giveaway Instagram réussi"
        includeSoftwareSchema
        softwareRating={4.9}
        softwareRatingCount={2345}
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Gift className="w-4 h-4" />
                  Guide Giveaway Instagram
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Giveaway Instagram :{' '}
                  <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                    Le Guide Ultime 2024
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Tout ce que vous devez savoir pour organiser un <strong>giveaway Instagram</strong> qui 
                  explose : formats, règles légales, timing et tirage au sort transparent.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                  <a
                    href="#guide"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-pink-300 transition-all"
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
                    Conforme Instagram
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
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Giveaway Instagram</h2>
                  <p className="text-gray-500 text-sm mt-2">Votre giveaway est terminé ?</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Désigner le gagnant
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      2,345+ giveaways
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      4.9/5
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
                5 Formats de Giveaway Instagram qui Cartonnent
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choisissez le format adapté à vos objectifs : viralité, engagement, ou croissance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Image className="w-6 h-6" />,
                  title: "Post Photo Classique",
                  format: "Feed",
                  description: "Le format le plus populaire. Photo du lot avec règles en légende.",
                  rules: "Follow + Like + Tag 2 amis",
                  pros: ["Visible longtemps", "Facile à comprendre", "Très engageant"],
                },
                {
                  icon: <Play className="w-6 h-6" />,
                  title: "Giveaway en Reels",
                  format: "Reels",
                  description: "Format vidéo court qui explose grâce à l'algorithme des Reels.",
                  rules: "Follow + Like + Sauvegarder + Commentaire",
                  pros: ["Portée massive", "Très engageant", "Tendance 2024"],
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Giveaway Stories",
                  format: "Stories",
                  description: "Format éphémère qui crée l'urgence. Utilisez stickers et sondages.",
                  rules: "Répondre au sondage + Partager en Story",
                  pros: ["Urgence naturelle", "Interactif", "DMs facilités"],
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Collab Giveaway",
                  format: "Collab",
                  description: "Partenariat avec d'autres comptes pour un mega giveaway.",
                  rules: "Follow tous les comptes + Like + Tag",
                  pros: ["Audience croisée", "Gros lots possibles", "Crédibilité"],
                },
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: "Giveaway UGC",
                  format: "User Content",
                  description: "Les participants créent du contenu pour participer.",
                  rules: "Créer un post/Story avec #VotreHashtag",
                  pros: ["Contenu gratuit", "Engagement fort", "Brand awareness"],
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Giveaway Quiz",
                  format: "Interactif",
                  description: "Posez des questions, tirez au sort parmi les bonnes réponses.",
                  rules: "Répondre correctement en commentaire",
                  pros: ["Éducatif", "Filtrage naturel", "Engagement qualitatif"],
                },
              ].map((format, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-white text-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                      {format.icon}
                    </div>
                    <span className="px-2 py-1 bg-white text-pink-600 text-xs font-medium rounded-full">
                      {format.format}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{format.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{format.description}</p>
                  
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-pink-600 text-sm font-medium">{format.rules}</p>
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

        {/* Template de Post */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Template de Description Giveaway
              </h2>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-gray-700">
{`🎁 GIVEAWAY 🎁

À GAGNER : [Description du lot] 🎉

Pour participer :
1️⃣ Follow @votre_compte
2️⃣ Like ❤️ ce post
3️⃣ Tag 2 amis en commentaire (qui pourraient aimer !)

⏰ Fin du concours : [DATE]
📍 Tirage au sort le [DATE] en Story

Bonus : +1 chance si tu partages en Story !

Bonne chance à tous ! 🍀

⚠️ Ce jeu concours n'est pas sponsorisé, administré ou associé à Instagram.
Règlement complet dans notre Story à la une "Règlement".

#Giveaway #Concours #AGagner #JeuConcours #[VotreNiche]`}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>💡 Tips :</strong> Personnalisez avec vos emojis préférés, adaptez le nombre de tags 
                  selon votre audience, et ajoutez des hashtags de votre niche !
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timing */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Timing Optimal pour vos Giveaways Instagram
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
                <Calendar className="w-8 h-8 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Meilleurs Moments</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Mardi - Mercredi</span>
                    <span className="text-green-600 font-medium">⭐ Optimal</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">12h - 14h</span>
                    <span className="text-green-600 font-medium">Pause déj</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">18h - 21h</span>
                    <span className="text-green-600 font-medium">Après travail</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <Clock className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Durée Recommandée</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Giveaway Flash</span>
                      <span className="text-purple-600">3-5 jours</span>
                    </div>
                    <p className="text-gray-600 text-sm">Crée l'urgence</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Standard ⭐</span>
                      <span className="text-purple-600">7-10 jours</span>
                    </div>
                    <p className="text-gray-600 text-sm">Équilibre parfait</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Long (gros lot)</span>
                      <span className="text-purple-600">2-3 semaines</span>
                    </div>
                    <p className="text-gray-600 text-sm">Max de participants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Règles Instagram */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Règles Officielles d'Instagram pour les Giveaways
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Obligatoire ✅</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Mentionner que Instagram n'est pas associé au concours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Publier un règlement accessible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Définir clairement les conditions d'éligibilité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Indiquer les dates de début et de fin</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interdit ❌</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Demander de taguer des contenus non appropriés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Encourager les faux comptes ou le spam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Demander des informations personnelles excessives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Faire de fausses promesses sur les lots</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Giveaway Instagram"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Ressources Instagram</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Tirage Commentaires", url: "/tirage-commentaires-instagram/" },
                { title: "Tirage Likes", url: "/tirage-likes-instagram/" },
                { title: "Tirage Stories", url: "/tirage-stories-instagram/" },
                { title: "Tirage Reels", url: "/tirage-reels-instagram/" },
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
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl p-8 text-white">
              <Gift className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Votre Giveaway Instagram est Prêt ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour tirer au sort le gagnant de manière 100% transparente. 
                Gratuit, sans inscription, avec vidéo preuve à partager en Story.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-all"
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

export default GiveawayInstagramPage;
