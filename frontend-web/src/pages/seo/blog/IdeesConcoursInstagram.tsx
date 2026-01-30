import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, ArrowRight, Gift, Heart, Camera, Users, Sparkles } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'intro', title: 'Pourquoi organiser un concours Instagram ?', level: 2 as const },
  { id: 'idee-1', title: '1. Le classique "Like + Commente"', level: 2 as const },
  { id: 'idee-2', title: '2. Le concours photo UGC', level: 2 as const },
  { id: 'idee-3', title: '3. Le quiz en Stories', level: 2 as const },
  { id: 'idee-4', title: '4. Le giveaway collaboratif', level: 2 as const },
  { id: 'idee-5', title: '5. Le concours "Tag un ami"', level: 2 as const },
  { id: 'idee-6', title: '6. Le challenge créatif', level: 2 as const },
  { id: 'idee-7', title: '7. Le concours légende', level: 2 as const },
  { id: 'idee-8', title: '8. Le calendrier de l\'Avent', level: 2 as const },
  { id: 'idee-9', title: '9. Le live giveaway', level: 2 as const },
  { id: 'idee-10', title: '10. Le concours fidélité', level: 2 as const },
  { id: 'conseils', title: 'Conseils pour réussir', level: 2 as const },
  { id: 'faq', title: 'FAQ', level: 2 as const },
];

const faqItems = [
  {
    question: "Quelle est la meilleure idée de concours pour gagner des abonnés ?",
    answer: "Le concours collaboratif avec d'autres créateurs est le plus efficace pour gagner des abonnés. Chaque participant doit suivre tous les comptes partenaires, ce qui multiplie l'exposition. Un giveaway collaboratif bien organisé peut faire gagner 1000+ abonnés en quelques jours."
  },
  {
    question: "Combien de temps doit durer un concours Instagram ?",
    answer: "La durée idéale est de 3 à 7 jours. Plus court, vous n'aurez pas assez de participants. Plus long, l'engagement diminue. Pour les gros lots, vous pouvez aller jusqu'à 14 jours avec des rappels réguliers."
  },
  {
    question: "Quel type de lot attire le plus de participants ?",
    answer: "Les lots universels (cartes cadeaux, tech, argent) attirent le plus de monde mais aussi des participants peu qualifiés. Préférez des lots liés à votre niche pour attirer votre cible idéale. Un lot de 50-100€ de valeur est un bon point de départ."
  },
  {
    question: "Faut-il demander de partager en Story ?",
    answer: "Le partage en Story augmente la visibilité mais ne peut pas être une condition obligatoire (c'est interdit par Instagram). Vous pouvez l'encourager en offrant des chances supplémentaires, mais le vérifier est complexe."
  },
  {
    question: "Comment éviter les participants qui se désabonnent après ?",
    answer: "C'est inévitable, mais vous pouvez limiter ce phénomène en : 1) offrant des lots pertinents pour votre audience, 2) publiant du contenu de qualité pendant le concours, 3) créant une relation avec vos nouveaux abonnés dès leur arrivée."
  },
];

const ideas = [
  {
    id: 'idee-1',
    title: '1. Le classique "Like + Commente"',
    difficulty: 'Facile',
    engagement: '⭐⭐⭐',
    description: 'Le format le plus simple et le plus efficace. Les participants doivent liker votre post et laisser un commentaire pour participer.',
    howTo: [
      'Publiez une photo attractive du lot',
      'Demandez de liker + commenter',
      'Optionnel : suivre le compte',
      'Utilisez Cleack pour le tirage',
    ],
    example: '"🎁 GIVEAWAY! Pour participer : 1️⃣ Like ce post 2️⃣ Commente avec ton emoji préféré 3️⃣ Follow @votrecompte. Tirage le 15/02!"',
    icon: Heart,
    color: 'pink',
  },
  {
    id: 'idee-2',
    title: '2. Le concours photo UGC',
    difficulty: 'Moyen',
    engagement: '⭐⭐⭐⭐⭐',
    description: 'Les participants postent une photo avec votre produit ou sur un thème donné. Génère du contenu authentique et viral.',
    howTo: [
      'Définissez un thème clair',
      'Créez un hashtag dédié',
      'Les participants postent sur leur feed',
      'Sélectionnez les meilleures photos ou tirez au sort',
    ],
    example: '"📸 PHOTO CONTEST! Postez votre meilleur look avec nos produits avec #MonStyleMarque. La plus créative gagne 200€ de shopping!"',
    icon: Camera,
    color: 'purple',
  },
  {
    id: 'idee-3',
    title: '3. Le quiz en Stories',
    difficulty: 'Facile',
    engagement: '⭐⭐⭐⭐',
    description: 'Utilisez les stickers quiz et sondage en Stories. Ultra engageant et fun pour votre audience.',
    howTo: [
      'Créez 3-5 questions liées à votre marque',
      'Utilisez le sticker Quiz',
      'Les bonnes réponses participent au tirage',
      'Annoncez le gagnant en Story',
    ],
    example: '"🧠 QUIZ TIME! Répondez à nos 5 questions sur [thème] dans nos Stories. Toutes les bonnes réponses gagnent une chance!"',
    icon: Sparkles,
    color: 'yellow',
  },
  {
    id: 'idee-4',
    title: '4. Le giveaway collaboratif',
    difficulty: 'Moyen',
    engagement: '⭐⭐⭐⭐⭐',
    description: 'Associez-vous à d\'autres créateurs ou marques pour un gros lot. Chacun expose le concours à son audience.',
    howTo: [
      'Trouvez 2-5 partenaires complémentaires',
      'Chacun contribue au lot',
      'Les participants suivent tous les comptes',
      'Partagez le coût et la visibilité',
    ],
    example: '"🎉 MEGA GIVEAWAY! Avec @compte1 @compte2 @compte3 on vous offre 500€ de cadeaux! Pour participer : follow tous les comptes + commente!"',
    icon: Users,
    color: 'blue',
  },
  {
    id: 'idee-5',
    title: '5. Le concours "Tag un ami"',
    difficulty: 'Facile',
    engagement: '⭐⭐⭐⭐',
    description: 'Les participants taguent un ou deux amis en commentaire. Effet boule de neige garanti.',
    howTo: [
      'Demandez de taguer 1-2 amis max',
      'Chaque commentaire = 1 participation',
      'Les amis tagués découvrent votre compte',
      'Bonus : l\'ami tagué peut aussi participer',
    ],
    example: '"🏷️ TAG & WIN! Tague 2 amis qui méritent ce cadeau en commentaire. Chaque tag = 1 chance de gagner!"',
    icon: Users,
    color: 'green',
  },
  {
    id: 'idee-6',
    title: '6. Le challenge créatif',
    difficulty: 'Difficile',
    engagement: '⭐⭐⭐⭐⭐',
    description: 'Lancez un défi créatif (danse, recette, DIY...). Génère du contenu viral et de l\'engagement massif.',
    howTo: [
      'Créez un concept simple et reproductible',
      'Lancez le hashtag du challenge',
      'Montrez l\'exemple avec votre vidéo',
      'Récompensez les meilleures participations',
    ],
    example: '"💃 CHALLENGE #MonStyleChallenge! Montrez votre transformation avant/après en 15 secondes. Le plus créatif gagne [lot]!"',
    icon: Sparkles,
    color: 'orange',
  },
  {
    id: 'idee-7',
    title: '7. Le concours légende',
    difficulty: 'Facile',
    engagement: '⭐⭐⭐⭐',
    description: 'Postez une photo et demandez aux participants de proposer la meilleure légende. Fun et engageant.',
    howTo: [
      'Choisissez une photo intrigante ou drôle',
      'Demandez des propositions de légendes',
      'La plus drôle/créative gagne',
      'Ou faites un tirage parmi toutes les participations',
    ],
    example: '"✍️ LÉGENDE THIS! Proposez la meilleure légende pour cette photo. La plus drôle gagne [lot]! 😂"',
    icon: Gift,
    color: 'indigo',
  },
  {
    id: 'idee-8',
    title: '8. Le calendrier de l\'Avent',
    difficulty: 'Difficile',
    engagement: '⭐⭐⭐⭐⭐',
    description: 'En décembre, offrez un cadeau chaque jour pendant 24 jours. Fidélise énormément votre audience.',
    howTo: [
      'Préparez 24 lots (petits à gros)',
      'Un tirage par jour du 1er au 24 décembre',
      'Créez l\'anticipation avec des teasers',
      'Demandez de revenir chaque jour',
    ],
    example: '"🎄 CALENDRIER DE L\'AVENT! Chaque jour, un nouveau cadeau à gagner. Aujourd\'hui : [lot]. Like + commente pour participer!"',
    icon: Gift,
    color: 'red',
  },
  {
    id: 'idee-9',
    title: '9. Le live giveaway',
    difficulty: 'Moyen',
    engagement: '⭐⭐⭐⭐⭐',
    description: 'Faites le tirage en direct pendant un Live Instagram. Crée de l\'excitation et booste votre visibilité.',
    howTo: [
      'Annoncez le Live à l\'avance',
      'Les participants commentent pendant le Live',
      'Faites le tirage en direct avec Cleack',
      'Interagissez avec votre audience',
    ],
    example: '"🔴 LIVE GIVEAWAY ce soir à 20h! Soyez présents et commentez pendant le live pour gagner [lot]. On tire au sort en direct!"',
    icon: Camera,
    color: 'red',
  },
  {
    id: 'idee-10',
    title: '10. Le concours fidélité',
    difficulty: 'Moyen',
    engagement: '⭐⭐⭐⭐',
    description: 'Récompensez vos abonnés les plus fidèles. Renforce la communauté et l\'engagement long terme.',
    howTo: [
      'Réservé aux abonnés depuis X mois',
      'Ou à ceux qui ont liké vos X derniers posts',
      'Vérification manuelle ou via engagement',
      'Lot premium pour récompenser la fidélité',
    ],
    example: '"💎 VIP GIVEAWAY! Réservé à nos abonnés depuis + de 3 mois. Commentez avec depuis combien de temps vous nous suivez!"',
    icon: Heart,
    color: 'amber',
  },
];

export const IdeesConcoursInstagram = () => {
  const breadcrumbItems = [
    { name: 'Blog', url: 'https://cleack.io/blog/' },
    { name: '10 Idées de Concours Instagram 2025', url: 'https://cleack.io/blog/idees-concours-instagram-2025/' },
  ];

  return (
    <>
      <SEOHead
        title="10 Idées de Concours Instagram pour 2025 (+ Exemples)"
        description="Inspirez-vous de ces 10 idées originales de jeux concours Instagram pour booster votre engagement et gagner des abonnés. Exemples et conseils inclus."
        keywords="idées concours instagram, jeu concours instagram idées, giveaway instagram idées, concours instagram exemples"
        canonicalUrl="https://cleack.io/blog/idees-concours-instagram-2025/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-12-01',
          dateModified: '2025-01-22',
          author: 'Cleack',
        }}
        faqItems={faqItems}
      />

      <article className="min-h-screen bg-white">
        {/* Hero */}
        <header className="bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-purple-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                💡 Idées & Inspiration
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                10 Idées de Concours Instagram pour 2025
              </h1>
              
              <p className="text-xl text-purple-100 mb-8 max-w-3xl">
                Des idées originales et éprouvées pour organiser des concours Instagram 
                qui génèrent de l'engagement et font grandir votre communauté.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-purple-100">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Par Cleack
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Mis à jour le 22 janvier 2025
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  10 min de lecture
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
                
                <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">
                    🎯 Lancez votre concours
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Une idée en tête ? Faites votre tirage au sort avec Cleack.
                  </p>
                  <Link
                    to="/tirage-au-sort-instagram"
                    className="block w-full text-center bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Créer un tirage
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl">
              {/* Introduction */}
              <section id="intro" className="prose prose-lg max-w-none mb-12">
                <h2>Pourquoi organiser un concours Instagram ?</h2>
                
                <p>
                  Les concours Instagram restent l'une des <strong>stratégies les plus efficaces</strong> pour 
                  développer votre audience en 2025. Un giveaway bien conçu peut :
                </p>

                <ul>
                  <li><strong>Multiplier par 5 à 10</strong> l'engagement de vos publications</li>
                  <li>Faire <strong>gagner des centaines d'abonnés</strong> en quelques jours</li>
                  <li>Créer du <strong>bouche-à-oreille organique</strong> via les tags</li>
                  <li>Générer du <strong>contenu UGC</strong> (User Generated Content)</li>
                  <li>Renforcer la <strong>fidélité</strong> de votre communauté existante</li>
                </ul>

                <p>
                  Voici <strong>10 idées de concours éprouvées</strong>, classées par niveau de difficulté, 
                  avec des exemples concrets que vous pouvez adapter à votre marque.
                </p>
              </section>

              {/* Ideas */}
              {ideas.map((idea) => {
                const Icon = idea.icon;
                const colorClasses = {
                  pink: 'from-pink-50 to-pink-100 border-pink-200',
                  purple: 'from-purple-50 to-purple-100 border-purple-200',
                  yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
                  blue: 'from-blue-50 to-blue-100 border-blue-200',
                  green: 'from-green-50 to-green-100 border-green-200',
                  orange: 'from-orange-50 to-orange-100 border-orange-200',
                  indigo: 'from-indigo-50 to-indigo-100 border-indigo-200',
                  red: 'from-red-50 to-red-100 border-red-200',
                  amber: 'from-amber-50 to-amber-100 border-amber-200',
                };
                
                return (
                  <section key={idea.id} id={idea.id} className="mb-10">
                    <div className={`p-6 bg-gradient-to-br ${colorClasses[idea.color as keyof typeof colorClasses]} border rounded-2xl`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-1">{idea.title}</h2>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">Difficulté : {idea.difficulty}</span>
                            <span className="text-gray-600">Engagement : {idea.engagement}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{idea.description}</p>
                      
                      <div className="bg-white/70 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">📋 Comment faire :</h4>
                        <ol className="text-gray-600 text-sm space-y-1">
                          {idea.howTo.map((step, i) => (
                            <li key={i}>{i + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">💬 Exemple de texte :</h4>
                        <p className="text-gray-600 text-sm italic">"{idea.example}"</p>
                      </div>
                    </div>
                  </section>
                );
              })}

              {/* Tips Section */}
              <section id="conseils" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Conseils pour réussir vos concours
                </h2>

                <div className="space-y-4">
                  {[
                    { title: "Définissez un objectif clair", desc: "Gagner des abonnés ? De l'engagement ? Du UGC ? Adaptez votre format en conséquence." },
                    { title: "Choisissez un lot pertinent", desc: "Un lot lié à votre niche attire une audience qualifiée plutôt que des chasseurs de primes." },
                    { title: "Gardez des règles simples", desc: "Plus c'est simple, plus vous aurez de participants. 2-3 conditions maximum." },
                    { title: "Créez de l'urgence", desc: "Une deadline claire pousse à l'action. 'Plus que 48h pour participer !'" },
                    { title: "Utilisez un outil fiable", desc: "Cleack garantit un tirage équitable et génère un certificat de transparence." },
                    { title: "Annoncez les résultats publiquement", desc: "Montrez le gagnant, remerciez les participants, créez l'anticipation pour le prochain." },
                  ].map((tip, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{tip.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-12">
                <FAQSection 
                  items={faqItems}
                  title="Questions fréquentes sur les concours Instagram"
                />
              </section>

              {/* CTA */}
              <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Une idée vous plaît ?
                </h2>
                <p className="text-purple-100 mb-6 max-w-lg mx-auto">
                  Lancez votre concours Instagram et utilisez Cleack pour un tirage au sort 
                  équitable et transparent.
                </p>
                <Link
                  to="/tirage-au-sort-instagram"
                  className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors"
                >
                  Faire un tirage au sort
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </section>

              {/* Related */}
              <section className="mt-12 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles connexes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/blog/comment-faire-tirage-au-sort-instagram" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-bold text-gray-900 mb-1">Comment faire un tirage Instagram</h3>
                    <p className="text-gray-600 text-sm">Guide étape par étape</p>
                  </Link>
                  <Link to="/blog/regles-jeu-concours-instagram" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-bold text-gray-900 mb-1">Règles des jeux concours</h3>
                    <p className="text-gray-600 text-sm">Cadre légal et bonnes pratiques</p>
                  </Link>
                </div>
              </section>

              {/* Share */}
              <section className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Cet article vous a inspiré ? Partagez-le !</p>
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

export default IdeesConcoursInstagram;
