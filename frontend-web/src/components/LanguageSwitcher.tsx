import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700 uppercase">
        {i18n.language === "en" ? "FR" : "EN"}
      </span>
    </motion.button>
  );
}
