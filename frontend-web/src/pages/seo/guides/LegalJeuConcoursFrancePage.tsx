import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale,
  CheckCircle2,
  Shield,
  ArrowRight,
  Trophy,
  Sparkles,
  AlertCircle,
  FileText,
  Users,
  Gift,
  Ban,
  Gavel,
  BookOpen,
  Euro,
  Clock,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/guide/legal-jeu-concours-france/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: 'https://cleack.io/guide/' },
  { name: 'Légal Jeu Concours France', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Un jeu concours sur les réseaux sociaux est-il légal en France ?",
    answer: "Oui, les jeux concours gratuits (loteries publicitaires sans obligation d'achat) sont légaux en France. C'est l'obligation d'achat qui rendrait le jeu illégal. Les concours sur Instagram, Facebook, TikTok etc. sont donc autorisés tant qu'ils restent gratuits."
  },
  {
    question: "Faut-il payer des taxes sur les lots de concours ?",
    answer: "Pour l'organisateur, les lots sont une charge déductible. Pour le gagnant, les lots de jeux publicitaires gratuits ne sont pas imposables en France, contrairement aux gains de jeux d'argent."
  },
  {
    question: "Peut-on exclure certaines personnes d'un concours ?",
    answer: "Oui, vous pouvez légalement exclure : vos employés et leur famille, les mineurs, les non-résidents français. Ces exclusions doivent être clairement mentionnées dans le règlement."
  },
  {
    question: "Que risque-t-on en cas de concours non conforme ?",
    answer: "Les sanctions peuvent aller de l'amende (jusqu'à 300 000€ pour tromperie) à des poursuites pénales pour loterie illicite. Sans compter le risque réputationnel. D'où l'importance d'être conforme."
  },
  {
    question: "Le dépôt chez huissier est-il obligatoire ?",
    answer: "Non, depuis 2014, le dépôt du règlement chez un huissier n'est plus obligatoire. Cependant, il reste recommandé pour les gros lots (>500€) car il constitue une preuve en cas de litige."
  },
  {
    question: "Peut-on organiser un concours international depuis la France ?",
    answer: "Oui, mais vous devez respecter les lois de chaque pays ciblé. En pratique, il est souvent plus simple de limiter le concours à la France ou à l'UE et de le préciser clairement dans le règlement."
  },
];

const LegalJeuConcoursFrancePage = () => {
  return (
    <>
      <SEOHead
        title="Jeu Concours Légal en France : Guide Complet 2024 | Cleack"
        description="Guide complet sur la législation des jeux concours en France. Règles légales, obligations, RGPD, sanctions. Tout pour organiser un concours conforme."
        keywords="jeu concours légal france, législation concours, loi jeu concours, règles légales concours, concours instagram légal, RGPD concours"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-guide-legal.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Scale className="w-4 h-4" />
                Guide Juridique
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Jeux Concours en France :{' '}
                <span className="bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
                  Guide Légal Complet
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Tout ce que vous devez savoir sur la législation française des jeux concours. 
                Organisez vos concours en toute conformité.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  Mis à jour 2024
                </span>
                <span className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  <Scale className="w-4 h-4" />
                  Droit français
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Avertissement */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Avertissement</h3>
                  <p className="text-amber-700 text-sm">
                    Ce guide est fourni à titre informatif et ne constitue pas un conseil juridique. 
                    Pour des situations complexes ou des enjeux importants, consultez un avocat spécialisé. 
                    La législation peut évoluer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de jeux */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Les 3 Types de Jeux : Ce qui est Légal ou Non
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Loteries gratuites */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Loteries Gratuites</h3>
                    <span className="text-green-600 font-medium">✓ LÉGAL</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Tirage au sort <strong>sans obligation d'achat</strong>. C'est le cas de la plupart 
                  des concours sur les réseaux sociaux.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Exemples :</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Concours Instagram « commente pour participer »</li>
                    <li>• Giveaway Twitter « RT pour gagner »</li>
                    <li>• Jeu Facebook « like + partage »</li>
                  </ul>
                </div>
              </div>

              {/* Concours de compétence */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-10 h-10 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Concours de Talents</h3>
                    <span className="text-blue-600 font-medium">✓ LÉGAL</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Le gagnant est désigné par ses <strong>compétences ou sa créativité</strong>, 
                  pas par le hasard.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Exemples :</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Concours photo « meilleure création »</li>
                    <li>• Quiz avec sélection des bonnes réponses</li>
                    <li>• Challenge créatif jugé par un jury</li>
                  </ul>
                </div>
              </div>

              {/* Loteries payantes */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Ban className="w-10 h-10 text-red-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Loteries Payantes</h3>
                    <span className="text-red-600 font-medium">✗ ILLÉGAL</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Tout jeu de hasard avec <strong>obligation d'achat</strong> pour participer 
                  est une loterie illicite.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Exemples interdits :</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• « Achetez X pour participer au tirage »</li>
                    <li>• Jeux où l'achat augmente les chances</li>
                    <li>• Tombolas payantes (sauf associations)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Obligations légales */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Vos Obligations Légales en tant qu'Organisateur
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Obligatoire */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  Obligatoire
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "Règlement accessible", desc: "Doit être disponible gratuitement pour tous les participants" },
                    { title: "Gratuité de participation", desc: "Aucune obligation d'achat pour participer" },
                    { title: "Mentions obligatoires", desc: "Organisateur, dates, lot, modalités, RGPD..." },
                    { title: "Information claire", desc: "Règles compréhensibles et sans ambiguïté" },
                    { title: "Respect du RGPD", desc: "Clause données personnelles obligatoire" },
                    { title: "Tirage équitable", desc: "Aléatoire ou selon critères objectifs annoncés" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommandé */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Recommandé (non obligatoire)
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "Dépôt huissier", desc: "Pour les lots >500€, constitue une preuve en cas de litige" },
                    { title: "Assurance", desc: "Couvre les risques liés au lot (vol, dommage...)" },
                    { title: "Tirage filmé", desc: "Preuve vidéo de la transparence (Cleack le fait !)" },
                    { title: "Gagnants suppléants", desc: "En cas de non-réponse du gagnant principal" },
                    { title: "Mention plateforme", desc: "Préciser que la plateforme n'est pas associée" },
                    { title: "Conservation preuves", desc: "Garder les traces du tirage et des participations" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RGPD Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                RGPD et Jeux Concours
              </h2>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
              <p className="text-gray-700 mb-6">
                Depuis mai 2018, le <strong>Règlement Général sur la Protection des Données (RGPD)</strong> 
                s'applique à tout traitement de données personnelles, y compris les jeux concours.
              </p>

              <h3 className="font-semibold text-gray-900 mb-4">Ce que vous devez faire :</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Informer sur les données collectées",
                  "Préciser la finalité du traitement",
                  "Indiquer la durée de conservation",
                  "Obtenir le consentement explicite",
                  "Permettre l'accès aux données",
                  "Permettre la rectification",
                  "Permettre la suppression",
                  "Nommer un contact DPO",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>⚠️ Attention :</strong> Les amendes RGPD peuvent atteindre 4% du CA annuel 
                  ou 20 millions d'euros. Ne négligez pas cette partie de votre règlement !
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sanctions */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sanctions en Cas de Non-Conformité
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Euro className="w-8 h-8" />,
                  title: "Amendes",
                  items: [
                    "Loterie illicite : jusqu'à 300 000€",
                    "Publicité trompeuse : 1,5M€",
                    "RGPD : 4% du CA ou 20M€",
                  ],
                  color: "red",
                },
                {
                  icon: <Gavel className="w-8 h-8" />,
                  title: "Poursuites Pénales",
                  items: [
                    "Loterie illicite : 2 ans de prison",
                    "Escroquerie si faux lot",
                    "Abus de confiance",
                  ],
                  color: "orange",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Réputation",
                  items: [
                    "Bad buzz médiatique",
                    "Perte de confiance clients",
                    "Signalements sur les réseaux",
                  ],
                  color: "yellow",
                },
              ].map((item, index) => (
                <div key={index} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-xl p-6`}>
                  <div className={`w-12 h-12 bg-${item.color}-100 text-${item.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.items.map((i, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                        <AlertCircle className={`w-4 h-4 text-${item.color}-500 flex-shrink-0 mt-0.5`} />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Checklist Conformité Légale
              </h2>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
              <div className="space-y-4">
                {[
                  "Participation gratuite, sans obligation d'achat",
                  "Règlement rédigé et accessible",
                  "Identité organisateur mentionnée (nom, adresse, SIRET)",
                  "Dates de début et fin précises",
                  "Description exacte du lot et valeur",
                  "Modalités de participation claires",
                  "Mode de désignation du gagnant expliqué",
                  "Clause RGPD complète",
                  "Mention que la plateforme n'est pas associée",
                  "Loi applicable et juridiction compétente indiquées",
                ].map((item, index) => (
                  <label key={index} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection items={faqItems} title="Questions Fréquentes" />
          </div>
        </section>

        {/* Related Guides */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides Connexes</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Organiser un Jeu Concours", url: "/guide/organiser-jeu-concours/" },
                { title: "Rédiger le Règlement", url: "/guide/reglement-jeu-concours/" },
                { title: "Générateur de Règlement", url: "/outils/generateur-reglement/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-slate-700 to-blue-700 rounded-2xl p-8 text-white">
              <Scale className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Organisez un Concours 100% Conforme</h2>
              <p className="text-white/90 mb-6">
                Cleack vous aide à organiser des tirages au sort transparents et professionnels. 
                Générez votre règlement et lancez votre tirage en toute sérénité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/outils/generateur-reglement/"
                  className="inline-flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Générer un règlement
                </Link>
                <Link
                  to="/draw/new"
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Lancer un tirage
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LegalJeuConcoursFrancePage;
