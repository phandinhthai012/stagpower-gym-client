import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthPage, RegistrationSuccessPage } from './features/auth';
import { MemberLayout } from './features/member/components/MemberLayout';
import { MemberDashboard } from './features/member/pages/MemberDashboard';
import { MemberProfile } from './features/member/pages/MemberProfile';
import { MemberCheckin } from './features/member/pages/MemberCheckin';
import { MemberPackages } from './features/member/pages/MemberPackages';
import { MemberPayments } from './features/member/pages/MemberPayments';
import { MemberSchedule } from './features/member/pages/MemberSchedule';
import { MemberHistory } from './features/member/pages/MemberHistory';
import { MemberNotifications } from './features/member/pages/MemberNotifications';
import { MemberSuggestions } from './features/member/pages/MemberSuggestions';
import { LandingPage } from './features/landing/page/LandingPage';
import { AdminDashboard, AdminLayout, AdminPackageManagement, AdminAccessControl, AdminMemberManagement, AdminReports } from './features/admin';
import { StaffDashboard } from './features/staff';
import { TrainerLayout } from './features/personTrainer/components/TrainerLayout';
import { TrainerDashboardPage } from './features/personTrainer/pages/TrainerDashboardPage';
import { TrainerMemberManagementPage } from './features/personTrainer/pages/TrainerMemberManagementPage';
import { TrainerSchedulePage } from './features/personTrainer/pages/TrainerSchedulePage';
import { TrainerProgressPage } from './features/personTrainer/pages/TrainerProgressPage';
import { TrainerProfilePage } from './features/personTrainer/pages/TrainerProfilePage';
import { TrainerNotificationsPage } from './features/personTrainer/pages/TrainerNotificationsPage';
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
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<AdminMemberManagement />} />
            <Route path="packages" element={<AdminPackageManagement />} />
            <Route path="access-control" element={<AdminAccessControl />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
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
                <MemberLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Navigate to="/member/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="checkin" element={<MemberCheckin />} />
            <Route path="packages" element={<MemberPackages />} />
            <Route path="payments" element={<MemberPayments />} />
            <Route path="schedule" element={<MemberSchedule />} />
            <Route path="history" element={<MemberHistory />} />
            <Route path="notifications" element={<MemberNotifications />} />
            <Route path="suggestions" element={<MemberSuggestions />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
