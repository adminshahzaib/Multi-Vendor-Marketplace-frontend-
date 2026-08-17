// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Show loading while auth state initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // No role restrictions specified or user role matches allowed roles
  if (!allowedRoles || allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // User authenticated but role not allowed - redirect to home
  console.warn(`Access denied. User role "${user.role}" not in allowed roles: ${allowedRoles.join(', ')}`);
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;