import React, { useRef, useState, useEffect, useCallback } from 'react';
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
import { toast } from 'react-toastify';
import { getDevices, type DeviceInfo } from '../services/deviceService';
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
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async (force = false) => {
    try {
      setError(null);
      const deviceList = await getDevices(force);
      setDevices(deviceList);
      toast.success(t('deviceList.loadSuccess'));
    } catch (e) {
      setError(t('deviceList.fetchError'));
    }
  }, [t]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleReload = () => {
    fetchDevices(true);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t('sidebar.agents')}
        </Typography>
        <IconButton onClick={handleReload}>
          <Refresh />
        </IconButton>
      </Toolbar>
      <List sx={{ overflow: 'auto' }}>
        <DeviceList
          ref={deviceListRef}
          devices={devices}
          error={error}
          onReload={handleReload}
        />
      </List>
    </Box>
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