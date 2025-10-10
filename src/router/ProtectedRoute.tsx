import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OverlayProvider } from '../contexts/OverlayContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <OverlayProvider>
      <Outlet />
    </OverlayProvider>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;