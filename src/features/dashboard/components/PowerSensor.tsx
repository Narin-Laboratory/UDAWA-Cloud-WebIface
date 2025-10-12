import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Box, Divider, useTheme, useMediaQuery } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Device } from '../services/deviceService';

const MAX_DATA_POINTS = 720;

const PowerSensor: React.FC<{ device: Device | null }> = ({ device }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (device?.attributesClientScope) {
      const amp = device.attributesClientScope['_amp']?.[0]?.[1];
      const volt = device.attributesClientScope['_volt']?.[0]?.[1];
      const watt = device.attributesClientScope['_watt']?.[0]?.[1];
      const pf = device.attributesClientScope['_pf']?.[0]?.[1];

      if (amp !== undefined || volt !== undefined || watt !== undefined || pf !== undefined) {
        const newEntry = {
          name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          _amp: parseFloat(amp || '0'),
          _volt: parseFloat(volt || '0'),
          _watt: parseFloat(watt || '0'),
          _pf: parseFloat(pf || '0'),
        };

        setChartData(prevData => {
          const lastEntry = prevData[prevData.length - 1];
          if (lastEntry && lastEntry.name === newEntry.name) {
            return prevData;
          }

          const updatedData = [...prevData, newEntry];
          if (updatedData.length > MAX_DATA_POINTS) {
            return updatedData.slice(updatedData.length - MAX_DATA_POINTS);
          }
          return updatedData;
        });
      }
    }
  }, [device]);

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
      return String(Math.round(num));
    }
    return 'N/A';
  };

  const charts = [
    { dataKey: '_amp', label: t('powerSensor._amp'), color: '#8884d8' },
    { dataKey: '_volt', label: t('powerSensor._volt'), color: '#82ca9d' },
    { dataKey: '_watt', label: t('powerSensor._watt'), color: '#ffc658' },
    { dataKey: '_pf', label: t('powerSensor._pf'), color: '#ff7300' },
  ];

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>{t('powerSensor.title')}</Typography>
          <Grid container spacing={2} alignItems="center" justifyContent="space-around">
            <Grid item container xs={12} sm="auto" spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._amp')}</Typography>
                <Typography variant="h5">{getAttribute('_amp', 2)} A</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._volt')}</Typography>
                <Typography variant="h5">{getAttribute('_volt', 0)} V</Typography>
              </Grid>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 2 }} />

            <Grid item container xs={12} sm="auto" spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._watt')}</Typography>
                <Typography variant="h5">{getAttribute('_watt', 0)} W</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{t('powerSensor._ener')}</Typography>
                <Typography variant="h5">{getAttribute('_ener', 2)} kWh</Typography>
              </Grid>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 2 }} />

            <Grid item container xs={12} sm="auto" spacing={2} justifyContent="center" alignItems="center">
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, mx: -1.5 }}>
        {charts.map(chart => (
          <Box key={chart.dataKey} sx={{ width: { xs: '100%', sm: '50%' }, p: 1.5 }}>
            <Typography variant="subtitle1" align="center">{chart.label}</Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={chart.dataKey} name={chart.label} stroke={chart.color} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PowerSensor;