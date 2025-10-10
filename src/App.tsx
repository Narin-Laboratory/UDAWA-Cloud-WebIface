import React from 'react';
import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { TelemetryProvider } from './contexts/TelemetryContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={prefersDarkMode ? 'dark' : 'light'}
      />
      <AuthProvider>
        <TelemetryProvider>
          <Router>
            <AppRouter />
          </Router>
        </TelemetryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;