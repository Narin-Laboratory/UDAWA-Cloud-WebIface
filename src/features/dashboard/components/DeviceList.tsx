import {
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
  Typography,
  Box,
  ListItemButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Circle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  getDevices,
  getDeviceInfo,
  type DeviceInfo,
} from '../services/deviceService';
import { useTranslation } from 'react-i18next';

export interface DeviceListHandle {
  reload: () => void;
}

const DeviceList = forwardRef<DeviceListHandle, {}>((_props, ref) => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(
    async (force = false) => {
      const fetchPromise = async () => {
        setError(null);
        const deviceList = await getDevices(force);
        const devicesWithInfo = await Promise.all(
          deviceList.map(async (device) => {
            const deviceInfo = await getDeviceInfo(device.id.id);
            return { ...device, active: deviceInfo.active };
          })
        );
        setDevices(devicesWithInfo);
      };

      toast.promise(fetchPromise(), {
        pending: t('deviceList.loading'),
        success: t('deviceList.loadSuccess'),
        error: {
          render() {
            setError(t('deviceList.fetchError'));
            return t('deviceList.fetchError');
          },
        },
      });
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