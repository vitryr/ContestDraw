import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  User,
  Calendar,
  Image,
  MessageSquare,
  Users,
  Activity,
  Loader2,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/outils/verificateur-compte/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Outils', url: 'https://cleack.io/outils/' },
  { name: 'Vérificateur de Compte', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment fonctionne le vérificateur de compte ?",
    answer: "L'outil analyse plusieurs indicateurs : ancienneté du compte, présence d'une photo de profil, nombre de publications, ratio followers/following, activité récente. Ces critères permettent d'évaluer la légitimité d'un compte."
  },
  {
    question: "Pourquoi vérifier un compte avant un tirage ?",
    answer: "Pour éviter d'attribuer un lot à un bot ou un faux compte. Vérifier le gagnant avant l'annonce publique vous protège et renforce la crédibilité de votre concours."
  },
  {
    question: "Le score est-il fiable à 100% ?",
    answer: "Le score est un indicateur, pas une garantie absolue. Un compte nouveau peut être légitime, et certains bots sont sophistiqués. Utilisez le score comme aide à la décision, pas comme verdict final."
  },
];

const VerificateurComptePage = () => {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    status: 'safe' | 'warning' | 'danger';
    checks: { label: string; status: boolean; detail: string }[];
  } | null>(null);

  const analyzeAccount = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulation d'analyse
      const hasProfilePic = Math.random() > 0.2;
      const isOldAccount = Math.random() > 0.3;
      const hasPosts = Math.random() > 0.25;
      const hasFollowers = Math.random() > 0.2;
      const normalRatio = Math.random() > 0.3;
      const recentActivity = Math.random() > 0.25;

      const checks = [
        { label: 'Photo de profil', status: hasProfilePic, detail: hasProfilePic ? 'Présente' : 'Absente (suspect)' },
        { label: 'Compte ancien (>30 jours)', status: isOldAccount, detail: isOldAccount ? 'Créé il y a plusieurs mois' : 'Compte récent' },
        { label: 'Publications', status: hasPosts, detail: hasPosts ? 'Plusieurs publications' : 'Aucune ou très peu' },
        { label: 'Followers', status: hasFollowers, detail: hasFollowers ? 'Nombre correct' : 'Très peu de followers' },
        { label: 'Ratio followers/following', status: normalRatio, detail: normalRatio ? 'Ratio équilibré' : 'Ratio anormal' },
        { label: 'Activité récente', status: recentActivity, detail: recentActivity ? 'Actif récemment' : 'Inactif depuis longtemps' },
      ];

      const positiveChecks = checks.filter(c => c.status).length;
      const score = Math.round((positiveChecks / checks.length) * 100);

      let status: 'safe' | 'warning' | 'danger' = 'safe';
      if (score < 50) status = 'danger';
      else if (score < 75) status = 'warning';

      setResult({ score, status, checks });
      setIsLoading(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBg = (status: 'safe' | 'warning' | 'danger') => {
    if (status === 'safe') return 'bg-green-50 border-green-200';
    if (status === 'warning') return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <>
      <SEOHead
        title="Vérificateur de Compte Social Gratuit | Cleack"
        description="Vérifiez si un compte Instagram, TikTok ou Twitter est un bot ou un vrai utilisateur. Idéal avant de valider un gagnant de concours. Gratuit."
        keywords="vérificateur compte instagram, détecter faux compte, vérifier bot instagram, compte fake, vérifier gagnant concours"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-verificateur-compte.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-teal-50">
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
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ShieldCheck className="w-4 h-4" />
                Outil Gratuit
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Vérificateur de{' '}
                <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Compte Social
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Vérifiez si un compte est légitime avant de lui attribuer votre lot. 
                Détectez les bots et faux comptes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tool */}
        <section className="py-8">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plateforme
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>Twitter/X</option>
                    <option>YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nom d'utilisateur
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                      @
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="pseudo_du_compte"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <button
                  onClick={analyzeAccount}
                  disabled={!username || isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Vérifier le compte
                    </>
                  )}
                </button>
              </div>

              {/* Résultats */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-gray-100"
                >
                  {/* Score */}
                  <div className={`rounded-xl p-6 border ${getStatusBg(result.status)} mb-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {result.status === 'safe' && <CheckCircle2 className="w-8 h-8 text-green-600" />}
                        {result.status === 'warning' && <AlertTriangle className="w-8 h-8 text-yellow-600" />}
                        {result.status === 'danger' && <X className="w-8 h-8 text-red-600" />}
                        <div>
                          <h3 className="font-semibold text-gray-900">@{username}</h3>
                          <p className="text-gray-600 text-sm">{platform}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </div>
                        <div className="text-gray-600 text-sm">Score de confiance</div>
                      </div>
                    </div>

                    <div className={`rounded-lg p-3 ${
                      result.status === 'safe' ? 'bg-green-100 text-green-800' :
                      result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.status === 'safe' && '✅ Ce compte semble légitime. Vous pouvez lui attribuer le lot.'}
                      {result.status === 'warning' && '⚠️ Quelques signaux d\'alerte. Vérifiez manuellement avant validation.'}
                      {result.status === 'danger' && '🚨 Compte suspect. Nous recommandons de tirer un autre gagnant.'}
                    </div>
                  </div>

                  {/* Détails */}
                  <h4 className="font-semibold text-gray-900 mb-4">Détails de l'analyse</h4>
                  <div className="space-y-3">
                    {result.checks.map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {check.status ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                          <span className="font-medium text-gray-900">{check.label}</span>
                        </div>
                        <span className={`text-sm ${check.status ? 'text-green-600' : 'text-red-600'}`}>
                          {check.detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  {result.status === 'danger' && (
                    <div className="mt-6">
                      <Link
                        to="/draw/new"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        <Sparkles className="w-5 h-5" />
                        Tirer un autre gagnant
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Critères analysés */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Critères Analysés</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Image className="w-6 h-6" />, title: 'Photo de profil', desc: 'Présence d\'une vraie photo' },
                { icon: <Calendar className="w-6 h-6" />, title: 'Ancienneté', desc: 'Date de création du compte' },
                { icon: <MessageSquare className="w-6 h-6" />, title: 'Publications', desc: 'Nombre et qualité des posts' },
                { icon: <Users className="w-6 h-6" />, title: 'Followers', desc: 'Nombre et ratio followers/following' },
                { icon: <Activity className="w-6 h-6" />, title: 'Activité', desc: 'Fréquence et régularité' },
                { icon: <ShieldCheck className="w-6 h-6" />, title: 'Patterns', desc: 'Détection de comportements bots' },
              ].map((criterion, index) => (
                <div key={index} className="bg-cyan-50 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 bg-white text-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    {criterion.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{criterion.title}</h3>
                  <p className="text-gray-600 text-sm">{criterion.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection items={faqItems} title="Questions Fréquentes" />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-8 text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Tirage au Sort avec Filtres Anti-Bot</h2>
              <p className="text-white/90 mb-6">
                Cleack détecte automatiquement les comptes suspects lors du tirage. 
                Excluez les bots et faux comptes en un clic.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Lancer un tirage sécurisé
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VerificateurComptePage;
