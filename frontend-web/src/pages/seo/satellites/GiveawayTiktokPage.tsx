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
  TrendingUp,
  Users,
  Video,
  Clock,
  Award,
  Target,
  Heart,
  Share2,
  Star,
  Music,
  Eye,
  Calendar,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/giveaway-tiktok/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort TikTok', url: 'https://cleack.io/tirage-au-sort-tiktok/' },
  { name: 'Giveaway TikTok', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment organiser un giveaway TikTok qui fonctionne ?",
    answer: "Un giveaway TikTok réussi combine un lot attractif, des règles simples (commenter + follow + tag 2 amis), une vidéo engageante qui explique le concours, et un tirage au sort transparent avec Cleack. Annoncez clairement la date de fin et montrez le gagnant en vidéo."
  },
  {
    question: "Quelles sont les règles légales pour un giveaway TikTok en France ?",
    answer: "En France, un giveaway gratuit est légal s'il n'y a pas d'obligation d'achat. Vous devez rédiger un règlement clair, déposer ce règlement (chez un huissier pour les gros lots), et respecter le RGPD pour les données collectées. L'âge minimum est généralement 13 ans avec accord parental."
  },
  {
    question: "Quel est le meilleur moment pour lancer un giveaway TikTok ?",
    answer: "Les meilleurs moments sont : mardi, jeudi et vendredi entre 18h et 21h. Évitez le lundi matin et le dimanche soir. Durée idéale : 5-7 jours pour un maximum de participation sans lasser votre audience."
  },
  {
    question: "Comment augmenter la visibilité de mon giveaway TikTok ?",
    answer: "Utilisez des hashtags populaires (#giveaway #concours #gratuit), publiez aux heures de pointe, créez une vidéo accrocheuse dans les 3 premières secondes, répondez aux commentaires pour booster l'engagement, et faites des rappels stories avant la fin."
  },
  {
    question: "Comment choisir le gagnant d'un giveaway TikTok ?",
    answer: "Avec Cleack, collez le lien de votre vidéo TikTok, configurez vos filtres (mentions, doublons...), et lancez le tirage au sort. Cleack génère une vidéo preuve à partager pour montrer la transparence du tirage à votre communauté."
  },
  {
    question: "Combien de gagnants puis-je sélectionner ?",
    answer: "Avec Cleack, vous pouvez choisir autant de gagnants que vous le souhaitez. Sélectionnez 1, 3, 5 ou même 10 gagnants en un seul tirage. Des gagnants suppléants peuvent aussi être tirés au cas où les premiers ne répondraient pas."
  },
  {
    question: "Comment contacter le gagnant d'un giveaway TikTok ?",
    answer: "Vous pouvez : 1) Répondre à son commentaire gagnant, 2) Le mentionner dans une vidéo d'annonce, 3) Lui envoyer un message privé. Donnez-lui 48-72h pour répondre avant de passer au gagnant suppléant."
  },
];

const howToSteps = [
  { name: "Créez votre vidéo giveaway", text: "Filmez une vidéo engageante présentant le lot et les règles de participation." },
  { name: "Définissez les règles claires", text: "Follow + Like + Commentaire avec 2 tags. Gardez les règles simples." },
  { name: "Laissez les participations affluer", text: "Répondez aux commentaires et faites des rappels avant la fin." },
  { name: "Tirez au sort avec Cleack", text: "Utilisez notre outil gratuit et partagez la vidéo preuve du tirage." },
];

const GiveawayTiktokPage = () => {
  return (
    <>
      <SEOHead
        title="Giveaway TikTok : Guide Complet + Tirage au Sort Gratuit | Cleack"
        description="Organisez un giveaway TikTok réussi en 2024. Guide complet : règles, lots, timing + outil de tirage au sort gratuit. Vidéo preuve incluse pour vos concours."
        keywords="giveaway tiktok, concours tiktok, tirage au sort tiktok, organiser giveaway tiktok, giveaway tiktok gratuit, comment faire giveaway tiktok"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-giveaway-tiktok.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un giveaway TikTok réussi"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={756}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-pink-950">
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
                  <Gift className="w-4 h-4" />
                  Guide Giveaway TikTok
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Giveaway TikTok :{' '}
                  <span className="bg-gradient-to-r from-pink-500 via-red-500 to-cyan-400 bg-clip-text text-transparent">
                    Le Guide Ultime 2024
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-8">
                  Apprenez à organiser un <strong className="text-white">giveaway TikTok</strong> qui 
                  explose : choix du lot, règles optimales, timing parfait et tirage au sort transparent 
                  avec Cleack.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Tirer au sort maintenant
                  </Link>
                  <a
                    href="#guide"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Lire le guide
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Guide complet
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Légal en France
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Tirage gratuit
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Giveaway TikTok</h2>
                  <p className="text-gray-400 text-sm mt-2">Votre concours est terminé ? Tirez au sort !</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.tiktok.com/@user/video/..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Désigner le gagnant
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      12,000+ tirages
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

        {/* Guide Section */}
        <section id="guide" className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Comment Organiser un Giveaway TikTok en 2024
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Suivez ce guide étape par étape pour créer un giveaway TikTok qui génère un maximum d'engagement.
              </p>
            </div>

            {/* Étape 1: Choisir le lot */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white">Choisir le Lot Parfait</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Ce qui fonctionne
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      Produits tech populaires (AirPods, Ring Light, micro)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      Cartes cadeaux (Amazon, Sephora, Fnac)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      Produits de votre niche (cosmétiques, gaming, fitness)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      Expériences uniques (meet & greet, VIP)
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    À éviter
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Lots trop génériques (attire les chasseurs de concours)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Valeur trop faible (moins de 30€ = peu d'engagement)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Produits sans rapport avec votre audience
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Argent cash (interdit sur TikTok)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Étape 2: Définir les règles */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white">Définir des Règles Simples</h3>
              </div>

              <div className="ml-16 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Règles Recommandées (Engagement Optimal)</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Like la vidéo</p>
                    <p className="text-gray-400 text-sm">Booste l'algorithme</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Follow le compte</p>
                    <p className="text-gray-400 text-sm">Fidélise l'audience</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Share2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Tag 2 amis</p>
                    <p className="text-gray-400 text-sm">Viralité garantie</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-cyan-400 text-sm">
                    <strong>💡 Pro Tip :</strong> N'ajoutez pas trop de règles ! Plus c'est simple, plus les gens participent. 
                    3 actions maximum.
                  </p>
                </div>
              </div>
            </div>

            {/* Étape 3: Créer la vidéo */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white">Créer une Vidéo Engageante</h3>
              </div>

              <div className="ml-16 grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <Video className="w-8 h-8 text-pink-400 mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-3">Structure de Vidéo Idéale</h4>
                  <ol className="space-y-3 text-gray-300">
                    <li><span className="text-pink-400 font-bold">0-3s :</span> Hook accrocheur (« GIVEAWAY ÉNORME ! »)</li>
                    <li><span className="text-pink-400 font-bold">3-10s :</span> Montrez le lot de manière attractive</li>
                    <li><span className="text-pink-400 font-bold">10-20s :</span> Expliquez les règles clairement</li>
                    <li><span className="text-pink-400 font-bold">20-30s :</span> Date de fin + CTA (« Participe maintenant ! »)</li>
                  </ol>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <Music className="w-8 h-8 text-cyan-400 mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-3">Astuces TikTok</h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      Utilisez un son trending pour plus de visibilité
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      Ajoutez du texte à l'écran pour les règles
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      Format vertical 9:16 obligatoire
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      Épinglez la vidéo en haut de votre profil
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Étape 4: Timing */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-2xl font-bold text-white">Choisir le Bon Timing</h3>
              </div>

              <div className="ml-16 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Calendar className="w-8 h-8 text-pink-400 mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-3">Meilleurs Jours</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Mardi</span>
                        <span className="text-green-400">⭐⭐⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Jeudi</span>
                        <span className="text-green-400">⭐⭐⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Vendredi</span>
                        <span className="text-green-400">⭐⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Samedi</span>
                        <span className="text-yellow-400">⭐⭐⭐</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Clock className="w-8 h-8 text-cyan-400 mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-3">Meilleures Heures</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">18h - 21h</span>
                        <span className="text-green-400">Optimal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">12h - 14h</span>
                        <span className="text-yellow-400">Bon</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">21h - 23h</span>
                        <span className="text-yellow-400">Correct</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                      Durée recommandée : <strong className="text-white">5-7 jours</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 5: Tirage */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  5
                </div>
                <h3 className="text-2xl font-bold text-white">Tirer au Sort avec Cleack</h3>
              </div>

              <div className="ml-16 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 border border-pink-500/30 rounded-xl p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Link to="/draw/new" className="text-pink-400">🔗</Link>
                    </div>
                    <h4 className="text-white font-medium">Collez le lien</h4>
                    <p className="text-gray-400 text-sm">De votre vidéo giveaway</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <h4 className="text-white font-medium">Configurez</h4>
                    <p className="text-gray-400 text-sm">Filtres et nombre de gagnants</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <h4 className="text-white font-medium">Partagez</h4>
                    <p className="text-gray-400 text-sm">La vidéo preuve du tirage</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Trophy className="w-5 h-5" />
                    Lancer mon tirage maintenant
                  </Link>
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
              title="Questions Fréquentes - Giveaway TikTok"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Ressources TikTok</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires TikTok", url: "/tirage-commentaires-tiktok/" },
                { title: "Concours TikTok", url: "/concours-tiktok/" },
                { title: "Guide Complet TikTok", url: "/tirage-au-sort-tiktok/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-all group"
                >
                  <span className="font-medium text-white">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to pillar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              to="/tirage-au-sort-tiktok/"
              className="inline-flex items-center gap-2 text-pink-400 font-medium hover:text-pink-300 transition-colors"
            >
              ← Retour au guide complet Tirage au Sort TikTok
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl p-8 text-white">
              <Gift className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Votre Giveaway TikTok est Prêt ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour tirer au sort le gagnant de manière 100% transparente. 
                Gratuit, sans inscription, avec vidéo preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all"
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

export default GiveawayTiktokPage;
