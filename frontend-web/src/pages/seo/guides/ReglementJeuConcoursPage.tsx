import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  Shield,
  ArrowRight,
  Trophy,
  Sparkles,
  AlertCircle,
  Scale,
  Users,
  Calendar,
  Gift,
  Mail,
  Globe,
  Lock,
  Download,
  Copy,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/guide/reglement-jeu-concours/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: 'https://cleack.io/guide/' },
  { name: 'Règlement Jeu Concours', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Le règlement est-il obligatoire pour un jeu concours ?",
    answer: "Oui, en France, un règlement est légalement obligatoire pour toute loterie publicitaire ou jeu concours avec tirage au sort. Il protège l'organisateur et informe les participants de leurs droits."
  },
  {
    question: "Où publier le règlement du concours ?",
    answer: "Le règlement doit être accessible à tous les participants. Options : en commentaire épinglé sous le post, dans un lien en bio, sur une page de votre site, ou dans une Story à la une. L'important est qu'il soit facilement trouvable."
  },
  {
    question: "Faut-il déposer le règlement chez un huissier ?",
    answer: "Ce n'est plus obligatoire depuis 2014. Cependant, pour les concours avec des lots importants (>500€), le dépôt chez un huissier reste recommandé pour prouver l'antériorité du règlement en cas de litige."
  },
  {
    question: "Que faire si un participant ne respecte pas le règlement ?",
    answer: "Si un participant enfreint les règles (faux compte, fraude, conditions non remplies), vous avez le droit de l'exclure. C'est pourquoi il est important de prévoir une clause d'exclusion dans le règlement."
  },
  {
    question: "Comment gérer le RGPD dans le règlement ?",
    answer: "Vous devez informer les participants sur : les données collectées, leur utilisation, la durée de conservation, leurs droits (accès, rectification, suppression), et qui contacter. Une clause RGPD dédiée est indispensable."
  },
  {
    question: "Peut-on modifier le règlement après le lancement ?",
    answer: "En principe non, sauf mention contraire dans le règlement original. Si une modification est nécessaire, elle doit être communiquée clairement à tous les participants et ne pas les désavantager."
  },
];

const ReglementJeuConcoursPage = () => {
  return (
    <>
      <SEOHead
        title="Règlement Jeu Concours : Modèle Gratuit et Guide Complet | Cleack"
        description="Guide complet pour rédiger un règlement de jeu concours conforme. Modèle gratuit, mentions obligatoires, RGPD. Tout ce qu'il faut savoir pour être en règle."
        keywords="règlement jeu concours, modèle règlement concours, règlement concours instagram, rédiger règlement, règlement type concours, mentions légales concours"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-guide-reglement.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
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
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FileText className="w-4 h-4" />
                Guide Règlement
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Règlement Jeu Concours :{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Guide et Modèle Gratuit
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Tout ce que vous devez savoir pour rédiger un règlement de jeu concours conforme 
                à la législation française. Modèle gratuit inclus.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/outils/generateur-reglement/"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Générer mon règlement
                </Link>
                <a
                  href="#modele"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-emerald-300 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Voir le modèle
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pourquoi un règlement */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi un Règlement est-il Obligatoire ?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <Scale className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Obligation Légale</h3>
                <p className="text-gray-600 text-sm">
                  En France, l'article L121-20 du Code de la consommation impose un règlement 
                  pour toute loterie publicitaire avec tirage au sort.
                </p>
              </div>

              <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                <Shield className="w-10 h-10 text-teal-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Protection Juridique</h3>
                <p className="text-gray-600 text-sm">
                  Le règlement vous protège en cas de litige. Il définit clairement les règles 
                  et peut être utilisé comme preuve.
                </p>
              </div>

              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-100">
                <Users className="w-10 h-10 text-cyan-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparence</h3>
                <p className="text-gray-600 text-sm">
                  Les participants savent exactement à quoi s'attendre. Cela renforce la confiance 
                  et la crédibilité de votre marque.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mentions Obligatoires */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Les 12 Mentions Obligatoires
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Votre règlement doit contenir au minimum ces informations pour être conforme.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "1. Organisateur",
                  content: "Nom/raison sociale, adresse, SIRET si applicable",
                },
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "2. Dates",
                  content: "Date et heure précises de début et de fin",
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  title: "3. Conditions de participation",
                  content: "Âge minimum, résidence, exclusions (employés...)",
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: "4. Modalités de participation",
                  content: "Actions requises (follow, like, commentaire...)",
                },
                {
                  icon: <Gift className="w-6 h-6" />,
                  title: "5. Description du lot",
                  content: "Nature exacte, valeur estimée, nombre de gagnants",
                },
                {
                  icon: <Trophy className="w-6 h-6" />,
                  title: "6. Désignation des gagnants",
                  content: "Méthode de tirage (aléatoire, jury...), date",
                },
                {
                  icon: <Mail className="w-6 h-6" />,
                  title: "7. Notification",
                  content: "Comment et quand le gagnant sera contacté",
                },
                {
                  icon: <Gift className="w-6 h-6" />,
                  title: "8. Attribution du lot",
                  content: "Délai pour réclamer, mode de remise",
                },
                {
                  icon: <AlertCircle className="w-6 h-6" />,
                  title: "9. Responsabilité",
                  content: "Limites de responsabilité de l'organisateur",
                },
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: "10. Données personnelles",
                  content: "Clause RGPD complète (voir section dédiée)",
                },
                {
                  icon: <Scale className="w-6 h-6" />,
                  title: "11. Droit applicable",
                  content: "Loi française, tribunal compétent",
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "12. Accès au règlement",
                  content: "Où et comment consulter le règlement complet",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clause RGPD */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                La Clause RGPD Obligatoire
              </h2>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-100">
              <Lock className="w-10 h-10 text-emerald-600 mb-6" />
              
              <p className="text-gray-700 mb-6">
                Depuis 2018, le RGPD impose d'informer clairement les participants sur le traitement 
                de leurs données personnelles. Votre clause doit inclure :
              </p>

              <div className="space-y-4">
                {[
                  { title: "Responsable du traitement", content: "Qui collecte et traite les données (vous)" },
                  { title: "Données collectées", content: "Pseudo, email, adresse... selon le concours" },
                  { title: "Finalité", content: "Pourquoi vous collectez ces données (gestion du concours, envoi du lot)" },
                  { title: "Base légale", content: "Consentement ou exécution d'un contrat" },
                  { title: "Durée de conservation", content: "Combien de temps vous gardez les données" },
                  { title: "Droits des participants", content: "Accès, rectification, suppression, portabilité" },
                  { title: "Contact DPO", content: "Email pour exercer ses droits" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">{item.title} :</span>{' '}
                      <span className="text-gray-600">{item.content}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Modèle */}
        <section id="modele" className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Modèle de Règlement Type
              </h2>
              <p className="text-gray-600">
                Voici la structure d'un règlement conforme. Adaptez les [crochets] à votre situation.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <span className="font-medium text-gray-900">Règlement du Jeu Concours</span>
                <button className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  <Copy className="w-4 h-4" />
                  Copier
                </button>
              </div>
              <div className="p-6 font-mono text-sm text-gray-700 whitespace-pre-wrap bg-gray-50/50">
{`RÈGLEMENT DU JEU CONCOURS « [NOM DU CONCOURS] »

ARTICLE 1 – ORGANISATION
La société [NOM], [forme juridique], au capital de [X] €, 
immatriculée au RCS de [VILLE] sous le n° [SIRET], 
dont le siège social est situé [ADRESSE], 
organise un jeu concours gratuit sans obligation d'achat 
du [DATE DÉBUT] au [DATE FIN] inclus.

ARTICLE 2 – CONDITIONS DE PARTICIPATION
Ce jeu est ouvert à toute personne physique majeure 
résidant en France métropolitaine, à l'exception des 
employés de la société organisatrice et de leur famille.
Une seule participation par personne est autorisée.

ARTICLE 3 – MODALITÉS DE PARTICIPATION
Pour participer, il suffit de :
- [Action 1 : ex: Suivre le compte @xxx]
- [Action 2 : ex: Aimer la publication du concours]
- [Action 3 : ex: Commenter en taguant 2 amis]

ARTICLE 4 – DOTATION
Le lot mis en jeu est : [DESCRIPTION EXACTE DU LOT]
Valeur commerciale estimée : [VALEUR] € TTC
Nombre de gagnants : [NOMBRE]
Le lot est non échangeable et non remboursable.

ARTICLE 5 – DÉSIGNATION DU GAGNANT
Le gagnant sera désigné par tirage au sort aléatoire 
parmi les participations valides, le [DATE TIRAGE] 
à l'aide de l'outil Cleack.io.

ARTICLE 6 – NOTIFICATION
Le gagnant sera contacté par [message privé/email] 
dans les 7 jours suivant le tirage. Il devra répondre 
sous 7 jours pour confirmer ses coordonnées.
Passé ce délai, un nouveau gagnant sera tiré au sort.

ARTICLE 7 – DONNÉES PERSONNELLES
Conformément au RGPD, les données collectées sont 
utilisées uniquement pour la gestion du concours.
Elles seront conservées pendant [DURÉE] puis supprimées.
Pour exercer vos droits : [EMAIL CONTACT]

ARTICLE 8 – RESPONSABILITÉ
L'organisateur ne saurait être tenu responsable des 
problèmes techniques ou d'acheminement du lot.
Instagram/Facebook/TikTok/Twitter n'est en aucun cas 
associé à ce jeu concours.

ARTICLE 9 – RÈGLEMENT
Le règlement complet est disponible [LIEN/LIEU].
Toute participation implique l'acceptation sans réserve 
du présent règlement.

ARTICLE 10 – LOI APPLICABLE
Ce jeu est soumis à la loi française. Tout litige sera 
de la compétence des tribunaux de [VILLE].

Fait à [VILLE], le [DATE]`}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/outils/generateur-reglement/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FileText className="w-5 h-5" />
                Générer mon règlement personnalisé
              </Link>
            </div>
          </div>
        </section>

        {/* Erreurs courantes */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Erreurs Courantes à Éviter
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { error: "Pas de règlement du tout", fix: "Toujours rédiger un règlement, même court" },
                { error: "Règlement introuvable", fix: "Le rendre facilement accessible (lien en bio, commentaire épinglé)" },
                { error: "Dates floues (\"bientôt\")", fix: "Dates et heures précises obligatoires" },
                { error: "Lot non décrit précisément", fix: "Description exacte et valeur estimée" },
                { error: "Pas de clause RGPD", fix: "Obligatoire depuis 2018" },
                { error: "Modifier le règlement après", fix: "Prévoir une clause de modification si vraiment nécessaire" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-red-50 rounded-lg p-4">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">{item.error}</p>
                    <p className="text-red-600 text-sm mt-1">✓ {item.fix}</p>
                  </div>
                </div>
              ))}
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
                { title: "Aspects Légaux en France", url: "/guide/legal-jeu-concours-france/" },
                { title: "Générateur de Règlement", url: "/outils/generateur-reglement/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100 hover:border-emerald-300 transition-all group"
                >
                  <span className="font-medium text-gray-900">{link.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Créez Votre Règlement en 2 Minutes</h2>
              <p className="text-white/90 mb-6">
                Utilisez notre générateur gratuit pour créer un règlement 
                complet et conforme à la législation française.
              </p>
              <Link
                to="/outils/generateur-reglement/"
                className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Générer mon règlement
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ReglementJeuConcoursPage;
