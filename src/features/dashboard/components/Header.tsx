import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  const { i18n } = useTranslation();
  const [user, setUser] = useState({ name: '', authority: '' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const userData = getItem('user');
    if (userData) {
      setUser({
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        authority: userData.authority || '',
      });
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLangMenuClose();
    handleMenuClose();
  };

  const renderDesktopMenu = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <LanguageSwitcher />
      <Button color="inherit" onClick={handleMenuOpen} sx={{ textTransform: 'none', ml: 1 }}>
        <AccountCircle sx={{ mr: 1 }} />
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body1">{user.name || 'User'}</Typography>
          <Typography variant="caption" sx={{ display: 'block', lineHeight: 1 }}>
            {user.authority}
          </Typography>
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );

  const renderMobileMenu = () => (
    <Box>
      <IconButton color="inherit" onClick={handleMenuOpen} aria-label="More actions">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLangMenuOpen}>Language</MenuItem>
        <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>
          Logout
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLangMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('id')}>Indonesia</MenuItem>
      </Menu>
    </Box>
  );

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
        {isMobile ? renderMobileMenu() : renderDesktopMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Header;