import React from 'react';
import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import DashboardLayout from './features/dashboard/layouts/DashboardLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
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
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default App;