import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Politique de Confidentialité
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 mb-4">
              Flowrigin OÜ ("nous", "notre", "ContestDraw") s'engage à protéger
              votre vie privée. Cette politique de confidentialité explique
              comment nous collectons, utilisons, stockons et protégeons vos
              données personnelles lorsque vous utilisez notre plateforme
              ContestDraw.
            </p>
            <p className="text-gray-600">
              En utilisant ContestDraw, vous acceptez les pratiques décrites
              dans cette politique. Nous vous encourageons à la lire
              attentivement.
            </p>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Responsable du Traitement
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p>
                <strong>Société :</strong> Flowrigin OÜ
              </p>
              <p>
                <strong>Numéro d'enregistrement :</strong> 17371835
              </p>
              <p>
                <strong>Adresse :</strong> Sepapaja tn 6, Tallinn 15551, Estonia
              </p>
              <p>
                <strong>Email DPO :</strong>{" "}
                <a
                  href="mailto:privacy@contestdraw.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@contestdraw.com
                </a>
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Données Collectées
            </h2>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              3.1 Données que vous nous fournissez
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Données de compte :</strong> nom, prénom, adresse email,
                mot de passe (hashé)
              </li>
              <li>
                <strong>Données de profil :</strong> photo de profil, nom
                d'entreprise (optionnel)
              </li>
              <li>
                <strong>Données de paiement :</strong> traitées par Stripe
                (nous ne stockons pas vos données bancaires)
              </li>
              <li>
                <strong>Données des tirages :</strong> titre, description,
                règles, participants
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              3.2 Données collectées automatiquement
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Données techniques :</strong> adresse IP, type de
                navigateur, système d'exploitation
              </li>
              <li>
                <strong>Données d'utilisation :</strong> pages visitées, actions
                effectuées, horodatages
              </li>
              <li>
                <strong>Cookies :</strong> voir la section dédiée ci-dessous
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              3.3 Données des réseaux sociaux
            </h3>
            <p className="text-gray-600">
              Si vous connectez un compte Instagram, YouTube, TikTok ou
              Facebook, nous accédons aux données publiques nécessaires pour
              effectuer les tirages au sort (commentaires publics, mentions,
              followers) selon les autorisations accordées.
            </p>
          </section>

          {/* Finalités du traitement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Finalités du Traitement
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Fourniture du service :</strong> créer et gérer votre
                compte, effectuer des tirages au sort
              </li>
              <li>
                <strong>Facturation :</strong> traiter les paiements et émettre
                des factures
              </li>
              <li>
                <strong>Communication :</strong> vous envoyer des notifications
                sur vos tirages, répondre à vos demandes
              </li>
              <li>
                <strong>Amélioration du service :</strong> analyser l'utilisation
                pour améliorer ContestDraw
              </li>
              <li>
                <strong>Sécurité :</strong> détecter et prévenir la fraude et les
                abus
              </li>
              <li>
                <strong>Obligations légales :</strong> respecter nos obligations
                légales et fiscales
              </li>
            </ul>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Base Légale du Traitement
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Exécution du contrat :</strong> pour fournir nos services
                (Art. 6.1.b RGPD)
              </li>
              <li>
                <strong>Consentement :</strong> pour certaines communications
                marketing (Art. 6.1.a RGPD)
              </li>
              <li>
                <strong>Intérêts légitimes :</strong> pour améliorer nos services
                et assurer la sécurité (Art. 6.1.f RGPD)
              </li>
              <li>
                <strong>Obligation légale :</strong> pour respecter nos
                obligations fiscales et légales (Art. 6.1.c RGPD)
              </li>
            </ul>
          </section>

          {/* Partage des données */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Partage des Données
            </h2>
            <p className="text-gray-600 mb-4">
              Nous ne vendons jamais vos données personnelles. Nous pouvons
              partager vos données avec :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Prestataires de services :</strong>
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>Stripe (paiements) - États-Unis</li>
                  <li>Vercel (hébergement) - États-Unis</li>
                  <li>Brevo (emails transactionnels) - France</li>
                </ul>
              </li>
              <li>
                <strong>Autorités légales :</strong> si requis par la loi
              </li>
              <li>
                <strong>Participants publics :</strong> les résultats des tirages
                peuvent être rendus publics (noms d'utilisateur des gagnants)
              </li>
            </ul>
          </section>

          {/* Transferts internationaux */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Transferts Internationaux
            </h2>
            <p className="text-gray-600 mb-4">
              Certains de nos prestataires sont situés hors de l'Espace
              Économique Européen (EEE). Nous nous assurons que ces transferts
              sont encadrés par des garanties appropriées :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Clauses contractuelles types de la Commission européenne</li>
              <li>
                Data Privacy Framework EU-US (pour les prestataires américains
                certifiés)
              </li>
            </ul>
          </section>

          {/* Conservation des données */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Conservation des Données
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Données de compte :</strong> conservées tant que votre
                compte est actif, puis 3 ans après la clôture
              </li>
              <li>
                <strong>Données des tirages :</strong> conservées 3 ans après le
                tirage pour preuves légales
              </li>
              <li>
                <strong>Données de facturation :</strong> conservées 10 ans
                (obligation légale comptable)
              </li>
              <li>
                <strong>Logs techniques :</strong> conservés 1 an maximum
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section id="cookies">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              9. Cookies
            </h2>
            <p className="text-gray-600 mb-4">
              Nous utilisons des cookies pour assurer le bon fonctionnement du
              site :
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-gray-700">Finalité</th>
                    <th className="px-4 py-3 text-left text-gray-700">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3">Essentiels</td>
                    <td className="px-4 py-3">
                      Authentification, sécurité, préférences
                    </td>
                    <td className="px-4 py-3">Session / 1 an</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Analytiques</td>
                    <td className="px-4 py-3">
                      Mesure d'audience (anonymisée)
                    </td>
                    <td className="px-4 py-3">13 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 mt-4">
              Vous pouvez gérer vos préférences de cookies via notre bandeau de
              consentement ou les paramètres de votre navigateur.
            </p>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              10. Vos Droits
            </h2>
            <p className="text-gray-600 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Droit d'accès :</strong> obtenir une copie de vos données
              </li>
              <li>
                <strong>Droit de rectification :</strong> corriger vos données
                inexactes
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> demander la suppression
                de vos données
              </li>
              <li>
                <strong>Droit à la limitation :</strong> limiter le traitement
                de vos données
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir vos données
                dans un format structuré
              </li>
              <li>
                <strong>Droit d'opposition :</strong> vous opposer au traitement
                de vos données
              </li>
              <li>
                <strong>Droit de retirer votre consentement :</strong> à tout
                moment pour les traitements basés sur le consentement
              </li>
            </ul>
            <p className="text-gray-600 mb-4">
              Pour exercer vos droits, contactez-nous à{" "}
              <a
                href="mailto:privacy@contestdraw.com"
                className="text-blue-600 hover:underline"
              >
                privacy@contestdraw.com
              </a>
            </p>
            <p className="text-gray-600">
              Vous pouvez également déposer une réclamation auprès de l'autorité
              de protection des données estonienne :{" "}
              <a
                href="https://www.aki.ee/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Andmekaitse Inspektsioon (AKI)
              </a>
            </p>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              11. Sécurité des Données
            </h2>
            <p className="text-gray-600 mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Chiffrement TLS/SSL pour toutes les communications</li>
              <li>Hashage des mots de passe (bcrypt)</li>
              <li>Accès restreint aux données sur le principe du besoin</li>
              <li>Surveillance et détection des intrusions</li>
              <li>Sauvegardes régulières et chiffrées</li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              12. Modifications
            </h2>
            <p className="text-gray-600">
              Nous pouvons modifier cette politique de confidentialité à tout
              moment. En cas de modification significative, nous vous en
              informerons par email ou via une notification sur la plateforme.
              La date de dernière mise à jour est indiquée en bas de cette page.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              13. Contact
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p>
                <strong>Pour toute question sur cette politique :</strong>
              </p>
              <p>
                Email :{" "}
                <a
                  href="mailto:privacy@contestdraw.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@contestdraw.com
                </a>
              </p>
              <p>Adresse : Flowrigin OÜ, Sepapaja tn 6, Tallinn 15551, Estonia</p>
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
