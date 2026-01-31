import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Shield, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'probleme', title: 'Le problème des faux comptes', level: 2 as const },
  { id: 'detecter', title: 'Comment les détecter', level: 2 as const },
  { id: 'filtres-cleack', title: 'Filtres automatiques Cleack', level: 2 as const },
  { id: 'regles-preventives', title: 'Règles préventives', level: 2 as const },
  { id: 'que-faire', title: 'Que faire si le gagnant est suspect ?', level: 2 as const },
  { id: 'faq', title: 'FAQ', level: 2 as const },
];

const faqItems = [
  {
    question: "Comment Cleack détecte-t-il les faux comptes ?",
    answer: "Cleack analyse plusieurs signaux : absence de photo de profil, compte privé, ratio followers/following anormal, peu ou pas de publications, nom d'utilisateur généré aléatoirement, compte créé récemment."
  },
  {
    question: "Peut-on éliminer 100% des bots ?",
    answer: "Aucun système n'est parfait à 100%. Cependant, en combinant les filtres automatiques et des règles de participation bien pensées, vous pouvez éliminer la grande majorité des participants frauduleux (90%+)."
  },
  {
    question: "Faut-il vérifier manuellement le gagnant ?",
    answer: "Oui, il est recommandé de vérifier le profil du gagnant avant d'annoncer les résultats. Si le compte semble suspect, vous pouvez relancer le tirage selon les termes de votre règlement."
  },
  {
    question: "Les concours Instagram attirent-ils beaucoup de bots ?",
    answer: "Les concours populaires peuvent attirer 10-30% de faux comptes. Ce pourcentage augmente si le lot est très attractif ou si les règles de participation sont trop simples."
  },
];

export const EviterFauxComptesGiveaway = () => {
  const breadcrumbItems = [
    { name: 'Articles', url: 'https://cleack.io/articles/' },
    { name: 'Éviter les faux comptes', url: 'https://cleack.io/eviter-faux-comptes-giveaway/' },
  ];

  return (
    <>
      <SEOHead
        title="Comment Éviter les Faux Comptes dans vos Giveaways"
        description="Apprenez à détecter et filtrer les bots et faux comptes pour des tirages au sort équitables. Outils et techniques pour protéger vos concours."
        keywords="faux comptes giveaway, détecter bots instagram, filtrer participants concours, spam giveaway"
        canonicalUrl="https://cleack.io/eviter-faux-comptes-giveaway/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-09-25',
          dateModified: '2025-01-05',
          author: 'Cleack',
        }}
        faqItems={faqItems}
      />

      <article className="min-h-screen bg-bg-primary">
        <header className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-emerald-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-bg-elevated/20 rounded-full text-sm font-medium mb-4">
                🎯 Guide Avancé
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Comment Éviter les Faux Comptes dans vos Giveaways
              </h1>
              
              <p className="text-xl text-emerald-100 mb-8 max-w-3xl">
                Protégez vos concours des bots et comptes frauduleux. 
                Techniques et outils pour des tirages au sort vraiment équitables.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-emerald-100">
                <span className="flex items-center gap-2"><User className="w-4 h-4" />Par Cleack</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />5 janvier 2025</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />8 min</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <TableOfContents items={tocItems} />
                <div className="mt-6 p-6 bg-bg-elevated rounded-xl">
                  <Shield className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="font-bold text-white mb-2">Tirage sécurisé</h3>
                  <p className="text-sm text-ink-secondary mb-4">Cleack filtre automatiquement les faux comptes.</p>
                  <Link to="/tirage-au-sort-instagram" className="block w-full text-center bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    Essayer Cleack
                  </Link>
                </div>
              </div>
            </aside>

            <main className="flex-1 max-w-3xl">
              <section id="probleme" className="prose prose-lg prose-invert max-w-none mb-12">
                <h2>Le problème des faux comptes dans les giveaways</h2>
                
                <p>
                  Les concours Instagram et TikTok attirent malheureusement des <strong>bots</strong> et 
                  des <strong>faux comptes</strong> qui cherchent à gagner sans être de vrais participants. 
                  Ces comptes peuvent représenter jusqu'à <strong>30% des participations</strong> sur 
                  certains giveaways populaires.
                </p>

                <div className="bg-error/10 border-l-4 border-error p-4 rounded-r-lg my-6 not-prose">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div>
                      <strong className="text-red-900">Les risques</strong>
                      <ul className="text-red-800 mt-2 space-y-1 text-sm">
                        <li>• Un faux compte gagne et ne récupère jamais son lot</li>
                        <li>• Vos vrais followers sont frustrés</li>
                        <li>• Perte de crédibilité si le problème est visible</li>
                        <li>• Gaspillage du lot offert</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="detecter" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Eye className="w-7 h-7 text-emerald-400" />
                  Comment détecter les faux comptes
                </h2>

                <p className="text-ink-secondary mb-6">
                  Voici les signaux qui doivent vous alerter :
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { signal: "Pas de photo de profil", desc: "Photo par défaut ou image générique" },
                    { signal: "Compte privé", desc: "Impossible de vérifier l'activité" },
                    { signal: "0-10 publications", desc: "Compte peu ou pas utilisé" },
                    { signal: "Nom aléatoire", desc: "user938472, john_doe_12345..." },
                    { signal: "Ratio suspect", desc: "1000 following / 10 followers" },
                    { signal: "Création récente", desc: "Compte créé juste avant le concours" },
                    { signal: "Bio vide", desc: "Aucune information personnelle" },
                    { signal: "Commentaires génériques", desc: "Emoji seul, phrases copiées" },
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-bg-elevated rounded-lg">
                      <h4 className="font-bold text-white mb-1">{item.signal}</h4>
                      <p className="text-ink-secondary text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="filtres-cleack" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Filtres automatiques Cleack</h2>

                <p className="text-ink-secondary mb-6">
                  Cleack intègre plusieurs filtres pour éliminer automatiquement les participants suspects :
                </p>

                <div className="space-y-4">
                  {[
                    { filter: "Filtre doublons", desc: "Un participant = une chance, même s'il commente 10 fois", status: "Actif par défaut" },
                    { filter: "Filtre photo de profil", desc: "Exclut les comptes sans photo", status: "Optionnel" },
                    { filter: "Filtre comptes privés", desc: "Exclut les comptes qu'on ne peut pas vérifier", status: "Optionnel" },
                    { filter: "Vérification follow", desc: "Vérifie que le participant suit bien votre compte", status: "Premium" },
                    { filter: "Détection patterns bots", desc: "IA qui détecte les comportements automatisés", status: "Premium" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
                      <div>
                        <h4 className="font-bold text-white">{item.filter}</h4>
                        <p className="text-ink-secondary text-sm">{item.desc}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Actif par défaut' ? 'bg-green-200 text-green-800' :
                        item.status === 'Premium' ? 'bg-purple-200 text-purple-800' :
                        'bg-bg-hover text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="regles-preventives" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Règles préventives pour vos concours</h2>

                <p className="text-ink-secondary mb-6">
                  En amont, vous pouvez limiter les faux comptes avec des règles bien pensées :
                </p>

                <div className="space-y-3">
                  {[
                    { tip: "Exigez le follow", desc: "Les bots ne suivent généralement pas les comptes", icon: "✓" },
                    { tip: "Demandez un commentaire personnalisé", desc: "'Dites-nous pourquoi vous voulez gagner' vs 'Commentez un emoji'", icon: "✓" },
                    { tip: "Limitez aux comptes publics", desc: "Précisez dans les règles que seuls les comptes publics participent", icon: "✓" },
                    { tip: "Vérifiez manuellement le gagnant", desc: "Avant d'annoncer, confirmez que le compte est légitime", icon: "✓" },
                    { tip: "Prévoir une clause dans le règlement", desc: "'L'organisateur se réserve le droit d'exclure les comptes suspects'", icon: "✓" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-bg-elevated rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-white">{item.tip}</h4>
                        <p className="text-ink-secondary text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="que-faire" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Que faire si le gagnant est suspect ?</h2>

                <div className="space-y-4">
                  <div className="p-5 border border-white/10 rounded-xl">
                    <h4 className="font-bold text-white mb-2">1. Vérifiez le profil</h4>
                    <p className="text-ink-secondary text-sm">
                      Regardez ses dernières publications, son nombre d'abonnés/abonnements, 
                      et si le compte semble actif et authentique.
                    </p>
                  </div>
                  
                  <div className="p-5 border border-white/10 rounded-xl">
                    <h4 className="font-bold text-white mb-2">2. Contactez-le</h4>
                    <p className="text-ink-secondary text-sm">
                      Envoyez un DM. Un vrai gagnant répondra rapidement. Pas de réponse en 48h = suspect.
                    </p>
                  </div>
                  
                  <div className="p-5 border border-white/10 rounded-xl">
                    <h4 className="font-bold text-white mb-2">3. Relancez le tirage si nécessaire</h4>
                    <p className="text-ink-secondary text-sm">
                      Si votre règlement le prévoit, vous pouvez exclure le compte suspect et 
                      désigner un nouveau gagnant. Documentez votre décision.
                    </p>
                  </div>
                </div>
              </section>

              <section id="faq" className="mb-12">
                <FAQSection items={faqItems} title="Questions fréquentes" />
              </section>

              <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Protégez vos concours</h2>
                <p className="text-emerald-100 mb-6">
                  Utilisez Cleack avec ses filtres anti-bots pour des tirages au sort équitables.
                </p>
                <Link to="/tirage-au-sort-instagram" className="inline-flex items-center gap-2 bg-bg-primary text-emerald-700 px-8 py-3 rounded-lg font-bold hover:bg-bg-elevated transition-colors">
                  Essayer Cleack gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </section>

              <section className="mt-12 pt-12 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Articles connexes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/comment-faire-tirage-au-sort-instagram" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card">
                    <h3 className="font-bold text-white mb-1">Tirage Instagram</h3>
                    <p className="text-ink-secondary text-sm">Guide complet</p>
                  </Link>
                  <Link to="/optimiser-concours-instagram" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card">
                    <h3 className="font-bold text-white mb-1">Optimiser vos concours</h3>
                    <p className="text-ink-secondary text-sm">Conseils avancés</p>
                  </Link>
                </div>
              </section>
            </main>
          </div>
        </div>
      </article>
    </>
  );
};

export default EviterFauxComptesGiveaway;
