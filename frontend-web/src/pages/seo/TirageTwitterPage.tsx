import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Twitter,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  Users,
  Video,
  Bot,
  Clock,
  Star,
  ArrowRight,
  MessageCircle,
  Heart,
  Trophy,
  Sparkles,
  Filter,
  Repeat,
  Quote,
  AtSign,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../components/seo';

// X (Twitter) icon
const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const CANONICAL_URL = 'https://cleack.io/tirage-au-sort-twitter/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort Twitter/X', url: CANONICAL_URL },
];

const tocItems: TOCItem[] = [
  { id: 'comment-ca-marche', title: 'Comment ça marche', level: 2 },
  { id: 'fonctionnalites', title: 'Fonctionnalités', level: 2 },
  { id: 'types-tirages', title: 'Types de tirages', level: 2 },
  { id: 'twitter-vs-x', title: 'Twitter vs X', level: 2 },
  { id: 'tutoriel', title: 'Tutoriel complet', level: 2 },
  { id: 'conseils', title: 'Conseils giveaway', level: 2 },
  { id: 'faq', title: 'Questions fréquentes', level: 2 },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment faire un tirage au sort Twitter/X gratuitement ?",
    answer: "Avec Cleack, c'est simple : copiez le lien de votre tweet, collez-le dans notre outil, choisissez le type de tirage (retweets, likes ou replies), et cliquez sur « Tirer au sort ». En moins de 30 secondes, vous obtenez un gagnant aléatoire. <strong>100% gratuit</strong>."
  },
  {
    question: "Cleack fonctionne-t-il avec X (nouveau nom de Twitter) ?",
    answer: "Oui ! Cleack fonctionne parfaitement avec <strong>X (anciennement Twitter)</strong>. Les liens twitter.com et x.com sont tous deux supportés. Toutes les fonctionnalités restent identiques."
  },
  {
    question: "Puis-je faire un tirage parmi les retweets ?",
    answer: "Oui, Cleack peut analyser les <strong>retweets</strong>, les <strong>likes</strong> et les <strong>réponses (replies)</strong> d'un tweet. Vous choisissez le type de participation que vous voulez inclure dans le tirage."
  },
  {
    question: "Comment filtrer les quote tweets ?",
    answer: "Cleack distingue les <strong>retweets simples</strong> des <strong>quote tweets</strong> (retweets avec commentaire). Vous pouvez choisir d'inclure les deux ou uniquement l'un des deux formats."
  },
  {
    question: "Dois-je connecter mon compte Twitter/X à Cleack ?",
    answer: "Non, <strong>aucune connexion</strong> n'est nécessaire. Cleack fonctionne uniquement avec le lien public de votre tweet. Vos identifiants restent privés et sécurisés."
  },
  {
    question: "Combien de participants Cleack peut-il gérer sur Twitter ?",
    answer: "Cleack peut analyser des tweets avec <strong>des milliers de retweets</strong> ou de likes. Les tweets très viraux prennent un peu plus de temps, mais nous récupérons tous les participants."
  },
  {
    question: "Comment contacter le gagnant sur Twitter/X ?",
    answer: "Vous pouvez : <ul><li>Répondre directement à son retweet ou commentaire</li><li>Le mentionner (@) dans un nouveau tweet</li><li>Lui envoyer un message privé (DM) s'il vous suit</li><li>Quote tweet en annonçant le gagnant</li></ul>"
  },
  {
    question: "Les comptes privés sont-ils inclus dans le tirage ?",
    answer: "Non, Cleack ne peut analyser que les <strong>comptes publics</strong>. Les retweets ou likes provenant de comptes privés ne sont pas accessibles via l'API publique de Twitter."
  },
  {
    question: "Cleack génère-t-il une preuve vidéo pour Twitter ?",
    answer: "Oui ! Cleack génère une <strong>vidéo preuve</strong> que vous pouvez tweeter directement pour montrer la transparence du tirage à votre communauté."
  },
  {
    question: "Est-ce conforme aux règles de Twitter/X d'organiser un giveaway ?",
    answer: "Oui, Twitter/X autorise les giveaways à condition de respecter les <a href='https://help.twitter.com/en/rules-and-policies/twitter-contest-rules' target='_blank'>règles de la plateforme</a>. Évitez de créer plusieurs comptes pour participer et ne demandez pas aux participants de spammer des mentions."
  },
];

const howToSteps = [
  {
    name: "Copiez le lien de votre tweet",
    text: "Cliquez sur les trois points (...) de votre tweet, puis 'Copier le lien'. Ou copiez l'URL depuis la barre d'adresse.",
  },
  {
    name: "Collez le lien dans Cleack",
    text: "Rendez-vous sur Cleack et collez l'URL de votre tweet. Notre outil détecte automatiquement le type de contenu.",
  },
  {
    name: "Choisissez le type de tirage",
    text: "Sélectionnez parmi : retweets, likes, réponses (replies), ou quote tweets. Configurez les filtres optionnels.",
  },
  {
    name: "Lancez le tirage et tweetez",
    text: "Cliquez sur 'Tirer au sort'. Téléchargez la vidéo preuve et tweetez-la pour annoncer le gagnant !",
  },
];

const softwareFeatures = [
  "Tirage au sort retweets",
  "Tirage au sort likes Twitter/X",
  "Tirage au sort replies",
  "Support quote tweets",
  "Preuve vidéo certifiée",
  "Détection des bots",
  "Exclusion comptes privés",
  "Multi-gagnants",
  "100% gratuit",
];

const reviews = [
  {
    author: "CryptoFR",
    datePublished: "2024-04-12",
    reviewBody: "Parfait pour nos giveaways crypto ! 2000 RT analysés en quelques secondes. La preuve vidéo est géniale pour la transparence.",
    ratingValue: 5,
  },
  {
    author: "Lucas M.",
    datePublished: "2024-03-28",
    reviewBody: "Enfin un outil qui fonctionne avec X ! Simple, gratuit et efficace. Je l'utilise tous les mois.",
    ratingValue: 5,
  },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-twitter/' },
  { lang: 'en', url: 'https://cleack.io/en/twitter-giveaway-picker/' },
  { lang: 'es', url: 'https://cleack.io/es/sorteo-twitter/' },
  { lang: 'x-default', url: 'https://cleack.io/en/twitter-giveaway-picker/' },
];

const TirageTwitterPage = () => {
  return (
    <>
      <SEOHead
        title="Tirage au Sort Twitter/X Gratuit - Choisir un Gagnant de Retweets | Cleack"
        description="Faites un tirage au sort Twitter/X gratuit parmi les retweets, likes ou réponses. Sélectionnez un gagnant aléatoire pour vos giveaways. Fonctionne avec twitter.com et x.com."
        keywords="tirage au sort twitter, tirage retweet, giveaway twitter, tirage au sort x, concours twitter, twitter giveaway picker, tirage likes twitter, giveaway x"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tirage-twitter.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment faire un tirage au sort Twitter/X"
        howToDescription="Guide pour sélectionner un gagnant parmi les retweets ou likes"
        howToTotalTime="PT2M"
        includeSoftwareSchema
        softwareRating={4.6}
        softwareRatingCount={687}
        softwareFeatures={softwareFeatures}
        reviews={reviews}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} className="text-gray-400" />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <XIcon className="w-4 h-4" />
                  Twitter / X
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Tirage au Sort{' '}
                  <span className="bg-gradient-to-r from-sky-400 to-white bg-clip-text text-transparent">
                    Twitter/X
                  </span>{' '}
                  Gratuit
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Sélectionnez un <strong className="text-white">gagnant aléatoire</strong> parmi les retweets, 
                  likes ou réponses de vos tweets. Idéal pour vos <strong className="text-white">giveaways</strong> et 
                  concours sur Twitter et X.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Lancer un tirage gratuit
                  </Link>
                  <a
                    href="#comment-ca-marche"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                  >
                    Comment ça marche ?
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>100% Gratuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Sans inscription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XIcon className="w-5 h-5 text-white" />
                    <span>Twitter & X</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <XIcon className="w-8 h-8 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold">Tirage au Sort Twitter/X</h2>
                    <p className="text-gray-400 mt-2">Collez le lien de votre tweet</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="https://twitter.com/user/status/..."
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/50"
                      readOnly
                    />
                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Tirer au sort gratuitement
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold">30s</div>
                      <div className="text-sm text-gray-500">Durée</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">∞</div>
                      <div className="text-sm text-gray-500">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold">4.6</span>
                      </div>
                      <div className="text-sm text-gray-500">Note</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} sticky className="bg-white/5 border-white/10" />
            </aside>

            <main className="min-w-0">
              {/* Intro */}
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                <p className="text-xl text-gray-300 leading-relaxed">
                  Twitter/X est la plateforme idéale pour les <strong className="text-white">giveaways rapides</strong> et 
                  viraux. Avec son format instantané et ses fonctionnalités de partage (retweets), vos concours 
                  peuvent atteindre une audience massive en quelques heures.
                </p>
                <p className="text-gray-400">
                  Cleack analyse les retweets, likes et réponses de vos tweets pour sélectionner un gagnant 
                  de manière totalement aléatoire et transparente. Plus besoin de compter manuellement ou 
                  de faire confiance à des outils douteux !
                </p>
              </div>

              {/* Section: Comment ça marche */}
              <section id="comment-ca-marche" className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  Comment Faire un Tirage au Sort Twitter/X ?
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      step: 1,
                      title: "Copiez le lien de votre tweet",
                      description: "Cliquez sur les trois points (...) ou la flèche de partage de votre tweet, puis « Copier le lien ». Fonctionne avec twitter.com et x.com.",
                      icon: <XIcon className="w-6 h-6" />,
                    },
                    {
                      step: 2,
                      title: "Collez le lien dans Cleack",
                      description: "Rendez-vous sur Cleack et collez l'URL de votre tweet. Notre outil détecte automatiquement la plateforme et récupère les participants.",
                      icon: <Zap className="w-6 h-6" />,
                    },
                    {
                      step: 3,
                      title: "Choisissez le type de tirage",
                      description: "Sélectionnez parmi : retweets simples, quote tweets, likes, ou réponses (replies). Vous pouvez aussi combiner plusieurs types.",
                      icon: <Filter className="w-6 h-6" />,
                    },
                    {
                      step: 4,
                      title: "Lancez le tirage et tweetez",
                      description: "Cliquez sur « Tirer au sort ». Téléchargez la vidéo preuve et publiez un tweet pour annoncer le gagnant à votre communauté !",
                      icon: <Trophy className="w-6 h-6" />,
                    },
                  ].map((item) => (
                    <div key={item.step} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-sky-400 mb-1">Étape {item.step}</div>
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Fonctionnalités */}
              <section id="fonctionnalites" className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  Fonctionnalités du Tirage au Sort Twitter/X
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: <Repeat className="w-6 h-6" />,
                      title: "Retweets",
                      description: "Tirez au sort parmi les personnes qui ont retweeté votre publication. Le format classique des giveaways Twitter.",
                      highlight: true,
                    },
                    {
                      icon: <Heart className="w-6 h-6" />,
                      title: "Likes",
                      description: "Sélectionnez un gagnant parmi les likes. Idéal pour les concours simples à forte participation.",
                      highlight: true,
                    },
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Réponses (Replies)",
                      description: "Analysez les réponses à votre tweet. Parfait pour les concours avec questions ou conditions.",
                    },
                    {
                      icon: <Quote className="w-6 h-6" />,
                      title: "Quote Tweets",
                      description: "Tirez parmi les quote tweets (retweets avec commentaire). Génère plus d'engagement et de visibilité.",
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Preuve Vidéo",
                      description: "Générez une vidéo du tirage à tweeter pour prouver la transparence.",
                    },
                    {
                      icon: <Bot className="w-6 h-6" />,
                      title: "Anti-Bots",
                      description: "Détection automatique des comptes suspects et des bots de participation.",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-white/5 rounded-xl p-6 border ${
                        feature.highlight ? 'border-sky-500/50' : 'border-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        feature.highlight ? 'bg-white text-black' : 'bg-white/10 text-white'
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Types de tirages */}
              <section id="types-tirages" className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  Types de Giveaways Twitter/X
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Repeat className="w-6 h-6" />,
                      title: "Giveaway RT + Follow",
                      description: "Le classique « RT + Follow pour participer ». Demandez aux participants de retweeter et de vous suivre. Cleack tire au sort parmi les RT, et vous vérifiez manuellement si le gagnant vous suit.",
                      link: "/tirage-retweets/",
                      badge: "Le plus populaire",
                    },
                    {
                      icon: <Heart className="w-6 h-6" />,
                      title: "Giveaway Likes",
                      description: "Format ultra-simple : « Like pour participer ». Génère énormément de participation car c'est le geste le plus facile sur Twitter. Idéal pour maximiser l'engagement.",
                      link: "/tirage-likes-twitter/",
                      badge: "Participation maximale",
                    },
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Giveaway Reply",
                      description: "Demandez aux participants de répondre avec un mot-clé, leur film préféré, etc. Plus engageant mais moins de participation. Permet de filtrer les participants sérieux.",
                      link: "/giveaway-twitter-x/",
                      badge: "Engagement qualitatif",
                    },
                    {
                      icon: <AtSign className="w-6 h-6" />,
                      title: "Giveaway Tag a Friend",
                      description: "« RT + tag un ami ». Chaque mention compte comme une participation supplémentaire. Effet viral garanti car chaque participant ramène de nouveaux utilisateurs.",
                      link: "/concours-twitter/",
                      badge: "Effet viral",
                    },
                  ].map((type, index) => (
                    <Link
                      key={index}
                      to={type.link}
                      className="block bg-white/5 rounded-xl p-6 border border-white/10 hover:border-sky-500/50 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white group-hover:text-black transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold group-hover:text-sky-400">
                              {type.title}
                            </h3>
                            <span className="text-xs font-medium text-sky-400 bg-sky-400/10 px-2 py-1 rounded">
                              {type.badge}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{type.description}</p>
                          <span className="inline-flex items-center gap-1 text-sky-400 text-sm font-medium">
                            En savoir plus <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section: Twitter vs X */}
              <section id="twitter-vs-x" className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  Twitter vs X : Qu'est-ce qui Change ?
                </h2>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-black flex-shrink-0">
                      <XIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Depuis le rebranding en X (juillet 2023)
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Twitter a été renommé X par Elon Musk, mais les fonctionnalités de base restent 
                        identiques. Cleack fonctionne parfaitement avec les deux domaines :
                      </p>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span><strong className="text-white">twitter.com</strong> - Ancien domaine, toujours fonctionnel</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span><strong className="text-white">x.com</strong> - Nouveau domaine officiel</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span>Les retweets, likes et replies fonctionnent identiquement</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span>Cleack détecte automatiquement le bon format</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Tutoriel */}
              <section id="tutoriel" className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  Tutoriel : Organiser un Giveaway Twitter/X Réussi
                </h2>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-white/10 text-sky-400 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      Rédigez un tweet accrocheur
                    </h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Commencez par <strong className="text-white">🎁 GIVEAWAY</strong> ou <strong className="text-white">🎉 CONCOURS</strong></li>
                      <li>• Décrivez clairement le lot et sa valeur</li>
                      <li>• Listez les conditions de participation</li>
                      <li>• Précisez la date de fin</li>
                      <li>• Ajoutez une image attractive du lot</li>
                    </ul>
                    <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-gray-300 font-mono">
                        🎁 GIVEAWAY 🎁<br/><br/>
                        Je vous offre [LOT] ! 🎉<br/><br/>
                        Pour participer :<br/>
                        ✅ Follow @votrecompte<br/>
                        ✅ RT ce tweet<br/>
                        ✅ Tag un ami<br/><br/>
                        Tirage le [DATE] avec @cleack_io 🎲
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-white/10 text-sky-400 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      Boostez la visibilité
                    </h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Publiez aux <strong className="text-white">heures de pointe</strong> (12h-14h, 18h-21h)</li>
                      <li>• Utilisez des <strong className="text-white">hashtags pertinents</strong> (#giveaway #concours + niche)</li>
                      <li>• <strong className="text-white">Épinglez le tweet</strong> sur votre profil</li>
                      <li>• Demandez à des amis de RT pour lancer l'effet viral</li>
                      <li>• Relancez avec un <strong className="text-white">thread de rappel</strong> à mi-parcours</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-white/10 text-sky-400 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      Tirez au sort avec Cleack
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Une fois le concours terminé, utilisez Cleack pour le tirage :
                    </p>
                    <ol className="space-y-2 text-gray-400 list-decimal list-inside">
                      <li>Copiez le lien de votre tweet de concours</li>
                      <li>Collez-le dans Cleack</li>
                      <li>Sélectionnez « Retweets » comme source</li>
                      <li>Cliquez sur « Tirer au sort »</li>
                      <li>Téléchargez la vidéo preuve</li>
                    </ol>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-white/10 text-sky-400 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                      Annoncez le gagnant
                    </h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>• <strong className="text-white">Quote tweet</strong> votre concours avec le nom du gagnant</li>
                      <li>• Joignez la <strong className="text-white">vidéo preuve Cleack</strong></li>
                      <li>• <strong className="text-white">Mentionnez le gagnant</strong> (@username)</li>
                      <li>• Contactez-le par <strong className="text-white">DM</strong> pour les détails d'envoi</li>
                      <li>• Prévoyez un <strong className="text-white">délai de réponse</strong> (48h-7j) avant de retirer</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section: Conseils */}
              <section id="conseils" className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  Conseils pour des Giveaways Twitter/X Réussis
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: "Durée courte : 2-5 jours",
                      description: "Twitter est une plateforme rapide. Un giveaway de 2-5 jours crée l'urgence et maintient l'engagement. Au-delà, votre tweet se perd dans le flux.",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Vérifiez le follow manuellement",
                      description: "Cleack ne peut pas vérifier si le gagnant vous suit. Avant d'annoncer, vérifiez manuellement que le gagnant remplit toutes les conditions.",
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Partagez la preuve vidéo",
                      description: "Tweetez la vidéo preuve Cleack avec l'annonce du gagnant. Ça montre la transparence et encourage la participation aux futurs concours.",
                    },
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Interagissez avec les participants",
                      description: "Répondez aux participants, likez leurs RT. Ça booste l'engagement et rend votre concours plus visible dans l'algorithme.",
                    },
                  ].map((conseil, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-sky-400 mb-4">
                        {conseil.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{conseil.title}</h3>
                      <p className="text-gray-400 text-sm">{conseil.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-16">
                <div className="bg-white rounded-2xl p-8">
                  <FAQSection
                    items={faqItems}
                    title="Questions Fréquentes sur le Tirage au Sort Twitter/X"
                    subtitle="Tout ce que vous devez savoir pour organiser un giveaway Twitter/X réussi"
                  />
                </div>
              </section>

              {/* Other Platforms */}
              <div className="bg-white rounded-2xl p-8 mb-16">
                <PlatformLinks currentPlatform="twitter" />
              </div>

              {/* Final CTA */}
              <section className="mt-16">
                <div className="bg-white rounded-2xl p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <XIcon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Prêt à Lancer Votre Giveaway Twitter/X ?
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Utilisez Cleack pour choisir un gagnant parmi vos retweets ou likes. 
                    Gratuit, rapide et avec preuve vidéo.
                  </p>
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Commencer gratuitement
                  </Link>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default TirageTwitterPage;
