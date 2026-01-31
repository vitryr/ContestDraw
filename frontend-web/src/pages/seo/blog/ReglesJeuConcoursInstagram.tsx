import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, ArrowRight, AlertTriangle, CheckCircle, FileText, Scale } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'intro', title: 'Pourquoi un cadre légal ?', level: 2 as const },
  { id: 'regles-instagram', title: 'Règles officielles Instagram', level: 2 as const },
  { id: 'legislation-france', title: 'Législation française', level: 2 as const },
  { id: 'reglement-obligatoire', title: 'Le règlement obligatoire', level: 2 as const },
  { id: 'mentions-legales', title: 'Mentions légales à inclure', level: 2 as const },
  { id: 'depot-huissier', title: 'Dépôt chez l\'huissier', level: 2 as const },
  { id: 'erreurs-courantes', title: 'Erreurs courantes à éviter', level: 2 as const },
  { id: 'modele-reglement', title: 'Modèle de règlement gratuit', level: 2 as const },
  { id: 'faq', title: 'FAQ', level: 2 as const },
];

const faqItems = [
  {
    question: "Est-il obligatoire d'avoir un règlement pour un concours Instagram ?",
    answer: "Oui, la loi française impose un règlement pour tout jeu concours avec tirage au sort, quel que soit la valeur du lot. Ce règlement doit être accessible aux participants et déposé chez un huissier pour les lots dépassant un certain montant."
  },
  {
    question: "Faut-il déposer le règlement chez un huissier ?",
    answer: "Le dépôt chez huissier n'est plus obligatoire depuis 2014, mais reste fortement recommandé pour les concours avec des lots de valeur importante (>500€) ou pour vous protéger en cas de litige. Le coût varie de 100€ à 300€."
  },
  {
    question: "Peut-on demander un achat pour participer ?",
    answer: "Non, c'est strictement interdit en France. Un jeu concours avec obligation d'achat devient une loterie, ce qui est illégal. Vous devez toujours proposer une participation gratuite, même si elle est moins visible."
  },
  {
    question: "Quelles sont les sanctions en cas de non-respect ?",
    answer: "Les sanctions peuvent aller de l'amende (jusqu'à 300 000€) à des poursuites pénales pour loterie illégale. Instagram peut également supprimer votre publication ou suspendre votre compte en cas de violation de ses règles."
  },
  {
    question: "Un mineur peut-il participer à mon concours ?",
    answer: "Les mineurs peuvent participer avec l'autorisation de leurs parents/tuteurs légaux. Vous devez le préciser dans votre règlement et prévoir une procédure de vérification si nécessaire. Beaucoup de marques limitent la participation aux +18 ans pour simplifier."
  },
  {
    question: "Dois-je payer des impôts sur les lots offerts ?",
    answer: "En France, les gains aux jeux concours sont exonérés d'impôts pour le gagnant. En revanche, l'organisateur doit déclarer la valeur des lots comme charges déductibles s'il s'agit d'une entreprise."
  },
];

export const ReglesJeuConcoursInstagram = () => {
  const breadcrumbItems = [
    { name: 'Articles', url: 'https://cleack.io/articles/' },
    { name: 'Règles d\'un Jeu Concours Instagram', url: 'https://cleack.io/regles-jeu-concours-instagram/' },
  ];

  return (
    <>
      <SEOHead
        title="Règles d'un Jeu Concours Instagram : Guide Légal 2025"
        description="Tout ce qu'il faut savoir sur les règles légales des concours Instagram en France. Règlement, mentions obligatoires, dépôt huissier : le guide complet."
        keywords="règles jeu concours instagram, règlement concours instagram, concours instagram légal, loi jeu concours france"
        canonicalUrl="https://cleack.io/regles-jeu-concours-instagram/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-08-20',
          dateModified: '2025-01-20',
          author: 'Cleack',
        }}
        faqItems={faqItems}
      />

      <article className="min-h-screen bg-bg-primary">
        {/* Hero */}
        <header className="bg-gradient-to-br from-red-600 via-rose-700 to-pink-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-red-100" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-bg-elevated/20 rounded-full text-sm font-medium mb-4">
                ⚖️ Légal & Règles
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Règles d'un Jeu Concours Instagram : Guide Légal 2025
              </h1>
              
              <p className="text-xl text-red-100 mb-8 max-w-3xl">
                Organisez des concours Instagram en toute légalité. Découvrez les règles officielles, 
                la législation française et les mentions obligatoires.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-red-100">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Par Cleack
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Mis à jour le 20 janvier 2025
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  11 min de lecture
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
                
                <div className="mt-6 p-6 bg-gradient-to-br from-bg-primary to-rose-100 rounded-xl">
                  <h3 className="font-bold text-white mb-2">
                    📋 Générer un règlement
                  </h3>
                  <p className="text-sm text-ink-secondary mb-4">
                    Créez un règlement conforme en quelques clics avec notre outil gratuit.
                  </p>
                  <Link
                    to="/outils/generateur-reglement"
                    className="block w-full text-center bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Créer mon règlement
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl">
              {/* Alert Box */}
              <div className="bg-bg-elevated border-l-4 border-yellow-500 p-4 rounded-r-lg mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-yellow-900">Avertissement</strong>
                    <p className="text-yellow-800 mt-1 text-sm">
                      Cet article fournit des informations générales et ne constitue pas un conseil juridique. 
                      Pour des situations complexes, consultez un avocat spécialisé.
                    </p>
                  </div>
                </div>
              </div>

              {/* Introduction */}
              <section id="intro" className="prose prose-lg prose-invert max-w-none mb-12">
                <h2>Pourquoi un cadre légal pour les concours Instagram ?</h2>
                
                <p>
                  Organiser un jeu concours sur Instagram peut sembler simple, mais c'est une activité 
                  <strong> encadrée par la loi française</strong>. Ne pas respecter ces règles peut entraîner :
                </p>

                <ul>
                  <li>Des <strong>sanctions financières</strong> jusqu'à 300 000€</li>
                  <li>Des <strong>poursuites pénales</strong> pour loterie illégale</li>
                  <li>La <strong>suppression de votre compte</strong> Instagram</li>
                  <li>Des <strong>litiges avec les participants</strong></li>
                </ul>

                <p>
                  Ce guide vous explique tout ce que vous devez savoir pour organiser des concours 
                  en toute conformité en 2025.
                </p>
              </section>

              {/* Instagram Rules */}
              <section id="regles-instagram" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-accent-primary/20 rounded-lg">📱</span>
                  Règles officielles Instagram
                </h2>

                <p className="text-ink-secondary mb-6">
                  Instagram a ses propres <a href="https://help.instagram.com/179379842258600" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">directives pour les promotions</a>. 
                  Les voici résumées :
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-success/10 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Autorisé
                    </h3>
                    <ul className="text-green-800 text-sm space-y-2">
                      <li>✓ Demander de liker un post</li>
                      <li>✓ Demander de commenter</li>
                      <li>✓ Demander de suivre votre compte</li>
                      <li>✓ Demander de taguer des amis</li>
                      <li>✓ Encourager le partage en Story</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-error/10 border border-red-200 rounded-lg">
                    <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Interdit
                    </h3>
                    <ul className="text-red-800 text-sm space-y-2">
                      <li>✗ Obliger à partager sur le feed</li>
                      <li>✗ Inciter aux tags excessifs</li>
                      <li>✗ Faire croire qu'Instagram sponsorise</li>
                      <li>✗ Utiliser des faux comptes</li>
                      <li>✗ Manipuler l'engagement</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-bg-card rounded-lg">
                  <h4 className="font-bold text-white mb-2">🔒 Mention obligatoire Instagram</h4>
                  <p className="text-ink-secondary text-sm">
                    Vous devez inclure cette mention dans votre post ou règlement :<br/>
                    <em>"Ce concours n'est pas administré, soutenu ou associé à Instagram/Meta."</em>
                  </p>
                </div>
              </section>

              {/* French Law */}
              <section id="legislation-france" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-accent-secondary/20 rounded-lg">🇫🇷</span>
                  Législation française
                </h2>

                <p className="text-ink-secondary mb-6">
                  En France, les jeux concours sont régis par plusieurs textes de loi. Voici les points essentiels :
                </p>

                <div className="space-y-4">
                  <div className="p-5 border border-white/10 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Scale className="w-6 h-6 text-accent-secondary flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-white mb-2">Jeu concours vs Loterie</h3>
                        <p className="text-ink-secondary text-sm">
                          Un <strong>jeu concours</strong> (sans obligation d'achat) est légal. 
                          Une <strong>loterie</strong> (avec obligation d'achat) est illégale en France 
                          (sauf exceptions comme la Française des Jeux).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border border-white/10 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FileText className="w-6 h-6 text-accent-secondary flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-white mb-2">Règlement obligatoire</h3>
                        <p className="text-ink-secondary text-sm">
                          Tout jeu concours doit avoir un règlement écrit, même simplifié. 
                          Il doit être accessible aux participants sur demande.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border border-white/10 rounded-xl">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-accent-secondary flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-white mb-2">Participation gratuite</h3>
                        <p className="text-ink-secondary text-sm">
                          Vous ne pouvez JAMAIS exiger un achat pour participer. 
                          Si vous proposez des chances supplémentaires contre achat, 
                          une voie de participation gratuite doit exister.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mandatory Rules */}
              <section id="reglement-obligatoire" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-accent-secondary/20 rounded-lg">📝</span>
                  Le règlement obligatoire
                </h2>

                <p className="text-ink-secondary mb-6">
                  Votre règlement de jeu concours doit contenir au minimum les éléments suivants :
                </p>

                <div className="bg-bg-elevated rounded-xl p-6">
                  <ol className="space-y-4">
                    {[
                      { title: "Identité de l'organisateur", desc: "Nom, adresse, SIRET si entreprise" },
                      { title: "Dates du concours", desc: "Date de début et de fin précises" },
                      { title: "Conditions de participation", desc: "Âge minimum, zone géographique, etc." },
                      { title: "Modalités de participation", desc: "Comment participer (liker, commenter...)" },
                      { title: "Description des lots", desc: "Nature et valeur indicative de chaque lot" },
                      { title: "Modalités du tirage au sort", desc: "Date, méthode, nombre de gagnants" },
                      { title: "Notification des gagnants", desc: "Comment et quand ils seront contactés" },
                      { title: "Remise des lots", desc: "Délais et conditions de livraison" },
                      { title: "Données personnelles", desc: "Traitement conforme au RGPD" },
                      { title: "Acceptation du règlement", desc: "La participation vaut acceptation" },
                    ].map((item, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{item.title}</h4>
                          <p className="text-ink-secondary text-sm">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* Legal Mentions */}
              <section id="mentions-legales" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-bg-elevated0/20 rounded-lg">✅</span>
                  Mentions légales à inclure dans votre post
                </h2>

                <p className="text-ink-secondary mb-6">
                  Votre publication Instagram doit contenir certaines informations essentielles :
                </p>

                <div className="bg-gradient-to-br from-bg-primary to-bg-primary border border-pink-200 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-4">Exemple de post conforme :</h4>
                  <div className="bg-bg-primary rounded-lg p-4 text-sm text-ink-secondary">
                    <p className="mb-2">🎁 <strong>CONCOURS</strong> 🎁</p>
                    <p className="mb-2">Gagnez [description du lot] d'une valeur de [X]€ !</p>
                    <p className="mb-2">Pour participer :</p>
                    <p className="mb-1">1️⃣ Suivez @votrecompte</p>
                    <p className="mb-1">2️⃣ Likez ce post</p>
                    <p className="mb-2">3️⃣ Commentez avec votre emoji préféré</p>
                    <p className="mb-2">📅 Fin du concours : [date]</p>
                    <p className="mb-2">🎲 Tirage au sort le [date] via @cleack.io</p>
                    <p className="text-xs text-ink-muted mt-4">
                      Concours ouvert aux résidents français, +18 ans. Règlement complet disponible sur demande. 
                      Ce concours n'est pas administré ou associé à Instagram.
                    </p>
                  </div>
                </div>
              </section>

              {/* Huissier */}
              <section id="depot-huissier" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-amber-100 rounded-lg">⚖️</span>
                  Dépôt chez l'huissier
                </h2>

                <p className="text-ink-secondary mb-6">
                  Le dépôt du règlement chez un huissier de justice n'est plus obligatoire depuis 2014, 
                  mais reste recommandé dans certains cas :
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <h4 className="font-bold text-green-900 mb-2">✓ Recommandé si :</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Lot d'une valeur supérieure à 500€</li>
                      <li>• Grande audience (plus de 10k participants)</li>
                      <li>• Concours sensible ou polémique</li>
                      <li>• Collaboration avec une grande marque</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-bg-card rounded-lg">
                    <h4 className="font-bold text-white mb-2">💰 Coût estimé :</h4>
                    <ul className="text-ink-secondary text-sm space-y-1">
                      <li>• Dépôt simple : 80-150€</li>
                      <li>• Avec constat de tirage : 150-300€</li>
                      <li>• Service en ligne : ~50€</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Common Mistakes */}
              <section id="erreurs-courantes" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-red-500/20 rounded-lg">⚠️</span>
                  Erreurs courantes à éviter
                </h2>

                <div className="space-y-3">
                  {[
                    { error: "Demander de partager sur le feed", consequence: "Violation des règles Instagram, risque de suppression" },
                    { error: "Pas de règlement écrit", consequence: "Non-conformité légale, pas de recours en cas de litige" },
                    { error: "Condition d'achat obligatoire", consequence: "Loterie illégale, sanctions pénales possibles" },
                    { error: "Pas de date de fin", consequence: "Concours perpétuel = problème juridique" },
                    { error: "Oublier la mention Instagram", consequence: "Violation des CGU Instagram" },
                    { error: "Tirage non transparent", consequence: "Contestations et perte de crédibilité" },
                    { error: "Ignorer le RGPD", consequence: "Amendes CNIL jusqu'à 4% du CA" },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-error/10 rounded-lg">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900">{item.error}</h4>
                        <p className="text-error text-sm">{item.consequence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Template */}
              <section id="modele-reglement" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-accent-secondary/20 rounded-lg">📋</span>
                  Modèle de règlement gratuit
                </h2>

                <p className="text-ink-secondary mb-6">
                  Utilisez notre générateur de règlement gratuit pour créer un document conforme 
                  en quelques minutes :
                </p>

                <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6 text-center">
                  <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="font-bold text-white text-xl mb-2">
                    Générateur de Règlement
                  </h3>
                  <p className="text-ink-secondary mb-4">
                    Remplissez un formulaire simple et obtenez un règlement complet 
                    au format PDF, conforme à la législation française.
                  </p>
                  <Link
                    to="/outils/generateur-reglement"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
                  >
                    Créer mon règlement gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-12">
                <FAQSection 
                  items={faqItems}
                  title="Questions fréquentes sur la légalité des concours"
                />
              </section>

              {/* CTA */}
              <section className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Prêt à organiser votre concours ?
                </h2>
                <p className="text-red-100 mb-6 max-w-lg mx-auto">
                  Maintenant que vous connaissez les règles, lancez votre concours Instagram 
                  en toute sérénité avec Cleack.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/outils/generateur-reglement"
                    className="inline-flex items-center justify-center gap-2 bg-bg-primary text-error px-6 py-3 rounded-lg font-bold hover:bg-error/10 transition-colors"
                  >
                    Créer un règlement
                  </Link>
                  <Link
                    to="/tirage-au-sort-instagram"
                    className="inline-flex items-center justify-center gap-2 bg-red-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-900 transition-colors"
                  >
                    Faire un tirage
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </section>

              {/* Related */}
              <section className="mt-12 pt-12 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Articles connexes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/jeu-concours-legal-france" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">Jeu Concours Légal en France</h3>
                    <p className="text-ink-secondary text-sm">Guide juridique complet</p>
                  </Link>
                  <Link to="/modeles-reglement-concours" className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-card transition-colors">
                    <h3 className="font-bold text-white mb-1">Modèles de Règlement</h3>
                    <p className="text-ink-secondary text-sm">Templates gratuits 2025</p>
                  </Link>
                </div>
              </section>

              {/* Share */}
              <section className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-ink-secondary">Partagez ce guide !</p>
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

export default ReglesJeuConcoursInstagram;
