/**
 * Private Route Component
 * Protects routes that require authentication
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const PrivateRoute = ({ children, requiredRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements if specified
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      // User doesn't have required role - redirect to appropriate dashboard
      switch (user.role) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'manager':
          return <Navigate to="/admin" replace />; // Managers also use admin dashboard
        case 'employee':
          return <Navigate to="/employee" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
