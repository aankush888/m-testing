import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { FloatingCrisisButton } from './components/FloatingCrisisButton';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { MoodCheckIn } from './pages/client/MoodCheckIn';
import { JournalEntry } from './pages/client/JournalEntry';
import { ClientInsights } from './pages/client/ClientInsights';
import { Homework } from './pages/client/Homework';
import { Activities } from './pages/client/Activities';
import { ClientAssessments } from './pages/client/ClientAssessments';
import { TherapistDashboard } from './pages/therapist/TherapistDashboard';
import { SessionNotes } from './pages/therapist/SessionNotes';
import { PatientProfile } from './pages/therapist/PatientProfile';
import { AnalyticsDashboard } from './pages/therapist/AnalyticsDashboard';
import { AssessmentManager } from './pages/therapist/AssessmentManager';
import { CaregiverDashboard } from './pages/caregiver/CaregiverDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: string }> = ({
  children,
  allowedRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.isFirstTime ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <Navigate to={`/${user?.role}/dashboard`} replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Client Routes */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/mood-check-in"
          element={
            <ProtectedRoute allowedRole="client">
              <MoodCheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/journal"
          element={
            <ProtectedRoute allowedRole="client">
              <JournalEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/insights"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/homework"
          element={
            <ProtectedRoute allowedRole="client">
              <Homework />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/activities"
          element={
            <ProtectedRoute allowedRole="client">
              <Activities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/assessments"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientAssessments />
            </ProtectedRoute>
          }
        />

        {/* Therapist Routes */}
        <Route
          path="/therapist/dashboard"
          element={
            <ProtectedRoute allowedRole="therapist">
              <TherapistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/therapist/session-notes"
          element={
            <ProtectedRoute allowedRole="therapist">
              <SessionNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/therapist/patient/:id"
          element={
            <ProtectedRoute allowedRole="therapist">
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/therapist/analytics"
          element={
            <ProtectedRoute allowedRole="therapist">
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/therapist/assessments"
          element={
            <ProtectedRoute allowedRole="therapist">
              <AssessmentManager />
            </ProtectedRoute>
          }
        />

        {/* Caregiver Routes */}
        <Route
          path="/caregiver/dashboard"
          element={
            <ProtectedRoute allowedRole="caregiver">
              <CaregiverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Show crisis button for all authenticated users */}
      {isAuthenticated && <FloatingCrisisButton />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
