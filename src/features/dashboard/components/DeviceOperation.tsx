
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { rpcV2 } from '@/features/dashboard/services/deviceService';
import { useDevice } from '../hooks/useDevice';

const DeviceOperation: React.FC = () => {
  const { t } = useTranslation();
  const { device } = useDevice();


  const handleRpcCall = async (method: string) => {
    if (!device?.id.id) return;

    try {
      await toast.promise(
        rpcV2(device.id.id, method, {}),
        {
          pending: `${t('rpcv2.process')}: ${method}`,
          success: `${t('rpcv2.success')}: ${method}`,
          error: `${t('rpcv2.error')}: ${method}`,
        },
      );
    } catch {
      // Error is already handled by toast.promise
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('device.deviceOperation.title')}
        </Typography>
        <Stack spacing={2} direction="row">
          <Button onClick={() => handleRpcCall('syncAttribute')} variant="contained">
            {t('device.deviceOperation.syncAttribute')}
          </Button>
          <Button onClick={() => handleRpcCall('stateSave')} variant="contained">
            {t('device.deviceOperation.stateSave')}
          </Button>
          <Button onClick={() => handleRpcCall('FSUpdate')} variant="contained">
            {t('device.deviceOperation.fsUpdate')}
          </Button>
          <Button onClick={() => handleRpcCall('reboot')} variant="contained" color="error">
            {t('device.deviceOperation.reboot')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DeviceOperation;
