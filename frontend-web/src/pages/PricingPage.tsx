import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ChevronDown } from "lucide-react";
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("pricing.title", "Simple, Credit-Based Pricing")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
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
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <span className="font-medium">{currency}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${currencyDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {currencyDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setCurrency("EUR");
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg ${currency === "EUR" ? "bg-primary-50 text-primary-600 font-medium" : ""}`}
                    >
                      EUR (€)
                    </button>
                    <button
                      onClick={() => {
                        setCurrency("USD");
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg ${currency === "USD" ? "bg-primary-50 text-primary-600 font-medium" : ""}`}
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
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 p-8 ${
                  pack.popular
                    ? "border-primary-600 shadow-xl scale-105"
                    : "border-gray-200 shadow-lg"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pack.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {formatPrice(getPrice(pack))}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {pack.credits} {t("pricing.credits", "credits")}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={user ? "/buy-credits" : "/auth"}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    pack.popular
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {user
                    ? t("pricing.buyCredits", "Buy Credits")
                    : t("pricing.getStarted", "Get Started")}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            {t("pricing.priceNote", "All prices in {{currency}}. Credits never expire.", {
              currency: currency,
            })}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything Included
            </h2>
            <p className="text-xl text-gray-600">
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
                className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm"
              >
                <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do credits work?
              </h3>
              <p className="text-gray-600">
                Each contest draw uses 1 credit. You can run draws for any
                number of participants and winners with a single credit. Credits
                never expire.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I get a refund?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a 30-day money-back guarantee. If you're not
                satisfied, contact us for a full refund.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American
                Express) and PayPal.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! New users get 3 free credits to try the service. No credit
                card required for the trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Create fair, transparent contest draws in minutes
          </p>
          <Link
            to={user ? "/buy-credits" : "/auth"}
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {user
              ? t("pricing.buyCredits", "Buy Credits")
              : t("pricing.startFreeTrial", "Start Free Trial")}
          </Link>
        </div>
      </section>
    </div>
  );
}
