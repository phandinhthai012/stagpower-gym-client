import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthPage, RegistrationSuccessPage } from './features/auth';
import { MemberPage } from './features/member';
import { AdminDashboard } from './features/admin';
import { StaffDashboard } from './features/staff';
import { TrainerLayout } from './features/personTrainer/components/TrainerLayout';
import { TrainerDashboardPage } from './features/personTrainer/pages/TrainerDashboardPage';
import { TrainerMemberManagementPage } from './features/personTrainer/pages/TrainerMemberManagementPage';
import { TrainerSchedulePage } from './features/personTrainer/pages/TrainerSchedulePage';
import { TrainerProgressPage } from './features/personTrainer/pages/TrainerProgressPage';
import { TrainerProfilePage } from './features/personTrainer/pages/TrainerProfilePage';
import { TrainerNotificationsPage } from './features/personTrainer/pages/TrainerNotificationsPage';
import { LandingPage } from './features/landing/page';
import { useDocumentTitle } from './hooks/useDocumentTitle';

function App() {
  // Set dynamic title based on current page
  useDocumentTitle('StagPower - Hệ Thống Phòng Gym Thông Minh');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff" 
            element={
              <ProtectedRoute requiredRole="Staff">
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainer" 
            element={
              <ProtectedRoute requiredRole="Trainer">
                <TrainerLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Navigate to="/trainer/dashboard" replace />} />
            <Route path="dashboard" element={<TrainerDashboardPage />} />
            <Route path="member-management" element={<TrainerMemberManagementPage />} />
            <Route path="schedule" element={<TrainerSchedulePage />} />
            <Route path="progress" element={<TrainerProgressPage />} />
            <Route path="profile" element={<TrainerProfilePage />} />
            <Route path="notifications" element={<TrainerNotificationsPage />} />
          </Route>
          <Route 
            path="/member" 
            element={
              <ProtectedRoute requiredRole="Member">
                <MemberPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
