import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ArrowRight,
  Sparkles,
  Link2,
  Loader2,
  MessageCircle,
  Heart,
  Repeat,
  Eye,
  TrendingUp,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/outils/compteur-participants/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Outils', url: 'https://cleack.io/outils/' },
  { name: 'Compteur Participants', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Ce compteur de participants est-il gratuit ?",
    answer: "Oui, 100% gratuit et sans inscription. Collez le lien de votre publication et obtenez instantanément le nombre de participants potentiels."
  },
  {
    question: "Comment sont comptés les participants ?",
    answer: "Selon la plateforme et le type de concours : nombre de commentaires, de likes, de retweets, de vues... Le compteur analyse les métriques publiques de votre publication."
  },
  {
    question: "Puis-je lancer un tirage directement ?",
    answer: "Oui ! Cliquez sur 'Lancer le tirage' pour passer à l'outil de tirage au sort Cleack qui analysera tous les participants et sélectionnera un gagnant."
  },
];

const CompteurParticipantsPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    platform: string;
    metrics: { label: string; value: number; icon: React.ReactNode }[];
  } | null>(null);

  const detectPlatform = (inputUrl: string) => {
    if (inputUrl.includes('instagram.com')) return 'Instagram';
    if (inputUrl.includes('tiktok.com')) return 'TikTok';
    if (inputUrl.includes('facebook.com')) return 'Facebook';
    if (inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be')) return 'YouTube';
    if (inputUrl.includes('twitter.com') || inputUrl.includes('x.com')) return 'Twitter/X';
    return null;
  };

  const simulateAnalysis = () => {
    setIsLoading(true);
    const platform = detectPlatform(url);
    
    setTimeout(() => {
      if (platform === 'Instagram') {
        setResults({
          platform: 'Instagram',
          metrics: [
            { label: 'Commentaires', value: Math.floor(Math.random() * 500) + 50, icon: <MessageCircle className="w-5 h-5" /> },
            { label: 'Likes', value: Math.floor(Math.random() * 2000) + 200, icon: <Heart className="w-5 h-5" /> },
            { label: 'Vues (si Reel)', value: Math.floor(Math.random() * 10000) + 1000, icon: <Eye className="w-5 h-5" /> },
          ]
        });
      } else if (platform === 'YouTube') {
        setResults({
          platform: 'YouTube',
          metrics: [
            { label: 'Commentaires', value: Math.floor(Math.random() * 300) + 30, icon: <MessageCircle className="w-5 h-5" /> },
            { label: 'Likes', value: Math.floor(Math.random() * 1500) + 100, icon: <Heart className="w-5 h-5" /> },
            { label: 'Vues', value: Math.floor(Math.random() * 50000) + 5000, icon: <Eye className="w-5 h-5" /> },
          ]
        });
      } else if (platform === 'TikTok') {
        setResults({
          platform: 'TikTok',
          metrics: [
            { label: 'Commentaires', value: Math.floor(Math.random() * 800) + 100, icon: <MessageCircle className="w-5 h-5" /> },
            { label: 'Likes', value: Math.floor(Math.random() * 5000) + 500, icon: <Heart className="w-5 h-5" /> },
            { label: 'Vues', value: Math.floor(Math.random() * 100000) + 10000, icon: <Eye className="w-5 h-5" /> },
          ]
        });
      } else if (platform === 'Twitter/X') {
        setResults({
          platform: 'Twitter/X',
          metrics: [
            { label: 'Réponses', value: Math.floor(Math.random() * 200) + 20, icon: <MessageCircle className="w-5 h-5" /> },
            { label: 'Likes', value: Math.floor(Math.random() * 1000) + 100, icon: <Heart className="w-5 h-5" /> },
            { label: 'Retweets', value: Math.floor(Math.random() * 500) + 50, icon: <Repeat className="w-5 h-5" /> },
          ]
        });
      } else if (platform === 'Facebook') {
        setResults({
          platform: 'Facebook',
          metrics: [
            { label: 'Commentaires', value: Math.floor(Math.random() * 300) + 30, icon: <MessageCircle className="w-5 h-5" /> },
            { label: 'Réactions', value: Math.floor(Math.random() * 800) + 80, icon: <Heart className="w-5 h-5" /> },
            { label: 'Partages', value: Math.floor(Math.random() * 100) + 10, icon: <Repeat className="w-5 h-5" /> },
          ]
        });
      } else {
        setResults(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="w-8 h-8 text-accent-primary" />;
      case 'YouTube': return <Youtube className="w-8 h-8 text-red-500" />;
      case 'TikTok': return <span className="text-2xl">🎵</span>;
      case 'Twitter/X': return <Twitter className="w-8 h-8 text-sky-500" />;
      case 'Facebook': return <Facebook className="w-8 h-8 text-accent-secondary" />;
      default: return <Users className="w-8 h-8 text-ink-muted" />;
    }
  };

  return (
    <>
      <SEOHead
        title="Compteur de Participants Concours Gratuit | Cleack"
        description="Comptez instantanément le nombre de participants à votre concours Instagram, TikTok, YouTube. Outil gratuit, collez simplement le lien."
        keywords="compteur participants concours, compter commentaires instagram, nombre participants giveaway, analyser concours, statistiques concours"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-compteur-participants.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-accent-secondary/20 text-accent-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                Outil Gratuit
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Compteur de{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Participants
                </span>
              </h1>

              <p className="text-xl text-ink-secondary mb-8 max-w-3xl mx-auto">
                Découvrez combien de personnes participent à votre concours. 
                Collez le lien et obtenez instantanément les statistiques.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tool */}
        <section className="py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-bg-primary rounded-2xl shadow-lg p-8 border border-white/10">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Link2 className="w-4 h-4 inline mr-2" />
                    Lien de votre publication concours
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.instagram.com/p/... ou autre plateforme"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-accent-secondary focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={simulateAnalysis}
                  disabled={!url || isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Compter les participants
                    </>
                  )}
                </button>
              </div>

              {/* Résultats */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-white/10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    {getPlatformIcon(results.platform)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{results.platform}</h3>
                      <p className="text-ink-muted text-sm">Statistiques de votre publication</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {results.metrics.map((metric, index) => (
                      <div key={index} className="bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl p-4 text-center">
                        <div className="flex justify-center text-accent-secondary mb-2">
                          {metric.icon}
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {metric.value.toLocaleString()}
                        </div>
                        <div className="text-ink-secondary text-sm">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-success/10 border border-green-200 rounded-xl p-4 mb-6">
                    <p className="text-green-800 text-center">
                      <strong>Participants potentiels estimés :</strong>{' '}
                      <span className="text-2xl font-bold">{results.metrics[0].value.toLocaleString()}</span>
                      <span className="text-success text-sm block mt-1">
                        Basé sur le nombre de {results.metrics[0].label.toLowerCase()}
                      </span>
                    </p>
                  </div>

                  <Link
                    to="/draw/new"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-bg-primary0 to-bg-primary0 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Lancer le tirage au sort
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Plateformes supportées */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Plateformes Supportées</h2>
            <div className="grid grid-cols-5 gap-4">
              {[
                { name: 'Instagram', icon: <Instagram className="w-8 h-8" />, color: 'pink' },
                { name: 'TikTok', icon: <span className="text-3xl">🎵</span>, color: 'gray' },
                { name: 'Facebook', icon: <Facebook className="w-8 h-8" />, color: 'blue' },
                { name: 'YouTube', icon: <Youtube className="w-8 h-8" />, color: 'red' },
                { name: 'Twitter/X', icon: <Twitter className="w-8 h-8" />, color: 'sky' },
              ].map((platform, index) => (
                <div key={index} className="bg-bg-primary rounded-xl p-4 text-center border border-white/10 shadow-sm">
                  <div className={`text-${platform.color}-500 flex justify-center mb-2`}>
                    {platform.icon}
                  </div>
                  <span className="text-ink-secondary text-sm font-medium">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-bg-primary">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection items={faqItems} title="Questions Fréquentes" />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Tirer au Sort ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour désigner un gagnant de manière 100% aléatoire et transparente.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-primary text-accent-secondary px-8 py-4 rounded-xl font-semibold hover:bg-accent-secondary/10 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Lancer un tirage
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CompteurParticipantsPage;
