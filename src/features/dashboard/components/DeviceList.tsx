import {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
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
import { getDevicesByAssetId, DeviceInfo } from '../services/deviceService';
import slugify from '../../../utils/slugify';

export interface DeviceListHandle {
  reload: () => void;
}

interface DeviceListProps {
  assetId: string;
}

const DeviceList = forwardRef<DeviceListHandle, DeviceListProps>(
  ({ assetId }, ref) => {
    const [devices, setDevices] = useState<DeviceInfo[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchDevices = useCallback(async (force = false) => {
      try {
        setError(null);
        const deviceList = await getDevicesByAssetId(assetId, force);
        setDevices(deviceList);
        toast.success('Device list loaded successfully');
      } catch (e) {
        setError('Failed to fetch devices');
      }
    }, [assetId]);

    useEffect(() => {
      if (assetId) {
        fetchDevices();
      }
    }, [fetchDevices, assetId]);

    useEffect(() => {
      if (error) {
        toast.error(error);
      }
    }, [error]);

    useImperativeHandle(ref, () => ({
      reload: () => {
        fetchDevices(true);
      },
    }));

    if (error) {
      return (
        <ListItem>
          <Typography color="error">{error}</Typography>
        </ListItem>
      );
    }

    return (
      <>
        {devices.map(device => (
          <ListItem key={device.id.id} disablePadding sx={{ pl: 4 }}>
            <ListItemButton
              component={RouterLink}
              to={`/dashboard/device/${slugify(device.type)}/${device.id.id}`}
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
  }
);

export default DeviceList;
