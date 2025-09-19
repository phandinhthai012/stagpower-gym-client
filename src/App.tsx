import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthPage, RegistrationSuccessPage } from './features/auth';
import { MemberPage } from './features/member';
import { AdminDashboard } from './features/admin';
import { StaffDashboard } from './features/staff';
import { TrainerDashboard } from './features/personTrainer';
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
                <TrainerDashboard />
              </ProtectedRoute>
            } 
          />
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
