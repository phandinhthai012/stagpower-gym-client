import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { AdminDashboard, AdminPackageManagementWithModal, AdminAccessControl, AdminMemberManagementWithModal, AdminReports, AdminPTSchedule, AdminStaffPTManagement, AdminInvoicePayment, AdminBranchManagement, AdminExerciseManagement, AdminDiscountManagement, AdminComplaintManagement, AdminAccountSettings } from './features/admin/pages';
import { AdminLayout } from './features/admin/components';
import { StaffDashboard } from './features/staff';
import { TrainerLayout } from './features/personTrainer/components/TrainerLayout';
import { TrainerDashboardPage } from './features/personTrainer/pages/TrainerDashboardPage';
import { TrainerMemberManagementPage } from './features/personTrainer/pages/TrainerMemberManagementPage';
import { TrainerSchedulePage } from './features/personTrainer/pages/TrainerSchedulePage';
import { TrainerProgressPage } from './features/personTrainer/pages/TrainerProgressPage';
import { TrainerProfilePage } from './features/personTrainer/pages/TrainerProfilePage';
import { TrainerNotificationsPage } from './features/personTrainer/pages/TrainerNotificationsPage';
import { TrainerSessionDetailPage } from './features/personTrainer/pages/TrainerSessionDetailPage';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { Toaster } from 'sonner'

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
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<AdminMemberManagementWithModal />} />
            <Route path="packages" element={<AdminPackageManagementWithModal />} />
            <Route path="access-control" element={<AdminAccessControl />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="schedules" element={<AdminPTSchedule />} />
            <Route path="staff-pt-management" element={<AdminStaffPTManagement />} />
            <Route path="invoice-payment" element={<AdminInvoicePayment />} />
            <Route path="branch-management" element={<AdminBranchManagement />} />
            <Route path="discounts" element={<AdminDiscountManagement />} />
            <Route path="exercises" element={<AdminExerciseManagement />} />
            <Route path="complaints" element={<AdminComplaintManagement />} />
            <Route path="settings" element={<AdminAccountSettings />} />
          </Route>
          <Route
            path="/staff"
            element={
              <ProtectedRoute requiredRole="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer"
            element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/trainer/dashboard" replace />} />
            <Route path="dashboard" element={<TrainerDashboardPage />} />
            <Route path="member-management" element={<TrainerMemberManagementPage />} />
            <Route path="schedule" element={<Outlet />}>
              <Route index element={<TrainerSchedulePage />} />
              <Route path="session/:sessionId" element={<TrainerSessionDetailPage />} />
            </Route>
            <Route path="progress" element={<TrainerProgressPage />} />
            <Route path="profile" element={<TrainerProfilePage />} />
            <Route path="notifications" element={<TrainerNotificationsPage />} />

          </Route>
          <Route
            path="/member"
            element={
              <ProtectedRoute requiredRole="member">
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
      <Toaster
        position="top-right"
        duration={4000}
        richColors
        closeButton={true}
        expand={true}
        visibleToasts={5}
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            fontWeight: '500',
          },
          className: 'toast-custom',
          descriptionClassName: 'toast-description',
          actionButtonStyle: {
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: '600',
          }
        }}
        theme="dark"
      />
    </AuthProvider>
  );
}

export default App;
