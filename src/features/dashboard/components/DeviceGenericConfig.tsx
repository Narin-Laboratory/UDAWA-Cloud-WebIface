import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { DeviceInfo } from '@/features/dashboard/services/deviceService';
import { saveDeviceAttributes } from '@/features/dashboard/services/deviceService';

interface DeviceGenericConfigProps {
  device: DeviceInfo | null;
}

const DeviceGenericConfig: React.FC<DeviceGenericConfigProps> = ({
  device,
}) => {
  const { t } = useTranslation();
  const [wssid, setWssid] = useState('');
  const [wpass, setWpass] = useState('');
  const [hname, setHname] = useState('');

  useEffect(() => {
    if (device) {
      setWssid(device.attributesClientScope?.wssid?.[0]?.[1] || '');
      setWpass(device.attributesClientScope?.wpass?.[0]?.[1] || '');
      setHname(device.attributesClientScope?.hname?.[0]?.[1] || '');
    }
  }, [device]);

  const handleSave = async () => {
    if (!device) return;

    const attributes = {
      wssid: wssid,
      wpass: wpass,
      hname: hname,
    };

    try {
      await toast.promise(
        saveDeviceAttributes(
          device.id.entityType,
          device.id.id,
          'CLIENT_SCOPE',
          attributes,
        ),
        {
          pending: t('device.genericConfig.saving'),
          success: t('device.genericConfig.saveSuccess'),
          error: t('device.genericConfig.saveError'),
        },
      );
    } catch (error) {
      // Error is already handled by toast.promise
    }
  };

  const handleReset = () => {
    if (device) {
      setWssid(device.attributesClientScope?.wssid?.[0]?.[1] || '');
      setWpass(device.attributesClientScope?.wpass?.[0]?.[1] || '');
      setHname(device.attributesClientScope?.hname?.[0]?.[1] || '');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('device.genericConfig.title')}
        </Typography>
        <TextField
          label={t('device.genericConfig.wifiSSID')}
          value={wssid}
          onChange={e => setWssid(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.wifiPassword')}
          value={wpass}
          onChange={e => setWpass(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.hostName')}
          value={hname}
          onChange={e => setHname(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleReset} sx={{ mr: 1 }}>
            {t('device.genericConfig.reset')}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {t('device.genericConfig.save')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeviceGenericConfig;