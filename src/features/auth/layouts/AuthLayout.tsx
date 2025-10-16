import React, { useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NeuralNetworkCanvas from '../components/NeuralNetworkCanvas';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NeuralNetworkCanvas />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          flex: '1 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            color: '#333',
          }}
        >
          {children}
        </Box>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          backgroundColor: 'transparent',
          color: '#fff',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" align="center">
            {t('footer.copyright', { year: 2025 })}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;