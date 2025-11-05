import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Stack,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../hooks/useDevice';

const DeviceDetailsCard: React.FC = () => {
  const { device } = useDevice();
  const { t } = useTranslation();

  if (!device) {
    return null;
  }

  const renderDetail = (label: string, value: any) => (
    <Box
      sx={{
        width: { xs: '50%', sm: '33.33%', md: '25%' },
        p: 1,
      }}
    >
      <Typography variant="body2">
        <strong>{label}:</strong>
      </Typography>
      <Typography variant="body2">{value ?? 'N/A'}</Typography>
    </Box>
  );

  return (
    <Card
      variant="outlined"
      sx={{ width: '100%', mb: 2 }}
      data-testid="device-details-card"
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '33.33%' }, p: 1 }}>
            <Stack spacing={1}>
              <Typography variant="h5" component="div">
                {device.label}
              </Typography>
              <Typography color="text.secondary">{device.type}</Typography>
              <Typography variant="body2" color="text.secondary">
                {device.name}
              </Typography>
              <Chip
                label={t(
                  device.active ? 'device.status.active' : 'device.status.inactive'
                )}
                color={device.active ? 'success' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Stack>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }}
          />
          <Box
            sx={{
              width: { xs: '100%', md: '66.67%' },
              display: 'flex',
              flexWrap: 'wrap',
              p: 1,
            }}
          >
            {renderDetail(
              t('device.properties.ipAddress'),
              (device?.attributesClientScope as any)?.ipad
            )}
            {renderDetail(
              t('device.properties.ssid'),
              device?.attributesClientScope?.wssid
            )}
            {renderDetail(
              t('device.properties.signal'),
              `${device?.attributesClientScope?.rssi}%`
            )}
            {renderDetail(
              t('device.properties.battery'),
              `${device?.attributesClientScope?.batt}%`
            )}
            {renderDetail(
              t('device.properties.firmware'),
              (device?.timeseries?.current_fw_version as any)?.value
            )}
            {renderDetail(
              t('device.properties.fwState'),
              (device?.timeseries?.fw_state as any)?.value
            )}
            {renderDetail(
              t('device.properties.heap'),
              device?.attributesClientScope?.heap
            )}
            {renderDetail(
              t('device.properties.lastSeen'),
              device?.attributesServerScope?.lastActivityTime
                ? new Date(
                    Number(device.attributesServerScope.lastActivityTime)
                  ).toLocaleString()
                : 'N/A'
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsCard;
