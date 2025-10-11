import React from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Device } from '@/features/devices/types';

interface DeviceGenericConfigProps {
  device: Device | null;
}

const DeviceGenericConfig: React.FC<DeviceGenericConfigProps> = ({
  device,
}) => {
  const { t } = useTranslation();

  const wssid = device?.attributesClientScope?.wssid?.[0]?.[1] || '';
  const wpass = device?.attributesClientScope?.wpass?.[0]?.[1] || '';
  const hname = device?.attributesClientScope?.hname?.[0]?.[1] || '';

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('device.genericConfig.title')}
        </Typography>
        <TextField
          label={t('device.genericConfig.wifiSSID')}
          value={wssid}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label={t('device.genericConfig.wifiPassword')}
          value={wpass}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label={t('device.genericConfig.hostName')}
          value={hname}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DeviceGenericConfig;