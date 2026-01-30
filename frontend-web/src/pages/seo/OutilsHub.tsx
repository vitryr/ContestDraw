import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  ArrowRight,
  FileText,
  Users,
  CheckCircle,
  Calendar,
  Sparkles,
  Download,
  Zap,
  Shield,
} from 'lucide-react';
import { SEOHead, Breadcrumb } from '../../components/seo';
import type { BreadcrumbItem } from '../../components/seo';

const CANONICAL_URL = 'https://cleack.io/outils/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Outils Gratuits', url: CANONICAL_URL },
];

const tools = [
  {
    title: 'Générateur de Règlement',
    description: 'Créez un règlement de jeu concours conforme à la loi française en 2 minutes. Téléchargez en PDF ou copiez le texte.',
    url: '/outils/generateur-reglement/',
    icon: <FileText className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    status: 'Disponible',
    features: ['Conforme RGPD', 'Export PDF', 'Personnalisable'],
  },
  {
    title: 'Compteur de Participants',
    description: 'Comptez automatiquement le nombre de participants à votre concours Instagram, TikTok ou Facebook.',
    url: '/outils/compteur-participants/',
    icon: <Users className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    status: 'Bientôt',
    features: ['Multi-plateforme', 'Temps réel', 'Statistiques'],
  },
  {
    title: 'Vérificateur de Compte',
    description: 'Vérifiez si un compte Instagram ou TikTok est un vrai compte ou un bot/faux compte.',
    url: '/outils/verificateur-compte/',
    icon: <CheckCircle className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    status: 'Bientôt',
    features: ['Détection bots', 'Score de confiance', 'Historique'],
  },
  {
    title: 'Calendrier Concours 2025',
    description: 'Planifiez vos concours avec les dates clés de l\'année : événements, fêtes, périodes propices.',
    url: '/outils/calendrier-concours/',
    icon: <Calendar className="w-8 h-8" />,
    color: 'from-orange-500 to-red-500',
    status: 'Disponible',
    features: ['Événements FR', 'Export iCal', 'Rappels'],
  },
];

const benefits = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: '100% Gratuit',
    description: 'Tous nos outils sont gratuits et sans inscription obligatoire.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Conformes RGPD',
    description: 'Vos données ne sont jamais stockées ni partagées.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'Export Facile',
    description: 'Téléchargez vos résultats en PDF, CSV ou copiez-les.',
  },
];

const OutilsHub = () => {
  return (
    <>
      <SEOHead
        title="Outils Gratuits pour Jeux Concours - Règlement, Compteur | Cleack"
        description="Outils gratuits pour organiser vos jeux concours : générateur de règlement, compteur de participants, vérificateur de compte et calendrier des concours."
        keywords="outil jeu concours, générateur règlement concours, compteur participants instagram, vérificateur bot instagram, calendrier concours"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-outils.jpg"
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50">
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
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Wrench className="w-4 h-4" />
                Boîte à Outils
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Outils{' '}
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Gratuits
                </span>{' '}
                pour vos Concours
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Des outils pratiques pour organiser, gérer et analyser vos jeux concours. 
                Tous gratuits, sans inscription.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <span className="text-orange-500">{benefit.icon}</span>
                    <span>{benefit.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <Link
                  key={tool.url}
                  to={tool.url}
                  className={`group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all ${
                    tool.status === 'Bientôt' ? 'opacity-75 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center flex-shrink-0`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {tool.title}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          tool.status === 'Disponible' 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-gray-500 bg-gray-100'
                        }`}>
                          {tool.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{tool.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.features.map((feature, index) => (
                          <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                      {tool.status === 'Disponible' && (
                        <span className="inline-flex items-center gap-1 text-orange-600 font-medium group-hover:gap-2 transition-all">
                          Utiliser l'outil <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Main CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Notre Outil Principal : le Tirage au Sort
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Sélectionnez un gagnant parmi les commentaires, likes ou partages de vos publications 
                Instagram, TikTok, Facebook, YouTube ou Twitter. Avec preuve vidéo certifiée.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Faire un tirage au sort gratuit
              </Link>
              <p className="text-white/70 text-sm mt-4">
                Sans inscription • Sans connexion aux réseaux • 100% gratuit
              </p>
            </div>
          </div>
        </section>

        {/* Suggest Tool */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Un outil vous manque ?
            </h2>
            <p className="text-gray-600 mb-6">
              Suggérez-nous de nouveaux outils à développer. Nous sommes à l'écoute de vos besoins.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
            >
              Nous contacter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default OutilsHub;
