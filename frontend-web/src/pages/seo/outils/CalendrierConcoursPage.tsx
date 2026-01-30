import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gift,
  Star,
  Heart,
  Sun,
  Snowflake,
  Leaf,
  Flower2,
  PartyPopper,
  ShoppingBag,
  GraduationCap,
  Music,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/outils/calendrier-concours/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Outils', url: 'https://cleack.io/outils/' },
  { name: 'Calendrier Concours', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Quand organiser un concours pour un maximum d'impact ?",
    answer: "Les meilleurs moments sont : autour des fêtes (Noël, Saint-Valentin), les temps forts commerciaux (Black Friday, soldes), les événements saisonniers, et les anniversaires de votre marque. Évitez les périodes de vacances d'été où l'engagement baisse."
  },
  {
    question: "Combien de concours organiser par an ?",
    answer: "Qualité > quantité. 4-6 concours par an bien préparés valent mieux que des concours hebdomadaires qui lassent votre audience. Gardez un effet de rareté pour maximiser l'engagement."
  },
  {
    question: "Faut-il adapter le lot à la saison ?",
    answer: "Oui ! Un lot cohérent avec la saison ou l'événement génère plus d'engagement. Exemple : produits cocooning en hiver, voyage en été, chocolats à Pâques..."
  },
];

const calendarData = [
  {
    month: 'Janvier',
    events: [
      { date: '1er', name: 'Nouvel An', icon: <PartyPopper className="w-5 h-5" />, idea: 'Concours "Bonnes résolutions" ou rétrospective' },
      { date: '6', name: 'Épiphanie', icon: <Star className="w-5 h-5" />, idea: 'Tirage galette des rois' },
      { date: 'Mi-janvier', name: 'Soldes d\'hiver', icon: <ShoppingBag className="w-5 h-5" />, idea: 'Giveaway produits en promo' },
    ],
    color: 'blue',
  },
  {
    month: 'Février',
    events: [
      { date: '14', name: 'Saint-Valentin', icon: <Heart className="w-5 h-5" />, idea: 'Concours couple, lot romantique' },
      { date: 'Variable', name: 'Carnaval/Mardi Gras', icon: <PartyPopper className="w-5 h-5" />, idea: 'Concours déguisement' },
    ],
    color: 'pink',
  },
  {
    month: 'Mars',
    events: [
      { date: '8', name: 'Journée des Femmes', icon: <Flower2 className="w-5 h-5" />, idea: 'Giveaway beauty/wellness' },
      { date: '17', name: 'Saint-Patrick', icon: <Leaf className="w-5 h-5" />, idea: 'Concours vert/irlandais' },
      { date: '20', name: 'Printemps', icon: <Flower2 className="w-5 h-5" />, idea: 'Renouveau, changement de saison' },
    ],
    color: 'green',
  },
  {
    month: 'Avril',
    events: [
      { date: '1er', name: 'Poisson d\'Avril', icon: <Star className="w-5 h-5" />, idea: 'Concours humour/blague' },
      { date: 'Variable', name: 'Pâques', icon: <Gift className="w-5 h-5" />, idea: 'Chasse aux œufs, lot chocolat' },
    ],
    color: 'yellow',
  },
  {
    month: 'Mai',
    events: [
      { date: '1er', name: 'Fête du Travail', icon: <Flower2 className="w-5 h-5" />, idea: 'Concours "bien-être au travail"' },
      { date: 'Dernier dim.', name: 'Fête des Mères', icon: <Heart className="w-5 h-5" />, idea: 'Lot pour mamans' },
    ],
    color: 'pink',
  },
  {
    month: 'Juin',
    events: [
      { date: 'Mi-juin', name: 'Fête des Pères', icon: <Gift className="w-5 h-5" />, idea: 'Lot pour papas' },
      { date: '21', name: 'Fête de la Musique', icon: <Music className="w-5 h-5" />, idea: 'Concours playlist/musical' },
      { date: '21', name: 'Été', icon: <Sun className="w-5 h-5" />, idea: 'Lot vacances/plage' },
    ],
    color: 'orange',
  },
  {
    month: 'Juillet',
    events: [
      { date: 'Début', name: 'Soldes d\'été', icon: <ShoppingBag className="w-5 h-5" />, idea: 'Giveaway produits soldés' },
      { date: '14', name: 'Fête Nationale', icon: <PartyPopper className="w-5 h-5" />, idea: 'Concours bleu-blanc-rouge' },
    ],
    color: 'blue',
  },
  {
    month: 'Août',
    events: [
      { date: 'Tout le mois', name: 'Vacances', icon: <Sun className="w-5 h-5" />, idea: 'Engagement bas - éviter les gros concours' },
      { date: 'Fin août', name: 'Rentrée', icon: <GraduationCap className="w-5 h-5" />, idea: 'Concours rentrée/back to school' },
    ],
    color: 'yellow',
  },
  {
    month: 'Septembre',
    events: [
      { date: 'Début', name: 'Rentrée', icon: <GraduationCap className="w-5 h-5" />, idea: 'Lot fournitures/tech' },
      { date: '22', name: 'Automne', icon: <Leaf className="w-5 h-5" />, idea: 'Ambiance cosy, couleurs chaudes' },
    ],
    color: 'orange',
  },
  {
    month: 'Octobre',
    events: [
      { date: '31', name: 'Halloween', icon: <Star className="w-5 h-5" />, idea: 'Concours costume, lot effrayant' },
    ],
    color: 'purple',
  },
  {
    month: 'Novembre',
    events: [
      { date: '4ème ven.', name: 'Black Friday', icon: <ShoppingBag className="w-5 h-5" />, idea: 'Mega giveaway, lot premium' },
      { date: 'Lundi suivant', name: 'Cyber Monday', icon: <ShoppingBag className="w-5 h-5" />, idea: 'Lot tech/digital' },
    ],
    color: 'gray',
  },
  {
    month: 'Décembre',
    events: [
      { date: '1-24', name: 'Avent', icon: <Calendar className="w-5 h-5" />, idea: 'Calendrier de l\'avent concours' },
      { date: '25', name: 'Noël', icon: <Gift className="w-5 h-5" />, idea: 'Gros lot, magie de Noël' },
      { date: '31', name: 'Réveillon', icon: <PartyPopper className="w-5 h-5" />, idea: 'Concours "meilleur souvenir 2024"' },
    ],
    color: 'red',
  },
];

const CalendrierConcoursPage = () => {
  return (
    <>
      <SEOHead
        title="Calendrier des Concours 2024 : Meilleures Dates | Cleack"
        description="Calendrier des meilleures dates pour organiser un concours en 2024. Fêtes, événements, temps forts. Planifiez vos giveaways pour un maximum d'impact."
        keywords="calendrier concours, quand organiser concours, meilleures dates giveaway, planning concours, idées concours saisonnier"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-calendrier-concours.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Calendar className="w-4 h-4" />
                Planning 2024
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Calendrier des{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Concours 2024
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Les meilleures dates pour organiser vos concours et giveaways. 
                Planifiez vos temps forts pour maximiser l'engagement.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calendrier */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calendarData.map((month, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className={`bg-${month.color}-100 px-4 py-3`}>
                    <h3 className={`font-bold text-${month.color}-800 text-lg`}>{month.month}</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {month.events.map((event, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-10 h-10 bg-${month.color}-50 text-${month.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {event.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs">{event.date}</span>
                            <span className="font-medium text-gray-900 text-sm">{event.name}</span>
                          </div>
                          <p className="text-gray-600 text-xs mt-1">{event.idea}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Conseils */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Conseils de Timing</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <CheckCircle2 className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-3">Périodes Idéales</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Fêtes commerciales (Noël, Black Friday)</li>
                  <li>✓ Événements saisonniers (rentrée, été)</li>
                  <li>✓ Anniversaires de marque</li>
                  <li>✓ Lancements de produits</li>
                  <li>✓ Atteinte de paliers (10K followers)</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <Calendar className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-3">Périodes à Éviter</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✗ Plein été (juillet-août) - engagement bas</li>
                  <li>✗ Entre deux fêtes (période creuse)</li>
                  <li>✗ Trop de concours à la suite (lassitude)</li>
                  <li>✗ Événements tragiques (respecter le deuil)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Idées par saison */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Idées de Lots par Saison</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { season: 'Printemps', icon: <Flower2 className="w-8 h-8" />, color: 'green', ideas: ['Jardinage', 'Vélo', 'Fitness', 'Mode légère', 'Allergie-free'] },
                { season: 'Été', icon: <Sun className="w-8 h-8" />, color: 'yellow', ideas: ['Voyage', 'Plage', 'Barbecue', 'Glaces', 'Festival'] },
                { season: 'Automne', icon: <Leaf className="w-8 h-8" />, color: 'orange', ideas: ['Cocooning', 'Cuisine', 'Tech', 'Rentrée', 'Halloween'] },
                { season: 'Hiver', icon: <Snowflake className="w-8 h-8" />, color: 'blue', ideas: ['Noël', 'Ski', 'Chocolat', 'Bien-être', 'Gaming'] },
              ].map((season, index) => (
                <div key={index} className={`bg-${season.color}-50 rounded-xl p-6 border border-${season.color}-100`}>
                  <div className={`text-${season.color}-600 mb-4`}>
                    {season.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">{season.season}</h3>
                  <ul className="space-y-1">
                    {season.ideas.map((idea, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 bg-${season.color}-400 rounded-full`}></span>
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection items={faqItems} title="Questions Fréquentes" />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Prêt à Lancer Votre Prochain Concours ?</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour un tirage au sort transparent et professionnel. 
                Gratuit, sans inscription.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Lancer un tirage
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CalendrierConcoursPage;
