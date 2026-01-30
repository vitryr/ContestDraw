import { useEffect, useState, lazy, Suspense } from "react";
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
  AdminPromoCodesPage,
} from "./pages/admin";

// SEO Pages - Lazy loaded for performance (Core Web Vitals)
const TirageInstagramPage = lazy(() => import("./pages/seo/TirageInstagramPage"));
const TirageTiktokPage = lazy(() => import("./pages/seo/TirageTiktokPage"));
const TirageFacebookPage = lazy(() => import("./pages/seo/TirageFacebookPage"));
const TirageYoutubePage = lazy(() => import("./pages/seo/TirageYoutubePage"));
const TirageTwitterPage = lazy(() => import("./pages/seo/TirageTwitterPage"));

// Hub Pages
const JeuConcoursHub = lazy(() => import("./pages/seo/JeuConcoursHub"));
const GuideHub = lazy(() => import("./pages/seo/GuideHub"));
const OutilsHub = lazy(() => import("./pages/seo/OutilsHub"));

// Satellite Pages - Instagram
const TirageCommentairesInstagramPage = lazy(() => import("./pages/seo/satellites/TirageCommentairesInstagramPage"));
const TirageLikesInstagramPage = lazy(() => import("./pages/seo/satellites/TirageLikesInstagramPage"));
const TirageStoriesInstagramPage = lazy(() => import("./pages/seo/satellites/TirageStoriesInstagramPage"));
const TirageReelsInstagramPage = lazy(() => import("./pages/seo/satellites/TirageReelsInstagramPage"));
const TirageAbonnesInstagramPage = lazy(() => import("./pages/seo/satellites/TirageAbonnesInstagramPage"));
const GiveawayInstagramPage = lazy(() => import("./pages/seo/satellites/GiveawayInstagramPage"));

// Satellite Pages - TikTok
const TirageCommentairesTiktokPage = lazy(() => import("./pages/seo/satellites/TirageCommentairesTiktokPage"));
const GiveawayTiktokPage = lazy(() => import("./pages/seo/satellites/GiveawayTiktokPage"));
const ConcoursTiktokPage = lazy(() => import("./pages/seo/satellites/ConcoursTiktokPage"));

// Satellite Pages - Facebook
const TirageCommentairesFacebookPage = lazy(() => import("./pages/seo/satellites/TirageCommentairesFacebookPage"));
const ConcoursPageFacebookPage = lazy(() => import("./pages/seo/satellites/ConcoursPageFacebookPage"));
const TirageGroupeFacebookPage = lazy(() => import("./pages/seo/satellites/TirageGroupeFacebookPage"));

// Satellite Pages - YouTube
const TirageCommentairesYoutubePage = lazy(() => import("./pages/seo/satellites/TirageCommentairesYoutubePage"));
const GiveawayYoutubeShortsPage = lazy(() => import("./pages/seo/satellites/GiveawayYoutubeShortsPage"));
const ConcoursYoutubePage = lazy(() => import("./pages/seo/satellites/ConcoursYoutubePage"));

// Satellite Pages - Twitter/X
const TirageRetweetsPage = lazy(() => import("./pages/seo/satellites/TirageRetweetsPage"));
const TirageLikesTwitterPage = lazy(() => import("./pages/seo/satellites/TirageLikesTwitterPage"));
const GiveawayTwitterPage = lazy(() => import("./pages/seo/satellites/GiveawayTwitterPage"));

// Guide Pages
const OrganiserJeuConcoursPage = lazy(() => import("./pages/seo/guides/OrganiserJeuConcoursPage"));
const ReglementJeuConcoursPage = lazy(() => import("./pages/seo/guides/ReglementJeuConcoursPage"));
const LegalJeuConcoursFrancePage = lazy(() => import("./pages/seo/guides/LegalJeuConcoursFrancePage"));
const AugmenterEngagementPage = lazy(() => import("./pages/seo/guides/AugmenterEngagementPage"));
const MeilleursOutilsTiragePage = lazy(() => import("./pages/seo/guides/MeilleursOutilsTiragePage"));

// Outils Pages
const GenerateurReglementPage = lazy(() => import("./pages/seo/outils/GenerateurReglementPage"));
const CompteurParticipantsPage = lazy(() => import("./pages/seo/outils/CompteurParticipantsPage"));
const VerificateurComptePage = lazy(() => import("./pages/seo/outils/VerificateurComptePage"));
const CalendrierConcoursPage = lazy(() => import("./pages/seo/outils/CalendrierConcoursPage"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
      <p className="text-gray-500 text-sm">Chargement...</p>
    </div>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
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

            {/* ============================================ */}
            {/* SEO PAGES - Pillar Pages (Pages Piliers)    */}
            {/* ============================================ */}
            
            {/* Instagram - Main pillar (18,100 searches/month) */}
            <Route path="tirage-au-sort-instagram" element={<TirageInstagramPage />} />
            
            {/* TikTok - Second pillar (4,400 searches/month) */}
            <Route path="tirage-au-sort-tiktok" element={<TirageTiktokPage />} />
            
            {/* Facebook - Third pillar (5,400 searches/month) */}
            <Route path="tirage-au-sort-facebook" element={<TirageFacebookPage />} />
            
            {/* YouTube - Fourth pillar (3,600 searches/month) */}
            <Route path="tirage-au-sort-youtube" element={<TirageYoutubePage />} />
            
            {/* Twitter/X - Fifth pillar (720 searches/month) */}
            <Route path="tirage-au-sort-twitter" element={<TirageTwitterPage />} />

            {/* ============================================ */}
            {/* SEO PAGES - Hub Pages                       */}
            {/* ============================================ */}
            
            {/* Jeu Concours Hub */}
            <Route path="jeu-concours" element={<JeuConcoursHub />} />
            
            {/* Guides Hub */}
            <Route path="guide" element={<GuideHub />} />
            
            {/* Outils Hub */}
            <Route path="outils" element={<OutilsHub />} />

            {/* ============================================ */}
            {/* SEO PAGES - Satellite Pages - Instagram     */}
            {/* ============================================ */}
            
            <Route path="tirage-commentaires-instagram" element={<TirageCommentairesInstagramPage />} />
            <Route path="tirage-likes-instagram" element={<TirageLikesInstagramPage />} />
            <Route path="tirage-stories-instagram" element={<TirageStoriesInstagramPage />} />
            <Route path="tirage-reels-instagram" element={<TirageReelsInstagramPage />} />
            <Route path="tirage-abonnes-instagram" element={<TirageAbonnesInstagramPage />} />
            <Route path="giveaway-instagram" element={<GiveawayInstagramPage />} />
            
            {/* ============================================ */}
            {/* SEO PAGES - Satellite Pages - TikTok        */}
            {/* ============================================ */}
            
            <Route path="tirage-commentaires-tiktok" element={<TirageCommentairesTiktokPage />} />
            <Route path="giveaway-tiktok" element={<GiveawayTiktokPage />} />
            <Route path="concours-tiktok" element={<ConcoursTiktokPage />} />
            
            {/* ============================================ */}
            {/* SEO PAGES - Satellite Pages - Facebook      */}
            {/* ============================================ */}
            
            <Route path="tirage-commentaires-facebook" element={<TirageCommentairesFacebookPage />} />
            <Route path="concours-page-facebook" element={<ConcoursPageFacebookPage />} />
            <Route path="tirage-groupe-facebook" element={<TirageGroupeFacebookPage />} />
            
            {/* ============================================ */}
            {/* SEO PAGES - Satellite Pages - YouTube       */}
            {/* ============================================ */}
            
            <Route path="tirage-commentaires-youtube" element={<TirageCommentairesYoutubePage />} />
            <Route path="giveaway-youtube-shorts" element={<GiveawayYoutubeShortsPage />} />
            <Route path="concours-youtube" element={<ConcoursYoutubePage />} />
            
            {/* ============================================ */}
            {/* SEO PAGES - Satellite Pages - Twitter/X     */}
            {/* ============================================ */}
            
            <Route path="tirage-retweets" element={<TirageRetweetsPage />} />
            <Route path="tirage-likes-twitter" element={<TirageLikesTwitterPage />} />
            <Route path="giveaway-twitter" element={<GiveawayTwitterPage />} />
            
            {/* ============================================ */}
            {/* SEO PAGES - Guide Pages                     */}
            {/* ============================================ */}
            
            <Route path="guide/organiser-jeu-concours" element={<OrganiserJeuConcoursPage />} />
            <Route path="guide/reglement-jeu-concours" element={<ReglementJeuConcoursPage />} />
            <Route path="guide/legal-jeu-concours-france" element={<LegalJeuConcoursFrancePage />} />
            <Route path="guide/augmenter-engagement" element={<AugmenterEngagementPage />} />
            <Route path="guide/meilleurs-outils-tirage" element={<MeilleursOutilsTiragePage />} />
            
            {/* ============================================ */}
            {/* SEO PAGES - Outils Pages                    */}
            {/* ============================================ */}
            
            <Route path="outils/generateur-reglement" element={<GenerateurReglementPage />} />
            <Route path="outils/compteur-participants" element={<CompteurParticipantsPage />} />
            <Route path="outils/verificateur-compte" element={<VerificateurComptePage />} />
            <Route path="outils/calendrier-concours" element={<CalendrierConcoursPage />} />
            
            {/* ============================================ */}
            {/* TRAILING SLASH SUPPORT (SEO best practice)  */}
            {/* ============================================ */}
            
            {/* Pillar pages */}
            <Route path="tirage-au-sort-instagram/" element={<TirageInstagramPage />} />
            <Route path="tirage-au-sort-tiktok/" element={<TirageTiktokPage />} />
            <Route path="tirage-au-sort-facebook/" element={<TirageFacebookPage />} />
            <Route path="tirage-au-sort-youtube/" element={<TirageYoutubePage />} />
            <Route path="tirage-au-sort-twitter/" element={<TirageTwitterPage />} />
            
            {/* Hub pages */}
            <Route path="jeu-concours/" element={<JeuConcoursHub />} />
            <Route path="guide/" element={<GuideHub />} />
            <Route path="outils/" element={<OutilsHub />} />
            
            {/* Instagram satellites */}
            <Route path="tirage-commentaires-instagram/" element={<TirageCommentairesInstagramPage />} />
            <Route path="tirage-likes-instagram/" element={<TirageLikesInstagramPage />} />
            <Route path="tirage-stories-instagram/" element={<TirageStoriesInstagramPage />} />
            <Route path="tirage-reels-instagram/" element={<TirageReelsInstagramPage />} />
            <Route path="tirage-abonnes-instagram/" element={<TirageAbonnesInstagramPage />} />
            <Route path="giveaway-instagram/" element={<GiveawayInstagramPage />} />
            
            {/* TikTok satellites */}
            <Route path="tirage-commentaires-tiktok/" element={<TirageCommentairesTiktokPage />} />
            <Route path="giveaway-tiktok/" element={<GiveawayTiktokPage />} />
            <Route path="concours-tiktok/" element={<ConcoursTiktokPage />} />
            
            {/* Facebook satellites */}
            <Route path="tirage-commentaires-facebook/" element={<TirageCommentairesFacebookPage />} />
            <Route path="concours-page-facebook/" element={<ConcoursPageFacebookPage />} />
            <Route path="tirage-groupe-facebook/" element={<TirageGroupeFacebookPage />} />
            
            {/* YouTube satellites */}
            <Route path="tirage-commentaires-youtube/" element={<TirageCommentairesYoutubePage />} />
            <Route path="giveaway-youtube-shorts/" element={<GiveawayYoutubeShortsPage />} />
            <Route path="concours-youtube/" element={<ConcoursYoutubePage />} />
            
            {/* Twitter satellites */}
            <Route path="tirage-retweets/" element={<TirageRetweetsPage />} />
            <Route path="tirage-likes-twitter/" element={<TirageLikesTwitterPage />} />
            <Route path="giveaway-twitter/" element={<GiveawayTwitterPage />} />
            
            {/* Guide pages */}
            <Route path="guide/organiser-jeu-concours/" element={<OrganiserJeuConcoursPage />} />
            <Route path="guide/reglement-jeu-concours/" element={<ReglementJeuConcoursPage />} />
            <Route path="guide/legal-jeu-concours-france/" element={<LegalJeuConcoursFrancePage />} />
            <Route path="guide/augmenter-engagement/" element={<AugmenterEngagementPage />} />
            <Route path="guide/meilleurs-outils-tirage/" element={<MeilleursOutilsTiragePage />} />
            
            {/* Outils pages */}
            <Route path="outils/generateur-reglement/" element={<GenerateurReglementPage />} />
            <Route path="outils/compteur-participants/" element={<CompteurParticipantsPage />} />
            <Route path="outils/verificateur-compte/" element={<VerificateurComptePage />} />
            <Route path="outils/calendrier-concours/" element={<CalendrierConcoursPage />} />
            
            {/* Blog placeholder */}
            <Route path="blog" element={<Navigate to="/" replace />} />
            <Route path="blog/" element={<Navigate to="/" replace />} />
            <Route path="blog/*" element={<Navigate to="/" replace />} />

            {/* ============================================ */}
            {/* APP ROUTES - Protected                      */}
            {/* ============================================ */}

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
            <Route path="promo-codes" element={<AdminPromoCodesPage />} />
            <Route path="stats" element={<AdminStatsPage />} />
          </Route>

          {/* Embed route - minimal layout */}
          <Route path="embed/:drawId" element={<EmbedVerifyPage />} />
          
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnalyticsWrapper>
  );
}

export default App;
