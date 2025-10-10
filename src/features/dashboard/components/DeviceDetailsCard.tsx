import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Divider, Chip } from '@mui/material';
import type { DeviceInfo } from '../services/deviceService';
import { useTelemetry } from '../../../contexts/TelemetryContext';
import { getItem } from '../../../utils/storage';

interface DeviceDetailsCardProps {
  device: DeviceInfo;
}

const DeviceDetailsCard: React.FC<DeviceDetailsCardProps> = ({ device }) => {
  const [deviceData, setDeviceData] = useState<DeviceInfo>(device);
  const telemetryService = useTelemetry();

  useEffect(() => {
    setDeviceData(device); // Reset state if the device prop changes

    const telemetryKeysCache = getItem(
      `telemetry_keys_${device.id.id}`
    ) as { attributes: string[]; timeseries: string[] } | null;

    if (!telemetryService || !telemetryKeysCache) {
      return;
    }

    const subscriptionIds: number[] = [];

    const handleAttributeUpdate = (attributes: { [key: string]: any }) => {
        const updatedAttributes: Partial<DeviceInfo> = {};
        for (const key in attributes) {
          const attribute = key as keyof DeviceInfo;
          updatedAttributes[attribute] = attributes[key];
        }
        setDeviceData((prevData) => ({ ...prevData, ...updatedAttributes }));
      };

      const handleTimeseriesUpdate = (timeseries: { [key: string]: [number, any][] }) => {
        const latestValues: Partial<DeviceInfo> = {};
        for (const key in timeseries) {
          if (timeseries[key] && timeseries[key].length > 0) {
            const value = timeseries[key][0][1];
            const tsKey = key as keyof DeviceInfo;
            latestValues[tsKey] = value;
          }
        }
        setDeviceData((prevData) => ({ ...prevData, ...latestValues, lastSeen: new Date().toISOString() }));
      };

    if (telemetryKeysCache.attributes.length > 0) {
      const subId = telemetryService.subscribe(
        'DEVICE',
        device.id.id,
        'ATTRIBUTES',
        telemetryKeysCache.attributes,
        handleAttributeUpdate,
        'ANY_SCOPE'
      );
      if (subId !== null) subscriptionIds.push(subId);
    }

    if (telemetryKeysCache.timeseries.length > 0) {
      const subId = telemetryService.subscribe(
        'DEVICE',
        device.id.id,
        'TIMESERIES',
        telemetryKeysCache.timeseries,
        handleTimeseriesUpdate
      );
      if (subId !== null) subscriptionIds.push(subId);
    }

    return () => {
      subscriptionIds.forEach((id) => telemetryService.unsubscribe(id));
    };
  }, [device, telemetryService]);

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} sm={4}>
            <Typography variant="h5" component="div">
              {deviceData.label}
            </Typography>
            <Typography color="text.secondary">
              {deviceData.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deviceData.name}
            </Typography>
            <Chip
              label={deviceData.active ? 'active' : 'inactive'}
              color={deviceData.active ? 'success' : 'default'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid sm={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Divider orientation="vertical" flexItem />
          </Grid>
          <Grid xs={12} sm={7}>
            <Grid container spacing={1}>
              <Grid xs={6} sm={4}>
                <Typography variant="body2"><strong>IP Address:</strong></Typography>
                <Typography variant="body2">{deviceData.ipAddress || 'N/A'}</Typography>
              </Grid>
              <Grid xs={6} sm={4}>
                <Typography variant="body2"><strong>SSID:</strong></Typography>
                <Typography variant="body2">{deviceData.ssid || 'N/A'}</Typography>
              </Grid>
              <Grid xs={6} sm={4}>
                <Typography variant="body2"><strong>Signal:</strong></Typography>
                <Typography variant="body2">{deviceData.signal !== undefined ? `${deviceData.signal}%` : 'N/A'}</Typography>
              </Grid>
              <Grid xs={6} sm={4}>
                <Typography variant="body2"><strong>Battery:</strong></Typography>
                <Typography variant="body2">{deviceData.battery !== undefined ? `${deviceData.battery}%` : 'N/A'}</Typography>
              </Grid>
              <Grid xs={6} sm={4}>
                <Typography variant="body2"><strong>Firmware Ver.:</strong></Typography>
                <Typography variant="body2">{deviceData.firmwareVersion || 'N/A'}</Typography>
              </Grid>
              <Grid xs={6} sm={4}>
                <Typography variant="body2"><strong>Heap:</strong></Typography>
                <Typography variant="body2">{deviceData.heap ? `${deviceData.heap} B` : 'N/A'}</Typography>
              </Grid>
              <Grid xs={6} sm={4}>
                <Typography variant="body2"><strong>Last Seen:</strong></Typography>
                <Typography variant="body2">{deviceData.lastSeen ? new Date(deviceData.lastSeen).toLocaleString() : 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsCard;