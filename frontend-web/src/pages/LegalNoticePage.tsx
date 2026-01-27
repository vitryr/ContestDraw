import { useTranslation } from "react-i18next";

export default function LegalNoticePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Mentions Légales
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Éditeur du Site
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p>
                <strong>Raison sociale :</strong> Flowrigin OÜ
              </p>
              <p>
                <strong>Forme juridique :</strong> Osaühing (Société à
                responsabilité limitée privée - OÜ)
              </p>
              <p>
                <strong>Capital social :</strong> 1 EUR
              </p>
              <p>
                <strong>Numéro d'enregistrement :</strong> 17371835
              </p>
              <p>
                <strong>Registre :</strong> Registre du commerce estonien
                (Äriregister)
              </p>
              <p>
                <strong>Lien registre :</strong>{" "}
                <a
                  href="https://ariregister.rik.ee/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://ariregister.rik.ee/
                </a>
              </p>
              <p>
                <strong>Statut TVA :</strong> Non assujetti à la TVA (en dessous
                du seuil)
              </p>
              <p>
                <strong>Date d'enregistrement :</strong> 13 novembre 2024
              </p>
              <p>
                <strong>Activité :</strong> Programmation informatique, conseil
                (NACE 62101)
              </p>
              <p>
                <strong>Siège social :</strong> Sepapaja tn 6, Tallinn 15551,
                Estonia
              </p>
              <p>
                <strong>Téléphone :</strong> +33 6 25 75 44 20
              </p>
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@cleack.io"
                  className="text-blue-600 hover:underline"
                >
                  contact@cleack.io
                </a>
              </p>
              <p>
                <strong>Site web :</strong>{" "}
                <a
                  href="https://cleack.io"
                  className="text-blue-600 hover:underline"
                >
                  https://cleack.io
                </a>
              </p>
            </div>
          </section>

          {/* Directeur de la publication */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Directeur de la Publication
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p>
                <strong>Nom :</strong> Romain Vitry
              </p>
              <p>
                <strong>Fonction :</strong> Membre du conseil d'administration
                (Board Member)
              </p>
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@cleack.io"
                  className="text-blue-600 hover:underline"
                >
                  contact@cleack.io
                </a>
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Hébergement du Site
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p>
                <strong>Hébergeur :</strong> Vercel Inc.
              </p>
              <p>
                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                91789, USA
              </p>
              <p>
                <strong>Site web :</strong>{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Propriété Intellectuelle
            </h2>
            <p className="text-gray-600 mb-4">
              L'ensemble de ce site relève de la législation estonienne et
              internationale sur le droit d'auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les représentations
              iconographiques et photographiques.
            </p>
            <p className="text-gray-600">
              Les marques, logos, et noms de domaine apparaissant sur le site
              sont la propriété de Flowrigin OÜ ou font l'objet d'une
              autorisation d'utilisation. Toute reproduction non autorisée
              constitue une contrefaçon susceptible d'engager la responsabilité
              civile et pénale.
            </p>
          </section>

          {/* Protection des données */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Protection des Données Personnelles
            </h2>
            <p className="text-gray-600 mb-4">
              Cleack accorde une grande importance à la protection de vos
              données personnelles. Le traitement de vos données personnelles
              est effectué conformément au Règlement Général sur la Protection
              des Données (RGPD).
            </p>
            <p className="text-gray-600 mb-4">
              Pour plus d'informations, consultez notre{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:underline font-medium"
              >
                Politique de Confidentialité
              </a>
              .
            </p>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-800 mb-2">
                Responsable du traitement des données
              </h3>
              <p>
                <strong>Nom :</strong> Flowrigin OÜ
              </p>
              <p>
                <strong>Numéro d'enregistrement :</strong> 17371835
              </p>
              <p>
                <strong>Email DPO :</strong>{" "}
                <a
                  href="mailto:privacy@cleack.io"
                  className="text-blue-600 hover:underline"
                >
                  privacy@cleack.io
                </a>
              </p>

              <h3 className="font-semibold text-gray-800 mb-2 mt-4">
                Autorité de protection des données
              </h3>
              <p>
                <strong>Nom :</strong> Andmekaitse Inspektsioon (AKI)
              </p>
              <p>
                <strong>Site web :</strong>{" "}
                <a
                  href="https://www.aki.ee/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.aki.ee
                </a>
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Droit Applicable
            </h2>
            <p className="text-gray-600 mb-4">
              Le présent site et les présentes mentions légales sont régis par
              le droit estonien. En cas de litige et à défaut d'accord amiable,
              le litige sera porté devant les tribunaux estoniens.
            </p>
            <p className="text-gray-600">
              Flowrigin OÜ est une société estonienne enregistrée en République
              d'Estonie, membre de l'Union Européenne. Nous respectons toutes
              les réglementations européennes applicables, notamment le RGPD.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Contact
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@cleack.io"
                  className="text-blue-600 hover:underline"
                >
                  contact@cleack.io
                </a>
              </p>
              <p>
                <strong>Téléphone :</strong> +33 6 25 75 44 20
              </p>
              <p>
                <strong>Adresse :</strong> Flowrigin OÜ, Sepapaja tn 6, Tallinn
                15551, Estonia
              </p>
            </div>
          </section>

          {/* Autres documents */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Autres Documents Légaux
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Politique de Confidentialité
                </a>{" "}
                - Comment nous collectons et utilisons vos données personnelles
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Conditions Générales d'Utilisation
                </a>{" "}
                - Les règles d'utilisation de nos services
              </li>
            </ul>
          </section>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Dernière mise à jour : Janvier 2026
        </p>
      </div>
    </div>
  );
}
