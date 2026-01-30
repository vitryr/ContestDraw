import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, ArrowRight, CheckCircle, Video, Zap } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'pourquoi-tiktok', title: 'Pourquoi organiser un giveaway TikTok ?', level: 2 as const },
  { id: 'preparer-concours', title: 'Préparer votre concours TikTok', level: 2 as const },
  { id: 'tirage-cleack', title: 'Faire le tirage avec Cleack', level: 2 as const },
  { id: 'regles-tiktok', title: 'Règles officielles TikTok', level: 2 as const },
  { id: 'formats-concours', title: 'Les meilleurs formats de concours', level: 2 as const },
  { id: 'maximiser-viralite', title: 'Maximiser la viralité', level: 2 as const },
  { id: 'faq', title: 'Questions fréquentes', level: 2 as const },
];

const faqItems = [
  {
    question: "Comment récupérer les commentaires d'une vidéo TikTok ?",
    answer: "Cleack récupère automatiquement les commentaires de votre vidéo TikTok. Il vous suffit de copier le lien de la vidéo et de le coller sur <a href='/tirage-au-sort-tiktok'>cleack.io/tirage-au-sort-tiktok</a>. L'outil extrait tous les commentaires instantanément."
  },
  {
    question: "Puis-je faire un tirage au sort sur un Live TikTok ?",
    answer: "Oui ! Les commentaires des Lives TikTok sont également supportés par Cleack. Vous pouvez faire un tirage parmi les spectateurs qui ont commenté pendant votre Live."
  },
  {
    question: "Combien de participants minimum pour un bon giveaway TikTok ?",
    answer: "Il n'y a pas de minimum technique, mais pour un concours engageant, visez au moins 100-500 participants. Un bon taux de participation sur TikTok est de 2-5% de vos vues."
  },
  {
    question: "Les duets comptent-ils comme participation ?",
    answer: "Les duets créent de nouvelles vidéos, ils ne sont pas comptés comme des commentaires. Si vous voulez inclure les duets, vous devrez les ajouter manuellement ou organiser un concours spécifique."
  },
  {
    question: "Comment éviter les faux comptes sur TikTok ?",
    answer: "Cleack filtre automatiquement les comptes suspects. Vous pouvez aussi exiger que les participants suivent votre compte et aient une photo de profil, ce qui élimine la plupart des bots."
  },
  {
    question: "Faut-il un règlement pour un concours TikTok ?",
    answer: "Oui, la loi française impose un règlement pour tout jeu concours avec tirage au sort. Consultez notre <a href='/guide/reglement-jeu-concours'>générateur de règlement gratuit</a> pour créer le vôtre."
  },
];

export const CommentFaireTirageTiktok = () => {
  const breadcrumbItems = [
    { name: 'Blog', url: 'https://cleack.io/blog/' },
    { name: 'Comment faire un tirage au sort TikTok', url: 'https://cleack.io/blog/comment-faire-tirage-au-sort-tiktok/' },
  ];

  return (
    <>
      <SEOHead
        title="Comment Faire un Tirage au Sort TikTok : Tutoriel 2025"
        description="Guide complet pour organiser un giveaway TikTok réussi. Choisissez un gagnant parmi les commentaires de vos vidéos facilement avec Cleack."
        keywords="comment faire tirage tiktok, giveaway tiktok, tirage au sort tiktok, concours tiktok"
        canonicalUrl="https://cleack.io/blog/comment-faire-tirage-au-sort-tiktok/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-10-05',
          dateModified: '2025-01-15',
          author: 'Cleack',
        }}
        faqItems={faqItems}
        howToName="Comment faire un tirage au sort TikTok"
        howToDescription="Guide pour réaliser un tirage au sort équitable parmi les commentaires TikTok"
        howToSteps={[
          { name: "Publier votre vidéo concours", text: "Créez une vidéo TikTok engageante annonçant votre giveaway" },
          { name: "Définir les règles", text: "Précisez les conditions : commenter, suivre, liker" },
          { name: "Copier le lien de la vidéo", text: "Partagez > Copier le lien de votre vidéo TikTok" },
          { name: "Utiliser Cleack", text: "Collez le lien sur cleack.io/tirage-au-sort-tiktok" },
          { name: "Lancer le tirage", text: "Configurez les filtres et lancez le tirage aléatoire" },
        ]}
      />

      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-cyan-500 via-teal-600 to-emerald-700 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-cyan-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                📖 Tutoriel
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Comment Faire un Tirage au Sort TikTok
              </h1>
              
              <p className="text-xl text-cyan-100 mb-8 max-w-3xl">
                Le guide complet pour organiser un giveaway TikTok viral et choisir 
                équitablement un gagnant parmi vos commentaires.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-cyan-100">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Par Cleack
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Mis à jour le 15 janvier 2025
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  7 min de lecture
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
                
                <div className="mt-6 p-6 bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">
                    🎵 Tirage TikTok instantané
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Sélectionnez un gagnant parmi vos commentaires TikTok en 2 minutes.
                  </p>
                  <Link
                    to="/tirage-au-sort-tiktok"
                    className="block w-full text-center bg-cyan-600 text-white py-2 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                  >
                    Lancer un tirage TikTok
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl">
              {/* Introduction */}
              <section id="pourquoi-tiktok" className="prose prose-lg max-w-none mb-12">
                <h2>Pourquoi organiser un giveaway TikTok ?</h2>
                
                <p>
                  TikTok est devenu <strong>la plateforme incontournable</strong> pour toucher 
                  une audience jeune et engagée. Avec plus de <strong>1 milliard d'utilisateurs actifs</strong>, 
                  c'est le terrain de jeu idéal pour organiser des concours viraux.
                </p>

                <div className="grid md:grid-cols-3 gap-4 not-prose my-8">
                  <div className="p-4 bg-cyan-50 rounded-lg text-center">
                    <Video className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-900">10x plus d'engagement</p>
                    <p className="text-sm text-gray-600">vs Instagram</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg text-center">
                    <Zap className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-900">Viralité naturelle</p>
                    <p className="text-sm text-gray-600">Algorithme favorable</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-900">Audience 16-30 ans</p>
                    <p className="text-sm text-gray-600">Très réactive</p>
                  </div>
                </div>

                <h3>Les avantages d'un giveaway TikTok</h3>
                
                <ul>
                  <li><strong>Viralité exponentielle</strong> : l'algorithme TikTok pousse les vidéos engageantes</li>
                  <li><strong>Coût d'acquisition faible</strong> : un bon giveaway peut atteindre des millions de vues gratuitement</li>
                  <li><strong>Engagement authentique</strong> : les utilisateurs TikTok commentent et partagent naturellement</li>
                  <li><strong>Conversion rapide</strong> : de la découverte au follow en quelques secondes</li>
                </ul>
              </section>

              {/* Prepare Contest */}
              <section id="preparer-concours" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Préparer votre concours TikTok
                </h2>

                <p className="text-gray-600 mb-6">
                  Un bon giveaway TikTok se prépare. Voici les étapes clés avant de publier votre vidéo :
                </p>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-3">1. Choisir un lot attractif</h3>
                    <p className="text-gray-600 mb-3">
                      Le lot doit correspondre à votre audience. Pour TikTok, privilégiez :
                    </p>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Tech : AirPods, PS5, iPhone</li>
                      <li>• Mode : cartes cadeaux, sneakers</li>
                      <li>• Beauté : coffrets makeup, soins</li>
                      <li>• Expériences : voyages, concerts</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-3">2. Définir des règles simples</h3>
                    <p className="text-gray-600 mb-3">
                      Sur TikTok, la simplicité est reine. Évitez les règles complexes :
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800 text-sm">✓ Recommandé</p>
                        <ul className="text-green-700 text-xs mt-2 space-y-1">
                          <li>Follow + commentaire</li>
                          <li>Tag 1-2 amis</li>
                          <li>Like la vidéo</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="font-medium text-red-800 text-sm">✗ À éviter</p>
                        <ul className="text-red-700 text-xs mt-2 space-y-1">
                          <li>Duet obligatoire</li>
                          <li>Tag 5+ amis</li>
                          <li>Conditions multiples</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-3">3. Créer une vidéo engageante</h3>
                    <p className="text-gray-600 mb-3">
                      Votre vidéo doit capter l'attention en moins de 3 secondes :
                    </p>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Hook accrocheur : "Je donne un iPhone à l'un de vous..."</li>
                      <li>• Montrez le lot visuellement</li>
                      <li>• Expliquez les règles clairement</li>
                      <li>• Ajoutez un texte récapitulatif à l'écran</li>
                      <li>• Utilisez une musique tendance</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tirage with Cleack */}
              <section id="tirage-cleack" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Faire le tirage avec Cleack
                </h2>

                <p className="text-gray-600 mb-6">
                  Une fois votre concours terminé, utilisez Cleack pour désigner le gagnant équitablement :
                </p>

                <div className="space-y-4">
                  {[
                    { step: 1, title: "Copiez le lien de votre vidéo", desc: "Sur TikTok, appuyez sur Partager puis 'Copier le lien'" },
                    { step: 2, title: "Rendez-vous sur Cleack", desc: "Ouvrez cleack.io/tirage-au-sort-tiktok dans votre navigateur" },
                    { step: 3, title: "Collez votre lien", desc: "Cleack récupère automatiquement tous les commentaires" },
                    { step: 4, title: "Appliquez les filtres", desc: "Excluez les doublons, vérifiez les follows si nécessaire" },
                    { step: 5, title: "Lancez le tirage", desc: "Cliquez et obtenez votre gagnant avec certificat" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-4 bg-cyan-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-cyan-100 rounded-lg">
                  <p className="text-cyan-900 text-sm">
                    <strong>💡 Astuce :</strong> Filmez votre écran pendant le tirage et partagez 
                    la vidéo en Story pour prouver la transparence du processus !
                  </p>
                </div>
              </section>

              {/* TikTok Rules */}
              <section id="regles-tiktok" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Règles officielles TikTok pour les concours
                </h2>

                <p className="text-gray-600 mb-6">
                  TikTok a des <a href="https://www.tiktok.com/community-guidelines" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">règles communautaires</a> qui 
                  encadrent les concours. Respectez-les pour éviter toute sanction :
                </p>

                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h3 className="font-bold text-green-900">✓ Autorisé</h3>
                    <ul className="text-green-800 text-sm mt-2 space-y-1">
                      <li>• Demander des likes et commentaires</li>
                      <li>• Demander de suivre votre compte</li>
                      <li>• Organiser des concours créatifs</li>
                      <li>• Collaborer avec des marques (avec mention)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border-l-4 border-red-500 bg-red-50">
                    <h3 className="font-bold text-red-900">✗ Interdit</h3>
                    <ul className="text-red-800 text-sm mt-2 space-y-1">
                      <li>• Promettre des gains contre de l'argent</li>
                      <li>• Spam ou manipulation de l'engagement</li>
                      <li>• Fausses promesses ou arnaques</li>
                      <li>• Utiliser des bots ou faux comptes</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">📋 Mentions obligatoires</h3>
                  <p className="text-gray-600 text-sm">
                    Dans votre vidéo ou description, précisez :
                  </p>
                  <ul className="text-gray-700 text-sm mt-2 space-y-1">
                    <li>• Les dates du concours</li>
                    <li>• Le lot exact à gagner</li>
                    <li>• Les conditions de participation</li>
                    <li>• "Concours non sponsorisé par TikTok"</li>
                  </ul>
                </div>
              </section>

              {/* Contest Formats */}
              <section id="formats-concours" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Les meilleurs formats de concours TikTok
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">🎵 Concours commentaire</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Le plus simple : demandez aux gens de commenter pour participer.
                    </p>
                    <p className="text-cyan-600 text-xs font-medium">Idéal pour débuter</p>
                  </div>
                  
                  <div className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">🤝 Concours tag</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Les participants taguent 1-2 amis pour multiplier la visibilité.
                    </p>
                    <p className="text-cyan-600 text-xs font-medium">Maximise la portée</p>
                  </div>
                  
                  <div className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">💬 Concours créatif</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Demandez une réponse originale : "Dites-moi pourquoi vous méritez ce lot"
                    </p>
                    <p className="text-cyan-600 text-xs font-medium">Engagement qualité</p>
                  </div>
                  
                  <div className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">🎬 Concours duet</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Les participants font un duet avec votre vidéo (plus complexe à gérer).
                    </p>
                    <p className="text-cyan-600 text-xs font-medium">UGC viral</p>
                  </div>
                </div>
              </section>

              {/* Maximize Virality */}
              <section id="maximiser-viralite" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Maximiser la viralité de votre giveaway
                </h2>

                <div className="space-y-4">
                  {[
                    { tip: "Publiez aux heures de pointe", desc: "18h-21h en semaine, toute la journée le week-end" },
                    { tip: "Utilisez les hashtags tendance", desc: "#giveaway #concours #gratuit + hashtags de votre niche" },
                    { tip: "Répondez aux commentaires", desc: "L'algorithme booste les vidéos avec beaucoup d'interactions" },
                    { tip: "Faites des rappels", desc: "Publiez des vidéos de rappel avant la fin du concours" },
                    { tip: "Collaborez avec d'autres créateurs", desc: "Les duos et collabs multiplient votre audience" },
                    { tip: "Annoncez le gagnant en vidéo", desc: "Crée de l'anticipation pour vos prochains concours" },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.tip}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faq" className="mb-12">
                <FAQSection 
                  items={faqItems}
                  title="Questions fréquentes sur les tirages TikTok"
                />
              </section>

              {/* CTA Section */}
              <section className="bg-gradient-to-br from-cyan-600 to-teal-700 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Prêt à lancer votre giveaway TikTok ?
                </h2>
                <p className="text-cyan-100 mb-6 max-w-lg mx-auto">
                  Utilisez Cleack pour un tirage au sort équitable et transparent. 
                  Gratuit et instantané.
                </p>
                <Link
                  to="/tirage-au-sort-tiktok"
                  className="inline-flex items-center gap-2 bg-white text-cyan-700 px-8 py-3 rounded-lg font-bold hover:bg-cyan-50 transition-colors"
                >
                  Faire un tirage TikTok
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </section>

              {/* Related Articles */}
              <section className="mt-12 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Articles connexes
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/blog/idees-giveaway-tiktok" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-bold text-gray-900 mb-1">Idées de Giveaway TikTok</h3>
                    <p className="text-gray-600 text-sm">12 concepts viraux pour vos concours</p>
                  </Link>
                  <Link to="/blog/comment-faire-tirage-au-sort-instagram" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-bold text-gray-900 mb-1">Tirage au Sort Instagram</h3>
                    <p className="text-gray-600 text-sm">Guide complet pour Instagram</p>
                  </Link>
                </div>
              </section>

              {/* Share */}
              <section className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Partagez cet article !</p>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
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

export default CommentFaireTirageTiktok;
