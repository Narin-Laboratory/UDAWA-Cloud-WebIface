import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Chip, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../hooks/useDevice';

const DeviceDetailsCard: React.FC = () => {
  const { device } = useDevice();
  const { t } = useTranslation();

  if (!device) {
    return null;
  }

  const renderDetail = (label: string, value: any) => (
    <Grid size={{ xs: 6, sm: 6, md: 4 }}>
      <Typography variant="body2"><strong>{label}:</strong></Typography>
      <Typography variant="body2">{value ?? 'N/A'}</Typography>
    </Grid>
  );

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }} data-testid="device-details-card">
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
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
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 1 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Divider orientation="vertical" flexItem />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={1}>
              {renderDetail(t('device.properties.ipAddress'), (device?.attributesClientScope as any)?.ipad)}
              {renderDetail(t('device.properties.ssid'), device?.attributesClientScope?.wssid)}
              {renderDetail(t('device.properties.signal'), `${device?.attributesClientScope?.rssi}%`)}
              {renderDetail(t('device.properties.battery'), `${device?.attributesClientScope?.batt}%`)}
              {renderDetail(t('device.properties.firmware'), device?.timeseries?.current_fw_version)}
              {renderDetail(t('device.properties.fwState'), device?.timeseries?.fw_state)}
              {renderDetail(t('device.properties.heap'), device?.attributesClientScope?.heap)}
              {renderDetail(t('device.properties.lastSeen'), device?.attributesServerScope?.lastActivityTime
                ? new Date(Number(device.attributesServerScope.lastActivityTime)).toLocaleString()
                : 'N/A')}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsCard;