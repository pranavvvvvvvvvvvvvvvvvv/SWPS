import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AutoTranslateProvider } from '@/lib/AutoTranslate';
import { ThemeProvider } from '@/lib/ThemeContext';
import PublicLayout from '@/components/site/PublicLayout';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import HowItWorks from '@/pages/HowItWorks';
import SitePrediction from '@/pages/Prediction';
import Architecture from '@/pages/Architecture';
import Features from '@/pages/Features';
import Technology from '@/pages/Technology';
import Gallery from '@/pages/Gallery';
import FutureScope from '@/pages/FutureScope';
import Research from '@/pages/Research';
import Team from '@/pages/Team';
import Contact from '@/pages/Contact';
import Overview from '@/pages/dashboard/Overview';
import ControlLog from '@/pages/dashboard/ControlLog';
import Prediction from '@/pages/dashboard/Prediction';
import Alerts from '@/pages/dashboard/Alerts';
import MapView from '@/pages/dashboard/MapView';
import Maintenance from '@/pages/dashboard/Maintenance';
import Devices from '@/pages/dashboard/Devices';
import Thresholds from '@/pages/dashboard/Thresholds';
import Reports from '@/pages/dashboard/Reports';
import ManualEntry from '@/pages/dashboard/ManualEntry';
import Users from '@/pages/dashboard/Users';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

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

      {/* Everything else requires an account — visitors land on login / sign-up first. */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/prediction" element={<SitePrediction />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/features" element={<Features />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/future-scope" element={<FutureScope />} />
          <Route path="/research" element={<Research />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="control-log" element={<ControlLog />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="map" element={<MapView />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="devices" element={<Devices />} />
          <Route path="thresholds" element={<Thresholds />} />
          <Route path="reports" element={<Reports />} />
          <Route path="manual-entry" element={<ManualEntry />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AutoTranslateProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <ScrollToTop />
                <AuthenticatedApp />
              </Router>
              <Toaster />
            </QueryClientProvider>
          </AuthProvider>
        </AutoTranslateProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
