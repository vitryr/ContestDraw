import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, ArrowRight, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'introduction', title: 'Pourquoi faire un tirage au sort Instagram ?', level: 2 as const },
  { id: 'methode-cleack', title: 'Méthode 1 : Utiliser Cleack (Recommandé)', level: 2 as const },
  { id: 'methode-manuelle', title: 'Méthode 2 : Tirage manuel', level: 2 as const },
  { id: 'regles-instagram', title: 'Les règles officielles Instagram', level: 2 as const },
  { id: 'filtrer-participants', title: 'Comment filtrer les participants', level: 2 as const },
  { id: 'annoncer-gagnant', title: 'Annoncer le gagnant', level: 2 as const },
  { id: 'erreurs-eviter', title: 'Les erreurs à éviter', level: 2 as const },
  { id: 'faq', title: 'Questions fréquentes', level: 2 as const },
];

const faqItems = [
  {
    question: "Le tirage au sort Instagram est-il gratuit avec Cleack ?",
    answer: "Oui, Cleack propose une version gratuite qui permet de faire jusqu'à 3 tirages par mois. Pour des besoins plus importants, des forfaits payants sont disponibles avec des fonctionnalités avancées comme le filtrage des faux comptes."
  },
  {
    question: "Combien de temps faut-il pour faire un tirage au sort ?",
    answer: "Avec Cleack, le tirage complet prend environ 2 minutes : vous collez le lien de votre publication, choisissez vos filtres, et lancez le tirage. Le résultat est instantané et vérifiable."
  },
  {
    question: "Est-ce légal de faire un tirage au sort sur Instagram ?",
    answer: "Oui, c'est légal en France tant que vous respectez certaines règles : pas d'obligation d'achat pour participer, rédaction d'un règlement, et respect des <a href='/guide/legal-jeu-concours-france'>conditions d'Instagram</a>. Consultez notre guide sur la légalité des jeux concours."
  },
  {
    question: "Comment éviter les faux comptes dans mon tirage ?",
    answer: "Cleack intègre des filtres automatiques pour détecter les comptes suspects : comptes sans photo de profil, comptes privés, comptes avec peu de publications. Vous pouvez aussi exiger des conditions comme suivre votre compte ou mentionner des amis."
  },
  {
    question: "Puis-je faire un tirage sur une Story Instagram ?",
    answer: "Oui ! Cleack permet de faire des tirages au sort sur les <a href='/tirage-stories-instagram'>Stories Instagram</a> en récupérant les réponses. C'est idéal pour des concours courts et engageants."
  },
  {
    question: "Le gagnant est-il informé automatiquement ?",
    answer: "Non, vous devez contacter le gagnant vous-même (par commentaire, DM ou story). Cleack génère un certificat de tirage que vous pouvez partager pour prouver l'équité du processus."
  },
];

export const CommentFaireTirageInstagram = () => {
  const breadcrumbItems = [
    { name: 'Articles', url: 'https://cleack.io/articles/' },
    { name: 'Comment faire un tirage au sort Instagram', url: 'https://cleack.io/comment-faire-tirage-au-sort-instagram/' },
  ];

  const articleDate = {
    published: '2024-09-15',
    modified: '2025-01-20',
  };

  return (
    <>
      <SEOHead
        title="Comment Faire un Tirage au Sort Instagram en 2025 (Guide Complet)"
        description="Apprenez à organiser un tirage au sort Instagram étape par étape. Méthode gratuite, légale et équitable pour désigner un gagnant parmi vos commentaires."
        keywords="comment faire tirage au sort instagram, tirage au sort instagram gratuit, choisir gagnant concours instagram, tirage commentaires instagram"
        canonicalUrl="https://cleack.io/comment-faire-tirage-au-sort-instagram/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: articleDate.published,
          dateModified: articleDate.modified,
          author: 'Cleack',
          image: 'https://cleack.io/images/blog/tirage-instagram-guide.jpg'
        }}
        faqItems={faqItems}
        howToName="Comment faire un tirage au sort Instagram"
        howToDescription="Guide étape par étape pour réaliser un tirage au sort équitable sur Instagram"
        howToSteps={[
          { name: "Préparer votre concours", text: "Publiez votre post Instagram avec les règles de participation (liker, commenter, suivre)" },
          { name: "Copier le lien du post", text: "Sur Instagram, cliquez sur les 3 points > Copier le lien de la publication" },
          { name: "Ouvrir Cleack", text: "Rendez-vous sur cleack.io et collez le lien de votre publication" },
          { name: "Configurer les filtres", text: "Choisissez vos critères : exclure les doublons, les comptes privés, etc." },
          { name: "Lancer le tirage", text: "Cliquez sur 'Lancer le tirage' pour obtenir un gagnant aléatoire" },
          { name: "Annoncer le résultat", text: "Contactez le gagnant et publiez les résultats avec le certificat de tirage" },
        ]}
        howToTotalTime="PT5M"
      />

      <article className="min-h-screen bg-bg-primary">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-bg-primary0 via-purple-600 to-indigo-700 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-pink-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-bg-elevated/20 rounded-full text-sm font-medium mb-4">
                📖 Tutoriel
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Comment Faire un Tirage au Sort Instagram en 2025
              </h1>
              
              <p className="text-xl text-pink-100 mb-8 max-w-3xl">
                Le guide complet et gratuit pour organiser un tirage au sort Instagram équitable, 
                légal et transparent. Apprenez à désigner un gagnant parmi vos commentaires en quelques minutes.
              </p>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-pink-100">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Par Cleack
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Mis à jour le {new Date(articleDate.modified).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  8 min de lecture
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar TOC */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <TableOfContents items={tocItems} />
                
                {/* CTA Box */}
                <div className="mt-6 p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                  <h3 className="font-bold text-white mb-2">
                    🎯 Prêt à faire votre tirage ?
                  </h3>
                  <p className="text-sm text-ink-secondary mb-4">
                    Utilisez Cleack pour un tirage au sort gratuit et équitable.
                  </p>
                  <Link
                    to="/tirage-au-sort-instagram"
                    className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Lancer un tirage
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl">
              {/* Introduction */}
              <section id="introduction" className="prose prose-lg prose-invert max-w-none mb-12">
                <h2>Pourquoi faire un tirage au sort Instagram ?</h2>
                
                <p>
                  Les <strong>concours Instagram</strong> sont l'un des moyens les plus efficaces pour 
                  augmenter votre visibilité, gagner des abonnés et créer de l'engagement avec votre communauté. 
                  En 2025, plus de <strong>70% des marques</strong> utilisent régulièrement des giveaways pour 
                  booster leur présence sur les réseaux sociaux.
                </p>

                <p>
                  Mais comment désigner un gagnant de manière <strong>équitable et transparente</strong> ? 
                  C'est là qu'intervient le tirage au sort. Contrairement à un choix arbitraire, 
                  le tirage garantit à chaque participant une chance égale de gagner.
                </p>

                <div className="bg-accent-secondary/10 border-l-4 border-accent-secondary p-4 rounded-r-lg my-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-accent-secondary flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-white">Le saviez-vous ?</strong>
                      <p className="text-blue-800 mt-1 mb-0">
                        Un concours Instagram bien organisé peut générer jusqu'à <strong>10x plus d'engagement</strong> 
                        qu'une publication classique et faire gagner des centaines de nouveaux abonnés.
                      </p>
                    </div>
                  </div>
                </div>

                <h3>Les avantages du tirage au sort automatisé</h3>
                
                <ul>
                  <li><strong>Équité totale</strong> : chaque participant a exactement les mêmes chances</li>
                  <li><strong>Gain de temps</strong> : fini le comptage manuel des commentaires</li>
                  <li><strong>Transparence</strong> : certificat de tirage vérifiable par tous</li>
                  <li><strong>Filtrage intelligent</strong> : élimination automatique des doublons et faux comptes</li>
                  <li><strong>Conforme à la loi</strong> : respect des obligations légales françaises</li>
                </ul>
              </section>

              {/* Method 1: Cleack */}
              <section id="methode-cleack" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Méthode 1 : Utiliser Cleack (Recommandé)
                </h2>

                <p className="text-ink-secondary mb-6">
                  <Link to="/tirage-au-sort-instagram" className="text-primary-600 font-medium hover:underline">Cleack</Link> est 
                  l'outil de tirage au sort le plus utilisé en France. Gratuit, simple et fiable, 
                  il vous permet de faire un tirage en moins de 2 minutes.
                </p>

                <div className="space-y-4">
                  {[
                    { step: 1, title: "Publiez votre concours sur Instagram", desc: "Créez un post avec une image attractive et des règles claires : liker, commenter, suivre, tagger des amis..." },
                    { step: 2, title: "Attendez la fin du concours", desc: "Laissez le temps aux participants de voir votre publication. En général, 3 à 7 jours suffisent." },
                    { step: 3, title: "Copiez le lien de votre publication", desc: "Sur Instagram, appuyez sur les 3 points (⋯) puis 'Copier le lien'." },
                    { step: 4, title: "Collez le lien sur Cleack", desc: "Rendez-vous sur cleack.io/tirage-au-sort-instagram et collez votre lien." },
                    { step: 5, title: "Configurez vos filtres", desc: "Excluez les doublons, les comptes privés, exigez un follow... Personnalisez selon vos règles." },
                    { step: 6, title: "Lancez le tirage", desc: "Cliquez sur le bouton et obtenez instantanément votre gagnant avec un certificat de tirage." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-4 bg-bg-elevated rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{item.title}</h3>
                        <p className="text-ink-secondary text-sm mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-success/10 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    <div>
                      <strong className="text-green-900">Avantages de Cleack</strong>
                      <ul className="text-green-800 mt-2 space-y-1 text-sm">
                        <li>✓ Gratuit jusqu'à 3 tirages/mois</li>
                        <li>✓ Compatible posts, Reels, Stories</li>
                        <li>✓ Filtrage des faux comptes</li>
                        <li>✓ Certificat de tirage vérifiable</li>
                        <li>✓ Interface en français</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Method 2: Manual */}
              <section id="methode-manuelle" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Méthode 2 : Tirage manuel (déconseillé)
                </h2>

                <p className="text-ink-secondary mb-4">
                  Il est techniquement possible de faire un tirage manuellement, mais cette méthode 
                  présente de nombreux inconvénients :
                </p>

                <div className="bg-bg-elevated border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-yellow-900">Attention aux risques</strong>
                      <ul className="text-yellow-800 mt-2 space-y-1 text-sm">
                        <li>• Très chronophage (compter les commentaires manuellement)</li>
                        <li>• Risque d'erreur humaine</li>
                        <li>• Difficulté à prouver l'équité du tirage</li>
                        <li>• Impossible de filtrer les doublons automatiquement</li>
                        <li>• Pas de certificat officiel</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-ink-secondary">
                  Si vous tenez à faire un tirage manuel, voici les étapes :
                </p>

                <ol className="list-decimal list-inside space-y-2 text-ink-secondary mt-4">
                  <li>Listez tous les commentaires dans un fichier Excel</li>
                  <li>Supprimez les doublons manuellement</li>
                  <li>Attribuez un numéro à chaque participant</li>
                  <li>Utilisez random.org pour générer un nombre aléatoire</li>
                  <li>Filmez le processus pour prouver votre bonne foi</li>
                </ol>
              </section>

              {/* Instagram Rules */}
              <section id="regles-instagram" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Les règles officielles Instagram à respecter
                </h2>

                <p className="text-ink-secondary mb-6">
                  Instagram a des <a href="https://help.instagram.com/179379842258600" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">directives strictes</a> concernant 
                  les concours. Les ignorer peut entraîner la suppression de votre publication ou la suspension de votre compte.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Ce qui est autorisé
                    </h3>
                    <ul className="text-green-800 text-sm space-y-2">
                      <li>• Demander de liker une publication</li>
                      <li>• Demander de commenter</li>
                      <li>• Demander de suivre votre compte</li>
                      <li>• Demander de taguer des amis</li>
                      <li>• Partager en Story (facultatif)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-error/10 rounded-lg">
                    <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Ce qui est interdit
                    </h3>
                    <ul className="text-red-800 text-sm space-y-2">
                      <li>• Demander de partager sur le feed</li>
                      <li>• Offrir des récompenses contre des tags répétés</li>
                      <li>• Utiliser des faux comptes</li>
                      <li>• Faire croire qu'Instagram sponsorise</li>
                      <li>• Obligation d'achat pour participer</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-bg-card rounded-lg">
                  <h3 className="font-bold text-white mb-2">📋 Mentions obligatoires dans votre post</h3>
                  <p className="text-ink-secondary text-sm mb-3">
                    Pour être conforme, votre publication de concours doit inclure :
                  </p>
                  <ul className="text-ink-secondary text-sm space-y-1">
                    <li>✓ Les conditions de participation</li>
                    <li>✓ La date de fin du concours</li>
                    <li>✓ Le lot à gagner</li>
                    <li>✓ La mention "Ce concours n'est pas associé à Instagram"</li>
                    <li>✓ Un lien vers le règlement complet (si applicable)</li>
                  </ul>
                </div>
              </section>

              {/* Filtering participants */}
              <section id="filtrer-participants" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Comment filtrer les participants
                </h2>

                <p className="text-ink-secondary mb-6">
                  Tous les participants ne sont pas légitimes. Voici comment garantir l'équité de votre tirage :
                </p>

                <div className="space-y-4">
                  <div className="p-4 border border-white/10 rounded-lg">
                    <h3 className="font-bold text-white mb-2">🔍 Filtrer les doublons</h3>
                    <p className="text-ink-secondary text-sm">
                      Certains utilisateurs commentent plusieurs fois pour augmenter leurs chances. 
                      Cleack détecte et compte chaque participant une seule fois automatiquement.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-white/10 rounded-lg">
                    <h3 className="font-bold text-white mb-2">🤖 Éliminer les bots</h3>
                    <p className="text-ink-secondary text-sm">
                      Les faux comptes polluent vos concours. Filtrez les comptes sans photo de profil, 
                      sans publications, ou avec des noms suspects.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-white/10 rounded-lg">
                    <h3 className="font-bold text-white mb-2">👥 Vérifier les abonnés</h3>
                    <p className="text-ink-secondary text-sm">
                      Si votre règle impose de suivre votre compte, Cleack peut vérifier que le gagnant 
                      est bien abonné au moment du tirage.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-white/10 rounded-lg">
                    <h3 className="font-bold text-white mb-2">💬 Valider les mentions</h3>
                    <p className="text-ink-secondary text-sm">
                      Si vous demandez de tagger des amis, vérifiez que le commentaire contient 
                      bien des mentions (@) valides.
                    </p>
                  </div>
                </div>
              </section>

              {/* Announcing winner */}
              <section id="annoncer-gagnant" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Annoncer le gagnant : les bonnes pratiques
                </h2>

                <p className="text-ink-secondary mb-6">
                  Une fois le tirage effectué, l'annonce du gagnant est cruciale pour votre crédibilité. 
                  Voici comment procéder :
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-white mb-3">1. Contactez le gagnant en privé</h3>
                    <p className="text-ink-secondary text-sm">
                      Envoyez un DM au gagnant pour l'informer et récupérer ses coordonnées pour 
                      l'envoi du lot. Donnez-lui un délai de réponse (48-72h généralement).
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white mb-3">2. Publiez l'annonce publique</h3>
                    <p className="text-ink-secondary text-sm">
                      Créez une Story ou un post annonçant le gagnant. Taguez-le et remerciez 
                      tous les participants. Partagez le certificat de tirage Cleack pour prouver 
                      la transparence.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white mb-3">3. En cas de non-réponse</h3>
                    <p className="text-ink-secondary text-sm">
                      Si le gagnant ne répond pas dans le délai imparti, vous pouvez relancer le 
                      tirage pour désigner un nouveau gagnant. Précisez cette règle dans votre 
                      règlement initial.
                    </p>
                  </div>
                </div>
              </section>

              {/* Mistakes to avoid */}
              <section id="erreurs-eviter" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Les 7 erreurs à éviter
                </h2>

                <div className="space-y-4">
                  {[
                    { title: "Règles floues", desc: "Des conditions de participation imprécises créent de la confusion et des contestations." },
                    { title: "Pas de date limite", desc: "Sans deadline claire, votre concours peut trainer indéfiniment." },
                    { title: "Lot non défini", desc: "Ne pas préciser exactement ce que le gagnant va recevoir est une source de déception." },
                    { title: "Ignorer la loi", desc: "En France, les jeux concours sont encadrés. Consultez notre guide sur la législation." },
                    { title: "Tirage non transparent", desc: "Sans preuve du tirage, les participants peuvent douter de votre honnêteté." },
                    { title: "Trop de conditions", desc: "Liker + commenter + suivre + tagger 5 amis + partager = trop compliqué, vous perdrez des participants." },
                    { title: "Délai de réponse trop court", desc: "Donnez au moins 48h au gagnant pour répondre avant de relancer le tirage." },
                  ].map((error, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-error/10 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-error/100 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-red-900">{error.title}</h3>
                        <p className="text-red-800 text-sm mt-1">{error.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faq" className="mb-12">
                <FAQSection 
                  items={faqItems}
                  title="Questions fréquentes sur le tirage au sort Instagram"
                />
              </section>

              {/* CTA Section */}
              <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Prêt à lancer votre tirage au sort ?
                </h2>
                <p className="text-primary-100 mb-6 max-w-lg mx-auto">
                  Utilisez Cleack pour un tirage gratuit, équitable et transparent. 
                  Résultat en moins de 2 minutes.
                </p>
                <Link
                  to="/tirage-au-sort-instagram"
                  className="inline-flex items-center gap-2 bg-bg-elevated text-primary-700 px-8 py-3 rounded-lg font-bold hover:bg-bg-elevated transition-colors"
                >
                  Faire un tirage maintenant
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </section>

              {/* Related Articles */}
              <section className="mt-12 pt-12 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Articles connexes
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/regles-jeu-concours-instagram" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">Règles d'un Jeu Concours Instagram</h3>
                    <p className="text-ink-secondary text-sm">Guide légal complet pour vos concours</p>
                  </Link>
                  <Link to="/idees-concours-instagram-2025" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">10 Idées de Concours Instagram 2025</h3>
                    <p className="text-ink-secondary text-sm">Inspiration pour vos prochains giveaways</p>
                  </Link>
                  <Link to="/eviter-faux-comptes-giveaway" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">Éviter les Faux Comptes</h3>
                    <p className="text-ink-secondary text-sm">Techniques pour filtrer les bots</p>
                  </Link>
                  <Link to="/tirage-commentaires-instagram" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">Tirage Commentaires Instagram</h3>
                    <p className="text-ink-secondary text-sm">Outil spécialisé pour les commentaires</p>
                  </Link>
                </div>
              </section>

              {/* Share Section */}
              <section className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-ink-secondary">
                    Cet article vous a été utile ? Partagez-le !
                  </p>
                  <div className="flex items-center gap-3">
                    <button className="p-2 bg-bg-card rounded-lg hover:bg-bg-hover transition-colors">
                      <Share2 className="w-5 h-5 text-ink-secondary" />
                    </button>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </article>
    </>
  );
};

export default CommentFaireTirageInstagram;
