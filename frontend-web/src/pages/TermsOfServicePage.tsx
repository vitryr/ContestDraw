import { useTranslation } from "react-i18next";

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Conditions Générales d'Utilisation
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          {/* Préambule */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Préambule
            </h2>
            <p className="text-gray-600 mb-4">
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU")
              régissent l'utilisation de la plateforme ContestDraw, éditée par
              Flowrigin OÜ, société de droit estonien immatriculée sous le
              numéro 17371835, dont le siège social est situé à Sepapaja tn 6,
              Tallinn 15551, Estonia.
            </p>
            <p className="text-gray-600">
              L'utilisation de ContestDraw implique l'acceptation pleine et
              entière des présentes CGU. Si vous n'acceptez pas ces conditions,
              veuillez ne pas utiliser nos services.
            </p>
          </section>

          {/* Définitions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Définitions
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>"Plateforme" :</strong> le site web ContestDraw et ses
                services associés
              </li>
              <li>
                <strong>"Utilisateur" :</strong> toute personne utilisant la
                Plateforme
              </li>
              <li>
                <strong>"Organisateur" :</strong> Utilisateur créant et gérant
                des tirages au sort
              </li>
              <li>
                <strong>"Participant" :</strong> personne participant à un
                tirage au sort
              </li>
              <li>
                <strong>"Tirage" :</strong> opération de sélection aléatoire de
                gagnants parmi les Participants
              </li>
              <li>
                <strong>"Crédits" :</strong> unités d'utilisation permettant
                d'effectuer des tirages
              </li>
            </ul>
          </section>

          {/* Description du service */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Description du Service
            </h2>
            <p className="text-gray-600 mb-4">
              ContestDraw est une plateforme SaaS permettant de :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                Importer automatiquement les participants depuis les réseaux
                sociaux (Instagram, YouTube, TikTok, Facebook)
              </li>
              <li>Effectuer des tirages au sort certifiés et transparents</li>
              <li>Appliquer des filtres (followers, hashtags, mentions)</li>
              <li>Générer des certificats de conformité légale</li>
              <li>Créer des pages de vérification publique des résultats</li>
            </ul>
          </section>

          {/* Inscription */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Inscription et Compte
            </h2>
            <h3 className="text-xl font-medium text-gray-700 mb-3">
              4.1 Conditions d'inscription
            </h3>
            <p className="text-gray-600 mb-4">
              Pour utiliser ContestDraw, vous devez :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Être âgé d'au moins 18 ans ou avoir la majorité légale</li>
              <li>
                Fournir des informations exactes et à jour lors de l'inscription
              </li>
              <li>Avoir la capacité juridique de conclure un contrat</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              4.2 Sécurité du compte
            </h3>
            <p className="text-gray-600 mb-4">
              Vous êtes responsable de la confidentialité de vos identifiants et
              de toutes les activités effectuées sous votre compte. Vous vous
              engagez à nous notifier immédiatement toute utilisation non
              autorisée.
            </p>
          </section>

          {/* Utilisation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Utilisation du Service
            </h2>
            <h3 className="text-xl font-medium text-gray-700 mb-3">
              5.1 Utilisations autorisées
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Organisation de jeux-concours et tirages au sort légaux</li>
              <li>
                Promotion commerciale ou personnelle dans le respect des lois
              </li>
              <li>Sélection aléatoire de participants pour des événements</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              5.2 Utilisations interdites
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Organisation de loteries ou jeux d'argent illégaux</li>
              <li>Utilisation frauduleuse ou manipulation des tirages</li>
              <li>
                Violation des conditions d'utilisation des réseaux sociaux
              </li>
              <li>Collecte de données personnelles sans consentement</li>
              <li>Tout usage contraire aux lois applicables</li>
              <li>
                Création de faux participants ou manipulation des résultats
              </li>
            </ul>
          </section>

          {/* Responsabilité Organisateur */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Responsabilités de l'Organisateur
            </h2>
            <p className="text-gray-600 mb-4">
              En tant qu'Organisateur, vous êtes seul responsable de :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                La conformité de vos jeux-concours avec les lois applicables
                (France, UE, pays des participants)
              </li>
              <li>La rédaction d'un règlement de jeu complet et légal</li>
              <li>
                Le dépôt du règlement chez un huissier si requis par la loi
              </li>
              <li>
                La déclaration éventuelle auprès des autorités compétentes
              </li>
              <li>La remise effective des lots aux gagnants</li>
              <li>Le respect des CGU des plateformes sociales utilisées</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
              <p className="text-yellow-800 text-sm">
                <strong>Important :</strong> ContestDraw fournit un outil
                technique et ne peut être tenu responsable du non-respect des
                obligations légales par l'Organisateur.
              </p>
            </div>
          </section>

          {/* Tarification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Tarification et Paiement
            </h2>
            <h3 className="text-xl font-medium text-gray-700 mb-3">
              7.1 Système de crédits
            </h3>
            <p className="text-gray-600 mb-4">
              ContestDraw fonctionne avec un système de crédits. Chaque tirage
              consomme un certain nombre de crédits selon le nombre de
              participants.
            </p>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              7.2 Paiement
            </h3>
            <p className="text-gray-600 mb-4">
              Les paiements sont traités de manière sécurisée via Stripe. Les
              prix sont affichés en euros et peuvent être modifiés à tout
              moment. Toute modification de prix sera communiquée avant son
              entrée en vigueur.
            </p>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              7.3 Remboursement
            </h3>
            <p className="text-gray-600">
              Les crédits achetés ne sont pas remboursables sauf en cas de
              dysfonctionnement technique imputable à ContestDraw. Les demandes
              de remboursement doivent être adressées à{" "}
              <a
                href="mailto:support@contestdraw.com"
                className="text-blue-600 hover:underline"
              >
                support@contestdraw.com
              </a>{" "}
              dans un délai de 14 jours.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Propriété Intellectuelle
            </h2>
            <p className="text-gray-600 mb-4">
              La Plateforme, son code source, son design et ses fonctionnalités
              sont la propriété exclusive de Flowrigin OÜ et sont protégés par
              les lois sur la propriété intellectuelle.
            </p>
            <p className="text-gray-600">
              L'Utilisateur conserve la propriété des contenus qu'il publie sur
              la Plateforme mais accorde à Flowrigin OÜ une licence non
              exclusive pour afficher ces contenus dans le cadre du service.
            </p>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              9. Limitation de Responsabilité
            </h2>
            <p className="text-gray-600 mb-4">
              ContestDraw est fourni "tel quel". Flowrigin OÜ ne garantit pas :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Un fonctionnement ininterrompu ou exempt d'erreurs</li>
              <li>
                La disponibilité permanente des API tierces (Instagram, etc.)
              </li>
              <li>
                La conformité légale des jeux organisés par les Utilisateurs
              </li>
            </ul>
            <p className="text-gray-600">
              En aucun cas, Flowrigin OÜ ne pourra être tenu responsable des
              dommages indirects, pertes de profits ou préjudices résultant de
              l'utilisation de la Plateforme.
            </p>
          </section>

          {/* Suspension */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              10. Suspension et Résiliation
            </h2>
            <p className="text-gray-600 mb-4">
              Flowrigin OÜ se réserve le droit de suspendre ou résilier votre
              compte en cas de :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Violation des présentes CGU</li>
              <li>Activité frauduleuse ou illégale</li>
              <li>Non-paiement des services</li>
              <li>Usage abusif de la Plateforme</li>
            </ul>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              11. Données Personnelles
            </h2>
            <p className="text-gray-600">
              Le traitement des données personnelles est décrit dans notre{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:underline font-medium"
              >
                Politique de Confidentialité
              </a>
              , qui fait partie intégrante des présentes CGU.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              12. Modification des CGU
            </h2>
            <p className="text-gray-600">
              Flowrigin OÜ peut modifier les présentes CGU à tout moment. Les
              modifications seront communiquées par email ou notification sur la
              Plateforme avec un préavis de 30 jours. L'utilisation continue de
              la Plateforme après ce délai vaut acceptation des nouvelles CGU.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              13. Droit Applicable et Litiges
            </h2>
            <p className="text-gray-600 mb-4">
              Les présentes CGU sont régies par le droit estonien. Tout litige
              relatif à l'interprétation ou l'exécution des présentes sera
              soumis aux tribunaux compétents de Tallinn, Estonie.
            </p>
            <p className="text-gray-600">
              Conformément au Règlement européen n°524/2013, vous pouvez
              également recourir à la plateforme de Règlement en Ligne des
              Litiges (RLL) :{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              14. Contact
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p>
                <strong>Pour toute question sur ces CGU :</strong>
              </p>
              <p>
                Email :{" "}
                <a
                  href="mailto:legal@contestdraw.com"
                  className="text-blue-600 hover:underline"
                >
                  legal@contestdraw.com
                </a>
              </p>
              <p>
                Adresse : Flowrigin OÜ, Sepapaja tn 6, Tallinn 15551, Estonia
              </p>
            </div>
          </section>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Dernière mise à jour : Janvier 2026
        </p>
      </div>
    </div>
  );
}
