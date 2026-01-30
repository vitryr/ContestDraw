import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Shield,
  FileText,
  Scale,
  TrendingUp,
  Lightbulb,
  Users,
  Target,
  Award,
  Calendar,
} from 'lucide-react';
import { SEOHead, Breadcrumb } from '../../components/seo';
import type { BreadcrumbItem } from '../../components/seo';

const CANONICAL_URL = 'https://cleack.io/guide/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: CANONICAL_URL },
];

const mainGuides = [
  {
    title: 'Comment Organiser un Jeu Concours',
    description: 'Guide complet de A à Z pour créer un concours réussi sur les réseaux sociaux. Stratégie, création, promotion et tirage au sort.',
    url: '/guide/organiser-jeu-concours/',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    readTime: '15 min',
    featured: true,
  },
  {
    title: 'Règlement Jeu Concours',
    description: 'Modèle de règlement conforme à la loi française. Téléchargez notre template et personnalisez-le pour votre concours.',
    url: '/guide/reglement-jeu-concours/',
    icon: <FileText className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    readTime: '10 min',
    featured: true,
  },
  {
    title: 'Légalité des Jeux Concours en France',
    description: 'Ce que dit la loi sur les concours et loteries. RGPD, déclarations obligatoires, conditions légales et pièges à éviter.',
    url: '/guide/legal-jeu-concours-france/',
    icon: <Scale className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    readTime: '12 min',
    featured: true,
  },
];

const additionalGuides = [
  {
    title: 'Augmenter l\'Engagement Instagram',
    description: 'Stratégies pour booster l\'engagement de vos publications et concours Instagram.',
    url: '/guide/augmenter-engagement/',
    icon: <TrendingUp className="w-6 h-6" />,
    readTime: '8 min',
  },
  {
    title: 'Meilleurs Outils de Tirage au Sort',
    description: 'Comparatif des outils de tirage au sort en ligne. Avantages, inconvénients et recommandations.',
    url: '/guide/meilleurs-outils-tirage/',
    icon: <Award className="w-6 h-6" />,
    readTime: '7 min',
  },
  {
    title: '10 Idées de Concours Instagram',
    description: 'Inspirez-vous de ces idées de concours qui fonctionnent pour engager votre audience.',
    url: '/blog/idees-concours-instagram/',
    icon: <Lightbulb className="w-6 h-6" />,
    readTime: '6 min',
  },
  {
    title: 'Calendrier des Concours 2025',
    description: 'Les meilleures périodes pour organiser des concours selon les événements de l\'année.',
    url: '/guide/calendrier-concours/',
    icon: <Calendar className="w-6 h-6" />,
    readTime: '5 min',
  },
];

const tips = [
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Définissez vos objectifs',
    description: 'Gain d\'abonnés, engagement, notoriété... Adaptez votre concours à vos objectifs.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Connaissez votre audience',
    description: 'Le lot et les conditions doivent parler à votre communauté.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Respectez la loi',
    description: 'Un règlement conforme vous protège et rassure les participants.',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'Soyez transparent',
    description: 'Utilisez une preuve vidéo pour le tirage et annoncez le gagnant publiquement.',
  },
];

const GuideHub = () => {
  return (
    <>
      <SEOHead
        title="Guides Jeux Concours - Organiser, Règlement, Légalité | Cleack"
        description="Guides complets pour organiser des jeux concours sur les réseaux sociaux. Règlements types, aspects légaux, stratégies d'engagement et meilleures pratiques."
        keywords="guide jeu concours, organiser concours instagram, règlement jeu concours, jeu concours légal france, comment faire un giveaway"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-guides.jpg"
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
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
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Centre de Ressources
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Guides{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Jeux Concours
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tout ce que vous devez savoir pour organiser des concours réussis et conformes. 
                Règlements, aspects légaux, stratégies et meilleures pratiques.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Guides */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Guides Essentiels
              </h2>
              <p className="text-gray-600">
                Les ressources indispensables pour organiser vos concours
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {mainGuides.map((guide) => (
                <Link
                  key={guide.url}
                  to={guide.url}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${guide.color} text-white flex items-center justify-center mb-6`}>
                    {guide.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {guide.readTime} de lecture
                    </span>
                    {guide.featured && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        Essentiel
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium group-hover:gap-2 transition-all">
                    Lire le guide <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Guides */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Plus de Ressources
              </h2>
              <p className="text-gray-600">
                Approfondissez vos connaissances avec ces guides complémentaires
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalGuides.map((guide) => (
                <Link
                  key={guide.url}
                  to={guide.url}
                  className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                    {guide.icon}
                  </div>
                  <span className="text-xs text-gray-500 mb-2 block">{guide.readTime}</span>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{guide.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 md:p-12">
              <div className="text-center text-white mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  4 Clés pour un Concours Réussi
                </h2>
                <p className="text-white/80 max-w-2xl mx-auto">
                  Retenez ces principes fondamentaux pour maximiser l'impact de vos jeux concours
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tips.map((tip, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white mb-4">
                      {tip.icon}
                    </div>
                    <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
                    <p className="text-white/80 text-sm">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à Mettre en Pratique ?
            </h2>
            <p className="text-gray-600 mb-8">
              Utilisez Cleack pour tirer au sort vos gagnants avec une preuve vidéo certifiée. 
              Gratuit, rapide et transparent.
            </p>
            <Link
              to="/draw/new"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
            >
              Faire un tirage au sort gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default GuideHub;
