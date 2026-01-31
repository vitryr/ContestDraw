import { motion } from "framer-motion";
import { Shield, Database, Share2, Globe, Clock, Cookie, UserCheck, Lock, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
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
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-accent-primary/10 rounded-full blur-[100px]"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-primary/10 border border-accent-primary/30 text-accent-primary mb-6">
              <Shield className="w-4 h-4" />
              Privacy
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Politique de Confidentialité
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full mx-auto" />
          </div>

          <div className="bg-bg-card border border-white/[0.06] rounded-2xl p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Flowrigin OÜ ("nous", "notre", "Cleack") s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles lorsque vous utilisez notre plateforme Cleack.
              </p>
              <p className="text-ink-secondary">
                En utilisant Cleack, vous acceptez les pratiques décrites dans cette politique. Nous vous encourageons à la lire attentivement.
              </p>
            </section>

            {/* Responsable du traitement */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">2. Responsable du Traitement</h2>
              </div>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-2 text-ink-secondary">
                <p><strong className="text-white">Société :</strong> Flowrigin OÜ</p>
                <p><strong className="text-white">Numéro d'enregistrement :</strong> 17371835</p>
                <p><strong className="text-white">Adresse :</strong> Sepapaja tn 6, Tallinn 15551, Estonia</p>
                <p><strong className="text-white">Email DPO :</strong>{" "}
                  <a href="mailto:support@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">support@cleack.io</a>
                </p>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-white">3. Données Collectées</h2>
              </div>

              <h3 className="text-xl font-medium text-white mb-3">3.1 Données que vous nous fournissez</h3>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2 mb-6">
                <li><strong className="text-white">Données de compte :</strong> nom, prénom, adresse email, mot de passe (hashé)</li>
                <li><strong className="text-white">Données de profil :</strong> photo de profil, nom d'entreprise (optionnel)</li>
                <li><strong className="text-white">Données de paiement :</strong> traitées par Stripe (nous ne stockons pas vos données bancaires)</li>
                <li><strong className="text-white">Données des tirages :</strong> titre, description, règles, participants</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">3.2 Données collectées automatiquement</h3>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2 mb-6">
                <li><strong className="text-white">Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation</li>
                <li><strong className="text-white">Données d'utilisation :</strong> pages visitées, actions effectuées, horodatages</li>
                <li><strong className="text-white">Cookies :</strong> voir la section dédiée ci-dessous</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">3.3 Données des réseaux sociaux</h3>
              <p className="text-ink-secondary">
                Si vous connectez un compte Instagram, YouTube, TikTok ou Facebook, nous accédons aux données publiques nécessaires pour effectuer les tirages au sort (commentaires publics, mentions, followers) selon les autorisations accordées.
              </p>
            </section>

            {/* Finalités */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-2xl font-semibold text-white">4. Finalités du Traitement</h2>
              </div>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li><strong className="text-white">Fourniture du service :</strong> créer et gérer votre compte, effectuer des tirages au sort</li>
                <li><strong className="text-white">Facturation :</strong> traiter les paiements et émettre des factures</li>
                <li><strong className="text-white">Communication :</strong> vous envoyer des notifications sur vos tirages, répondre à vos demandes</li>
                <li><strong className="text-white">Amélioration du service :</strong> analyser l'utilisation pour améliorer Cleack</li>
                <li><strong className="text-white">Sécurité :</strong> détecter et prévenir la fraude et les abus</li>
                <li><strong className="text-white">Obligations légales :</strong> respecter nos obligations légales et fiscales</li>
              </ul>
            </section>

            {/* Partage */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">6. Partage des Données</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec :
              </p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li><strong className="text-white">Prestataires de services :</strong>
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>Stripe (paiements) - États-Unis</li>
                    <li>Vercel (hébergement) - États-Unis</li>
                    <li>Resend (emails transactionnels) - France</li>
                  </ul>
                </li>
                <li><strong className="text-white">Autorités légales :</strong> si requis par la loi</li>
                <li><strong className="text-white">Participants publics :</strong> les résultats des tirages peuvent être rendus publics</li>
              </ul>
            </section>

            {/* Transferts */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">7. Transferts Internationaux</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Certains de nos prestataires sont situés hors de l'Espace Économique Européen (EEE). Nous nous assurons que ces transferts sont encadrés par des garanties appropriées :
              </p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li>Clauses contractuelles types de la Commission européenne</li>
                <li>Data Privacy Framework EU-US (pour les prestataires américains certifiés)</li>
              </ul>
            </section>

            {/* Conservation */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-white">8. Conservation des Données</h2>
              </div>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li><strong className="text-white">Données de compte :</strong> conservées tant que votre compte est actif, puis 3 ans après la clôture</li>
                <li><strong className="text-white">Données des tirages :</strong> conservées 3 ans après le tirage pour preuves légales</li>
                <li><strong className="text-white">Données de facturation :</strong> conservées 10 ans (obligation légale comptable)</li>
                <li><strong className="text-white">Logs techniques :</strong> conservés 1 an maximum</li>
              </ul>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-2xl font-semibold text-white">9. Cookies</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Nous utilisons des cookies pour assurer le bon fonctionnement du site :
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-bg-elevated rounded-xl overflow-hidden">
                  <thead className="bg-bg-card">
                    <tr>
                      <th className="px-4 py-3 text-left text-white">Type</th>
                      <th className="px-4 py-3 text-left text-white">Finalité</th>
                      <th className="px-4 py-3 text-left text-white">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    <tr>
                      <td className="px-4 py-3 text-ink-secondary">Essentiels</td>
                      <td className="px-4 py-3 text-ink-secondary">Authentification, sécurité, préférences</td>
                      <td className="px-4 py-3 text-ink-secondary">Session / 1 an</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-ink-secondary">Analytiques</td>
                      <td className="px-4 py-3 text-ink-secondary">Mesure d'audience (anonymisée)</td>
                      <td className="px-4 py-3 text-ink-secondary">13 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Vos droits */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">10. Vos Droits</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2 mb-4">
                <li><strong className="text-white">Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong className="text-white">Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong className="text-white">Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong className="text-white">Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong className="text-white">Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong className="text-white">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              </ul>
              <p className="text-ink-secondary">
                Pour exercer vos droits, contactez-nous à{" "}
                <a href="mailto:support@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">support@cleack.io</a>
              </p>
            </section>

            {/* Sécurité */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">11. Sécurité des Données</h2>
              </div>
              <p className="text-ink-secondary mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc pl-6 text-ink-secondary space-y-2">
                <li>Chiffrement TLS/SSL pour toutes les communications</li>
                <li>Hashage des mots de passe (bcrypt)</li>
                <li>Accès restreint aux données sur le principe du besoin</li>
                <li>Surveillance et détection des intrusions</li>
                <li>Sauvegardes régulières et chiffrées</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-white">13. Contact</h2>
              </div>
              <div className="bg-bg-elevated rounded-xl p-6 space-y-2 text-ink-secondary">
                <p><strong className="text-white">Pour toute question sur cette politique :</strong></p>
                <p>Email : <a href="mailto:support@cleack.io" className="text-accent-secondary hover:text-accent-tertiary">support@cleack.io</a></p>
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
