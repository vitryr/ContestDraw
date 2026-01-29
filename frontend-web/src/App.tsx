import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { usePageTracking } from "./hooks/useAnalytics";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import AuthPageEnhanced from "./pages/AuthPageEnhanced";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import NewDrawPage from "./pages/NewDrawPage";
import DrawConfigPage from "./pages/DrawConfigPage";
import DrawFiltersPage from "./pages/DrawFiltersPage";
import DrawExecutionPage from "./pages/DrawExecutionPage";
import ResultsPage from "./pages/ResultsPage";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import PublicVerifyPage from "./pages/PublicVerifyPage";
import EmbedVerifyPage from "./pages/EmbedVerifyPage";
import FAQPage from "./pages/FAQPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import BuyCreditsPage from "./pages/BuyCreditsPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import LegalNoticePage from "./pages/LegalNoticePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ContactPage from "./pages/ContactPage";

// Admin pages
import { AdminLayout } from "./components/admin/AdminLayout";
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminDrawsPage,
  AdminPaymentsPage,
  AdminStatsPage,
} from "./pages/admin";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Analytics page tracking wrapper
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

function App() {
  const { loadUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user from token on app initialization
  useEffect(() => {
    const initAuth = async () => {
      await loadUser();
      setIsInitialized(true);
    };
    initAuth();
  }, [loadUser]);

  // Show loading screen while initializing auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AnalyticsWrapper>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="auth" element={<AuthPageEnhanced />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<EmailVerificationPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/cancel" element={<PaymentCancelPage />} />
        <Route
          path="buy-credits"
          element={
            <ProtectedRoute>
              <BuyCreditsPage />
            </ProtectedRoute>
          }
        />
        <Route path="faq" element={<FAQPage />} />

        {/* Legal pages - no auth required */}
        <Route path="legal" element={<LegalNoticePage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsOfServicePage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Public verification routes - no auth required */}
        <Route path="verify/:drawId" element={<PublicVerifyPage />} />
        <Route path="v/:shortCode" element={<PublicVerifyPage />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="draw/new"
          element={
            <ProtectedRoute>
              <NewDrawPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="draw/:id/config"
          element={
            <ProtectedRoute>
              <DrawConfigPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="draw/:id/filters"
          element={
            <ProtectedRoute>
              <DrawFiltersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="draw/:id/execute"
          element={
            <ProtectedRoute>
              <DrawExecutionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="draw/:id/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="draws" element={<AdminDrawsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="stats" element={<AdminStatsPage />} />
      </Route>

      {/* Embed route - minimal layout */}
      <Route path="embed/:drawId" element={<EmbedVerifyPage />} />
    </Routes>
    </AnalyticsWrapper>
  );
}

export default App;
