import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import {
  getDevices,
  getDeviceInfo,
  type DeviceInfo,
} from '../services/deviceService';
import { useTranslation } from 'react-i18next';

export interface DeviceListHandle {
  reload: () => void;
}

const DeviceList = forwardRef<DeviceListHandle, {}>((props, ref) => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(
    async (force = false) => {
      try {
        setLoading(true);
        setError(null);
        const deviceList = await getDevices(force);
        const devicesWithInfo = await Promise.all(
          deviceList.map(async (device) => {
            const deviceInfo = await getDeviceInfo(device.id.id);
            return { ...device, active: deviceInfo.active };
          })
        );
        setDevices(devicesWithInfo);
      } catch (err) {
        setError(t('deviceList.fetchError'));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useImperativeHandle(ref, () => ({
    reload: () => {
      fetchDevices(true);
    },
  }));

  useEffect(() => {
    fetchDevices(false);
  }, [fetchDevices]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <ListItem>
        <Typography color="error">{error}</Typography>
      </ListItem>
    );
  }

  return (
    <>
      {devices.map((device) => (
        <ListItem key={device.id.id}>
          <ListItemText primary={device.label} secondary={device.type} />
          <ListItemIcon>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Circle
                sx={{
                  color: device.active ? 'green' : 'red',
                  fontSize: 'small',
                }}
              />
            </Box>
          </ListItemIcon>
        </ListItem>
      ))}
    </>
  );
});

export default DeviceList;