import { motion } from "framer-motion";
import { FileText, AlertTriangle, CreditCard, Shield, Scale, Ban, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-primary py-12">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -20, 30, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-accent-secondary/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary mb-6">
              <Scale className="w-4 h-4" />
              Terms
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-accent-secondary to-accent-primary rounded-full mx-auto" />
          </div>

          <div className="bg-bg-card border border-white/[0.06] rounded-2xl p-8 space-y-8">
            {/* Préambule */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">1. Préambule</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation de la plateforme Cleack, éditée par Flowrigin OÜ, société de droit estonien immatriculée sous le numéro 17371835, dont le siège social est situé à Sepapaja tn 6, Tallinn 15551, Estonia.
              </p>
              <p className="text-ink-secondary">
                L'utilisation de Cleack implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>
            </section>

            {/* Définitions */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">2. Définitions</h2>
              </div>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li><strong className="text-white">"Plateforme" :</strong> le site web Cleack et ses services associés</li>
                <li><strong className="text-white">"Utilisateur" :</strong> toute personne utilisant la Plateforme</li>
                <li><strong className="text-white">"Organisateur" :</strong> Utilisateur créant et gérant des tirages au sort</li>
                <li><strong className="text-white">"Participant" :</strong> personne participant à un tirage au sort</li>
                <li><strong className="text-white">"Tirage" :</strong> opération de sélection aléatoire de gagnants parmi les Participants</li>
                <li><strong className="text-white">"Crédits" :</strong> unités d'utilisation permettant d'effectuer des tirages</li>
              </ul>
            </section>

            {/* Description du service */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-white">3. Description du Service</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Cleack est une plateforme SaaS permettant de :
              </p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li>Importer automatiquement les participants depuis les réseaux sociaux (Instagram, YouTube, TikTok, Facebook)</li>
                <li>Effectuer des tirages au sort certifiés et transparents</li>
                <li>Appliquer des filtres (followers, hashtags, mentions)</li>
                <li>Générer des certificats de conformité légale</li>
                <li>Créer des pages de vérification publique des résultats</li>
              </ul>
            </section>

            {/* Inscription */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-2xl font-semibold text-white">4. Inscription et Compte</h2>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">4.1 Conditions d'inscription</h3>
              <p className="text-ink-secondary mb-4">Pour utiliser Cleack, vous devez :</p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2 mb-6">
                <li>Être âgé d'au moins 18 ans ou avoir la majorité légale</li>
                <li>Fournir des informations exactes et à jour lors de l'inscription</li>
                <li>Avoir la capacité juridique de conclure un contrat</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">4.2 Sécurité du compte</h3>
              <p className="text-ink-secondary">
                Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte. Vous vous engagez à nous notifier immédiatement toute utilisation non autorisée.
              </p>
            </section>

            {/* Utilisation */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">5. Utilisation du Service</h2>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">5.1 Utilisations autorisées</h3>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2 mb-6">
                <li>Organisation de jeux-concours et tirages au sort légaux</li>
                <li>Promotion commerciale ou personnelle dans le respect des lois</li>
                <li>Sélection aléatoire de participants pour des événements</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">5.2 Utilisations interdites</h3>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li>Organisation de loteries ou jeux d'argent illégaux</li>
                <li>Utilisation frauduleuse ou manipulation des tirages</li>
                <li>Violation des conditions d'utilisation des réseaux sociaux</li>
                <li>Collecte de données personnelles sans consentement</li>
                <li>Tout usage contraire aux lois applicables</li>
                <li>Création de faux participants ou manipulation des résultats</li>
              </ul>
            </section>

            {/* Responsabilité Organisateur */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-2xl font-semibold text-white">6. Responsabilités de l'Organisateur</h2>
              </div>
              <p className="text-ink-secondary mb-4">En tant qu'Organisateur, vous êtes seul responsable de :</p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2 mb-4">
                <li>La conformité de vos jeux-concours avec les lois applicables (France, UE, pays des participants)</li>
                <li>La rédaction d'un règlement de jeu complet et légal</li>
                <li>Le dépôt du règlement chez un huissier si requis par la loi</li>
                <li>La déclaration éventuelle auprès des autorités compétentes</li>
                <li>La remise effective des lots aux gagnants</li>
                <li>Le respect des CGU des plateformes sociales utilisées</li>
              </ul>
              <div className="bg-warning/10 border border-warning/30 p-4 rounded-xl">
                <p className="text-warning text-sm">
                  <strong>Important :</strong> Cleack fournit un outil technique et ne peut être tenu responsable du non-respect des obligations légales par l'Organisateur.
                </p>
              </div>
            </section>

            {/* Tarification */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">7. Tarification et Paiement</h2>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">7.1 Système de crédits</h3>
              <p className="text-ink-secondary mb-6">
                Cleack fonctionne avec un système de crédits. Chaque tirage consomme un certain nombre de crédits selon le nombre de participants.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">7.2 Paiement</h3>
              <p className="text-ink-secondary mb-6">
                Les paiements sont traités de manière sécurisée via Stripe. Les prix sont affichés en euros et peuvent être modifiés à tout moment. Toute modification de prix sera communiquée avant son entrée en vigueur.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">7.3 Remboursement</h3>
              <p className="text-ink-secondary">
                Les crédits achetés ne sont pas remboursables sauf en cas de dysfonctionnement technique imputable à Cleack. Les demandes de remboursement doivent être adressées à{" "}
                <a href="mailto:support@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">support@cleack.io</a>{" "}
                dans un délai de 14 jours.
              </p>
            </section>

            {/* Limitation de responsabilité */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-error" />
                </div>
                <h2 className="text-2xl font-semibold text-white">9. Limitation de Responsabilité</h2>
              </div>
              <p className="text-ink-secondary mb-4">Cleack est fourni "tel quel". Flowrigin OÜ ne garantit pas :</p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2 mb-4">
                <li>Un fonctionnement ininterrompu ou exempt d'erreurs</li>
                <li>La disponibilité permanente des API tierces (Instagram, etc.)</li>
                <li>La conformité légale des jeux organisés par les Utilisateurs</li>
              </ul>
              <p className="text-ink-secondary">
                En aucun cas, Flowrigin OÜ ne pourra être tenu responsable des dommages indirects, pertes de profits ou préjudices résultant de l'utilisation de la Plateforme.
              </p>
            </section>

            {/* Droit applicable */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">13. Droit Applicable et Litiges</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Les présentes CGU sont régies par le droit estonien. Tout litige relatif à l'interprétation ou l'exécution des présentes sera soumis aux tribunaux compétents de Tallinn, Estonie.
              </p>
              <p className="text-ink-secondary">
                Conformément au Règlement européen n°524/2013, vous pouvez également recourir à la plateforme de Règlement en Ligne des Litiges (RLL) :{" "}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-accent-secondary hover:text-accent-tertiary">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-white">14. Contact</h2>
              </div>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-2 text-ink-secondary">
                <p><strong className="text-white">Pour toute question sur ces CGU :</strong></p>
                <p>Email : <a href="mailto:legal@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">legal@cleack.io</a></p>
                <p>Adresse : Flowrigin OÜ, Sepapaja tn 6, Tallinn 15551, Estonia</p>
              </div>
            </section>
          </div>

          <p className="text-center text-ink-muted mt-8 text-sm">
            Dernière mise à jour : Janvier 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
