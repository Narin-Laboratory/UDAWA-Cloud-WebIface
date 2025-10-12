import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../contexts/DeviceContext';
import type { DeviceInfo } from '../types';

const DeviceDetailsCard: React.FC = () => {
  const { device } = useDevice() as { device: DeviceInfo | null };
  const { t } = useTranslation();

  if (!device) {
    return null;
  }
  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }} data-testid="device-details-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', p: 1 }}>
            <Typography variant="h5" component="div">
              {device.label}
            </Typography>
            <Typography color="text.secondary">
              {device.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {device.name}
            </Typography>
            <Chip
              label={t(device.active ? 'device.status.active' : 'device.status.inactive')}
              color={device.active ? 'success' : 'default'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 2 }} />
          <Box sx={{ flex: '2 1 400px', p: 1, display: 'flex', flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.ipAddress')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.ipad?.[0]?.[1] ?? 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.ssid')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.wssid?.[0]?.[1] ?? 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.signal')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.rssi?.[0]?.[1] ?? 'N/A'}%
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.battery')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.batt?.[0]?.[1] ?? 'N/A'}%
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.firmware')}:</strong></Typography>
              <Typography variant="body2">
                {device?.timeseries?.current_fw_version?.[0]?.[1] ?? 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.fwState')}:</strong></Typography>
              <Typography variant="body2">
                {device?.timeseries?.fw_state?.[0]?.[1] ?? 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.heap')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.heap?.[0]?.[1] ?? 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 150px', p: 1 }}>
              <Typography variant="body2"><strong>{t('device.properties.lastSeen')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesServerScope?.lastActivityTime?.[0]?.[1]
                  ? new Date(Number(device.attributesServerScope.lastActivityTime[0][1])).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsCard;