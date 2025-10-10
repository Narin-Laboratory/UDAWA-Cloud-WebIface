import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getItem } from '../utils/storage';

const ProtectedRoute: React.FC = () => {
  const token = getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;