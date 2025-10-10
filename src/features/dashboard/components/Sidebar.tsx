import React, { useRef } from 'react';
import {
  Drawer,
  Box,
  Toolbar,
  List,
  Typography,
  IconButton,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import DeviceList, { type DeviceListHandle } from './DeviceList';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerClose: () => void;
  onDrawerTransitionEnd: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerClose,
  onDrawerTransitionEnd,
}) => {
  const { t } = useTranslation();
  const deviceListRef = useRef<DeviceListHandle>(null);

  const handleReload = () => {
    if (deviceListRef.current) {
      deviceListRef.current.reload();
    }
  };

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t('sidebar.assets')}
        </Typography>
        <IconButton onClick={handleReload}>
          <Refresh />
        </IconButton>
      </Toolbar>
      <List>
        <DeviceList ref={deviceListRef} />
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={onDrawerTransitionEnd}
        onClose={onDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;