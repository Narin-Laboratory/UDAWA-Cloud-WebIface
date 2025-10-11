import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import { getDeviceConfig, saveDeviceConfig, type DeviceConfig } from '../../services/deviceConfigService';
import { toast } from 'react-toastify';

const GenericDeviceConfig: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [config, setConfig] = useState<DeviceConfig>({
    wssid: '',
    wpass: '',
    hname: '',
    provDK: '',
    provDS: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (deviceId) {
      getDeviceConfig(deviceId)
        .then(data => {
          setConfig(data);
          setLoading(false);
        })
        .catch(_error => {
          toast.error('Failed to fetch device configuration.');
          setLoading(false);
        });
    }
  }, [deviceId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (deviceId) {
      toast.promise(
        saveDeviceConfig(deviceId, config),
        {
          pending: 'Saving configuration...',
          success: 'Configuration saved successfully!',
          error: 'Failed to save configuration.',
        }
      );
    }
  };

  if (loading) {
    return <Typography>Loading configuration...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Generic Device Configuration
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            label="WiFi SSID"
            name="wssid"
            value={config.wssid || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="WiFi Password"
            name="wpass"
            type="password"
            value={config.wpass || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Hostname"
            name="hname"
            value={config.hname || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Provision Device Key"
            name="provDK"
            value={config.provDK || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Provision Device Secret"
            name="provDS"
            value={config.provDS || ''}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GenericDeviceConfig;