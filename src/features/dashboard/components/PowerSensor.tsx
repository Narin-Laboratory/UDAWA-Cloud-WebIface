import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Device } from '../services/deviceService';

const MAX_DATA_POINTS = 720;

const PowerSensor: React.FC<{ device: Device | null }> = ({ device }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any[]>([]);

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

  const renderChart = (dataKey: string, label: string, color: string) => (
    <Grid item xs={12} sm={6} key={dataKey}>
      <Typography variant="subtitle1" align="center">{label}</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
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

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" align="center">{t('powerSensor._amp')}</Typography>
          <LineChart width={400} height={200} data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="_amp" name={t('powerSensor._amp')} stroke="#8884d8" dot={false} isAnimationActive={false} />
          </LineChart>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" align="center">{t('powerSensor._volt')}</Typography>
          <LineChart width={400} height={200} data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="_volt" name={t('powerSensor._volt')} stroke="#82ca9d" dot={false} isAnimationActive={false} />
          </LineChart>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" align="center">{t('powerSensor._watt')}</Typography>
          <LineChart width={400} height={200} data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="_watt" name={t('powerSensor._watt')} stroke="#ffc658" dot={false} isAnimationActive={false} />
          </LineChart>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" align="center">{t('powerSensor._pf')}</Typography>
          <LineChart width={400} height={200} data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="_pf" name={t('powerSensor._pf')} stroke="#ff7300" dot={false} isAnimationActive={false} />
          </LineChart>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PowerSensor;