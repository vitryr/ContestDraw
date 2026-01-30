import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Scale, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';

const tocItems = [
  { id: 'definition', title: 'Définition légale', level: 2 as const },
  { id: 'jeu-vs-loterie', title: 'Jeu concours vs Loterie', level: 2 as const },
  { id: 'obligations', title: 'Obligations de l\'organisateur', level: 2 as const },
  { id: 'reglement', title: 'Le règlement obligatoire', level: 2 as const },
  { id: 'rgpd', title: 'RGPD et données personnelles', level: 2 as const },
  { id: 'sanctions', title: 'Sanctions en cas de non-respect', level: 2 as const },
  { id: 'faq', title: 'FAQ', level: 2 as const },
];

const faqItems = [
  {
    question: "Quelle est la différence entre un jeu concours et une loterie ?",
    answer: "Un jeu concours est gratuit (pas d'obligation d'achat) et repose sur le hasard ou l'adresse. Une loterie exige une contrepartie financière et est illégale en France sauf exceptions (FDJ, associations). Le critère clé est l'absence de contrepartie."
  },
  {
    question: "Faut-il un règlement pour un petit concours Instagram ?",
    answer: "Oui, la loi française impose un règlement pour tout jeu concours, quelle que soit la valeur du lot ou le nombre de participants. Un règlement simplifié peut suffire pour les petits concours."
  },
  {
    question: "Peut-on organiser un concours sans être une entreprise ?",
    answer: "Oui, un particulier peut organiser un jeu concours. Cependant, si l'activité devient régulière ou lucrative, elle pourrait être requalifiée en activité commerciale."
  },
  {
    question: "Les concours sur les réseaux sociaux sont-ils soumis aux mêmes règles ?",
    answer: "Oui, un concours Instagram, TikTok ou Facebook est soumis à la législation française si l'organisateur ou les participants sont en France. Les règles des plateformes s'ajoutent aux obligations légales."
  },
  {
    question: "Quels sont les risques d'un concours non conforme ?",
    answer: "Les sanctions peuvent inclure : amendes jusqu'à 300 000€, poursuites pénales pour loterie illégale, annulation du concours, et atteinte à la réputation. Mieux vaut se conformer dès le départ."
  },
];

export const JeuConcoursLegalFrance = () => {
  const breadcrumbItems = [
    { name: 'Blog', url: 'https://cleack.io/blog/' },
    { name: 'Jeu Concours Légal en France', url: 'https://cleack.io/blog/jeu-concours-legal-france/' },
  ];

  return (
    <>
      <SEOHead
        title="Jeu Concours en France : Cadre Légal Complet 2025"
        description="Le guide juridique des jeux concours en France. Loteries, tirages au sort, règlements : restez conforme à la loi française."
        keywords="jeu concours légal france, loi jeu concours, règlementation concours france, loterie illégale"
        canonicalUrl="https://cleack.io/blog/jeu-concours-legal-france/"
        ogType="article"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-07-15',
          dateModified: '2025-01-15',
          author: 'Cleack',
        }}
        faqItems={faqItems}
      />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-slate-300" />
            
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                ⚖️ Légal
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Jeu Concours en France : Cadre Légal Complet 2025
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 max-w-3xl">
                Tout ce que vous devez savoir sur la législation française des jeux concours. 
                Évitez les sanctions et organisez vos concours en toute légalité.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-300">
                <span className="flex items-center gap-2"><User className="w-4 h-4" />Par Cleack</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />15 janvier 2025</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />15 min</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <TableOfContents items={tocItems} />
                <div className="mt-6 p-6 bg-slate-100 rounded-xl">
                  <Scale className="w-8 h-8 text-slate-700 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Créer un règlement</h3>
                  <p className="text-sm text-gray-600 mb-4">Générez un règlement conforme gratuitement.</p>
                  <Link to="/outils/generateur-reglement" className="block w-full text-center bg-slate-700 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                    Générer un règlement
                  </Link>
                </div>
              </div>
            </aside>

            <main className="flex-1 max-w-3xl">
              {/* Warning */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <strong className="text-yellow-900">Avertissement</strong>
                    <p className="text-yellow-800 mt-1 text-sm">
                      Cet article fournit des informations générales et ne constitue pas un conseil juridique. 
                      Pour des cas complexes, consultez un avocat spécialisé.
                    </p>
                  </div>
                </div>
              </div>

              <section id="definition" className="prose prose-lg max-w-none mb-12">
                <h2>Définition légale d'un jeu concours</h2>
                <p>
                  En droit français, un <strong>jeu concours</strong> est une opération promotionnelle 
                  gratuite qui permet de gagner des lots sans contrepartie financière obligatoire. 
                  Il se distingue de la loterie par l'absence d'obligation d'achat.
                </p>

                <p>
                  Les textes de référence sont :
                </p>
                <ul>
                  <li>La <strong>loi du 21 mai 1836</strong> portant prohibition des loteries</li>
                  <li>L'<strong>article L. 121-36</strong> du Code de la consommation</li>
                  <li>La <strong>jurisprudence</strong> de la Cour de cassation</li>
                </ul>
              </section>

              <section id="jeu-vs-loterie" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Scale className="w-7 h-7 text-slate-600" />
                  Jeu concours vs Loterie : la distinction cruciale
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="font-bold text-green-900 mb-3">✅ Jeu concours (LÉGAL)</h3>
                    <ul className="text-green-800 text-sm space-y-2">
                      <li>• Participation <strong>gratuite</strong></li>
                      <li>• Pas d'obligation d'achat</li>
                      <li>• Tirage au sort ou adresse/créativité</li>
                      <li>• Règlement obligatoire</li>
                      <li>• Exemple : "Commentez pour gagner"</li>
                    </ul>
                  </div>
                  
                  <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                    <h3 className="font-bold text-red-900 mb-3">❌ Loterie (ILLÉGAL)</h3>
                    <ul className="text-red-800 text-sm space-y-2">
                      <li>• Participation <strong>payante</strong></li>
                      <li>• Obligation d'achat ou sacrifice financier</li>
                      <li>• Basé uniquement sur le hasard</li>
                      <li>• Interdit sauf exceptions (FDJ)</li>
                      <li>• Exemple : "Achetez pour tenter de gagner"</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">🔍 Le test du gratuit</h4>
                  <p className="text-blue-800 text-sm">
                    Pour savoir si votre opération est légale, posez-vous la question : 
                    "Peut-on participer gratuitement, sans rien acheter ?" Si oui, c'est un jeu concours légal.
                  </p>
                </div>
              </section>

              <section id="obligations" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileText className="w-7 h-7 text-slate-600" />
                  Obligations de l'organisateur
                </h2>

                <div className="space-y-4">
                  {[
                    { title: "Rédiger un règlement", desc: "Document obligatoire décrivant les modalités du concours" },
                    { title: "Garantir la gratuité", desc: "Aucune obligation d'achat ne peut être imposée" },
                    { title: "Informer les participants", desc: "Règles claires et accessibles avant participation" },
                    { title: "Respecter le RGPD", desc: "Traitement légal des données personnelles collectées" },
                    { title: "Remettre les lots", desc: "Obligation de délivrer les prix promis aux gagnants" },
                    { title: "Conserver les preuves", desc: "Garder trace du tirage pendant 2 ans minimum" },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-slate-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="reglement" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Le règlement obligatoire</h2>

                <p className="text-gray-600 mb-6">
                  Le règlement est le document juridique qui encadre votre jeu concours. 
                  Il doit contenir :
                </p>

                <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                  {[
                    "Identité complète de l'organisateur",
                    "Dates de début et fin du concours",
                    "Conditions d'éligibilité (âge, résidence...)",
                    "Modalités de participation",
                    "Description et valeur des lots",
                    "Modalités du tirage au sort",
                    "Date et mode d'annonce des résultats",
                    "Conditions de remise des lots",
                    "Clause d'acceptation du règlement",
                    "Mentions RGPD sur les données",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg text-center">
                  <p className="text-primary-900 mb-3">
                    Créez votre règlement en quelques minutes avec notre outil gratuit :
                  </p>
                  <Link to="/outils/generateur-reglement" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">
                    Générer mon règlement
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>

              <section id="rgpd" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">RGPD et données personnelles</h2>

                <p className="text-gray-600 mb-6">
                  La collecte de données (pseudo, email...) lors d'un concours est soumise au RGPD :
                </p>

                <div className="space-y-3">
                  {[
                    "Base légale : consentement ou intérêt légitime",
                    "Finalité : gestion du concours uniquement (sauf opt-in)",
                    "Durée de conservation : limitée au nécessaire",
                    "Droits des participants : accès, rectification, suppression",
                    "Sécurité : protection des données collectées",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-blue-900">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="sanctions" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sanctions en cas de non-respect</h2>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="space-y-4">
                    {[
                      { sanction: "Loterie illégale", peine: "Jusqu'à 30 000€ d'amende et 2 ans de prison" },
                      { sanction: "Pratique commerciale trompeuse", peine: "Jusqu'à 300 000€ d'amende" },
                      { sanction: "Non-remise des lots", peine: "Dommages et intérêts + réputation" },
                      { sanction: "Violation RGPD", peine: "Jusqu'à 4% du CA annuel" },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="font-medium text-red-900">{item.sanction}</span>
                        <span className="text-red-700 text-sm">{item.peine}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="faq" className="mb-12">
                <FAQSection items={faqItems} title="Questions fréquentes sur la légalité" />
              </section>

              <section className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Organisez vos concours en toute légalité</h2>
                <p className="text-slate-300 mb-6">
                  Cleack vous aide à créer des tirages au sort conformes avec certificat vérifiable.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/outils/generateur-reglement" className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                    Créer un règlement
                  </Link>
                  <Link to="/tirage-au-sort-instagram" className="inline-flex items-center justify-center gap-2 bg-slate-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-500">
                    Faire un tirage
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </section>

              <section className="mt-12 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles connexes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/blog/regles-jeu-concours-instagram" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <h3 className="font-bold text-gray-900 mb-1">Règles Concours Instagram</h3>
                    <p className="text-gray-600 text-sm">Spécificités de la plateforme</p>
                  </Link>
                  <Link to="/blog/modeles-reglement-concours" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <h3 className="font-bold text-gray-900 mb-1">Modèles de Règlement</h3>
                    <p className="text-gray-600 text-sm">Templates gratuits</p>
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

export default JeuConcoursLegalFrance;
