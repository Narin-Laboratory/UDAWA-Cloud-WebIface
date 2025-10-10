import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Chip } from '@mui/material';
import { useDevice } from '../contexts/DeviceContext';

const DeviceDetailsCard: React.FC = () => {
  const { device } = useDevice();

  if (!device) {
    return null;
  }
  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
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
              label={device.active ? 'active' : 'inactive'}
              color={device.active ? 'success' : 'default'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item sm={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Divider orientation="vertical" flexItem />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Grid container spacing={1}>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2"><strong>IP Address:</strong></Typography>
                <Typography variant="body2">{device.ipAddress ?? 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2"><strong>SSID:</strong></Typography>
                <Typography variant="body2">{device.ssid ?? 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2"><strong>Signal:</strong></Typography>
                <Typography variant="body2">{device.signal !== undefined ? `${device.signal}%` : 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2"><strong>Battery:</strong></Typography>
                <Typography variant="body2">{device.battery !== undefined ? `${device.battery}%` : 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2"><strong>Firmware Ver.:</strong></Typography>
                <Typography variant="body2">{device.firmwareVersion ?? 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2"><strong>Heap:</strong></Typography>
                <Typography variant="body2">{device.heap ? `${device.heap} B` : 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2"><strong>Last Seen:</strong></Typography>
                <Typography variant="body2">{device.lastSeen ?? 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsCard;