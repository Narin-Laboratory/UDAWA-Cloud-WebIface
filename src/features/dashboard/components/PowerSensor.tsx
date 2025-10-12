import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Device } from '../services/deviceService';

const MAX_DATA_POINTS = 720;

const PowerSensor: React.FC<{ device: Device | null }> = ({ device }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (device && device.attributesClientScope) {
      const newEntry: any = {
        name: new Date().toLocaleTimeString(),
        _amp: parseFloat(device.attributesClientScope['_amp']?.[0]?.[1] || '0'),
        _volt: parseFloat(device.attributesClientScope['_volt']?.[0]?.[1] || '0'),
        _watt: parseFloat(device.attributesClientScope['_watt']?.[0]?.[1] || '0'),
        _pf: parseFloat(device.attributesClientScope['_pf']?.[0]?.[1] || '0'),
      };

      setData(prevData => {
        const updatedData = [...prevData, newEntry];
        if (updatedData.length > MAX_DATA_POINTS) {
          return updatedData.slice(updatedData.length - MAX_DATA_POINTS);
        }
        return updatedData;
      });
    }
  }, [device]);

  const getAttribute = (key: string, toFixed?: number) => {
    const value = device?.attributesClientScope?.[key]?.[0]?.[1];
    if (value) {
      const num = parseFloat(value);
      return isNaN(num) ? 'N/A' : num.toFixed(toFixed);
    }
    return 'N/A';
  };

  const renderChart = (dataKey: string, color: string) => (
    <Grid item xs={12} md={6}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Grid>
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>{t('powerSensor.title')}</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="subtitle1">{t('powerSensor._amp')}</Typography>
              <Typography variant="h5">{getAttribute('_amp', 2)} A</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{t('powerSensor._volt')}</Typography>
              <Typography variant="h5">{getAttribute('_volt', 0)} V</Typography>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Grid item>
              <Typography variant="subtitle1">{t('powerSensor._watt')}</Typography>
              <Typography variant="h5">{getAttribute('_watt', 0)} W</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{t('powerSensor._ener')}</Typography>
              <Typography variant="h5">{getAttribute('_ener', 2)} kWh</Typography>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Grid item>
              <Typography variant="subtitle1">{t('powerSensor._freq')}</Typography>
              <Typography variant="h5">{getAttribute('_freq', 1)} Hz</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{t('powerSensor._pf')}</Typography>
              <Typography variant="h5">{getAttribute('_pf', 2)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {renderChart('_amp', '#8884d8')}
        {renderChart('_volt', '#82ca9d')}
        {renderChart('_watt', '#ffc658')}
        {renderChart('_pf', '#ff7300')}
      </Grid>
    </Box>
  );
};

export default PowerSensor;