import React from 'react';
import { Container, Box } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default AuthLayout;