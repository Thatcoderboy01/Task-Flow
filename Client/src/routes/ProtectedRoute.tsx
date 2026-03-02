import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { SkeletonPage } from '@/components/ui/SkeletonLoader';

/* ============================================================
 * ProtectedRoute — redirects to /login if unauthenticated
 * ============================================================ */

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isInitialised, isLoading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  // Still checking session — show skeleton
  if (!isInitialised || isLoading) {
    return <SkeletonPage />;
  }

  // Not authenticated — redirect to login, preserving intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
