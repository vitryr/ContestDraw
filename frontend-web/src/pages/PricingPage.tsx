import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ChevronDown, Sparkles, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";

type Currency = "EUR" | "USD";

interface Pack {
  id: string;
  name: string;
  credits: number;
  priceEUR: number;
  priceUSD: number;
  popular: boolean;
  features: string[];
}

export default function PricingPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const packs: Pack[] = [
    {
      id: "starter",
      name: "Starter",
      credits: 10,
      priceEUR: 9,
      priceUSD: 10,
      popular: false,
      features: [
        "10 contest draws",
        "Up to 1,000 participants per draw",
        "Basic filters",
        "Video export",
        "Digital certificates",
      ],
    },
    {
      id: "pro",
      name: "Professional",
      credits: 50,
      priceEUR: 39,
      priceUSD: 42,
      popular: true,
      features: [
        "50 contest draws",
        "Up to 10,000 participants per draw",
        "Advanced filters",
        "Priority video export",
        "Custom certificates",
        "Email support",
      ],
    },
    {
      id: "business",
      name: "Business",
      credits: 200,
      priceEUR: 129,
      priceUSD: 139,
      popular: false,
      features: [
        "200 contest draws",
        "Unlimited participants",
        "All filter options",
        "Instant video export",
        "Custom branding",
        "Priority support",
        "API access",
      ],
    },
  ];

  const getPrice = (pack: Pack): number => {
    return currency === "EUR" ? pack.priceEUR : pack.priceUSD;
  };

  const formatPrice = (price: number): string => {
    return currency === "EUR" ? `${price}€` : `$${price}`;
  };

  const features = [
    "Fair and transparent draws",
    "Automated video generation",
    "Digital certificates",
    "Social media integration",
    "Advanced filtering",
    "Duplicate detection",
    "Audit trail",
    "Export results",
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 50, 0, -50, 0],
              y: [0, -30, 50, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-secondary/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -50, 0, 50, 0],
              y: [0, 30, -50, -30, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-accent-primary/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary mb-6">
              <CreditCard className="w-4 h-4" />
              {t("pricing.badge", "Simple Pricing")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("pricing.title", "Simple, Credit-Based Pricing")}
            </h1>
            <p className="text-xl text-ink-secondary max-w-2xl mx-auto mb-6">
              {t(
                "pricing.subtitle",
                "Pay only for what you use. No subscriptions, no hidden fees."
              )}
            </p>

            {/* Currency Selector */}
            <div className="flex justify-center mt-6">
              <div className="relative inline-block">
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-white/10 rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  <span className="font-medium text-white">{currency}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted transition-transform ${currencyDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {currencyDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-24 bg-bg-card border border-white/10 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setCurrency("EUR");
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-bg-elevated rounded-t-lg ${currency === "EUR" ? "bg-accent-secondary/20 text-accent-secondary font-medium" : "text-ink-secondary"}`}
                    >
                      EUR (€)
                    </button>
                    <button
                      onClick={() => {
                        setCurrency("USD");
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-bg-elevated rounded-b-lg ${currency === "USD" ? "bg-accent-secondary/20 text-accent-secondary font-medium" : "text-ink-secondary"}`}
                    >
                      USD ($)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  pack.popular
                    ? "bg-gradient-to-b from-accent-secondary/20 to-bg-card border-2 border-accent-secondary shadow-xl shadow-accent-secondary/20 scale-105"
                    : "bg-bg-card border border-white/[0.06]"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-secondary to-accent-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {pack.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-bold text-gradient">
                      {formatPrice(getPrice(pack))}
                    </span>
                  </div>
                  <p className="text-ink-secondary">
                    {pack.credits} {t("pricing.credits", "credits")}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-ink-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={user ? "/buy-credits" : "/auth"}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                    pack.popular
                      ? "bg-gradient-to-r from-accent-secondary to-accent-primary text-white hover:brightness-110"
                      : "bg-bg-elevated text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {user
                    ? t("pricing.buyCredits", "Buy Credits")
                    : t("pricing.getStarted", "Get Started")}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-ink-muted mt-8">
            {t("pricing.priceNote", "All prices in {{currency}}. Credits never expire.", {
              currency: currency,
            })}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything Included
            </h2>
            <p className="text-xl text-ink-secondary">
              All plans include these powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 bg-bg-card border border-white/[0.06] p-4 rounded-xl"
              >
                <Check className="w-5 h-5 text-accent-secondary flex-shrink-0" />
                <span className="text-ink-secondary font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                How do credits work?
              </h3>
              <p className="text-ink-secondary">
                Each contest draw uses 1 credit. You can run draws for any
                number of participants and winners with a single credit. Credits
                never expire.
              </p>
            </div>

            <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I get a refund?
              </h3>
              <p className="text-ink-secondary">
                Yes! We offer a 30-day money-back guarantee. If you're not
                satisfied, contact us for a full refund.
              </p>
            </div>

            <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-ink-secondary">
                We accept all major credit cards (Visa, Mastercard, American
                Express) and PayPal.
              </p>
            </div>

            <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-ink-secondary">
                Yes! New users get 3 free credits to try the service. No credit
                card required for the trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

            <div className="relative z-10 text-center py-16 px-8">
              <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Create fair, transparent contest draws in minutes
              </p>
              <Link
                to={user ? "/buy-credits" : "/auth"}
                className="inline-block bg-white text-accent-secondary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                {user
                  ? t("pricing.buyCredits", "Buy Credits")
                  : t("pricing.startFreeTrial", "Start Free Trial")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
