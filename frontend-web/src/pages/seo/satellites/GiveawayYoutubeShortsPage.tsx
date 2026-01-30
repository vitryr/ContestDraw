import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Film,
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
  Youtube,
  Star,
  Smartphone,
  Eye,
  Heart,
  MessageSquare,
  Lightbulb,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/giveaway-youtube-shorts/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Tirage au Sort YouTube', url: 'https://cleack.io/tirage-au-sort-youtube/' },
  { name: 'Giveaway YouTube Shorts', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment organiser un giveaway sur YouTube Shorts ?",
    answer: "Créez un Short engageant présentant le lot et les règles (commenter, s'abonner, liker). Une fois le concours terminé, utilisez Cleack pour tirer au sort parmi les commentaires du Short. Vous obtenez une vidéo preuve à partager."
  },
  {
    question: "Les Shorts sont-ils efficaces pour les giveaways ?",
    answer: "Très efficaces ! Les Shorts ont une portée organique bien supérieure aux vidéos longues (jusqu'à 10x plus de vues). Ils sont idéaux pour toucher de nouveaux abonnés et faire exploser la participation à vos concours."
  },
  {
    question: "Quelle durée idéale pour un Short giveaway ?",
    answer: "Entre 30 et 45 secondes. Assez long pour expliquer le lot et les règles clairement, mais assez court pour maintenir l'attention jusqu'au CTA final. Les 3 premières secondes sont cruciales."
  },
  {
    question: "Peut-on tirer au sort les commentaires d'un Short avec Cleack ?",
    answer: "Oui, absolument ! Cleack fonctionne exactement de la même manière pour les Shorts que pour les vidéos classiques. Copiez l'URL du Short, collez dans Cleack, et lancez le tirage."
  },
  {
    question: "Comment maximiser les participations sur un Short giveaway ?",
    answer: "1) Hook accrocheur dans les 3 premières secondes, 2) Montrez le lot de manière attractive, 3) Règles ultra-simples (commente + abonne-toi), 4) CTA clair avec deadline, 5) Utilisez des hashtags populaires."
  },
  {
    question: "Combien de temps doit durer un giveaway YouTube Shorts ?",
    answer: "Idéalement 5-7 jours. Les Shorts ont une durée de vie courte dans l'algorithme, donc évitez les concours trop longs. Faites des rappels dans d'autres Shorts ou en Community Post."
  },
  {
    question: "Les commentaires des Shorts comptent-ils dans l'algorithme ?",
    answer: "Oui ! Les commentaires, likes et partages sur les Shorts sont pris en compte par l'algorithme YouTube. Un Short avec beaucoup de commentaires sera plus poussé dans le feed Shorts."
  },
];

const howToSteps = [
  { name: "Créez votre Short giveaway", text: "Filmez un Short de 30-45s présentant le lot et les règles de participation." },
  { name: "Publiez avec les bons hashtags", text: "#Shorts #Giveaway #Concours + hashtags de votre niche." },
  { name: "Animez et rappelez", text: "Répondez aux commentaires, faites des rappels avant la deadline." },
  { name: "Tirez au sort avec Cleack", text: "Collez l'URL du Short et lancez le tirage transparent." },
];

const GiveawayYoutubeShortsPage = () => {
  return (
    <>
      <SEOHead
        title="Giveaway YouTube Shorts : Guide Complet + Tirage Gratuit | Cleack"
        description="Organisez un giveaway YouTube Shorts réussi en 2024. Guide complet : création, timing, hashtags + outil de tirage au sort gratuit avec preuve vidéo."
        keywords="giveaway youtube shorts, concours youtube shorts, tirage au sort shorts, youtube shorts giveaway, concours shorts youtube"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-giveaway-youtube-shorts.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un giveaway YouTube Shorts"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={534}
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
                  <Film className="w-4 h-4" />
                  Guide Giveaway Shorts
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Giveaway{' '}
                  <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    YouTube Shorts
                  </span>{' '}
                  : Le Guide 2024
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Exploitez la puissance des <strong>YouTube Shorts</strong> pour vos giveaways : 
                  portée massive, engagement élevé, et nouveaux abonnés. Guide complet + tirage gratuit.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Tirer au sort
                  </Link>
                  <a
                    href="#guide"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-red-300 transition-all"
                  >
                    Voir le guide
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Portée massive
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Format tendance
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
                    <Film className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tirage Giveaway Shorts</h2>
                  <p className="text-gray-500 text-sm mt-2">Votre concours Shorts est terminé ?</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/shorts/..."
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
                      <Film className="w-4 h-4" />
                      534+ tirages Shorts
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

        {/* Pourquoi les Shorts */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi les YouTube Shorts sont Parfaits pour les Giveaways
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Les Shorts offrent des avantages uniques pour maximiser l'impact de vos concours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Eye className="w-6 h-6" />,
                  title: "Portée 10x Supérieure",
                  description: "Les Shorts sont poussés massivement par l'algorithme, même aux non-abonnés.",
                  stat: "10x plus de vues",
                },
                {
                  icon: <Smartphone className="w-6 h-6" />,
                  title: "Mobile-First",
                  description: "Format vertical optimisé pour le mobile où se trouve votre audience.",
                  stat: "85% vues mobile",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Nouveaux Abonnés",
                  description: "Les Shorts sont le meilleur moyen de faire découvrir votre chaîne.",
                  stat: "+200% nouveaux abonnés",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Facile à Produire",
                  description: "Format court = moins de temps de production pour un impact max.",
                  stat: "5 min de création",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100"
                >
                  <div className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    {benefit.stat}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guide de création */}
        <section id="guide" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment Créer un Short Giveaway qui Cartonne
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Structure du Short */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Film className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Structure Idéale (30-45s)</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="font-bold text-red-600">0-3s</span>
                    <div>
                      <p className="font-medium text-gray-900">Hook Accrocheur</p>
                      <p className="text-sm text-gray-600">« GIVEAWAY ÉNORME ! 🎁 » ou « JE DONNE [Lot] ! »</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <span className="font-bold text-orange-600">3-15s</span>
                    <div>
                      <p className="font-medium text-gray-900">Présentation du Lot</p>
                      <p className="text-sm text-gray-600">Montrez le lot sous tous les angles, créez l'envie</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="font-bold text-yellow-600">15-30s</span>
                    <div>
                      <p className="font-medium text-gray-900">Règles de Participation</p>
                      <p className="text-sm text-gray-600">1) Abonne-toi 2) Like 3) Commente ton emoji préféré</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="font-bold text-green-600">30-45s</span>
                    <div>
                      <p className="font-medium text-gray-900">CTA + Deadline</p>
                      <p className="text-sm text-gray-600">« Tirage dans 7 jours ! GO GO GO ! 🚀 »</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Astuces */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Lightbulb className="w-8 h-8 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Astuces pour Maximiser l'Impact</h3>
                
                <ul className="space-y-4">
                  {[
                    { icon: <Eye className="w-5 h-5" />, tip: "Texte à l'écran obligatoire (beaucoup regardent sans son)" },
                    { icon: <MessageSquare className="w-5 h-5" />, tip: "Posez une question simple pour encourager les commentaires" },
                    { icon: <Heart className="w-5 h-5" />, tip: "Ajoutez de l'énergie et de l'enthousiasme !" },
                    { icon: <TrendingUp className="w-5 h-5" />, tip: "Utilisez un son trending pour plus de visibilité" },
                    { icon: <Clock className="w-5 h-5" />, tip: "Publiez entre 17h et 21h (heure de pointe)" },
                    { icon: <Star className="w-5 h-5" />, tip: "Épinglez un commentaire avec les règles détaillées" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-gray-700">{item.tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hashtags */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Hashtags Recommandés pour vos Shorts Giveaway
              </h2>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center text-sm">1</span>
                    Obligatoires
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['#Shorts', '#Giveaway', '#Concours'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-500 text-white rounded flex items-center justify-center text-sm">2</span>
                    Recommandés
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['#Gratuit', '#AGagner', '#JeuConcours', '#Tirage'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-yellow-500 text-white rounded flex items-center justify-center text-sm">3</span>
                    De votre niche
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['#Gaming', '#Tech', '#Beauty', '#Lifestyle'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-gray-600 text-sm">
                  <strong>💡 Exemple complet :</strong> #Shorts #Giveaway #Concours #AGagner #Gaming #PS5
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tirez au Sort parmi les Commentaires de votre Short
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
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
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection
              items={faqItems}
              title="Questions Fréquentes - Giveaway YouTube Shorts"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Ressources YouTube</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Tirage Commentaires YouTube", url: "/tirage-commentaires-youtube/" },
                { title: "Concours YouTube", url: "/concours-youtube/" },
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
              <h2 className="text-2xl font-bold mb-4">Votre Giveaway Shorts est Terminé ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour tirer au sort le gagnant parmi les commentaires de votre Short. 
                Gratuit, transparent, avec vidéo preuve.
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

export default GiveawayYoutubeShortsPage;
