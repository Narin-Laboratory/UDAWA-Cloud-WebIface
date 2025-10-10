import {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  ListItemButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Circle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import type { Id } from 'react-toastify';
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
  const toastId = useRef<Id | null>(null);

  const fetchDevices = useCallback(
    async (force = false) => {
      toastId.current = toast.loading(t('deviceList.loading'));
      try {
        const deviceList = await getDevices(force);
        const devicesWithInfo = await Promise.all(
          deviceList.map(async (device) => {
            const deviceInfo = await getDeviceInfo(device.id.id);
            return { ...device, active: deviceInfo.active };
          })
        );
        setDevices(devicesWithInfo);
        if (toastId.current) toast.dismiss(toastId.current);
      } catch {
        if (toastId.current) {
          toast.update(toastId.current, {
            render: t('deviceList.fetchError'),
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        } else {
          toast.error(t('deviceList.fetchError'));
        }
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