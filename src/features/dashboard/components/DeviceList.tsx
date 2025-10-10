import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useContext,
} from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  ListItemButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Circle } from '@mui/icons-material';
import {
  getDevices,
  getDeviceInfo,
  type DeviceInfo,
} from '../services/deviceService';
import { useTranslation } from 'react-i18next';
import { OverlayContext } from '../../../contexts/OverlayContext';

export interface DeviceListHandle {
  reload: () => void;
}

const DeviceList = forwardRef<DeviceListHandle, {}>((props, ref) => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const overlay = useContext(OverlayContext);

  const fetchDevices = useCallback(
    async (force = false) => {
      try {
        overlay?.showOverlay(t('deviceList.loading'), true);
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
        overlay?.hideOverlay();
      }
    },
    [t, overlay]
  );

  useImperativeHandle(ref, () => ({
    reload: () => {
      fetchDevices(true);
    },
  }));

  useEffect(() => {
    fetchDevices(false);
  }, [fetchDevices]);

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
        <ListItem key={device.id.id} disablePadding>
          <ListItemButton
            component={RouterLink}
            to={`/dashboard/device/${device.id.id}`}
          >
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
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
});

export default DeviceList;