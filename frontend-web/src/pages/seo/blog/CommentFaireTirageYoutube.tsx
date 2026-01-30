import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, CheckCircle, Play } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'pourquoi', title: 'Pourquoi organiser un giveaway YouTube ?', level: 2 as const },
  { id: 'etapes', title: 'Étapes du tirage au sort', level: 2 as const },
  { id: 'shorts', title: 'Tirage sur YouTube Shorts', level: 2 as const },
  { id: 'regles-youtube', title: 'Règles YouTube à respecter', level: 2 as const },
  { id: 'conseils', title: 'Conseils pour réussir', level: 2 as const },
  { id: 'faq', title: 'FAQ', level: 2 as const },
];

const faqItems = [
  {
    question: "Comment récupérer les commentaires d'une vidéo YouTube ?",
    answer: "Cleack récupère automatiquement tous les commentaires d'une vidéo YouTube. Il vous suffit de copier le lien de la vidéo (depuis la barre d'adresse ou le bouton Partager) et de le coller sur cleack.io."
  },
  {
    question: "Peut-on faire un tirage au sort sur les YouTube Shorts ?",
    answer: "Oui ! Les Shorts ont des commentaires comme les vidéos classiques. Le processus de tirage est identique. Les Shorts génèrent souvent plus de commentaires grâce à leur viralité."
  },
  {
    question: "Le tirage inclut-il les réponses aux commentaires ?",
    answer: "Par défaut, seuls les commentaires principaux sont inclus. Vous pouvez choisir d'inclure ou non les réponses selon vos règles de concours."
  },
  {
    question: "Combien de commentaires Cleack peut-il traiter ?",
    answer: "Cleack peut traiter des milliers de commentaires sans problème. Même pour les vidéos très populaires avec 10 000+ commentaires, le tirage reste instantané."
  },
];

export const CommentFaireTirageYoutube = () => {
  const breadcrumbItems = [
    { name: 'Blog', url: 'https://cleack.io/blog/' },
    { name: 'Tirage au sort YouTube', url: 'https://cleack.io/blog/comment-faire-tirage-au-sort-youtube/' },
  ];

  return (
    <>
      <SEOHead
        title="Tirage au Sort YouTube : Comment Choisir un Gagnant (2025)"
        description="Méthode simple pour sélectionner aléatoirement un gagnant parmi les commentaires YouTube. Compatible avec les Shorts et vidéos classiques."
        keywords="tirage au sort youtube, choisir gagnant youtube, concours youtube, giveaway youtube"
        canonicalUrl="https://cleack.io/blog/comment-faire-tirage-au-sort-youtube/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-11-01',
          dateModified: '2025-01-12',
          author: 'Cleack',
        }}
        faqItems={faqItems}
      />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-red-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                📖 Tutoriel
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Tirage au Sort YouTube : Choisir un Gagnant
              </h1>
              
              <p className="text-xl text-red-100 mb-8 max-w-3xl">
                Guide complet pour organiser un tirage au sort parmi les commentaires de vos vidéos YouTube. 
                Compatible vidéos classiques et Shorts.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-red-100">
                <span className="flex items-center gap-2"><User className="w-4 h-4" />Par Cleack</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />12 janvier 2025</span>
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
                <div className="mt-6 p-6 bg-red-50 rounded-xl">
                  <Play className="w-8 h-8 text-red-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Tirage YouTube</h3>
                  <p className="text-sm text-gray-600 mb-4">Désignez un gagnant en 2 minutes.</p>
                  <Link to="/tirage-au-sort-youtube" className="block w-full text-center bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Lancer un tirage
                  </Link>
                </div>
              </div>
            </aside>

            <main className="flex-1 max-w-3xl">
              <section id="pourquoi" className="prose prose-lg max-w-none mb-12">
                <h2>Pourquoi organiser un giveaway YouTube ?</h2>
                <p>
                  YouTube est la deuxième plateforme de recherche au monde. Organiser un concours 
                  sur vos vidéos permet de :
                </p>
                <ul>
                  <li><strong>Booster les commentaires</strong> et l'engagement de vos vidéos</li>
                  <li><strong>Augmenter le temps de visionnage</strong> (les gens regardent pour participer)</li>
                  <li><strong>Gagner des abonnés</strong> si c'est une condition</li>
                  <li><strong>Remercier votre communauté</strong> existante</li>
                </ul>
              </section>

              <section id="etapes" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Étapes du tirage au sort YouTube</h2>
                
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Publiez votre vidéo concours", desc: "Annoncez le giveaway dans la vidéo et dans la description." },
                    { step: 2, title: "Définissez les règles", desc: "Commenter, s'abonner, liker... Gardez ça simple." },
                    { step: 3, title: "Copiez le lien de la vidéo", desc: "Depuis la barre d'adresse ou le bouton Partager." },
                    { step: 4, title: "Collez sur Cleack", desc: "cleack.io/tirage-au-sort-youtube récupère tous les commentaires." },
                    { step: 5, title: "Filtrez et tirez au sort", desc: "Excluez les doublons et lancez le tirage équitable." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-4 bg-red-50 rounded-lg">
                      <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="shorts" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tirage sur YouTube Shorts</h2>
                
                <p className="text-gray-600 mb-6">
                  Les Shorts génèrent souvent beaucoup plus de commentaires que les vidéos longues. 
                  Le tirage fonctionne exactement de la même manière :
                </p>

                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg">
                  <h4 className="font-bold text-red-900 mb-2">🎬 Astuce Shorts</h4>
                  <p className="text-red-800 text-sm">
                    Les Shorts sont parfaits pour les concours flash (24-48h). Leur viralité 
                    peut générer des milliers de participations rapidement.
                  </p>
                </div>
              </section>

              <section id="regles-youtube" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Règles YouTube à respecter</h2>
                
                <div className="space-y-3">
                  {[
                    "Ne pas demander d'engagement artificiel (like/dislike forcé)",
                    "Mentionner que YouTube n'est pas sponsor du concours",
                    "Respecter les conditions d'utilisation de YouTube",
                    "Ne pas inclure de contenu trompeur ou spam",
                    "Avoir un règlement accessible (description ou lien)",
                  ].map((rule, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-gray-700">{rule}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="conseils" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Conseils pour réussir</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: "🎯", tip: "Annoncez le concours au début de la vidéo" },
                    { icon: "📝", tip: "Répétez les règles dans la description" },
                    { icon: "🔔", tip: "Demandez d'activer la cloche (sans forcer)" },
                    { icon: "📌", tip: "Épinglez un commentaire avec les règles" },
                    { icon: "⏰", tip: "Fixez une deadline claire" },
                    { icon: "🎬", tip: "Filmez le tirage pour plus de transparence" },
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <p className="text-gray-700 text-sm">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="faq" className="mb-12">
                <FAQSection items={faqItems} title="Questions fréquentes" />
              </section>

              <section className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Prêt pour votre tirage YouTube ?</h2>
                <p className="text-red-100 mb-6">Désignez un gagnant parmi vos commentaires en quelques clics.</p>
                <Link to="/tirage-au-sort-youtube" className="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors">
                  Faire un tirage
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </section>

              <section className="mt-12 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles connexes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/blog/comment-faire-tirage-au-sort-tiktok" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <h3 className="font-bold text-gray-900 mb-1">Tirage TikTok</h3>
                    <p className="text-gray-600 text-sm">Guide complet</p>
                  </Link>
                  <Link to="/giveaway-youtube-shorts" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <h3 className="font-bold text-gray-900 mb-1">Giveaway YouTube Shorts</h3>
                    <p className="text-gray-600 text-sm">Outil spécialisé</p>
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

export default CommentFaireTirageYoutube;
