import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Plus, TrendingUp, Sparkles } from "lucide-react";
import { useCreditsStore } from "../store/useCreditsStore";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

const WELCOME_BONUS_KEY = "cleack_welcome_bonus_shown";

export default function CreditBalance() {
  const { t } = useTranslation();
  const { balance } = useCreditsStore();
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);

  useEffect(() => {
    const bonusShown = localStorage.getItem(WELCOME_BONUS_KEY);
    const credits = balance || 0;
    if (!bonusShown && credits >= 3) {
      setShowWelcomeBonus(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        localStorage.setItem(WELCOME_BONUS_KEY, "true");
        setShowWelcomeBonus(false);
      }, 5000);
    }
  }, [balance]);

  return (
    <div className="card">
      {showWelcomeBonus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 bg-gradient-to-r from-accent-500 to-pink-500 rounded-lg p-4 text-white"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <div>
              <div className="font-bold text-sm uppercase tracking-wide">
                {t("credits.freeCreditsBadge")}
              </div>
              <div className="text-sm opacity-90">
                {t("credits.welcomeMessage")}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t("credits.title")}
            </h3>
            <p className="text-sm text-gray-600">{t("credits.subtitle")}</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">
              {t("credits.currentBalance")}
            </p>
            <p className="text-4xl font-bold text-white">{balance || 0}</p>
            <p className="text-white/80 text-sm mt-1">{t("credits.credits")}</p>
          </div>
          <TrendingUp className="w-12 h-12 text-white/30" />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">{t("credits.thisMonth")}</p>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500">{t("credits.drawsUsed")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">
            {t("credits.costPerDraw")}
          </p>
          <p className="text-2xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-500">{t("credits.credit")}</p>
        </div>
      </div>

      <Link to="/pricing" className="btn-primary w-full">
        <Plus className="w-5 h-5 mr-2 inline" />
        {t("credits.buyMore")}
      </Link>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">
          {t("credits.howItWorks")}
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>{t("credits.info1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>{t("credits.info2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>{t("credits.info3")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
