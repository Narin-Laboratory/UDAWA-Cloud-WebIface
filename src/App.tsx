import React from 'react';
import { CssBaseline } from '@mui/material';
import AuthLayout from './features/auth/layouts/AuthLayout';
import LoginPage from './features/auth/pages/LoginPage';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    </>
  );
};

export default App;