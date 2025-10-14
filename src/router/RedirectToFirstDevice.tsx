import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { getDevices } from '../features/dashboard/services/deviceService';
import type { Device } from '../features/dashboard/services/deviceService';

const RedirectToFirstDevice: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevicesAndRedirect = async () => {
      try {
        const devices = await getDevices();
        if (devices.length > 0) {
          const firstDevice = devices[0] as Device;
          if (firstDevice.id && firstDevice.type) {
            navigate(
              `/dashboard/device/${firstDevice.type}/${firstDevice.id.id}`
            );
          }
        }
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevicesAndRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return null;
};

export default RedirectToFirstDevice;