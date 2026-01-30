import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Zap,
  CreditCard,
  Shield,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCreditsStore } from "../store/useCreditsStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../services/api";

type Currency = "EUR" | "USD";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceEUR: number;
  priceUSD: number;
  popular?: boolean;
  savings?: number;
  features: string[];
}

const creditPacks: CreditPack[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    priceEUR: 9,
    priceUSD: 10,
    features: [
      "10 contest draws",
      "Up to 1,000 participants",
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
    savings: 22,
    features: [
      "50 contest draws",
      "Up to 10,000 participants",
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
    savings: 35,
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

export default function BuyCreditsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { balance } = useCreditsStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const getPrice = (pack: CreditPack): number => {
    return currency === "EUR" ? pack.priceEUR : pack.priceUSD;
  };

  const formatPrice = (price: number): string => {
    return currency === "EUR" ? `${price}€` : `$${price}`;
  };

  const handlePurchase = async (pack: CreditPack) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsLoading(pack.id);
    try {
      const price = getPrice(pack);
      // Call backend to create Stripe Checkout session for credit pack
      const response = await api.post<{
        status: string;
        data: { sessionId: string; url: string };
      }>("/payments/checkout/credits", {
        packId: pack.id,
        credits: pack.credits,
        price: price,
        name: pack.name,
        currency: currency.toLowerCase(),
      });

      if (response.data.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      const message =
        error.response?.data?.message || "Failed to initiate purchase";
      toast.error(message);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("buyCredits.backToDashboard", "Back to Dashboard")}
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("buyCredits.title", "Buy Credits")}
                </h1>
                <p className="text-gray-600 mt-2">
                  {t("buyCredits.currentBalance", "Current balance")}:{" "}
                  <span className="font-semibold text-primary-600">
                    {balance} {t("buyCredits.credits", "credits")}
                  </span>
                </p>
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{currency}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${currencyDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {currencyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
          </div>

          {/* Credit Packs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {creditPacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 p-8 bg-white ${
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

                {pack.savings && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    Save {pack.savings}%
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pack.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {formatPrice(getPrice(pack))}
                    </span>
                  </div>
                  <p className="text-gray-600 text-lg">
                    {pack.credits} {t("buyCredits.credits", "credits")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(
                      Number((getPrice(pack) / pack.credits).toFixed(2))
                    )}{" "}
                    {t("buyCredits.perCredit", "per credit")}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pack)}
                  disabled={isLoading !== null}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    pack.popular
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === pack.id ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {t("buyCredits.processing", "Processing...")}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {t("buyCredits.buyButton", "Buy {{credits}} Credits", {
                        credits: pack.credits,
                      })}
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-green-600" />
                <span>{t("buyCredits.securePayment", "Secure Payment")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Visa, Mastercard, Amex</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-primary-600" />
                <span>
                  {t("buyCredits.creditsNeverExpire", "Credits never expire")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-primary-600" />
                <span>
                  {t("buyCredits.moneyBackGuarantee", "30-day money back")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
