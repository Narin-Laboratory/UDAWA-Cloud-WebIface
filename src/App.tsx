import React from 'react';
import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import AuthLayout from './features/auth/layouts/AuthLayout';
import LoginPage from './features/auth/pages/LoginPage';
import { lightTheme, darkTheme } from './theme';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    </ThemeProvider>
  );
};

export default App;