import { motion } from "framer-motion";
import { FileText, Building2, User, Server, Shield, Scale, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LegalNoticePage() {
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
          className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-accent-secondary/10 rounded-full blur-[100px]"
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
              <FileText className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Mentions Légales
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-accent-secondary to-accent-primary rounded-full mx-auto" />
          </div>

          <div className="bg-bg-card border border-white/[0.06] rounded-2xl p-8 space-y-8">
            {/* Éditeur du site */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  1. Éditeur du Site
                </h2>
              </div>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-2 text-ink-secondary">
                <p><strong className="text-white">Raison sociale :</strong> Flowrigin OÜ</p>
                <p><strong className="text-white">Forme juridique :</strong> Osaühing (Société à responsabilité limitée privée - OÜ)</p>
                <p><strong className="text-white">Capital social :</strong> 1 EUR</p>
                <p><strong className="text-white">Numéro d'enregistrement :</strong> 17371835</p>
                <p><strong className="text-white">Registre :</strong> Registre du commerce estonien (Äriregister)</p>
                <p><strong className="text-white">Lien registre :</strong>{" "}
                  <a href="https://ariregister.rik.ee/" target="_blank" rel="noopener noreferrer" className="text-accent-secondary hover:text-accent-tertiary">
                    https://ariregister.rik.ee/
                  </a>
                </p>
                <p><strong className="text-white">Statut TVA :</strong> Non assujetti à la TVA (en dessous du seuil)</p>
                <p><strong className="text-white">Date d'enregistrement :</strong> 13 novembre 2024</p>
                <p><strong className="text-white">Activité :</strong> Programmation informatique, conseil (NACE 62101)</p>
                <p><strong className="text-white">Siège social :</strong> Sepapaja tn 6, Tallinn 15551, Estonia</p>
                <p><strong className="text-white">Téléphone :</strong> +33 6 25 75 44 20</p>
                <p><strong className="text-white">Email :</strong>{" "}
                  <a href="mailto:contact@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">contact@cleack.io</a>
                </p>
                <p><strong className="text-white">Site web :</strong>{" "}
                  <a href="https://cleack.io" className="text-accent-secondary hover:text-accent-tertiary">https://cleack.io</a>
                </p>
              </div>
            </section>

            {/* Directeur de la publication */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  2. Directeur de la Publication
                </h2>
              </div>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-2 text-ink-secondary">
                <p><strong className="text-white">Nom :</strong> Romain Vitry</p>
                <p><strong className="text-white">Fonction :</strong> Membre du conseil d'administration (Board Member)</p>
                <p><strong className="text-white">Email :</strong>{" "}
                  <a href="mailto:contact@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">contact@cleack.io</a>
                </p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  3. Hébergement du Site
                </h2>
              </div>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-2 text-ink-secondary">
                <p><strong className="text-white">Hébergeur :</strong> Vercel Inc.</p>
                <p><strong className="text-white">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                <p><strong className="text-white">Site web :</strong>{" "}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-accent-secondary hover:text-accent-tertiary">
                    https://vercel.com
                  </a>
                </p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  4. Propriété Intellectuelle
                </h2>
              </div>
              <p className="text-ink-secondary mb-4">
                L'ensemble de ce site relève de la législation estonienne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="text-ink-secondary">
                Les marques, logos, et noms de domaine apparaissant sur le site sont la propriété de Flowrigin OÜ ou font l'objet d'une autorisation d'utilisation. Toute reproduction non autorisée constitue une contrefaçon susceptible d'engager la responsabilité civile et pénale.
              </p>
            </section>

            {/* Protection des données */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  5. Protection des Données Personnelles
                </h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Cleack accorde une grande importance à la protection de vos données personnelles. Le traitement de vos données personnelles est effectué conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
              <p className="text-ink-secondary mb-4">
                Pour plus d'informations, consultez notre{" "}
                <a href="/privacy" className="text-accent-secondary hover:text-accent-tertiary font-medium">
                  Politique de Confidentialité
                </a>.
              </p>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Responsable du traitement des données</h3>
                  <div className="text-ink-secondary space-y-1">
                    <p><strong className="text-white">Nom :</strong> Flowrigin OÜ</p>
                    <p><strong className="text-white">Numéro d'enregistrement :</strong> 17371835</p>
                    <p><strong className="text-white">Email DPO :</strong>{" "}
                      <a href="mailto:privacy@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">privacy@cleack.io</a>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Autorité de protection des données</h3>
                  <div className="text-ink-secondary space-y-1">
                    <p><strong className="text-white">Nom :</strong> Andmekaitse Inspektsioon (AKI)</p>
                    <p><strong className="text-white">Site web :</strong>{" "}
                      <a href="https://www.aki.ee/" target="_blank" rel="noopener noreferrer" className="text-accent-secondary hover:text-accent-tertiary">www.aki.ee</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  6. Droit Applicable
                </h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Le présent site et les présentes mentions légales sont régis par le droit estonien. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux estoniens.
              </p>
              <p className="text-ink-secondary">
                Flowrigin OÜ est une société estonienne enregistrée en République d'Estonie, membre de l'Union Européenne. Nous respectons toutes les réglementations européennes applicables, notamment le RGPD.
              </p>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  7. Contact
                </h2>
              </div>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-2 text-ink-secondary">
                <p><strong className="text-white">Email :</strong>{" "}
                  <a href="mailto:contact@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">contact@cleack.io</a>
                </p>
                <p><strong className="text-white">Téléphone :</strong> +33 6 25 75 44 20</p>
                <p><strong className="text-white">Adresse :</strong> Flowrigin OÜ, Sepapaja tn 6, Tallinn 15551, Estonia</p>
              </div>
            </section>

            {/* Autres documents */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  8. Autres Documents Légaux
                </h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="/privacy" className="flex items-center gap-2 text-accent-secondary hover:text-accent-tertiary font-medium">
                    <FileText className="w-4 h-4" />
                    Politique de Confidentialité
                  </a>
                  <p className="text-ink-muted text-sm ml-6">Comment nous collectons et utilisons vos données personnelles</p>
                </li>
                <li>
                  <a href="/terms" className="flex items-center gap-2 text-accent-secondary hover:text-accent-tertiary font-medium">
                    <FileText className="w-4 h-4" />
                    Conditions Générales d'Utilisation
                  </a>
                  <p className="text-ink-muted text-sm ml-6">Les règles d'utilisation de nos services</p>
                </li>
              </ul>
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
