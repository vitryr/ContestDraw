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
import DrawExecutionPage from "./pages/DrawExecutionPage";
import ResultsPage from "./pages/ResultsPage";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import PublicVerifyPage from "./pages/PublicVerifyPage";
import EmbedVerifyPage from "./pages/EmbedVerifyPage";
import FAQPage from "./pages/FAQPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LegalNoticePage from "./pages/LegalNoticePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Analytics page tracking wrapper
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

function App() {
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
        <Route path="faq" element={<FAQPage />} />

        {/* Legal pages - no auth required */}
        <Route path="legal" element={<LegalNoticePage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsOfServicePage />} />

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

      {/* Embed route - minimal layout */}
      <Route path="embed/:drawId" element={<EmbedVerifyPage />} />
    </Routes>
    </AnalyticsWrapper>
  );
}

export default App;
