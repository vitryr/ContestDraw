import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  Copy,
  Download,
  Calendar,
  Users,
  Gift,
  Building2,
  Mail,
  Clock,
  Shield,
  Sparkles,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/outils/generateur-reglement/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Outils', url: 'https://cleack.io/outils/' },
  { name: 'Générateur Règlement', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "Ce générateur de règlement est-il gratuit ?",
    answer: "Oui, 100% gratuit et sans inscription. Vous pouvez générer autant de règlements que vous le souhaitez."
  },
  {
    question: "Le règlement généré est-il légalement valide ?",
    answer: "Ce générateur crée un règlement conforme aux exigences légales françaises pour les loteries publicitaires. Cependant, pour des enjeux importants, nous recommandons de faire valider par un juriste."
  },
  {
    question: "Puis-je modifier le règlement après génération ?",
    answer: "Oui, le texte généré est entièrement modifiable. Copiez-le et adaptez-le à vos besoins spécifiques."
  },
  {
    question: "Où dois-je publier ce règlement ?",
    answer: "Rendez-le accessible aux participants : en commentaire épinglé, dans un lien en bio, sur votre site web, ou dans une Story à la une."
  },
];

const GenerateurReglementPage = () => {
  const [formData, setFormData] = useState({
    organisateur: '',
    adresse: '',
    siret: '',
    nomConcours: '',
    dateDebut: '',
    dateFin: '',
    dateTirage: '',
    descriptionLot: '',
    valeurLot: '',
    nombreGagnants: '1',
    plateforme: 'Instagram',
    conditionsParticipation: 'Follow + Like + Commentaire',
    ageMinimum: '18',
    residence: 'France métropolitaine',
    emailContact: '',
    dureeConservation: '3 mois',
  });

  const [generatedReglement, setGeneratedReglement] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateReglement = () => {
    const reglement = `RÈGLEMENT DU JEU CONCOURS « ${formData.nomConcours || '[NOM DU CONCOURS]'} »

ARTICLE 1 – ORGANISATION
La société ${formData.organisateur || '[NOM DE L\'ORGANISATEUR]'}${formData.siret ? `, immatriculée sous le n° SIRET ${formData.siret}` : ''}, dont le siège social est situé ${formData.adresse || '[ADRESSE]'}, organise un jeu concours gratuit sans obligation d'achat du ${formData.dateDebut || '[DATE DÉBUT]'} au ${formData.dateFin || '[DATE FIN]'} inclus sur la plateforme ${formData.plateforme}.

ARTICLE 2 – CONDITIONS DE PARTICIPATION
Ce jeu est ouvert à toute personne physique âgée de ${formData.ageMinimum} ans minimum, résidant en ${formData.residence}, à l'exception des employés de la société organisatrice et de leur famille.
Une seule participation par personne est autorisée.

ARTICLE 3 – MODALITÉS DE PARTICIPATION
Pour participer, il suffit de :
${formData.conditionsParticipation.split(' + ').map((c, i) => `${i + 1}. ${c}`).join('\n')}

sur la publication officielle du concours.

ARTICLE 4 – DOTATION
Le lot mis en jeu est : ${formData.descriptionLot || '[DESCRIPTION DU LOT]'}
Valeur commerciale estimée : ${formData.valeurLot || '[VALEUR]'} € TTC
Nombre de gagnant(s) : ${formData.nombreGagnants}
Le lot est non échangeable, non transmissible et non remboursable.

ARTICLE 5 – DÉSIGNATION DU GAGNANT
Le(s) gagnant(s) sera(ont) désigné(s) par tirage au sort aléatoire parmi les participations valides, le ${formData.dateTirage || '[DATE TIRAGE]'}, à l'aide de l'outil Cleack.io qui garantit un tirage 100% aléatoire et transparent.

ARTICLE 6 – NOTIFICATION ET ATTRIBUTION DU LOT
Le gagnant sera contacté par message privé sur ${formData.plateforme} dans les 7 jours suivant le tirage. Il devra répondre dans un délai de 7 jours pour confirmer son acceptation et communiquer ses coordonnées pour l'envoi du lot.
À défaut de réponse dans ce délai, un nouveau gagnant sera désigné par tirage au sort.

ARTICLE 7 – DONNÉES PERSONNELLES (RGPD)
Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, les données personnelles collectées sont utilisées exclusivement pour la gestion du présent concours.
- Responsable du traitement : ${formData.organisateur || '[ORGANISATEUR]'}
- Données collectées : pseudo ${formData.plateforme}, et pour le gagnant : nom, prénom, adresse postale, email
- Finalité : organisation du concours et envoi du lot
- Durée de conservation : ${formData.dureeConservation} après la fin du concours
- Droits des participants : accès, rectification, suppression, portabilité
- Contact : ${formData.emailContact || '[EMAIL]'}

ARTICLE 8 – RESPONSABILITÉ
L'organisateur ne saurait être tenu responsable des problèmes techniques, d'acheminement postal, ou de tout dysfonctionnement lié à ${formData.plateforme}.
${formData.plateforme} n'est en aucun cas associé(e) à ce jeu concours et ne sponsorise pas cette opération.

ARTICLE 9 – ACCEPTATION DU RÈGLEMENT
La participation au jeu implique l'acceptation sans réserve du présent règlement.
Le règlement complet est disponible sur demande à l'adresse : ${formData.emailContact || '[EMAIL]'}

ARTICLE 10 – LOI APPLICABLE
Ce jeu est soumis à la loi française. Tout litige relatif à ce jeu sera de la compétence exclusive des tribunaux français.

Fait le ${new Date().toLocaleDateString('fr-FR')}`;

    setGeneratedReglement(reglement);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReglement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([generatedReglement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reglement-${formData.nomConcours || 'concours'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="Générateur de Règlement Jeu Concours Gratuit | Cleack"
        description="Générez gratuitement un règlement de jeu concours conforme à la loi française. Outil gratuit, sans inscription. Idéal pour Instagram, TikTok, Facebook."
        keywords="générateur règlement concours, créer règlement jeu concours, modèle règlement gratuit, règlement concours instagram, générateur règlement gratuit"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-generateur-reglement.jpg"
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-bg-primary via-bg-elevated to-bg-primary">
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
              <div className="inline-flex items-center gap-2 bg-accent-secondary/20 text-accent-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FileText className="w-4 h-4" />
                Outil Gratuit
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Générateur de{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Règlement Concours
                </span>
              </h1>

              <p className="text-xl text-ink-secondary mb-8 max-w-3xl mx-auto">
                Créez un règlement de jeu concours conforme à la loi française en quelques clics. 
                100% gratuit, sans inscription.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Formulaire */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-bg-primary rounded-2xl shadow-lg p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Informations du Concours</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Organisateur */}
                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Nom de l'organisateur *
                  </label>
                  <input
                    type="text"
                    name="organisateur"
                    value={formData.organisateur}
                    onChange={handleChange}
                    placeholder="Votre nom ou société"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    SIRET (optionnel)
                  </label>
                  <input
                    type="text"
                    name="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    placeholder="123 456 789 00012"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Adresse complète"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Concours */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    Nom du concours *
                  </label>
                  <input
                    type="text"
                    name="nomConcours"
                    value={formData.nomConcours}
                    onChange={handleChange}
                    placeholder="Ex: Grand Giveaway de Noël 2024"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date de début *
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Date du tirage *
                  </label>
                  <input
                    type="date"
                    name="dateTirage"
                    value={formData.dateTirage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    Plateforme
                  </label>
                  <select
                    name="plateforme"
                    value={formData.plateforme}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>Facebook</option>
                    <option>YouTube</option>
                    <option>Twitter/X</option>
                  </select>
                </div>

                {/* Lot */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Gift className="w-4 h-4 inline mr-2" />
                    Description du lot *
                  </label>
                  <textarea
                    name="descriptionLot"
                    value={formData.descriptionLot}
                    onChange={handleChange}
                    placeholder="Ex: Un iPhone 15 Pro 128Go coloris noir"
                    rows={2}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    Valeur estimée (€) *
                  </label>
                  <input
                    type="text"
                    name="valeurLot"
                    value={formData.valeurLot}
                    onChange={handleChange}
                    placeholder="Ex: 1199"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    Nombre de gagnants
                  </label>
                  <input
                    type="number"
                    name="nombreGagnants"
                    value={formData.nombreGagnants}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Conditions */}
                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Conditions de participation
                  </label>
                  <select
                    name="conditionsParticipation"
                    value={formData.conditionsParticipation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option>Follow + Like + Commentaire</option>
                    <option>Follow + Like + Tag 2 amis</option>
                    <option>Follow + Commentaire</option>
                    <option>Like + Commentaire</option>
                    <option>Commentaire uniquement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    Âge minimum
                  </label>
                  <select
                    name="ageMinimum"
                    value={formData.ageMinimum}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="13">13 ans</option>
                    <option value="16">16 ans</option>
                    <option value="18">18 ans (majeur)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email de contact *
                  </label>
                  <input
                    type="email"
                    name="emailContact"
                    value={formData.emailContact}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Durée conservation données
                  </label>
                  <select
                    name="dureeConservation"
                    value={formData.dureeConservation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option>1 mois</option>
                    <option>3 mois</option>
                    <option>6 mois</option>
                    <option>1 an</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={generateReglement}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Générer le règlement
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Résultat */}
        {generatedReglement && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-bg-primary rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                <div className="bg-accent-secondary/10 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                  <span className="font-semibold text-emerald-800">Votre règlement est prêt !</span>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-2 bg-bg-primary text-accent-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-secondary/10 transition-all"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copié !' : 'Copier'}
                    </button>
                    <button
                      onClick={downloadTxt}
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-ink-secondary font-mono bg-bg-elevated rounded-lg p-4 max-h-96 overflow-y-auto">
                    {generatedReglement}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <FAQSection items={faqItems} title="Questions Fréquentes" />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-bg-primary">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Règlement Prêt ? Lancez Votre Tirage !</h2>
              <p className="text-white/90 mb-6">
                Utilisez Cleack pour tirer au sort le gagnant de manière transparente et professionnelle.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-primary text-accent-secondary px-8 py-4 rounded-xl font-semibold hover:bg-accent-secondary/10 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Lancer un tirage au sort
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GenerateurReglementPage;
