import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  permission?: string;
}

export function ProtectedRoute({ children, permission }: Props) {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    // If user is logged in but doesn't have permission, redirect to dashboard home
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
