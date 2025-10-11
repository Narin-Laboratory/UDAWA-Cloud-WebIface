import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../contexts/DeviceContext';

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
          <Grid item xs={12} sm={4}>
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
            <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.lastSeen')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesServerScope?.lastActivityTime?.[0]?.[1]
                ? new Date(Number(device.attributesServerScope.lastActivityTime[0][1])).toLocaleString()
                : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
          <Grid item sm={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Divider orientation="vertical" flexItem />
          </Grid>
            <Grid item xs={12} sm={7}>
            <Grid container spacing={1}>
              <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.ipAddress')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.ipad?.[0]?.[1] ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.ssid')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.wssid?.[0]?.[1] ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.signal')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.rssi?.[0]?.[1] ?? 'N/A'}%
              </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.battery')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.batt?.[0]?.[1] ?? 'N/A'}%
              </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.firmware')}:</strong></Typography>
              <Typography variant="body2">
                {device?.timeseries?.current_fw_version?.[0]?.[1] ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.heap')}:</strong></Typography>
              <Typography variant="body2">
                {device?.attributesClientScope?.heap?.[0]?.[1] ?? 'N/A'}
              </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
              <Typography variant="body2"><strong>{t('device.properties.fwState')}:</strong></Typography>
              <Typography variant="body2">
                {device?.timeseries?.fw_state?.[0]?.[1] ?? 'N/A'}
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