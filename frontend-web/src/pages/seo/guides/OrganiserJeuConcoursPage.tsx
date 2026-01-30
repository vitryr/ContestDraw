import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Play,
  Shield,
  ArrowRight,
  Trophy,
  Sparkles,
  Users,
  Award,
  Clock,
  Target,
  Calendar,
  Gift,
  FileText,
  Megaphone,
  BarChart3,
  AlertCircle,
  Lightbulb,
  Star,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, TableOfContents } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/guide/organiser-jeu-concours/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: 'https://cleack.io/guide/' },
  { name: 'Organiser un Jeu Concours', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Combien de temps faut-il pour organiser un jeu concours ?",
    answer: "Comptez 2-3 jours minimum pour préparer un concours simple (choix du lot, création du visuel, rédaction du règlement). Pour un concours plus élaboré avec partenaires ou gros lot, prévoyez 1-2 semaines de préparation."
  },
  {
    question: "Quel budget prévoir pour un jeu concours ?",
    answer: "Le budget varie énormément : de 0€ (si vous offrez vos propres produits) à plusieurs milliers d'euros pour des gros lots. Prévoyez aussi le budget promotion (boost réseaux sociaux) et éventuellement les frais d'huissier pour les gros concours."
  },
  {
    question: "Faut-il un huissier pour un jeu concours ?",
    answer: "Non obligatoire légalement pour les loteries publicitaires gratuites. Cependant, le dépôt du règlement chez un huissier est recommandé pour les concours avec lots importants (>500€) pour garantir la transparence et vous protéger juridiquement."
  },
  {
    question: "Peut-on organiser un concours international ?",
    answer: "Oui, mais vous devez respecter les lois de chaque pays ciblé. En pratique, limitez souvent à la France ou l'UE pour simplifier. Précisez clairement les pays éligibles dans le règlement."
  },
  {
    question: "Quelles plateformes choisir pour un jeu concours ?",
    answer: "Choisissez selon votre audience : Instagram pour le B2C et les 18-35 ans, Facebook pour les 25-55 ans, TikTok pour les Gen Z, Twitter pour l'actualité, YouTube pour le contenu vidéo. Multi-plateforme idéal pour maximiser la portée."
  },
  {
    question: "Comment éviter les participants frauduleux ?",
    answer: "Utilisez Cleack qui détecte automatiquement les bots. Exigez des actions multiples (follow + commentaire), vérifiez le profil du gagnant avant annonce, et prévoyez des gagnants suppléants en cas de fraude détectée."
  },
];

const howToSteps = [
  { name: "Définir les objectifs", text: "Déterminez ce que vous voulez accomplir : notoriété, followers, engagement, leads..." },
  { name: "Choisir le lot", text: "Sélectionnez un prix attractif et cohérent avec votre audience cible." },
  { name: "Rédiger le règlement", text: "Créez un règlement complet couvrant tous les aspects légaux." },
  { name: "Créer le contenu", text: "Concevez visuels attractifs et textes accrocheurs pour chaque plateforme." },
  { name: "Lancer et promouvoir", text: "Publiez le concours et activez vos canaux de promotion." },
  { name: "Animer et modérer", text: "Répondez aux questions, faites des rappels, gérez les commentaires." },
  { name: "Tirer au sort", text: "Utilisez Cleack pour un tirage transparent avec preuve." },
  { name: "Annoncer et livrer", text: "Contactez le gagnant, annoncez publiquement, envoyez le lot." },
];

const OrganiserJeuConcoursPage = () => {
  const tocItems = [
    { id: 'objectifs', title: 'Définir vos objectifs', level: 2 as const },
    { id: 'lot', title: 'Choisir le lot parfait', level: 2 as const },
    { id: 'reglement', title: 'Rédiger le règlement', level: 2 as const },
    { id: 'contenu', title: 'Créer le contenu', level: 2 as const },
    { id: 'promotion', title: 'Promouvoir le concours', level: 2 as const },
    { id: 'tirage', title: 'Faire le tirage au sort', level: 2 as const },
    { id: 'faq', title: 'Questions fréquentes', level: 2 as const },
  ];

  return (
    <>
      <SEOHead
        title="Comment Organiser un Jeu Concours : Guide Complet 2024 | Cleack"
        description="Guide complet pour organiser un jeu concours réussi en 2024. Étapes, règles légales, choix du lot, promotion et tirage au sort. Tout ce que vous devez savoir."
        keywords="organiser jeu concours, comment faire un concours, organiser concours instagram, créer jeu concours, guide concours, concours réseaux sociaux"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-guide-organiser-concours.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="Comment organiser un jeu concours réussi"
      />

      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
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
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Guide Complet
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Comment Organiser un{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Jeu Concours Réussi
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Le guide ultime pour organiser un jeu concours qui atteint vos objectifs : 
                de la définition des règles au tirage au sort, en passant par la promotion.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  to="/draw/new"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Trophy className="w-5 h-5" />
                  Lancer un tirage au sort
                </Link>
                <Link
                  to="/outils/generateur-reglement/"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-indigo-300 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Générer un règlement
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  15 min de lecture
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Mis à jour 2024
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Table of Contents + Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Sidebar TOC */}
              <aside className="lg:col-span-1">
                <div className="sticky top-8">
                  <TableOfContents items={tocItems} />
                </div>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-3 prose prose-lg max-w-none">
                
                {/* Introduction */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12">
                  <p className="text-gray-700 leading-relaxed">
                    Un <strong>jeu concours bien organisé</strong> peut transformer votre présence en ligne : 
                    augmentation de la notoriété, gain de followers, engagement de votre communauté, et même 
                    génération de leads qualifiés. Mais attention, un concours mal préparé peut avoir l'effet 
                    inverse. Ce guide vous accompagne pas à pas pour organiser un concours qui atteint vos objectifs.
                  </p>
                </div>

                {/* Section 1: Objectifs */}
                <section id="objectifs" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Target className="w-8 h-8 text-indigo-600" />
                    1. Définir vos Objectifs
                  </h2>

                  <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                    <p className="text-gray-700 mb-6">
                      Avant de penser au lot ou aux règles, posez-vous cette question : 
                      <strong> Qu'est-ce que je veux accomplir avec ce concours ?</strong>
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { title: "Notoriété / Visibilité", description: "Faire connaître votre marque à de nouvelles audiences", kpi: "Impressions, Reach, Mentions" },
                        { title: "Croissance Followers", description: "Augmenter votre base d'abonnés sur les réseaux", kpi: "Nouveaux followers, Taux de rétention" },
                        { title: "Engagement", description: "Réactiver votre communauté existante", kpi: "Likes, Commentaires, Partages, Saves" },
                        { title: "Génération de Leads", description: "Collecter des emails ou des contacts qualifiés", kpi: "Inscriptions, Taux de conversion" },
                      ].map((obj, index) => (
                        <div key={index} className="bg-indigo-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">{obj.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{obj.description}</p>
                          <p className="text-indigo-600 text-xs font-medium">KPIs : {obj.kpi}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Conseil Pro</h4>
                        <p className="text-gray-700 text-sm">
                          Fixez des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels). 
                          Par exemple : « Gagner 1000 nouveaux followers Instagram en 10 jours » plutôt que 
                          « Avoir plus de followers ».
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Lot */}
                <section id="lot" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Gift className="w-8 h-8 text-indigo-600" />
                    2. Choisir le Lot Parfait
                  </h2>

                  <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                    <p className="text-gray-700 mb-6">
                      Le lot est le cœur de votre concours. Un bon lot attire les bons participants ; 
                      un mauvais lot attire les chasseurs de concours.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Ce qui fonctionne
                        </h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>✓ Lot en lien avec votre activité/niche</li>
                          <li>✓ Produit exclusif ou édition limitée</li>
                          <li>✓ Valeur perçue élevée (même si coût faible)</li>
                          <li>✓ Expérience unique (rencontre, accès VIP)</li>
                          <li>✓ Bundle de plusieurs produits</li>
                        </ul>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          À éviter
                        </h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>✗ Lot trop générique (iPhone, argent cash)</li>
                          <li>✗ Valeur trop faible (&lt;30€)</li>
                          <li>✗ Sans rapport avec votre audience</li>
                          <li>✗ Lot invendable/restant de stock</li>
                          <li>✗ Promesses floues</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">💰 Quel budget pour le lot ?</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <p className="font-medium text-indigo-600">Petit budget</p>
                        <p className="text-gray-600">50-100€</p>
                        <p className="text-gray-500 text-xs mt-1">Idéal pour concours réguliers</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="font-medium text-indigo-600">Budget moyen</p>
                        <p className="text-gray-600">100-500€</p>
                        <p className="text-gray-500 text-xs mt-1">Bon équilibre impact/coût</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="font-medium text-indigo-600">Gros budget</p>
                        <p className="text-gray-600">500€+</p>
                        <p className="text-gray-500 text-xs mt-1">Pour les temps forts</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Règlement */}
                <section id="reglement" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-600" />
                    3. Rédiger le Règlement
                  </h2>

                  <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                    <p className="text-gray-700 mb-6">
                      Le règlement est <strong>obligatoire légalement en France</strong> pour tout jeu concours 
                      avec tirage au sort. Il vous protège et informe les participants.
                    </p>

                    <h4 className="font-semibold text-gray-900 mb-4">Mentions obligatoires :</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Identité de l'organisateur (nom, adresse, SIRET)",
                        "Dates précises de début et de fin",
                        "Conditions de participation (âge, résidence...)",
                        "Description exacte du/des lot(s) et valeur",
                        "Modalités de désignation des gagnants",
                        "Délai et mode de notification du gagnant",
                        "Délai pour réclamer le lot",
                        "Clause d'exclusion de responsabilité",
                        "Mention RGPD (données personnelles)",
                        "Loi applicable et juridiction compétente",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                    <h4 className="font-semibold mb-3">🛠️ Gagnez du temps !</h4>
                    <p className="text-indigo-100 mb-4">
                      Utilisez notre générateur de règlement gratuit pour créer un règlement 
                      complet et conforme en quelques clics.
                    </p>
                    <Link
                      to="/outils/generateur-reglement/"
                      className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      Générer mon règlement
                    </Link>
                  </div>
                </section>

                {/* Section 4: Contenu */}
                <section id="contenu" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Megaphone className="w-8 h-8 text-indigo-600" />
                    4. Créer le Contenu
                  </h2>

                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <p className="text-gray-700 mb-6">
                      Le contenu de votre concours doit être clair, attractif, et adapté à chaque plateforme.
                    </p>

                    <h4 className="font-semibold text-gray-900 mb-4">Checklist du post parfait :</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">📸 Le Visuel</h5>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>✓ Photo HD du lot bien mise en valeur</li>
                          <li>✓ Texte « CONCOURS » ou « GIVEAWAY » visible</li>
                          <li>✓ Couleurs vives qui attirent l'œil</li>
                          <li>✓ Format adapté à la plateforme</li>
                          <li>✓ Votre logo/branding présent</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">✍️ Le Texte</h5>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>✓ Accroche percutante en 1ère ligne</li>
                          <li>✓ Règles numérotées et simples</li>
                          <li>✓ Date de fin bien visible</li>
                          <li>✓ Hashtags stratégiques</li>
                          <li>✓ CTA clair (Participe maintenant !)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Promotion */}
                <section id="promotion" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-indigo-600" />
                    5. Promouvoir le Concours
                  </h2>

                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <p className="text-gray-700 mb-6">
                      Un concours ne se suffit pas à lui-même. Activez tous vos canaux pour maximiser la portée.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: "Organique", items: ["Stories de rappel", "Épingle le post", "Cross-post", "Newsletter"] },
                        { title: "Payant", items: ["Boost du post", "Ads ciblées", "Influence marketing", "Partenariats"] },
                        { title: "Communautaire", items: ["Groupes Facebook", "Forums niche", "Discord/Slack", "Ambassadeurs"] },
                      ].map((channel, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">{channel.title}</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {channel.items.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 6: Tirage */}
                <section id="tirage" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-indigo-600" />
                    6. Faire le Tirage au Sort
                  </h2>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                    <p className="text-gray-700 mb-6">
                      C'est le moment crucial ! Un tirage transparent renforce la confiance de votre communauté.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                      <div className="bg-white rounded-lg p-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">📋</span>
                        </div>
                        <h4 className="font-medium text-gray-900">1. Copiez le lien</h4>
                        <p className="text-gray-600 text-sm">Du post concours</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">⚙️</span>
                        </div>
                        <h4 className="font-medium text-gray-900">2. Configurez</h4>
                        <p className="text-gray-600 text-sm">Filtres et gagnants</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">🎉</span>
                        </div>
                        <h4 className="font-medium text-gray-900">3. Partagez</h4>
                        <p className="text-gray-600 text-sm">La vidéo preuve</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <Link
                        to="/draw/new"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        <Sparkles className="w-5 h-5" />
                        Lancer un tirage avec Cleack
                      </Link>
                    </div>
                  </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="mb-16">
                  <FAQSection items={faqItems} title="Questions Fréquentes" />
                </section>

              </main>
            </div>
          </div>
        </section>

        {/* Related Guides */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides Connexes</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Rédiger un Règlement", url: "/guide/reglement-jeu-concours/" },
                { title: "Aspects Légaux en France", url: "/guide/legal-jeu-concours-france/" },
                { title: "Augmenter l'Engagement", url: "/guide/augmenter-engagement/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Concours ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour organiser un tirage au sort transparent et professionnel. 
                Gratuit, sans inscription, avec vidéo preuve.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default OrganiserJeuConcoursPage;
