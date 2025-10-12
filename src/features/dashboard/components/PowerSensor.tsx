import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Device } from '../services/deviceService';

const MAX_DATA_POINTS = 720;

const PowerSensor: React.FC<{ device: Device | null }> = ({ device }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any[]>([]);

  const amp = device?.attributesClientScope?.['_amp']?.[0]?.[1];
  const volt = device?.attributesClientScope?.['_volt']?.[0]?.[1];
  const watt = device?.attributesClientScope?.['_watt']?.[0]?.[1];
  const pf = device?.attributesClientScope?.['_pf']?.[0]?.[1];

  useEffect(() => {
    if (amp !== undefined || volt !== undefined || watt !== undefined || pf !== undefined) {
      const newEntry = {
        name: new Date().toLocaleTimeString(),
        _amp: parseFloat(amp || '0'),
        _volt: parseFloat(volt || '0'),
        _watt: parseFloat(watt || '0'),
        _pf: parseFloat(pf || '0'),
      };

      setChartData(prevData => {
        const lastEntry = prevData[prevData.length - 1];
        if (lastEntry && lastEntry._amp === newEntry._amp && lastEntry._volt === newEntry._volt && lastEntry._watt === newEntry._watt && lastEntry._pf === newEntry._pf) {
            return prevData;
        }

        const updatedData = [...prevData, newEntry];
        if (updatedData.length > MAX_DATA_POINTS) {
          return updatedData.slice(updatedData.length - MAX_DATA_POINTS);
        }
        return updatedData;
      });
    }
  }, [amp, volt, watt, pf]);

  const getAttribute = (key: string, toFixed?: number) => {
    const value = device?.attributesClientScope?.[key]?.[0]?.[1];
    if (value) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return 'N/A';
      }
      if (toFixed !== undefined) {
        return num.toFixed(toFixed);
      }
      return String(num);
    }
    return 'N/A';
  };

  const renderChart = (dataKey: string, label: string, color: string) => (
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle1" align="center">{label}</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} name={label} stroke={color} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Grid>
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>{t('powerSensor.title')}</Typography>
          <Grid container spacing={2} alignItems="center" justifyContent="space-around">
            <Grid item container xs={12} md="auto" spacing={2} justifyContent="center">
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._amp')}</Typography>
                <Typography variant="h5">{getAttribute('_amp', 2)} A</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._volt')}</Typography>
                <Typography variant="h5">{getAttribute('_volt', 0)} V</Typography>
              </Grid>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, my: 1 }} />

            <Grid item container xs={12} md="auto" spacing={2} justifyContent="center">
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._watt')}</Typography>
                <Typography variant="h5">{getAttribute('_watt', 0)} W</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._ener')}</Typography>
                <Typography variant="h5">{getAttribute('_ener', 2)} kWh</Typography>
              </Grid>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, my: 1 }} />

            <Grid item container xs={12} md="auto" spacing={2} justifyContent="center">
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._freq')}</Typography>
                <Typography variant="h5">{getAttribute('_freq', 1)} Hz</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._pf')}</Typography>
                <Typography variant="h5">{getAttribute('_pf', 2)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {renderChart('_amp', t('powerSensor._amp'), '#8884d8')}
        {renderChart('_volt', t('powerSensor._volt'), '#82ca9d')}
        {renderChart('_watt', t('powerSensor._watt'), '#ffc658')}
        {renderChart('_pf', t('powerSensor._pf'), '#ff7300')}
      </Grid>
    </Box>
  );
};

export default PowerSensor;