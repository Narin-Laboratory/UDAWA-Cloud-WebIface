import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getItem } from '../utils/storage';
import { OverlayProvider } from '../contexts/OverlayContext';

const ProtectedRoute: React.FC = () => {
  const token = getItem('token');
  return token ? (
    <OverlayProvider>
      <Outlet />
    </OverlayProvider>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;