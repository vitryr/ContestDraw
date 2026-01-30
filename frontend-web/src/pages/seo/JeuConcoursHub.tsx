import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Gift,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Users,
  Trophy,
  Shield,
  Clock,
  Target,
} from 'lucide-react';
import { SEOHead, Breadcrumb } from '../../components/seo';
import type { BreadcrumbItem } from '../../components/seo';

// TikTok icon
const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const CANONICAL_URL = 'https://cleack.io/jeu-concours/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Jeu Concours', url: CANONICAL_URL },
];

const platforms = [
  {
    name: 'Instagram',
    icon: <Instagram className="w-8 h-8" />,
    color: 'from-pink-500 to-purple-500',
    borderColor: 'border-pink-200',
    hoverColor: 'hover:border-pink-300',
    url: '/jeu-concours-instagram/',
    description: 'Organisez des concours Instagram engageants avec tirages automatiques',
    volume: '9,900 recherches/mois',
  },
  {
    name: 'TikTok',
    icon: <TikTokIcon className="w-8 h-8" />,
    color: 'from-gray-800 to-black',
    borderColor: 'border-gray-300',
    hoverColor: 'hover:border-gray-400',
    url: '/jeu-concours-tiktok/',
    description: 'Créez des giveaways viraux sur TikTok',
    volume: '2,400 recherches/mois',
  },
  {
    name: 'Facebook',
    icon: <Facebook className="w-8 h-8" />,
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:border-blue-300',
    url: '/jeu-concours-facebook/',
    description: 'Concours sur pages et groupes Facebook',
    volume: '880 recherches/mois',
  },
  {
    name: 'YouTube',
    icon: <Youtube className="w-8 h-8" />,
    color: 'from-red-500 to-red-600',
    borderColor: 'border-red-200',
    hoverColor: 'hover:border-red-300',
    url: '/jeu-concours-youtube/',
    description: 'Giveaways pour fidéliser vos abonnés YouTube',
    volume: '590 recherches/mois',
  },
];

const guides = [
  {
    title: 'Comment organiser un jeu concours',
    description: 'Guide complet de A à Z pour créer un concours réussi',
    url: '/guide/organiser-jeu-concours/',
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: 'Règlement jeu concours',
    description: 'Modèle de règlement conforme à la loi française',
    url: '/guide/reglement-jeu-concours/',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: 'Légalité des jeux concours en France',
    description: 'Ce que dit la loi sur les concours et loteries',
    url: '/guide/legal-jeu-concours-france/',
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
];

const JeuConcoursHub = () => {
  return (
    <>
      <SEOHead
        title="Jeu Concours en Ligne - Organiser & Tirer au Sort | Cleack"
        description="Organisez des jeux concours sur Instagram, TikTok, Facebook et YouTube. Tirage au sort gratuit avec preuve vidéo. Guides, règlements et outils pour des concours réussis."
        keywords="jeu concours, jeu concours instagram, concours en ligne, organiser jeu concours, giveaway, tirage au sort concours"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-jeu-concours.jpg"
        breadcrumbs={breadcrumbItems}
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={1523}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Gift className="w-4 h-4" />
                Guide Complet
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Organisez des{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Jeux Concours
                </span>{' '}
                qui Fonctionnent
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Créez des concours engageants sur tous les réseaux sociaux. Utilisez Cleack pour 
                tirer au sort vos gagnants avec une <strong>preuve vidéo certifiée</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/draw/new"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Lancer un tirage gratuit
                </Link>
                <a
                  href="#platforms"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-300 transition-all"
                >
                  Voir par plateforme
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Concours organisés', value: '+100K', icon: <Trophy className="w-5 h-5" /> },
                  { label: 'Utilisateurs', value: '+50K', icon: <Users className="w-5 h-5" /> },
                  { label: 'Plateformes', value: '5+', icon: <Target className="w-5 h-5" /> },
                  { label: 'Note moyenne', value: '4.8/5', icon: <CheckCircle2 className="w-5 h-5" /> },
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platforms Section */}
        <section id="platforms" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Jeux Concours par Plateforme
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chaque réseau social a ses spécificités. Découvrez nos guides dédiés pour organiser 
                des concours adaptés à chaque plateforme.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {platforms.map((platform) => (
                <Link
                  key={platform.name}
                  to={platform.url}
                  className={`group bg-white rounded-2xl p-6 border-2 ${platform.borderColor} ${platform.hoverColor} hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color} text-white flex items-center justify-center flex-shrink-0`}>
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Jeu Concours {platform.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {platform.volume}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{platform.description}</p>
                      <span className="inline-flex items-center gap-1 text-purple-600 font-medium group-hover:gap-2 transition-all">
                        Voir le guide <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment Organiser un Jeu Concours ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Un concours réussi suit 4 étapes clés. Cleack vous accompagne de la création 
                jusqu'au tirage au sort.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: 'Définissez les règles',
                  description: 'Choisissez le lot, les conditions de participation et la durée du concours.',
                  icon: <BookOpen className="w-6 h-6" />,
                },
                {
                  step: 2,
                  title: 'Publiez le concours',
                  description: 'Créez un visuel attractif et publiez sur la plateforme de votre choix.',
                  icon: <Target className="w-6 h-6" />,
                },
                {
                  step: 3,
                  title: 'Collectez les participations',
                  description: 'Laissez votre communauté participer via commentaires, likes ou partages.',
                  icon: <Users className="w-6 h-6" />,
                },
                {
                  step: 4,
                  title: 'Tirez au sort',
                  description: 'Utilisez Cleack pour sélectionner un gagnant avec preuve vidéo.',
                  icon: <Trophy className="w-6 h-6" />,
                },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium text-purple-600 mb-2">Étape {item.step}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Guides & Ressources
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour organiser des concours conformes et efficaces.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <Link
                  key={index}
                  to={guide.url}
                  className="group bg-gray-50 rounded-xl p-6 hover:bg-purple-50 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-white text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                    {guide.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <span className="inline-flex items-center gap-1 text-purple-600 text-sm font-medium group-hover:gap-2 transition-all">
                    Lire le guide <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-4">
                    Conseils pour un Concours Réussi
                  </h2>
                  <ul className="space-y-4">
                    {[
                      'Choisissez un lot en rapport avec votre audience',
                      'Gardez des conditions de participation simples',
                      'Définissez une durée optimale (5-10 jours)',
                      'Promouvez régulièrement votre concours',
                      'Annoncez le gagnant publiquement avec preuve',
                    ].map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                    <Clock className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Tirage en 30 secondes
                    </h3>
                    <p className="text-white/80 mb-4">
                      Avec Cleack, le tirage au sort prend moins de 30 secondes. 
                      Gratuit et sans inscription.
                    </p>
                    <Link
                      to="/draw/new"
                      className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Essayer maintenant
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à Lancer Votre Jeu Concours ?
            </h2>
            <p className="text-gray-600 mb-8">
              Utilisez Cleack pour tirer au sort vos gagnants sur Instagram, TikTok, Facebook, 
              YouTube ou Twitter. Gratuit, rapide et transparent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/draw/new"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Faire un tirage au sort
              </Link>
              <Link
                to="/guide/organiser-jeu-concours/"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Lire le guide complet
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default JeuConcoursHub;
