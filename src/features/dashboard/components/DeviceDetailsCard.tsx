import React from 'react';
import { Card, CardContent, Typography, Divider, Chip, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../contexts/DeviceContext';

const DeviceDetailsCard: React.FC = () => {
  const { device } = useDevice();
  const { t } = useTranslation();

  if (!device) {
    return null;
  }
  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          <Box sx={{ width: { xs: '100%', sm: '33%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '67%' }, mt: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.ipAddress')}:</strong></Typography>
                <Typography variant="body2">{device.ipAddress ?? 'N/A'}</Typography>
              </Box>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.ssid')}:</strong></Typography>
                <Typography variant="body2">{device.ssid ?? 'N/A'}</Typography>
              </Box>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.signal')}:</strong></Typography>
                <Typography variant="body2">{device.signal !== undefined ? `${device.signal}%` : 'N/A'}</Typography>
              </Box>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.battery')}:</strong></Typography>
                <Typography variant="body2">{device.battery !== undefined ? `${device.battery}%` : 'N/A'}</Typography>
              </Box>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.firmware')}:</strong></Typography>
                <Typography variant="body2">{device.firmwareVersion ?? 'N/A'}</Typography>
              </Box>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.heap')}:</strong></Typography>
                <Typography variant="body2">{device.heap ? `${device.heap} B` : 'N/A'}</Typography>
              </Box>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.lastSeen')}:</strong></Typography>
                <Typography variant="body2">{device.lastSeen ?? 'N/A'}</Typography>
              </Box>
              <Box sx={{ width: { xs: '50%', sm: '33%' }, mb: 1 }}>
                <Typography variant="body2"><strong>{t('device.properties.fwState')}:</strong></Typography>
                <Typography variant="body2">{device.fw_state ?? 'N/A'}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsCard;