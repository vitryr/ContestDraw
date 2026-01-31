import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Menu, X, User, LogOut, CreditCard } from "lucide-react";
import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCreditsStore } from "../store/useCreditsStore";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import OnboardingModal from "./OnboardingModal";
import { navigateAndScroll } from "../utils/scrollUtils";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps = {}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuthStore();
  const { balance, fetchBalance } = useCreditsStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <OnboardingModal />

      {/* Header - Dark purple themed */}
      <header className="sticky top-0 z-50 bg-[#13092b]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Cleack" 
                className="h-11 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-ink-secondary hover:text-white transition-colors"
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-ink-secondary hover:text-white transition-colors"
                  >
                    {t("nav.pricing")}
                  </Link>

                  <div className="flex items-center gap-2 px-4 py-2 bg-accent-secondary/10 border border-accent-secondary/30 rounded-full">
                    <CreditCard className="w-4 h-4 text-accent-secondary" />
                    <span className="font-medium text-white">
                      {balance || 0} {t("nav.credits")}
                    </span>
                  </div>

                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-bg-elevated transition-colors text-ink-secondary hover:text-white">
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-bg-elevated rounded-xl border border-white/[0.06] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-glow-lg">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-ink-secondary hover:text-white hover:bg-bg-card rounded-t-xl transition-colors"
                      >
                        {t("nav.profileSettings")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-error hover:bg-bg-card rounded-b-xl flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t("nav.logout")}</span>
                      </button>
                    </div>
                  </div>
                  <LanguageSwitcher />
                </>
              ) : (
                <>
                  {isLandingPage && (
                    <>
                      <a
                        href="#features"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateAndScroll(navigate, "/", "features");
                        }}
                        className="text-ink-secondary hover:text-white transition-colors"
                      >
                        {t("nav.features", "Fonctionnalites")}
                      </a>
                      <a
                        href="#pricing"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateAndScroll(navigate, "/", "pricing");
                        }}
                        className="text-ink-secondary hover:text-white transition-colors"
                      >
                        {t("nav.pricing")}
                      </a>
                    </>
                  )}
                  {!isLandingPage && (
                    <Link
                      to="/pricing"
                      className="text-ink-secondary hover:text-white transition-colors"
                    >
                      {t("nav.pricing")}
                    </Link>
                  )}
                  <Link
                    to="/faq"
                    className="text-ink-secondary hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/auth"
                    className="text-ink-secondary hover:text-white transition-colors"
                  >
                    {t("nav.signIn", "Connexion")}
                  </Link>
                  <LanguageSwitcher />
                  <Link
                    to="/auth"
                    className="btn-gradient"
                  >
                    {t("nav.signUp", "S'inscrire")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-bg-elevated text-ink-secondary"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 pb-4 space-y-2"
            >
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 rounded-lg hover:bg-bg-elevated text-ink-secondary hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <Link
                    to="/pricing"
                    className="block px-4 py-3 rounded-lg hover:bg-bg-elevated text-ink-secondary hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.pricing")}
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 rounded-lg hover:bg-bg-elevated text-ink-secondary hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.profile")}
                  </Link>
                  <div className="px-4 py-3 bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg">
                    <span className="font-medium text-white">
                      {balance || 0} {t("nav.credits")}
                    </span>
                  </div>
                  <div className="px-4 py-2">
                    <LanguageSwitcher />
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-error rounded-lg hover:bg-bg-elevated transition-colors"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <>
                  {isLandingPage && (
                    <>
                      <a
                        href="#features"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateAndScroll(navigate, "/", "features");
                          setMobileMenuOpen(false);
                        }}
                        className="block px-4 py-3 rounded-lg hover:bg-bg-elevated text-ink-secondary hover:text-white transition-colors"
                      >
                        {t("nav.features", "Fonctionnalites")}
                      </a>
                      <a
                        href="#pricing"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateAndScroll(navigate, "/", "pricing");
                          setMobileMenuOpen(false);
                        }}
                        className="block px-4 py-3 rounded-lg hover:bg-bg-elevated text-ink-secondary hover:text-white transition-colors"
                      >
                        {t("nav.pricing")}
                      </a>
                    </>
                  )}
                  {!isLandingPage && (
                    <Link
                      to="/pricing"
                      className="block px-4 py-3 rounded-lg hover:bg-bg-elevated text-ink-secondary hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("nav.pricing")}
                    </Link>
                  )}
                  <Link
                    to="/faq"
                    className="block px-4 py-3 rounded-lg hover:bg-bg-elevated text-ink-secondary hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <div className="px-4 py-2">
                    <LanguageSwitcher />
                  </div>
                  <Link
                    to="/auth"
                    className="block px-4 py-3 text-accent-primary font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.signIn")}
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children || <Outlet />}</main>

      {/* Footer - Dark purple themed */}
      <footer className="bg-[#13092b] border-t border-white/[0.06]">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Cleack" 
                className="h-7 w-auto"
              />
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-ink-secondary hover:text-white transition-colors text-sm"
              >
                {t("footer.terms", "Conditions d'utilisation")}
              </Link>
              <Link
                to="/privacy"
                className="text-ink-secondary hover:text-white transition-colors text-sm"
              >
                {t("footer.privacy", "Confidentialite")}
              </Link>
              <Link
                to="/contact"
                className="text-ink-secondary hover:text-white transition-colors text-sm"
              >
                {t("footer.contact", "Contact")}
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-ink-secondary text-sm">
              © {new Date().getFullYear()} {t("app.name")}. {t("footer.copyright", "Tous droits reserves.")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
