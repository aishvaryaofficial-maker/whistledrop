import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/moderator/ProtectedRoute';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { ReportSubmissionPage } from './pages/public/ReportSubmissionPage';
import { ReportSuccessPage } from './pages/public/ReportSuccessPage';
import { ReportTrackingPage } from './pages/public/ReportTrackingPage';

// Moderator pages
import { ModeratorLoginPage } from './pages/moderator/ModeratorLoginPage';
import { ModeratorDashboardPage } from './pages/moderator/ModeratorDashboardPage';
import { ModeratorReportDetailPage } from './pages/moderator/ModeratorReportDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-white dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<ReportSubmissionPage />} />
                <Route path="/reports" element={<ReportSubmissionPage />} />
                <Route path="/report/success" element={<ReportSuccessPage />} />
                <Route path="/track" element={<ReportTrackingPage />} />
                <Route path="/track/:caseCode" element={<ReportTrackingPage />} />

                {/* Moderator Authentication */}
                <Route path="/moderator/login" element={<ModeratorLoginPage />} />

                {/* Protected Moderator Routes */}
                <Route
                  path="/moderator/dashboard"
                  element={
                    <ProtectedRoute>
                      <ModeratorDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/moderator/reports/:caseCode"
                  element={
                    <ProtectedRoute>
                      <ModeratorReportDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirects & 404 */}
                <Route path="/moderator" element={<Navigate to="/moderator/dashboard" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
