import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import SiteLayout from '@/components/site/SiteLayout';
import Home from '@/pages/Home';
import AboutPage from '@/pages/AboutPage';
import SectorPage from '@/pages/SectorPage';
import AdminLeads from '@/pages/AdminLeads';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import ServiceLocationPage from '@/pages/ServiceLocationPage';
import Blog from '@/pages/Blog';
import BlogPostPage from '@/pages/BlogPostPage';
import Portal from '@/pages/Portal';
import SimulatorPage from '@/pages/SimulatorPage';
import AdminContent from '@/pages/AdminContent';
import AdminClients from '@/pages/AdminClients';
import PortfolioPage from '@/pages/PortfolioPage';
import ContactPage from '@/pages/ContactPage';
import FaqPage from '@/pages/FaqPage';
import PricingPage from '@/pages/PricingPage';
import ReviewsPage from '@/pages/ReviewsPage';
import TechPage from '@/pages/TechPage';
import ProcessPage from '@/pages/ProcessPage';
import MaturityPage from '@/pages/MaturityPage';
import RadarPage from '@/pages/RadarPage';
import TrakyaIndexPage from '@/pages/TrakyaIndexPage';
import DigitalMapPage from '@/pages/DigitalMapPage';
import LocationPage from '@/pages/LocationPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminCrm from '@/pages/AdminCrm';
import AdminSettings from '@/pages/AdminSettings';
import AdminWhatsapp from '@/pages/AdminWhatsapp';
import DomainCheckPage from '@/pages/DomainCheckPage';
import SiteAgePage from '@/pages/SiteAgePage';
import MarketPage from '@/pages/MarketPage';
import MarketItemPage from '@/pages/MarketItemPage';
import MarketPreviewPage from '@/pages/MarketPreviewPage';
import ThemeDemoPage from '@/pages/ThemeDemoPage';
import QuotePage from '@/pages/QuotePage';
import CustomQuotePage from '@/pages/CustomQuotePage';
import PaymentDone from '@/pages/PaymentDone';
import CheckoutPage from '@/pages/CheckoutPage';

import { CartProvider } from '@/lib/CartContext';
import { FavoritesProvider } from '@/lib/FavoritesContext';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/preview/:slug" element={<MarketPreviewPage />} />
      <Route path="/demo/:themeKey" element={<ThemeDemoPage />} />
      <Route path="/teklif/:leadId" element={<QuotePage />} />
      <Route path="/teklif-onayi/:token" element={<CustomQuotePage />} />
      <Route path="/odeme-tamam" element={<PaymentDone />} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sektor/:slug" element={<SectorPage />} />
        <Route path="/hizmetler" element={<Services />} />
        <Route path="/hizmet/:slug" element={<ServiceDetail />} />
        <Route path="/hizmet/:slug/:location" element={<ServiceLocationPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/simulasyon" element={<SimulatorPage />} />
        <Route path="/portfolyo" element={<PortfolioPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/sss" element={<FaqPage />} />
        <Route path="/fiyatlandirma" element={<PricingPage />} />
        <Route path="/yorumlar" element={<ReviewsPage />} />
        <Route path="/teknoloji" element={<TechPage />} />
        <Route path="/is-surecleri" element={<ProcessPage />} />
        <Route path="/olgunluk-testi" element={<MaturityPage />} />
        <Route path="/rakip-radar" element={<RadarPage />} />
        <Route path="/trakya-endeks" element={<TrakyaIndexPage />} />
        <Route path="/dijital-harita" element={<DigitalMapPage />} />
        <Route path="/konum/:slug" element={<LocationPage />} />
        <Route path="/gizlilik" element={<PrivacyPage />} />
        <Route path="/gizlilik-politikasi" element={<PrivacyPage />} />
        <Route path="/kullanim-sartlari" element={<TermsPage />} />
        <Route path="/alan-adi-kontrolu" element={<DomainCheckPage />} />
        <Route path="/site-yenileme" element={<SiteAgePage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/market/:slug" element={<MarketItemPage />} />
        <Route path="/odeme" element={<CheckoutPage />} />
        <Route path="/temalar" element={<Navigate to="/market?kat=tema" replace />} />
      </Route>
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/crm" element={<AdminCrm />} />
          <Route path="/admin/talepler" element={<AdminLeads />} />
          <Route path="/admin/icerik" element={<Navigate to="/admin/icerik/blog" replace />} />
          <Route path="/admin/icerik/:tab" element={<AdminContent />} />
          <Route path="/admin/musteriler" element={<AdminClients />} />
          <Route path="/admin/ayarlar" element={<AdminSettings />} />
          <Route path="/admin/whatsapp" element={<AdminWhatsapp />} />
        </Route>
        <Route path="/portal" element={<Portal />} />
        <Route path="/musteri-portali" element={<Navigate to="/portal" replace />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <FavoritesProvider>
            <CartProvider>
              <AuthenticatedApp />
            </CartProvider>
          </FavoritesProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App