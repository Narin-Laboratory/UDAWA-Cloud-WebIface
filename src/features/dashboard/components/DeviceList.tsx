import {
  useImperativeHandle,
  forwardRef,
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
import type { DeviceInfo } from '../services/deviceService';
import slugify from '../../../utils/slugify';

export interface DeviceListHandle {
  reload: () => void;
}

interface DeviceListProps {
  devices: DeviceInfo[];
  error: string | null;
  onReload: () => void;
}

const DeviceList = forwardRef<DeviceListHandle, DeviceListProps>(
  ({ devices, error, onReload }, ref) => {
    useImperativeHandle(ref, () => ({
      reload: () => {
        onReload();
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
        {devices.map((device) => (
          <ListItem key={device.id.id} disablePadding>
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