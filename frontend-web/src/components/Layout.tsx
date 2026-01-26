import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Menu, X, User, LogOut, CreditCard } from 'lucide-react';
import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCreditsStore } from '../store/useCreditsStore';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import OnboardingModal from './OnboardingModal';
import { navigateAndScroll } from '../utils/scrollUtils';

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
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user, fetchBalance]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingModal />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">{t('app.name')}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                    {t('nav.pricing')}
                  </Link>

                  <div className="flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-primary-600" />
                    <span className="font-medium text-primary-900">{balance || 0} {t('nav.credits')}</span>
                  </div>

                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        {t('nav.profileSettings')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-b-lg flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                  <LanguageSwitcher />
                </>
              ) : (
                <>
                  <Link to="/pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                    {t('nav.pricing')}
                  </Link>
                  <LanguageSwitcher />
                  <Link to="/auth" className="btn-secondary">
                    {t('nav.signIn')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    to="/pricing"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.pricing')}
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <div className="px-4 py-2 bg-primary-50 rounded-lg">
                    <span className="font-medium text-primary-900">{balance || 0} {t('nav.credits')}</span>
                  </div>
                  <div className="px-4 py-2">
                    <LanguageSwitcher />
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/pricing"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.pricing')}
                  </Link>
                  <div className="px-4 py-2">
                    <LanguageSwitcher />
                  </div>
                  <Link
                    to="/auth"
                    className="block px-4 py-2 text-primary-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.signIn')}
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-6 h-6 text-primary-600" />
                <span className="font-bold text-gray-900">{t('app.name')}</span>
              </div>
              <p className="text-sm text-gray-600">
                {t('footer.tagline')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/pricing" className="hover:text-primary-600">{t('nav.pricing')}</Link></li>
                <li>
                  <a
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateAndScroll(navigate, '/', 'features');
                    }}
                    className="hover:text-primary-600 cursor-pointer"
                  >
                    {t('footer.features')}
                  </a>
                </li>
                <li><Link to="/faq" className="hover:text-primary-600">{t('footer.documentation')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = 'mailto:contact@contestdraw.com';
                    }}
                    className="hover:text-primary-600 cursor-pointer"
                  >
                    {t('footer.about')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.contestdraw.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-600"
                  >
                    {t('footer.blog')}
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@contestdraw.com"
                    className="hover:text-primary-600"
                  >
                    {t('footer.contact')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/privacy" className="hover:text-primary-600">{t('footer.privacy')}</Link></li>
                <li><Link to="/terms" className="hover:text-primary-600">{t('footer.terms')}</Link></li>
                <li><Link to="/security" className="hover:text-primary-600">{t('footer.security')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} {t('app.name')}. {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
