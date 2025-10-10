import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { getItem } from '../../../utils/storage';

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  drawerWidth,
  onDrawerToggle,
  onLogout,
}) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getItem('user');
    if (user && user.firstName && user.lastName) {
      setUserName(`${user.firstName} ${user.lastName}`);
    }
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          UDAWA Smart System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <Typography variant="body1" sx={{ ml: 1 }}>
            {userName || 'User'}
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            sx={{ ml: 2 }}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;