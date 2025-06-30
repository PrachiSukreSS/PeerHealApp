import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { EmergencyChatbot } from './components/EmergencyChatbot';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { HelpersPage } from './pages/HelpersPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SubscriptionPlansPage } from './pages/SubscriptionPlansPage';
import { AlgorandIntegrationPage } from './pages/AlgorandIntegrationPage';
import { BecomeHelperPage } from './pages/BecomeHelperPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ElevenLabsDemoPage } from './pages/ElevenLabsDemoPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <Routes>
            {/* Auth Routes (no header/footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Main App Routes (with header/footer) */}
            <Route path="/*" element={
              <>
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/helpers" element={<HelpersPage />} />
                    <Route path="/ai-support" element={<AIAssistantPage />} />
                    <Route path="/pricing" element={<SubscriptionPlansPage />} />
                    <Route path="/blockchain" element={<AlgorandIntegrationPage />} />
                    <Route path="/become-helper" element={<BecomeHelperPage />} />
                    <Route path="/elevenlabs-demo" element={<ElevenLabsDemoPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
                <EmergencyChatbot />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;