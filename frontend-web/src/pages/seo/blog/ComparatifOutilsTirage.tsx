import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, ArrowRight, Star, Check, X, Award } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'intro', title: 'Pourquoi utiliser un outil de tirage ?', level: 2 as const },
  { id: 'criteres', title: 'Critères de comparaison', level: 2 as const },
  { id: 'cleack', title: '1. Cleack (Notre choix)', level: 2 as const },
  { id: 'wask', title: '2. Wask', level: 2 as const },
  { id: 'app-sorteos', title: '3. App Sorteos', level: 2 as const },
  { id: 'easypromos', title: '4. Easypromos', level: 2 as const },
  { id: 'random-comment-picker', title: '5. Random Comment Picker', level: 2 as const },
  { id: 'tableau-comparatif', title: 'Tableau comparatif', level: 2 as const },
  { id: 'verdict', title: 'Notre verdict', level: 2 as const },
  { id: 'faq', title: 'FAQ', level: 2 as const },
];

const faqItems = [
  {
    question: "Quel est le meilleur outil de tirage au sort gratuit ?",
    answer: "Cleack est le meilleur outil gratuit pour le marché français. Il offre jusqu'à 3 tirages gratuits par mois avec toutes les fonctionnalités essentielles : tirage Instagram, TikTok, Facebook, YouTube, filtrage des doublons et certificat de tirage."
  },
  {
    question: "Faut-il payer pour faire un tirage au sort fiable ?",
    answer: "Non, les outils gratuits comme Cleack offrent un tirage parfaitement fiable et équitable. Les versions payantes ajoutent des fonctionnalités avancées (filtres supplémentaires, plus de tirages, support prioritaire) mais ne rendent pas le tirage plus 'juste'."
  },
  {
    question: "Comment vérifier qu'un tirage au sort est vraiment aléatoire ?",
    answer: "Les outils sérieux comme Cleack génèrent un certificat de tirage avec un identifiant unique, la liste des participants, et le résultat. Ce certificat peut être vérifié sur une page publique, garantissant la transparence."
  },
  {
    question: "Peut-on faire un tirage au sort sur plusieurs réseaux en même temps ?",
    answer: "Certains outils comme Cleack permettent de combiner les participants de plusieurs publications (ex: Instagram + TikTok). C'est utile pour les concours cross-platform."
  },
  {
    question: "Quelle est la différence entre tirage au sort et sélection manuelle ?",
    answer: "Le tirage au sort est 100% aléatoire - chaque participant a exactement les mêmes chances. La sélection manuelle (jury) juge la qualité des participations. Les deux sont légaux mais le tirage est plus équitable et transparent."
  },
];

const tools = [
  {
    id: 'cleack',
    name: 'Cleack',
    logo: '🎯',
    badge: 'Notre choix',
    rating: 4.9,
    description: 'Outil français de référence pour les tirages au sort sur les réseaux sociaux. Simple, gratuit et fiable.',
    pricing: {
      free: '3 tirages/mois',
      paid: 'À partir de 4,99€/mois',
    },
    platforms: ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'Twitter'],
    pros: [
      'Interface 100% en français',
      'Gratuit pour usage occasionnel',
      'Certificat de tirage vérifiable',
      'Filtrage des faux comptes',
      'Support réactif',
      'Compatible tous les réseaux',
    ],
    cons: [
      'Limité à 3 tirages/mois en gratuit',
      'Pas d\'API disponible',
    ],
    bestFor: 'Créateurs français, marques et agences qui veulent un outil simple et fiable.',
    url: '/tirage-au-sort-instagram',
  },
  {
    id: 'wask',
    name: 'Wask',
    logo: '🎲',
    rating: 4.2,
    description: 'Plateforme turque spécialisée dans le marketing Instagram avec fonction de tirage au sort.',
    pricing: {
      free: 'Non',
      paid: 'À partir de 19$/mois',
    },
    platforms: ['Instagram', 'Facebook'],
    pros: [
      'Outils marketing complets',
      'Analytics avancés',
      'Gestion multi-comptes',
    ],
    cons: [
      'Pas de version gratuite',
      'Interface en anglais uniquement',
      'Prix élevé pour le tirage seul',
      'Pas de support TikTok/YouTube',
    ],
    bestFor: 'Agences qui ont besoin d\'outils marketing complets au-delà du tirage.',
  },
  {
    id: 'app-sorteos',
    name: 'App Sorteos',
    logo: '🇪🇸',
    rating: 4.0,
    description: 'Outil espagnol populaire pour les tirages Instagram. Interface simple mais limitée.',
    pricing: {
      free: '1 tirage/jour',
      paid: 'À partir de 4,95€/mois',
    },
    platforms: ['Instagram', 'Facebook', 'YouTube', 'TikTok', 'Twitter'],
    pros: [
      'Version gratuite généreuse',
      'Multi-plateforme',
      'Prix compétitifs',
    ],
    cons: [
      'Interface en espagnol/anglais',
      'Pas de filtrage avancé en gratuit',
      'Support limité',
      'Temps de chargement parfois longs',
    ],
    bestFor: 'Utilisateurs hispanophones ou anglophones avec budget limité.',
  },
  {
    id: 'easypromos',
    name: 'Easypromos',
    logo: '🏆',
    rating: 4.3,
    description: 'Solution professionnelle complète pour les jeux concours et promotions en ligne.',
    pricing: {
      free: 'Essai 14 jours',
      paid: 'À partir de 29€/mois',
    },
    platforms: ['Instagram', 'Facebook', 'Twitter', 'YouTube', 'TikTok'],
    pros: [
      'Solution très complète',
      'Nombreux types de concours',
      'Interface professionnelle',
      'Support multilingue',
    ],
    cons: [
      'Prix élevé',
      'Complexe pour un simple tirage',
      'Courbe d\'apprentissage',
      'Pas de version gratuite permanente',
    ],
    bestFor: 'Grandes entreprises et agences avec besoins complexes.',
  },
  {
    id: 'random-comment-picker',
    name: 'Random Comment Picker',
    logo: '🎰',
    rating: 3.5,
    description: 'Extension Chrome basique pour tirer au sort parmi les commentaires Instagram.',
    pricing: {
      free: 'Oui',
      paid: 'Non',
    },
    platforms: ['Instagram'],
    pros: [
      '100% gratuit',
      'Simple d\'utilisation',
      'Pas de création de compte',
    ],
    cons: [
      'Instagram uniquement',
      'Pas de filtrage',
      'Pas de certificat',
      'Pas de support',
      'Fiabilité incertaine',
    ],
    bestFor: 'Dépannage rapide pour micro-concours sans enjeu.',
  },
];

export const ComparatifOutilsTirage = () => {
  const breadcrumbItems = [
    { name: 'Articles', url: 'https://cleack.io/articles/' },
    { name: 'Comparatif outils de tirage au sort', url: 'https://cleack.io/meilleur-outil-tirage-au-sort/' },
  ];

  return (
    <>
      <SEOHead
        title="Comparatif 2025 : Les Meilleurs Outils de Tirage au Sort"
        description="Analyse détaillée des outils de tirage au sort en ligne. Cleack, Wask, App Sorteos, Easypromos... Lequel choisir pour vos concours ?"
        keywords="meilleur outil tirage au sort, comparatif tirage au sort, cleack vs easypromos, app sorteos avis"
        canonicalUrl="https://cleack.io/meilleur-outil-tirage-au-sort/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-10-25',
          dateModified: '2025-01-25',
          author: 'Cleack',
        }}
        faqItems={faqItems}
      />

      <article className="min-h-screen bg-bg-primary">
        {/* Hero */}
        <header className="bg-gradient-to-br from-bg-primary0 via-amber-600 to-yellow-700 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-orange-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-bg-elevated/20 rounded-full text-sm font-medium mb-4">
                ⚖️ Comparatif
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Comparatif 2025 : Les Meilleurs Outils de Tirage au Sort
              </h1>
              
              <p className="text-xl text-orange-100 mb-8 max-w-3xl">
                Nous avons testé et comparé les principaux outils de tirage au sort du marché. 
                Découvrez lequel correspond le mieux à vos besoins.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-orange-100">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Par Cleack
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Mis à jour le 25 janvier 2025
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  12 min de lecture
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <TableOfContents items={tocItems} />
                
                <div className="mt-6 p-6 bg-gradient-to-br from-bg-primary to-amber-100 rounded-xl">
                  <Award className="w-8 h-8 text-orange-400 mb-3" />
                  <h3 className="font-bold text-white mb-2">
                    Notre recommandation
                  </h3>
                  <p className="text-sm text-ink-secondary mb-4">
                    Cleack est le meilleur choix pour le marché français.
                  </p>
                  <Link
                    to="/tirage-au-sort-instagram"
                    className="block w-full text-center bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Essayer Cleack
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl">
              {/* Introduction */}
              <section id="intro" className="prose prose-lg prose-invert max-w-none mb-12">
                <h2>Pourquoi utiliser un outil de tirage au sort ?</h2>
                
                <p>
                  Faire un tirage au sort manuellement parmi des centaines de commentaires Instagram 
                  est fastidieux et source d'erreurs. Un <strong>outil spécialisé</strong> vous permet de :
                </p>

                <ul>
                  <li><strong>Gagner du temps</strong> : tirage en quelques clics vs heures de travail manuel</li>
                  <li><strong>Garantir l'équité</strong> : algorithme aléatoire certifié</li>
                  <li><strong>Filtrer les participants</strong> : doublons, bots, comptes privés...</li>
                  <li><strong>Prouver la transparence</strong> : certificat vérifiable par tous</li>
                  <li><strong>Gérer plusieurs réseaux</strong> : Instagram, TikTok, Facebook, YouTube</li>
                </ul>

                <p>
                  Mais tous les outils ne se valent pas. Nous avons testé les 5 principaux du marché 
                  pour vous aider à choisir.
                </p>
              </section>

              {/* Criteria */}
              <section id="criteres" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Critères de comparaison
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: '💰', title: 'Prix', desc: 'Gratuité, forfaits, rapport qualité/prix' },
                    { icon: '🌐', title: 'Plateformes', desc: 'Instagram, TikTok, Facebook, YouTube, Twitter' },
                    { icon: '🔧', title: 'Fonctionnalités', desc: 'Filtres, certificat, vérifications' },
                    { icon: '🇫🇷', title: 'Langue', desc: 'Interface et support en français' },
                    { icon: '⚡', title: 'Facilité', desc: 'Prise en main et rapidité d\'exécution' },
                    { icon: '⭐', title: 'Fiabilité', desc: 'Avis utilisateurs et stabilité' },
                  ].map((criteria, index) => (
                    <div key={index} className="p-4 bg-bg-elevated rounded-lg flex items-start gap-3">
                      <span className="text-2xl">{criteria.icon}</span>
                      <div>
                        <h3 className="font-bold text-white">{criteria.title}</h3>
                        <p className="text-ink-secondary text-sm">{criteria.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tools Reviews */}
              {tools.map((tool, index) => (
                <section key={tool.id} id={tool.id} className="mb-10">
                  <div className={`p-6 rounded-2xl border-2 ${index === 0 ? 'border-orange-300 bg-bg-elevated' : 'border-white/10 bg-bg-primary'}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{tool.logo}</span>
                        <div>
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {index + 1}. {tool.name}
                            {tool.badge && (
                              <span className="px-2 py-1 bg-bg-elevated0 text-white text-xs rounded-full">
                                {tool.badge}
                              </span>
                            )}
                          </h2>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-ink-secondary ml-1">{tool.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-ink-secondary mb-4">{tool.description}</p>

                    {/* Pricing */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-bg-primary rounded-lg border border-white/10">
                        <p className="text-xs text-ink-muted mb-1">Gratuit</p>
                        <p className="font-bold text-white">{tool.pricing.free}</p>
                      </div>
                      <div className="p-3 bg-bg-primary rounded-lg border border-white/10">
                        <p className="text-xs text-ink-muted mb-1">Payant</p>
                        <p className="font-bold text-white">{tool.pricing.paid}</p>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="mb-4">
                      <p className="text-sm text-ink-muted mb-2">Plateformes supportées :</p>
                      <div className="flex flex-wrap gap-2">
                        {tool.platforms.map((platform) => (
                          <span key={platform} className="px-2 py-1 bg-bg-card text-ink-secondary text-xs rounded-full">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="font-bold text-success mb-2 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Points forts
                        </p>
                        <ul className="space-y-1">
                          {tool.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-ink-secondary flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-error mb-2 flex items-center gap-1">
                          <X className="w-4 h-4" /> Points faibles
                        </p>
                        <ul className="space-y-1">
                          {tool.cons.map((con, i) => (
                            <li key={i} className="text-sm text-ink-secondary flex items-start gap-2">
                              <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Best For */}
                    <div className="p-3 bg-accent-secondary/10 rounded-lg">
                      <p className="text-sm">
                        <strong className="text-white">Idéal pour :</strong>{' '}
                        <span className="text-blue-800">{tool.bestFor}</span>
                      </p>
                    </div>

                    {/* CTA */}
                    {tool.url && (
                      <Link
                        to={tool.url}
                        className="inline-flex items-center gap-2 mt-4 text-orange-400 font-medium hover:text-orange-400"
                      >
                        Essayer {tool.name}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </section>
              ))}

              {/* Comparison Table */}
              <section id="tableau-comparatif" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Tableau comparatif
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-bg-card">
                        <th className="p-3 text-left font-bold">Critère</th>
                        <th className="p-3 text-center font-bold">Cleack</th>
                        <th className="p-3 text-center font-bold">Wask</th>
                        <th className="p-3 text-center font-bold">App Sorteos</th>
                        <th className="p-3 text-center font-bold">Easypromos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { criteria: 'Version gratuite', cleack: '✅ 3/mois', wask: '❌', appsorteos: '✅ 1/jour', easypromos: '⚠️ Essai' },
                        { criteria: 'Prix mensuel', cleack: '4,99€', wask: '19$', appsorteos: '4,95€', easypromos: '29€' },
                        { criteria: 'Interface FR', cleack: '✅', wask: '❌', appsorteos: '❌', easypromos: '✅' },
                        { criteria: 'Instagram', cleack: '✅', wask: '✅', appsorteos: '✅', easypromos: '✅' },
                        { criteria: 'TikTok', cleack: '✅', wask: '❌', appsorteos: '✅', easypromos: '✅' },
                        { criteria: 'YouTube', cleack: '✅', wask: '❌', appsorteos: '✅', easypromos: '✅' },
                        { criteria: 'Certificat', cleack: '✅', wask: '✅', appsorteos: '⚠️', easypromos: '✅' },
                        { criteria: 'Filtrage bots', cleack: '✅', wask: '✅', appsorteos: '⚠️', easypromos: '✅' },
                        { criteria: 'Note globale', cleack: '⭐ 4.9', wask: '⭐ 4.2', appsorteos: '⭐ 4.0', easypromos: '⭐ 4.3' },
                      ].map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-bg-primary' : 'bg-bg-elevated'}>
                          <td className="p-3 font-medium">{row.criteria}</td>
                          <td className="p-3 text-center">{row.cleack}</td>
                          <td className="p-3 text-center">{row.wask}</td>
                          <td className="p-3 text-center">{row.appsorteos}</td>
                          <td className="p-3 text-center">{row.easypromos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Verdict */}
              <section id="verdict" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Notre verdict
                </h2>

                <div className="bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-10 h-10 text-orange-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Cleack - Le meilleur choix pour la France</h3>
                      <p className="text-orange-400">⭐ 4.9/5 - Recommandé par notre équipe</p>
                    </div>
                  </div>

                  <p className="text-ink-secondary mb-4">
                    Après avoir testé tous ces outils, <strong>Cleack</strong> se démarque clairement 
                    pour le marché français :
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Interface 100% française</strong> - Pas de barrière de langue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Version gratuite généreuse</strong> - 3 tirages/mois sans carte bancaire</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Tous les réseaux</strong> - Instagram, TikTok, Facebook, YouTube, Twitter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Prix imbattable</strong> - À partir de 4,99€/mois pour un usage pro</span>
                    </li>
                  </ul>

                  <Link
                    to="/tirage-au-sort-instagram"
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                  >
                    Essayer Cleack gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-12">
                <FAQSection 
                  items={faqItems}
                  title="Questions fréquentes sur les outils de tirage"
                />
              </section>

              {/* Related */}
              <section className="mt-12 pt-12 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Articles connexes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/cleack-vs-app-sorteos" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">Cleack vs App Sorteos</h3>
                    <p className="text-ink-secondary text-sm">Comparaison détaillée</p>
                  </Link>
                  <Link to="/cleack-vs-easypromos" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">Cleack vs Easypromos</h3>
                    <p className="text-ink-secondary text-sm">Quel outil choisir ?</p>
                  </Link>
                </div>
              </section>

              {/* Share */}
              <section className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-ink-secondary">Ce comparatif vous a aidé ? Partagez-le !</p>
                  <button className="p-2 bg-bg-card rounded-lg hover:bg-bg-hover transition-colors">
                    <Share2 className="w-5 h-5 text-ink-secondary" />
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </article>
    </>
  );
};

export default ComparatifOutilsTirage;
