import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from '../features/auth/layouts/AuthLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardLayout from '../features/dashboard/layouts/DashboardLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import UserProfilePage from '../features/user/pages/UserProfilePage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <UserProfilePage />
            </DashboardLayout>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRouter;