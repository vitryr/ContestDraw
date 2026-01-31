import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  ArrowRight,
  Trophy,
  Sparkles,
  Users,
  Award,
  ThumbsUp,
  Share,
  Image,
  Clock,
  TrendingUp,
  BarChart3,
  Target,
  MessageSquare,
  Star,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/concours-page-facebook/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Facebook', url: 'https://cleack.io/tirage-au-sort-facebook/' },
  { name: 'Concours Page Facebook', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment organiser un concours sur ma Page Facebook ?",
    answer: "Créez une publication engageante présentant le lot et les règles (commenter, liker, taguer). Utilisez une image attractive. Une fois le concours terminé, utilisez Cleack pour tirer au sort le gagnant de manière transparente parmi les commentaires."
  },
  {
    question: "Un concours Facebook sur une Page est-il légal ?",
    answer: "Oui, tant qu'il respecte les règles de Facebook et la loi française : pas d'obligation d'achat, règlement accessible, pas de demande de partage sur le profil personnel (interdit par Facebook), et respect du RGPD pour les données."
  },
  {
    question: "Puis-je demander aux participants de partager ma publication ?",
    answer: "Attention : Facebook interdit officiellement d'exiger un partage sur le profil personnel comme condition de participation. Vous pouvez demander de commenter, liker, et taguer des amis, mais pas de partager. Les comptes contrevenants risquent des restrictions."
  },
  {
    question: "Comment booster la visibilité de mon concours sur ma Page ?",
    answer: "Épinglez la publication en haut de votre Page, utilisez les Stories Facebook, envisagez un petit budget publicitaire (boost), partagez dans les groupes liés à votre thématique, et faites des rappels avant la fin du concours."
  },
  {
    question: "Combien de temps doit durer un concours sur une Page Facebook ?",
    answer: "Durée recommandée : 7 à 14 jours. Assez long pour accumuler des participations, assez court pour maintenir l'urgence. Pour un gros lot, vous pouvez aller jusqu'à 3 semaines."
  },
  {
    question: "Faut-il un règlement pour un concours Page Facebook ?",
    answer: "Oui, c'est obligatoire légalement en France. Publiez le règlement dans un commentaire épinglé ou créez une note Facebook dédiée. Incluez : organisateur, dates, conditions, lot, modalités de tirage, clause RGPD."
  },
  {
    question: "Comment mesurer le succès de mon concours Facebook ?",
    answer: "Suivez ces KPIs : nombre de participations, nouveaux fans de la Page, portée de la publication, taux d'engagement, et croissance globale. Facebook Insights vous donne toutes ces données."
  },
];

const howToSteps = [
  { name: "Préparez votre concours", text: "Choisissez le lot, rédigez le règlement, créez le visuel de publication." },
  { name: "Publiez sur votre Page", text: "Postez avec des règles claires, épinglez la publication et ajoutez le règlement." },
  { name: "Animez et promouvez", text: "Répondez aux commentaires, faites des rappels, boostez si nécessaire." },
  { name: "Tirez au sort avec Cleack", text: "Utilisez notre outil gratuit et annoncez le gagnant avec la vidéo preuve." },
];

const ConcoursPageFacebookPage = () => {
  return (
    <>
      <SEOHead
        title="Concours Page Facebook : Guide Complet + Tirage Gratuit | Cleack"
        description="Organisez un concours réussi sur votre Page Facebook en 2024. Guide complet : règles, bonnes pratiques, promotion + outil de tirage au sort gratuit avec preuve."
        keywords="concours page facebook, organiser concours facebook page, tirage au sort page facebook, jeu concours facebook entreprise, concours facebook professionnel"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-concours-page-facebook.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un concours sur une Page Facebook"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={923}
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
                  <Building2 className="w-4 h-4" />
                  Guide Concours Page Facebook
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Concours{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Page Facebook
                  </span>{' '}
                  : Le Guide 2024
                </h1>

                <p className="text-xl text-ink-secondary mb-8">
                  Tout ce que vous devez savoir pour organiser un <strong>concours sur votre Page Facebook</strong> : 
                  règles, bonnes pratiques, promotion et tirage au sort transparent.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Tirer au sort le gagnant
                  </Link>
                  <a
                    href="#guide"
                    className="inline-flex items-center justify-center gap-2 bg-bg-elevated border-2 border-white/10 text-ink-secondary px-8 py-4 rounded-xl font-semibold hover:border-accent-secondary/50 transition-all"
                  >
                    Voir le guide
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-tertiary">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Conforme Facebook
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-secondary" />
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
                className="bg-bg-elevated rounded-2xl shadow-xl p-8 border border-white/10"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-bg-primary0 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tirage Concours Facebook</h2>
                  <p className="text-ink-tertiary text-sm mt-2">Votre concours est terminé ? Tirez au sort !</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.facebook.com/VotrePage/posts/..."
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    readOnly
                  />
                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Désigner le gagnant
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-4 text-sm text-ink-tertiary">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      923+ Pages
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

        {/* Avantages Concours Page */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pourquoi Organiser un Concours sur Votre Page Facebook ?
              </h2>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                Un concours bien organisé peut transformer votre Page Facebook.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Gagner des Fans",
                  description: "Un concours attractif peut faire gagner des centaines de nouveaux abonnés à votre Page.",
                  stat: "+34% fans en moyenne",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Booster l'Engagement",
                  description: "Les publications concours génèrent 3x plus d'interactions qu'un post classique.",
                  stat: "3x plus d'engagement",
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Visibilité Accrue",
                  description: "L'algorithme favorise les contenus engageants, votre Page gagne en portée.",
                  stat: "+65% de reach",
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Notoriété de Marque",
                  description: "Associez votre marque à un moment positif et mémorable pour votre audience.",
                  stat: "+45% reconnaissance",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl p-6 border border-blue-100"
                >
                  <div className="w-12 h-12 bg-bg-elevated text-accent-secondary rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-ink-secondary text-sm mb-3">{benefit.description}</p>
                  <span className="inline-block px-3 py-1 bg-accent-secondary/20 text-accent-secondary text-xs font-medium rounded-full">
                    {benefit.stat}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guide Complet */}
        <section id="guide" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Guide Complet : Organiser un Concours sur Votre Page Facebook
              </h2>
            </div>

            {/* Étape 1 */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white">Préparer le Concours</h3>
              </div>

              <div className="ml-16 grid md:grid-cols-2 gap-6">
                <div className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                  <Award className="w-8 h-8 text-accent-secondary mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-3">Choisir le Lot</h4>
                  <ul className="space-y-2 text-ink-secondary text-sm">
                    <li>• Valeur recommandée : 50€ à 500€</li>
                    <li>• En lien avec votre activité (fidélise)</li>
                    <li>• Exclusif si possible (édition limitée)</li>
                    <li>• Plusieurs petits lots &gt; 1 gros (plus de gagnants)</li>
                  </ul>
                </div>

                <div className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-accent-secondary mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-3">Définir les Règles</h4>
                  <ul className="space-y-2 text-ink-secondary text-sm">
                    <li>• ✅ Liker la publication</li>
                    <li>• ✅ Commenter (avec ou sans tag)</li>
                    <li>• ✅ Suivre la Page</li>
                    <li>• ❌ Partager (interdit par Facebook)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white">Créer la Publication</h3>
              </div>

              <div className="ml-16 bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                <Image className="w-8 h-8 text-accent-secondary mb-4" />
                <h4 className="text-lg font-semibold text-white mb-3">Checklist Publication Parfaite</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-white mb-2">Le Visuel</h5>
                    <ul className="space-y-2 text-ink-secondary text-sm">
                      <li>✓ Image haute qualité du lot</li>
                      <li>✓ Texte « CONCOURS » ou « GIVEAWAY » visible</li>
                      <li>✓ Format carré ou 4:5 (optimal mobile)</li>
                      <li>✓ Moins de 20% de texte sur l'image</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-white mb-2">Le Texte</h5>
                    <ul className="space-y-2 text-ink-secondary text-sm">
                      <li>✓ Accroche percutante en 1ère ligne</li>
                      <li>✓ Règles numérotées et claires</li>
                      <li>✓ Date de fin précise</li>
                      <li>✓ Lien vers le règlement complet</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-bg-elevated rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>💡 Template :</strong> « 🎁 CONCOURS 🎁 Pour participer : 1️⃣ Like ce post 
                    2️⃣ Follow @VotrePage 3️⃣ Commente en taguant 2 amis | Tirage le [DATE] ! 
                    Bonne chance 🍀 Règlement en commentaire. »
                  </p>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white">Promouvoir le Concours</h3>
              </div>

              <div className="ml-16 grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Megaphone className="w-6 h-6" />,
                    title: "Boost Publicitaire",
                    description: "Investissez 20-50€ pour toucher au-delà de vos fans actuels. Ciblez par intérêts.",
                  },
                  {
                    icon: <Share className="w-6 h-6" />,
                    title: "Cross-Promotion",
                    description: "Partagez sur Instagram, Stories, newsletter, site web. Utilisez tous vos canaux.",
                  },
                  {
                    icon: <Clock className="w-6 h-6" />,
                    title: "Rappels Réguliers",
                    description: "Stories de rappel à J-3, J-1, et le dernier jour. Créez l'urgence.",
                  },
                ].map((item, index) => (
                  <div key={index} className="bg-bg-elevated rounded-xl p-6 border border-white/10 shadow-sm">
                    <div className="w-10 h-10 bg-accent-secondary/20 text-accent-secondary rounded-lg flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-ink-secondary text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Étape 4 */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-2xl font-bold text-white">Tirer au Sort et Annoncer</h3>
              </div>

              <div className="ml-16 bg-gradient-to-br from-bg-primary to-bg-primary border border-blue-200 rounded-xl p-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <span className="text-2xl">📋</span>
                    </div>
                    <h4 className="text-white font-medium">Copiez le lien</h4>
                    <p className="text-ink-secondary text-sm">De votre publication concours</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <span className="text-2xl">🎰</span>
                    </div>
                    <h4 className="text-white font-medium">Tirez au sort</h4>
                    <p className="text-ink-secondary text-sm">Avec les filtres activés</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <span className="text-2xl">📢</span>
                    </div>
                    <h4 className="text-white font-medium">Annoncez</h4>
                    <p className="text-ink-secondary text-sm">Avec la vidéo preuve Cleack</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Trophy className="w-5 h-5" />
                    Lancer mon tirage maintenant
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Règles Facebook */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Règles Officielles de Facebook pour les Concours
              </h2>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                Respectez ces règles pour éviter les restrictions sur votre Page.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-bg-elevated border border-green-200 rounded-xl p-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Autorisé ✅</h3>
                <ul className="space-y-3 text-ink-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de <strong>liker</strong> la publication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de <strong>commenter</strong> (texte, emoji, tag)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de <strong>suivre la Page</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Demander de <strong>réagir</strong> (❤️ 😂 😮 etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Poster une <strong>photo en commentaire</strong></span>
                  </li>
                </ul>
              </div>

              <div className="bg-bg-elevated border border-red-200 rounded-xl p-6">
                <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Interdit ❌</h3>
                <ul className="space-y-3 text-ink-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Exiger de <strong>partager sur le profil personnel</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Demander de <strong>taguer sur une photo</strong> (qui n'y figure pas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Utiliser les <strong>fonctions Facebook de manière détournée</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Impliquer que <strong>Facebook sponsorise</strong> le concours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Collecter des <strong>données sans consentement</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Concours Page Facebook"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autres Ressources Facebook</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires Facebook", url: "/tirage-commentaires-facebook/" },
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
              <h2 className="text-2xl font-bold mb-4">Votre Concours Facebook est Terminé ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour tirer au sort le gagnant de manière 100% transparente. 
                Gratuit, sans inscription, avec vidéo preuve à partager.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-elevated text-accent-secondary px-8 py-4 rounded-xl font-semibold hover:bg-bg-elevated transition-all"
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

export default ConcoursPageFacebookPage;
