import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Download,
  Shield,
  Clock,
  Filter,
  Check,
  ArrowRight,
  Play,
  BadgeCheck,
} from "lucide-react";
import { handleAnchorClick } from "../utils/scrollUtils";

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Download className="w-7 h-7 text-accent-secondary" />,
      iconBg: "bg-accent-secondary/10",
      title: t("landing.features.smartFiltering.title", "Import automatique"),
      description: t(
        "landing.features.smartFiltering.description",
        "Collez simplement l'URL du concours. Nous importons automatiquement tous les participants depuis Instagram, TikTok, Twitter, Facebook et YouTube."
      ),
      large: true,
    },
    {
      icon: <Shield className="w-7 h-7 text-accent-primary" />,
      iconBg: "bg-accent-primary/10",
      title: t("landing.features.transparent.title", "100% Transparent"),
      description: t(
        "landing.features.transparent.description",
        "Video du tirage + certificat PDF pour prouver l'equite du processus."
      ),
      large: false,
    },
    {
      icon: <Clock className="w-7 h-7 text-success" />,
      iconBg: "bg-success/10",
      title: t("landing.features.fast.title", "Gain de temps massif"),
      description: t(
        "landing.features.fast.description",
        "De 2-4 heures de tri manuel a 2 minutes automatisees."
      ),
      large: false,
    },
    {
      icon: <Filter className="w-7 h-7 text-warning" />,
      iconBg: "bg-warning/10",
      title: t("landing.features.certificates.title", "Filtres puissants"),
      description: t(
        "landing.features.certificates.description",
        "Filtrez par engagement, followers, localisation et plus encore. Assurez la conformite GDPR et respectez vos criteres de concours."
      ),
      large: true,
    },
  ];

  const platforms = ["Instagram", "TikTok", "Twitter", "Facebook", "YouTube"];

  const pricingPlans = [
    {
      name: "Starter",
      subtitle: t("landing.pricing.starter.subtitle", "Pour tester"),
      price: "5",
      credits: "10",
      features: [
        t("landing.pricing.starter.feature1", "10 tirages au sort"),
        t("landing.pricing.starter.feature2", "Toutes les plateformes"),
        t("landing.pricing.starter.feature3", "Certificat PDF"),
      ],
      cta: t("landing.pricing.starter.cta", "Commencer"),
      highlighted: false,
    },
    {
      name: "Pro",
      subtitle: t("landing.pricing.pro.subtitle", "Pour influenceurs"),
      price: "20",
      credits: "50",
      features: [
        t("landing.pricing.pro.feature1", "50 tirages au sort"),
        t("landing.pricing.pro.feature2", "Video pour Stories"),
        t("landing.pricing.pro.feature3", "Support prioritaire"),
      ],
      cta: t("landing.pricing.pro.cta", "Choisir Pro"),
      highlighted: true,
      popular: true,
    },
    {
      name: "Agency",
      subtitle: t("landing.pricing.agency.subtitle", "Pour professionnels"),
      price: "75",
      credits: "250",
      features: [
        t("landing.pricing.agency.feature1", "250 tirages au sort"),
        t("landing.pricing.agency.feature2", "Analytics avances"),
        t("landing.pricing.agency.feature3", "Branding personnalise"),
      ],
      cta: t("landing.pricing.agency.cta", "Choisir Agency"),
      highlighted: false,
    },
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
        {/* Background orbs */}
        <div className="absolute -left-32 top-[200px] w-96 h-96 bg-accent-secondary opacity-20 blur-[120px] rounded-full" />
        <div className="absolute right-0 top-[220px] w-96 h-96 bg-accent-primary opacity-20 blur-[120px] rounded-full" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[584px]"
            >
              {/* Badge */}
              <div className="badge mb-8">
                <Sparkles className="w-4 h-4" />
                <span>{t("landing.hero.badge", "Automatisation des tirages au sort")}</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">{t("landing.hero.title", "Tirages au sort")}</span>
                <br />
                <span className="text-gradient">{t("landing.hero.titleHighlight", "en 2 minutes")}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-ink-secondary mb-10 leading-relaxed max-w-[542px]">
                {t(
                  "landing.hero.subtitle",
                  "Transformez 2-4 heures de travail manuel en une experience automatisee et transparente. Importez, filtrez, tirez au sort et partagez - le tout certifie."
                )}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 bg-accent-primary text-white px-6 py-5 rounded-lg font-medium text-lg hover:brightness-110 transition-all"
                >
                  {t("landing.hero.ctaStart", "Commencer gratuitement")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  onClick={(e) => handleAnchorClick(e, "#features")}
                  className="inline-flex items-center justify-center gap-2 bg-bg-primary text-white border border-white/10 px-6 py-5 rounded-lg font-medium text-lg hover:bg-bg-elevated transition-all"
                >
                  <Play className="w-4 h-4" />
                  {t("landing.hero.ctaLearn", "Voir une demo")}
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {t("landing.hero.stat1", "2min")}
                  </div>
                  <div className="text-sm text-ink-secondary">
                    {t("landing.hero.stat1Label", "vs. 2-4 heures")}
                  </div>
                </div>
                <div className="stats-divider" />
                <div>
                  <div className="text-3xl font-bold text-white">
                    {t("landing.hero.stat2", "5")}
                  </div>
                  <div className="text-sm text-ink-secondary">
                    {t("landing.hero.stat2Label", "Plateformes supportees")}
                  </div>
                </div>
                <div className="stats-divider" />
                <div>
                  <div className="text-3xl font-bold text-white">
                    {t("landing.hero.stat3", "100%")}
                  </div>
                  <div className="text-sm text-ink-secondary">
                    {t("landing.hero.stat3Label", "Transparent & certifie")}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right content - App mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Certified badge */}
              <div className="absolute -top-4 right-0 z-20 badge-certified">
                <BadgeCheck className="w-5 h-5" />
                <span>{t("landing.hero.certified", "Certifie")}</span>
              </div>

              {/* App mockup card */}
              <div className="bg-bg-elevated rounded-2xl border border-white/[0.06] shadow-glow-xl p-8">
                <div className="bg-bg-card rounded-xl p-6 space-y-4">
                  {/* Header row */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-b from-accent-secondary to-accent-primary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-1/2 bg-white/5 rounded" />
                    </div>
                  </div>

                  {/* Participant rows */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-bg-primary rounded-xl p-4"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent-secondary/20" />
                        <div className="flex-1 h-3 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Draw button */}
                <div className="mt-4 flex items-center justify-center h-12 rounded-2xl bg-gradient-to-b from-accent-secondary to-accent-primary">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-bg-elevated">
        <div className="container-custom">
          {/* Section header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("landing.features.title", "Pourquoi Cleack ?")}
            </h2>
            <p className="text-xl text-ink-secondary max-w-[603px]">
              {t(
                "landing.features.subtitle",
                "Concu pour les influenceurs, marques et agences qui valorisent l'efficacite et la transparence."
              )}
            </p>
          </div>

          {/* Features grid - asymmetric layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card md:col-span-2"
            >
              <div className={`icon-container ${features[0].iconBg} mb-6`}>
                {features[0].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {features[0].title}
              </h3>
              <p className="text-lg text-ink-secondary">{features[0].description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <div className={`icon-container ${features[1].iconBg} mb-6`}>
                {features[1].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {features[1].title}
              </h3>
              <p className="text-base text-ink-secondary">{features[1].description}</p>
            </motion.div>

            {/* Second row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <div className={`icon-container ${features[2].iconBg} mb-6`}>
                {features[2].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {features[2].title}
              </h3>
              <p className="text-base text-ink-secondary">{features[2].description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card md:col-span-2"
            >
              <div className={`icon-container ${features[3].iconBg} mb-6`}>
                {features[3].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {features[3].title}
              </h3>
              <p className="text-lg text-ink-secondary">{features[3].description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.platforms.title", "Compatible avec toutes vos plateformes")}
          </h2>
          <p className="text-xl text-ink-secondary mb-12 max-w-[633px] mx-auto">
            {t(
              "landing.platforms.subtitle",
              "Instagram, TikTok, Twitter/X, Facebook, YouTube - tout en un seul endroit."
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {platforms.map((platform) => (
              <motion.span
                key={platform}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-white"
              >
                {platform}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-bg-elevated">
        <div className="container-custom">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("landing.pricing.title", "Tarifs simples et transparents")}
            </h2>
            <p className="text-xl text-ink-secondary">
              {t(
                "landing.pricing.subtitle",
                "Payez uniquement pour ce que vous utilisez. Pas d'abonnement."
              )}
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1024px] mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${
                  plan.highlighted ? "card-highlight" : "card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 badge-popular">
                    {t("landing.pricing.popular", "Populaire")}
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-ink-secondary mb-6">{plan.subtitle}</p>

                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}€
                  </span>
                  <span className="text-ink-secondary ml-2">
                    / {plan.credits} credits
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="pricing-list-item">
                      <Check className="w-5 h-5 text-accent-secondary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/auth"
                  className={`block w-full text-center py-3 rounded-lg font-medium transition-all ${
                    plan.highlighted
                      ? "bg-accent-primary text-white hover:brightness-110"
                      : "bg-bg-primary border border-white/10 text-white hover:bg-bg-hover"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bg-primary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("landing.cta.title", "Pret a commencer ?")}
            </h2>
            <p className="text-xl text-ink-secondary mb-8">
              {t(
                "landing.cta.subtitle",
                "Rejoignez des milliers d'influenceurs qui font confiance a Cleack pour leurs tirages au sort."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 bg-accent-primary text-white px-8 py-4 rounded-lg font-medium text-lg hover:brightness-110 transition-all"
              >
                {t("landing.cta.startButton", "Commencer maintenant")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center bg-bg-elevated text-white border border-white/10 px-8 py-4 rounded-lg font-medium text-lg hover:bg-bg-card transition-all"
              >
                {t("landing.cta.pricingButton", "Voir les tarifs")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
