import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../hooks/useDevice';

const DeviceDetailsCard: React.FC = () => {
  const { device } = useDevice();
  const { t } = useTranslation();

  if (!device) {
    return null;
  }
  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }} data-testid="device-details-card">
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid size={6}>
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
          </Grid>
          <Grid size={1}>
            <Divider orientation="vertical" flexItem />
          </Grid>
            <Grid size={7}>
            <Grid container spacing={1}>
              <Grid size={6}>
              <Typography variant="body2"><strong>{t('device.properties.ipAddress')}:</strong></Typography>
              <Typography variant="body2">
                {(device?.attributesClientScope as any)?.ipad ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid size={6}>
              <Typography variant="body2"><strong>{t('device.properties.ssid')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.wssid ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid size={6}>
              <Typography variant="body2"><strong>{t('device.properties.signal')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.rssi ?? 'N/A'}%
              </Typography>
              </Grid>
              <Grid size={6}>
              <Typography variant="body2"><strong>{t('device.properties.battery')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.batt ?? 'N/A'}%
              </Typography>
              </Grid>
              <Grid size={6}>
              <Typography variant="body2"><strong>{t('device.properties.firmware')}:</strong></Typography>
              <Typography variant="body2">
                {device?.timeseries?.current_fw_version ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid size={6}>
              <Typography variant="body2"><strong>{t('device.properties.fwState')}:</strong></Typography>
              <Typography variant="body2">
                {device?.timeseries?.fw_state ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2"><strong>{t('device.properties.heap')}:</strong></Typography>
                <Typography variant="body2">
                  {device?.attributesClientScope?.heap ?? 'N/A'}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2"><strong>{t('device.properties.lastSeen')}:</strong></Typography>
                <Typography variant="body2">
                  {device?.attributesServerScope?.lastActivityTime
                  ? new Date(Number(device.attributesServerScope.lastActivityTime)).toLocaleString()
                  : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsCard;