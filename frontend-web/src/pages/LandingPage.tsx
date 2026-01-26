import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Trophy,
  Video,
  Filter,
  Award,
  Instagram,
  Twitter,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { handleAnchorClick } from "../utils/scrollUtils";

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Filter className="w-6 h-6" />,
      title: t("landing.features.smartFiltering.title"),
      description: t("landing.features.smartFiltering.description"),
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: t("landing.features.animatedVideos.title"),
      description: t("landing.features.animatedVideos.description"),
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: t("landing.features.certificates.title"),
      description: t("landing.features.certificates.description"),
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      title: t("landing.features.socialIntegration.title"),
      description: t("landing.features.socialIntegration.description"),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("landing.features.transparent.title"),
      description: t("landing.features.transparent.description"),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("landing.features.fast.title"),
      description: t("landing.features.fast.description"),
    },
  ];

  const steps = [
    {
      number: "1",
      title: t("landing.howItWorks.step1.title"),
      description: t("landing.howItWorks.step1.description"),
    },
    {
      number: "2",
      title: t("landing.howItWorks.step2.title"),
      description: t("landing.howItWorks.step2.description"),
    },
    {
      number: "3",
      title: t("landing.howItWorks.step3.title"),
      description: t("landing.howItWorks.step3.description"),
    },
    {
      number: "4",
      title: t("landing.howItWorks.step4.title"),
      description: t("landing.howItWorks.step4.description"),
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {t("landing.hero.title")}
                <span className="text-primary-600">
                  {" "}
                  {t("landing.hero.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("landing.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="btn-primary text-center">
                  {t("landing.hero.ctaStart")}
                </Link>
                <a
                  href="#features"
                  onClick={(e) => handleAnchorClick(e, "#features")}
                  className="btn-secondary text-center"
                >
                  {t("landing.hero.ctaLearn")}
                </a>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {t("landing.hero.stat1")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("landing.hero.stat1Label")}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {t("landing.hero.stat2")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("landing.hero.stat2Label")}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {t("landing.hero.stat3")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("landing.hero.stat3Label")}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl shadow-2xl p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <Trophy className="w-24 h-24 mx-auto mb-4 animate-bounce" />
                  <div className="text-2xl font-bold mb-2">
                    Winner Announcement
                  </div>
                  <div className="text-primary-100">
                    Professional animated video
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("landing.features.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("landing.howItWorks.title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("landing.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.social.title")}
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {t("landing.social.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t("landing.social.badge1")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t("landing.social.badge2")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t("landing.social.badge3")}</span>
              </div>
            </div>
            <Link
              to="/auth"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t("landing.social.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("landing.cta.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("landing.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="btn-primary">
              {t("landing.cta.startButton")}
            </Link>
            <Link to="/pricing" className="btn-secondary">
              {t("landing.cta.pricingButton")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
