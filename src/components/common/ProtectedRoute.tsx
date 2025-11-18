import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  allowStaff?: boolean; // Allow staff to access admin routes
}

export function ProtectedRoute({ children, requiredRole, allowStaff }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // If allowStaff is true and requiredRole is 'admin', also allow 'staff'
    if (allowStaff && requiredRole === 'admin' && user?.role === 'staff') {
      return <>{children}</>;
    }
    
    // Check if user role is in allowed roles
    if (!allowedRoles.includes(user?.role as UserRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <>{children}</>;
}
