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
  TrendingUp,
  Users,
  Video,
  Clock,
  Target,
  Heart,
  Share2,
  Star,
  Music,
  Eye,
  Lightbulb,
  AlertCircle,
  Scale,
  FileText,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/concours-tiktok/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort TikTok', url: 'https://cleack.io/tirage-au-sort-tiktok/' },
  { name: 'Concours TikTok', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Quelle est la différence entre un concours TikTok et un giveaway ?",
    answer: "Un giveaway est un tirage au sort 100% aléatoire parmi les participants. Un concours TikTok implique généralement un élément de compétition : meilleure vidéo, commentaire le plus créatif, défi le plus réussi. Vous pouvez combiner les deux : présélectionner les meilleures participations puis tirer au sort parmi elles."
  },
  {
    question: "Comment organiser un concours TikTok légal en France ?",
    answer: "Pour être légal, votre concours doit : 1) Être gratuit (pas d'obligation d'achat), 2) Avoir un règlement clair déposé, 3) Respecter les CGU de TikTok, 4) Ne pas impliquer de jeu de hasard pur avec mise. Si c'est un tirage au sort, c'est considéré comme une loterie gratuite et c'est autorisé."
  },
  {
    question: "Quels types de concours TikTok fonctionnent le mieux ?",
    answer: "Les formats les plus efficaces sont : les défis créatifs (#Challenge), les concours de duet/stitch, les concours UGC (User Generated Content) avec un hashtag dédié, et les classiques commentaires + tags. Choisissez selon votre objectif : engagement, viralité, ou contenu créé."
  },
  {
    question: "Comment annoncer le gagnant d'un concours TikTok ?",
    answer: "La meilleure pratique est de créer une vidéo d'annonce montrant le tirage au sort en direct (avec Cleack) ou révélant le gagnant. Mentionnez le @gagnant, répondez à son commentaire, et envoyez un message privé. Gardez une preuve du tirage pour la transparence."
  },
  {
    question: "Combien de temps doit durer un concours TikTok ?",
    answer: "Durée optimale : 7 jours pour un concours standard, 14 jours pour un défi créatif qui demande plus d'effort. Évitez les durées trop courtes (moins de 3 jours) ou trop longues (plus de 3 semaines) qui font perdre l'urgence."
  },
  {
    question: "Peut-on utiliser Cleack pour un concours créatif (pas un tirage) ?",
    answer: "Oui ! Cleack est parfait pour la phase finale. Par exemple : présélectionnez vos 10 meilleures participations manuellement, puis utilisez Cleack pour tirer au sort le grand gagnant parmi ces finalistes. C'est équitable et transparent."
  },
  {
    question: "Comment éviter les faux comptes et bots dans mon concours ?",
    answer: "Cleack détecte automatiquement les comptes suspects (créés récemment, sans photo, sans activité). Vous pouvez aussi exiger des commentaires substantiels (pas juste des emojis) et vérifier manuellement les gagnants avant annonce."
  },
];

const howToSteps = [
  { name: "Définissez le concept", text: "Choisissez le type de concours : défi créatif, meilleur commentaire, UGC, ou tirage simple." },
  { name: "Créez le règlement", text: "Rédigez les conditions de participation, critères de sélection, et modalités de gain." },
  { name: "Lancez et animez", text: "Publiez votre vidéo concours, interagissez avec les participants, faites des rappels." },
  { name: "Désignez le gagnant", text: "Utilisez Cleack pour un tirage transparent et partagez la vidéo preuve." },
];

const ConcoursTiktokPage = () => {
  return (
    <>
      <SEOHead
        title="Concours TikTok : Guide Complet + Tirage au Sort Gratuit | Cleack"
        description="Organisez un concours TikTok réussi en 2024. Guide complet : types de concours, règles légales, idées créatives + outil de tirage au sort gratuit avec preuve vidéo."
        keywords="concours tiktok, organiser concours tiktok, concours tiktok france, challenge tiktok concours, tirage au sort concours tiktok, règles concours tiktok"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-concours-tiktok.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un concours TikTok réussi"
        includeSoftwareSchema
        softwareRating={4.9}
        softwareRatingCount={634}
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
                  <Award className="w-4 h-4" />
                  Guide Concours TikTok
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Concours TikTok :{' '}
                  <span className="bg-gradient-to-r from-pink-500 via-red-500 to-cyan-400 bg-clip-text text-transparent">
                    Guide Complet 2024
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-8">
                  Tout ce que vous devez savoir pour organiser un <strong className="text-white">concours TikTok</strong> réussi : 
                  types de concours, aspects légaux, idées créatives et tirage au sort transparent.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Tirer au sort le gagnant
                  </Link>
                  <a
                    href="#types"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Types de concours
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Légal en France
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Tirage transparent
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    100% gratuit
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
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Concours TikTok</h2>
                  <p className="text-gray-400 text-sm mt-2">Désignez votre gagnant en toute transparence</p>
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
                    Lancer le tirage
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      8,500+ concours
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

        {/* Types de Concours */}
        <section id="types" className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                5 Types de Concours TikTok qui Fonctionnent
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Choisissez le format adapté à vos objectifs : engagement, viralité, ou création de contenu.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Concours Commentaires",
                  difficulty: "Facile",
                  engagement: "Élevé",
                  description: "Le classique : les participants commentent pour participer. Idéal pour maximiser rapidement l'engagement.",
                  example: "« Commente avec ton emoji préféré pour participer ! 🎁 »",
                  pros: ["Facile à participer", "Beaucoup de participations", "Booste l'algorithme"],
                },
                {
                  icon: <Video className="w-8 h-8" />,
                  title: "Défi Créatif (#Challenge)",
                  difficulty: "Moyen",
                  engagement: "Viral",
                  description: "Créez un défi avec hashtag dédié. Les participants créent leur propre vidéo.",
                  example: "« Montre ta transformation avec #MonChallenge pour gagner ! »",
                  pros: ["Contenu UGC gratuit", "Effet viral", "Brand awareness"],
                },
                {
                  icon: <Share2 className="w-8 h-8" />,
                  title: "Concours Duet/Stitch",
                  difficulty: "Moyen",
                  engagement: "Très élevé",
                  description: "Les participants font un duet ou stitch de votre vidéo pour participer.",
                  example: "« Fais un duet avec ta réaction pour tenter de gagner ! »",
                  pros: ["Interactivité maximale", "Créativité", "Exposition accrue"],
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Concours Tag & Follow",
                  difficulty: "Facile",
                  engagement: "Croissance",
                  description: "Follow + tag des amis dans les commentaires. Parfait pour la croissance.",
                  example: "« Follow + tag 2 amis qui adoreraient ce cadeau ! »",
                  pros: ["Gain d'abonnés", "Viralité naturelle", "Simple à gérer"],
                },
                {
                  icon: <Lightbulb className="w-8 h-8" />,
                  title: "Concours Créativité",
                  difficulty: "Avancé",
                  engagement: "Qualitatif",
                  description: "Le meilleur commentaire, la réponse la plus drôle, la vidéo la plus créative gagne.",
                  example: "« La meilleure légende pour cette photo remporte le lot ! »",
                  pros: ["Engagement qualitatif", "Contenu amusant", "Interaction forte"],
                },
                {
                  icon: <Eye className="w-8 h-8" />,
                  title: "Concours Quiz/Devinette",
                  difficulty: "Facile",
                  engagement: "Éducatif",
                  description: "Posez une question, tirez au sort parmi les bonnes réponses.",
                  example: "« Devinez le prix de ce produit ! Tirage parmi les bonnes réponses. »",
                  pros: ["Éducatif", "Engagement réfléchi", "Facile à filtrer"],
                },
              ].map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-pink-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 text-pink-400 rounded-xl flex items-center justify-center">
                      {type.icon}
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                        {type.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{type.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                  
                  <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                    <p className="text-cyan-400 text-sm italic">{type.example}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {type.pros.map((pro, i) => (
                      <span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                        ✓ {pro}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Aspects Légaux */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Concours TikTok : Les Règles Légales en France
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Assurez-vous que votre concours respecte la législation française.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-6">
                <Scale className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Ce qui est Autorisé ✅</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Loteries gratuites</strong> : Tirage au sort sans obligation d'achat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Concours de compétences</strong> : Meilleure photo, vidéo créative</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Réseaux sociaux</strong> : Actions de follow/like/commentaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Lots en nature</strong> : Produits, cartes cadeaux, expériences</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl p-6">
                <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Ce qui est Interdit ❌</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span><strong>Obligation d'achat</strong> : Acheter pour participer = loterie illégale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span><strong>Argent cash</strong> : Interdit par les CGU TikTok</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span><strong>Fausses promesses</strong> : Lot qui n'existe pas = fraude</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span><strong>Données personnelles</strong> : Collecte abusive sans consentement</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Règlement */}
            <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <FileText className="w-10 h-10 text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Rédiger un Règlement Valide</h3>
                  <p className="text-gray-400 mb-4">
                    Tout concours doit avoir un règlement accessible aux participants. Voici les mentions obligatoires :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Identité de l'organisateur</li>
                      <li>• Dates de début et fin</li>
                      <li>• Conditions de participation</li>
                      <li>• Description du/des lot(s)</li>
                    </ul>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Modalités de désignation des gagnants</li>
                      <li>• Modalités de remise du lot</li>
                      <li>• Droit applicable (droit français)</li>
                      <li>• Clause RGPD pour les données</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <Link
                      to="/outils/generateur-reglement/"
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Utiliser notre générateur de règlement gratuit →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Organiser Votre Concours TikTok en 4 Étapes
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.name}</h3>
                    <p className="text-gray-400 text-sm">{step.text}</p>
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Idées de Concours */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                10 Idées de Concours TikTok pour 2024
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Inspirez-vous de ces formats qui ont prouvé leur efficacité.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Concours d'anniversaire", desc: "Célébrez un cap (10K, 100K abonnés) avec un giveaway spécial." },
                { title: "Avant/Après Challenge", desc: "Transformation maquillage, déco, fitness avec votre produit." },
                { title: "Caption Contest", desc: "Meilleure légende pour une photo/vidéo drôle." },
                { title: "Concours Duo Parent-Enfant", desc: "Vidéos adorables avec engagement émotionnel fort." },
                { title: "Défi 24h", desc: "Challenge limité dans le temps pour créer l'urgence." },
                { title: "Concours de talents", desc: "Chant, danse, art... Laissez votre audience briller." },
                { title: "Unboxing Reaction", desc: "Envoyez des produits et faites gagner la meilleure réaction." },
                { title: "Concours Seasonal", desc: "Halloween, Noël, rentrée... Surfez sur les tendances." },
                { title: "Fan Art Contest", desc: "Dessins, édits, créations autour de votre marque." },
                { title: "Collab Contest", desc: "Gagnez une collaboration/apparition avec vous." },
              ].map((idea, index) => (
                <div key={index} className="flex items-start gap-4 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{idea.title}</h4>
                    <p className="text-gray-400 text-sm">{idea.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Concours TikTok"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Ressources TikTok</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires TikTok", url: "/tirage-commentaires-tiktok/" },
                { title: "Giveaway TikTok", url: "/giveaway-tiktok/" },
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
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Concours TikTok ?</h2>
              <p className="text-white/90 mb-6">
                Organisez votre concours et utilisez Cleack pour désigner le gagnant de manière 
                100% transparente. Gratuit, sans inscription.
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

export default ConcoursTiktokPage;
