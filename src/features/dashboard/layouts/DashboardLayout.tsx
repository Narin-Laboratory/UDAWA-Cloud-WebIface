import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ProgressOverlay from '../../../components/ProgressOverlay';
import { removeItem } from '../../../utils/storage';

const drawerWidth = 240;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [overlayState, setOverlayState] = React.useState({
    open: false,
    message: '',
    showProgress: false,
  });

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = () => {
    setOverlayState({
      open: true,
      message: t('logout.loggingOut'),
      showProgress: true,
    });

    setTimeout(() => {
      removeItem('token');
      removeItem('refreshToken');
      removeItem('user');
      window.location.href = '/';
    }, 1000); // Simulate network delay
  };

  return (
    <>
      <ProgressOverlay
        open={overlayState.open}
        message={overlayState.message}
        showProgress={overlayState.showProgress}
      />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Header
          drawerWidth={drawerWidth}
          onDrawerToggle={handleDrawerToggle}
          onLogout={handleLogout}
        />
        <Sidebar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onDrawerClose={handleDrawerClose}
          onDrawerTransitionEnd={handleDrawerTransitionEnd}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar />
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
}