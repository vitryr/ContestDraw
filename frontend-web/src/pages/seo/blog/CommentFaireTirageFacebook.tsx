import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'types-concours', title: 'Types de concours Facebook', level: 2 as const },
  { id: 'tirage-publication', title: 'Tirage sur une publication', level: 2 as const },
  { id: 'tirage-groupe', title: 'Tirage dans un groupe', level: 2 as const },
  { id: 'regles-facebook', title: 'Règles officielles Facebook', level: 2 as const },
  { id: 'astuces', title: 'Astuces pour maximiser la participation', level: 2 as const },
  { id: 'faq', title: 'FAQ', level: 2 as const },
];

const faqItems = [
  {
    question: "Peut-on faire un tirage au sort sur une page Facebook ?",
    answer: "Oui, vous pouvez organiser un tirage au sort sur les commentaires d'une publication de votre Page Facebook. Cleack récupère automatiquement tous les commentaires pour effectuer un tirage équitable."
  },
  {
    question: "Comment faire un tirage au sort dans un groupe Facebook ?",
    answer: "Le processus est identique : copiez le lien de la publication dans le groupe et collez-le sur Cleack. L'outil récupère les commentaires des membres du groupe qui ont participé."
  },
  {
    question: "Facebook autorise-t-il les concours ?",
    answer: "Oui, Facebook autorise les concours tant que vous respectez leurs règles : pas de demande de partage sur le profil personnel, pas de tag obligatoire sur des photos, et mention que Facebook n'est pas associé au concours."
  },
  {
    question: "Quelle est la différence entre un concours sur Page et sur Groupe ?",
    answer: "Sur une Page, vous touchez vos abonnés et potentiellement un public plus large. Dans un Groupe, vous ciblez une communauté plus engagée mais plus restreinte. Les groupes ont généralement un meilleur taux de participation."
  },
];

export const CommentFaireTirageFacebook = () => {
  const breadcrumbItems = [
    { name: 'Articles', url: 'https://cleack.io/articles/' },
    { name: 'Tirage au sort Facebook', url: 'https://cleack.io/comment-faire-tirage-au-sort-facebook/' },
  ];

  return (
    <>
      <SEOHead
        title="Comment Organiser un Tirage au Sort Facebook (Guide 2025)"
        description="Tout savoir pour réaliser un tirage au sort sur Facebook : pages, groupes, publications. Méthode conforme aux règles de la plateforme."
        keywords="tirage au sort facebook, concours facebook, tirage commentaires facebook, giveaway facebook"
        canonicalUrl="https://cleack.io/comment-faire-tirage-au-sort-facebook/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-10-12',
          dateModified: '2025-01-10',
          author: 'Cleack',
        }}
        faqItems={faqItems}
      />

      <article className="min-h-screen bg-bg-primary">
        <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-blue-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-bg-elevated/20 rounded-full text-sm font-medium mb-4">
                📖 Tutoriel
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Comment Organiser un Tirage au Sort Facebook
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                Guide complet pour faire un tirage au sort sur Facebook : pages, groupes et publications. 
                Méthode simple et conforme aux règles.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-blue-100">
                <span className="flex items-center gap-2"><User className="w-4 h-4" />Par Cleack</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />10 janvier 2025</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />6 min</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <TableOfContents items={tocItems} />
                <div className="mt-6 p-6 bg-accent-secondary/10 rounded-xl">
                  <h3 className="font-bold text-white mb-2">🎯 Tirage Facebook</h3>
                  <p className="text-sm text-ink-secondary mb-4">Faites votre tirage en 2 minutes.</p>
                  <Link to="/tirage-au-sort-facebook" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Lancer un tirage
                  </Link>
                </div>
              </div>
            </aside>

            <main className="flex-1 max-w-3xl">
              <section id="types-concours" className="prose prose-lg prose-invert max-w-none mb-12">
                <h2>Types de concours Facebook</h2>
                <p>Facebook offre plusieurs façons d'organiser un concours :</p>
                
                <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
                  <div className="p-4 bg-accent-secondary/10 rounded-lg">
                    <h3 className="font-bold text-white mb-2">📄 Sur une Page</h3>
                    <p className="text-ink-secondary text-sm">Idéal pour les marques et entreprises. Touchez vos fans et au-delà.</p>
                  </div>
                  <div className="p-4 bg-bg-elevated rounded-lg">
                    <h3 className="font-bold text-white mb-2">👥 Dans un Groupe</h3>
                    <p className="text-ink-secondary text-sm">Parfait pour les communautés. Engagement très élevé.</p>
                  </div>
                </div>
              </section>

              <section id="tirage-publication" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Tirage sur une publication de Page</h2>
                
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Publiez votre concours", desc: "Créez un post attractif avec le lot, les règles et la date de fin." },
                    { step: 2, title: "Attendez les participations", desc: "Laissez 3 à 7 jours pour maximiser les participations." },
                    { step: 3, title: "Copiez le lien du post", desc: "Cliquez sur la date du post > Copier le lien." },
                    { step: 4, title: "Utilisez Cleack", desc: "Collez le lien sur cleack.io/tirage-au-sort-facebook" },
                    { step: 5, title: "Lancez le tirage", desc: "Configurez les filtres et obtenez votre gagnant !" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-4 bg-accent-secondary/10 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{item.title}</h3>
                        <p className="text-ink-secondary text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="tirage-groupe" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Tirage dans un Groupe Facebook</h2>
                
                <p className="text-ink-secondary mb-6">
                  Les groupes Facebook ont généralement un meilleur taux d'engagement. 
                  Le processus est similaire :
                </p>

                <div className="p-4 bg-bg-elevated border border-indigo-200 rounded-lg mb-6">
                  <h4 className="font-bold text-indigo-900 mb-2">💡 Astuce Groupe</h4>
                  <p className="text-indigo-800 text-sm">
                    Dans les groupes privés, seuls les membres peuvent voir et participer. 
                    C'est idéal pour récompenser votre communauté fidèle.
                  </p>
                </div>
              </section>

              <section id="regles-facebook" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Règles officielles Facebook</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Autorisé
                    </h3>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Liker une publication</li>
                      <li>• Commenter</li>
                      <li>• Liker la Page</li>
                      <li>• Rejoindre un groupe</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-error/10 rounded-lg">
                    <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Interdit
                    </h3>
                    <ul className="text-red-800 text-sm space-y-1">
                      <li>• Partage obligatoire sur profil</li>
                      <li>• Tag sur photos</li>
                      <li>• Partage sur le mur d'amis</li>
                      <li>• Fausse affiliation Facebook</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="astuces" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Astuces pour maximiser la participation</h2>
                
                <div className="space-y-3">
                  {[
                    "Publiez aux heures de pointe (12h-14h et 19h-21h)",
                    "Utilisez une image attractive du lot",
                    "Gardez des règles simples (2-3 conditions max)",
                    "Encouragez le partage (sans l'obliger)",
                    "Répondez aux commentaires pour booster l'algo",
                    "Faites des rappels avant la fin",
                  ].map((tip, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg">
                      <CheckCircle className="w-5 h-5 text-accent-secondary flex-shrink-0" />
                      <span className="text-ink-secondary">{tip}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="faq" className="mb-12">
                <FAQSection items={faqItems} title="Questions fréquentes" />
              </section>

              <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Prêt pour votre tirage Facebook ?</h2>
                <p className="text-blue-100 mb-6">Utilisez Cleack pour un tirage gratuit et équitable.</p>
                <Link to="/tirage-au-sort-facebook" className="inline-flex items-center gap-2 bg-bg-primary text-accent-secondary px-8 py-3 rounded-lg font-bold hover:bg-accent-secondary/10 transition-colors">
                  Faire un tirage
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
                  <Link to="/regles-jeu-concours-instagram" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card">
                    <h3 className="font-bold text-white mb-1">Règles des concours</h3>
                    <p className="text-ink-secondary text-sm">Cadre légal</p>
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

export default CommentFaireTirageFacebook;
