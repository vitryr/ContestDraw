import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, Shield, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { consentService, ConsentPreferences } from "../services/consent";

interface CookieBannerProps {
  onConsentGiven?: (preferences: ConsentPreferences) => void;
}

interface CategoryToggleProps {
  id: keyof ConsentPreferences;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function CategoryToggle({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: CategoryToggleProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-white/[0.06] last:border-b-0">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{label}</span>
          {disabled && (
            <span className="text-xs px-2 py-0.5 bg-accent-secondary/20 text-accent-secondary rounded-full">
              Requis
            </span>
          )}
        </div>
        <p className="text-sm text-ink-secondary mt-1">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label} cookies`}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
          focus:ring-accent-secondary focus:ring-offset-2 focus:ring-offset-bg-primary
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
          ${checked ? "bg-accent-secondary" : "bg-bg-hover"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0.5"}
            mt-0.5
          `}
        />
      </button>
    </div>
  );
}

export default function CookieBanner({ onConsentGiven }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent has already been given
    const hasConsent = consentService.hasConsent();
    if (!hasConsent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    consentService.acceptAll();
    const allAccepted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    onConsentGiven?.(allAccepted);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    consentService.rejectAll();
    const onlyEssential: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    onConsentGiven?.(onlyEssential);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    consentService.saveConsent(preferences);
    onConsentGiven?.(preferences);
    setIsVisible(false);
  };

  const updatePreference = (key: keyof ConsentPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-bg-elevated border border-white/[0.08] rounded-2xl shadow-glow-lg overflow-hidden">
            {/* Main Banner Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-secondary/20 to-accent-tertiary/20 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-accent-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Nous utilisons des cookies
                  </h3>
                  <p className="text-ink-secondary mt-1 text-sm leading-relaxed">
                    Nous utilisons des cookies pour ameliorer votre experience, analyser le trafic
                    et personnaliser le contenu. Vous pouvez choisir les cookies que vous acceptez.
                  </p>
                </div>
              </div>

              {/* Detailed Settings (Expandable) */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-accent-secondary" />
                        <span className="font-medium text-white">Parametres des cookies</span>
                      </div>

                      <div className="bg-bg-card rounded-xl px-4">
                        <CategoryToggle
                          id="essential"
                          label="Cookies essentiels"
                          description="Necessaires au fonctionnement du site. Ils permettent la navigation et l'acces aux fonctionnalites de base."
                          checked={true}
                          disabled={true}
                          onChange={() => {}}
                        />
                        <CategoryToggle
                          id="analytics"
                          label="Cookies analytiques"
                          description="Nous aident a comprendre comment vous utilisez le site (Mixpanel, Sentry). Ces donnees sont anonymisees."
                          checked={preferences.analytics}
                          onChange={(checked) => updatePreference("analytics", checked)}
                        />
                        <CategoryToggle
                          id="marketing"
                          label="Cookies marketing"
                          description="Utilises pour personnaliser les publicites et mesurer leur efficacite. Non utilises actuellement."
                          checked={preferences.marketing}
                          onChange={(checked) => updatePreference("marketing", checked)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-accent-secondary to-accent-tertiary text-white font-medium rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent-secondary focus:ring-offset-2 focus:ring-offset-bg-elevated"
                  >
                    Tout accepter
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-bg-card text-white font-medium rounded-xl hover:bg-bg-hover transition-colors border border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-bg-elevated"
                  >
                    Refuser tout
                  </button>
                </div>

                {/* Toggle Details / Save */}
                <div className="flex gap-3">
                  {showDetails ? (
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-accent-secondary/20 text-accent-secondary font-medium rounded-xl hover:bg-accent-secondary/30 transition-colors border border-accent-secondary/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary focus:ring-offset-2 focus:ring-offset-bg-elevated"
                    >
                      Enregistrer mes preferences
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowDetails(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-ink-secondary hover:text-white transition-colors focus:outline-none"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Personnaliser</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Collapse button when details are open */}
              {showDetails && (
                <button
                  onClick={() => setShowDetails(false)}
                  className="mt-4 flex items-center gap-1 text-sm text-ink-secondary hover:text-white transition-colors mx-auto"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Masquer les details</span>
                </button>
              )}

              {/* Privacy Policy Link */}
              <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
                <Link
                  to="/legal/privacy"
                  className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-accent-secondary transition-colors"
                >
                  <span>Politique de confidentialite</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
