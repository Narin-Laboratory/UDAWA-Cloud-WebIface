import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DynamicObject } from "src/features/dashboard/services/deviceService.ts"; // Import the shared type

// --- UPDATED PROPS INTERFACE ---
// The 'attributes' prop now correctly uses the simple DynamicObject type.
interface PowerSensorProps {
  attributes: DynamicObject | undefined;
}

const MAX_DATA_POINTS = 720; // Maximum data points to keep in the chart history

// Interface for the data structure used by the charts
interface ChartData {
  name: string; // Timestamp label for the X-axis
  _amp: number;
  _volt: number;
  _watt: number;
  _pf: number;
}

const PowerSensor: React.FC<PowerSensorProps> = React.memo(({ attributes }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (attributes) {
      // --- SIMPLIFIED DATA ACCESS ---
      // Directly access properties and convert to number
      const amp = Number(attributes._amp || 0);
      const volt = Number(attributes._volt || 0);
      const watt = Number(attributes._watt || 0);
      const pf = Number(attributes._pf || 0);

      const newEntry: ChartData = {
        name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        _amp: amp,
        _volt: volt,
        _watt: watt,
        _pf: pf,
      };

      setChartData((prevData) => {
        // Prevent duplicate entries for the same second
        if (prevData.length > 0 && prevData[prevData.length - 1].name === newEntry.name) {
          return prevData;
        }
        
        const updatedData = [...prevData, newEntry];
        // Trim the data array if it exceeds the max length
        return updatedData.length > MAX_DATA_POINTS
          ? updatedData.slice(updatedData.length - MAX_DATA_POINTS)
          : updatedData;
      });
    }
  }, [attributes]);

  // --- SIMPLIFIED HELPER FUNCTION ---
  // Helper to safely get and format attribute values
  const getAttribute = (key: string, toFixed?: number) => {
    const value = attributes?.[key];
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      return 'N/A';
    }

    return toFixed !== undefined ? num.toFixed(toFixed) : String(Math.round(num));
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
            <Grid container={true} size={12} spacing={2} justifyContent="center" alignItems="center">
              <div>
                <Typography variant="subtitle1">{t('powerSensor._amp')}</Typography>
                <Typography variant="h5">{getAttribute('_amp', 2)} A</Typography>
              </div>
              <div>
                <Typography variant="subtitle1">{t('powerSensor._volt')}</Typography>
                <Typography variant="h5">{getAttribute('_volt', 0)} V</Typography>
              </div>
            </Grid>
            <Grid container={true} size={12} spacing={2} justifyContent="center" alignItems="center">
              <div>
                <Typography variant="subtitle1">{t('powerSensor._watt')}</Typography>
                <Typography variant="h5">{getAttribute('_watt', 0)} W</Typography>
              </div>
              <div>
                <Typography variant="subtitle1">{t('powerSensor._ener')}</Typography>
                <Typography variant="h5">{getAttribute('_ener', 2)} kWh</Typography>
              </div>
            </Grid>
            <Grid container={true} size={12} spacing={2} justifyContent="center" alignItems="center">
              <div>
                <Typography variant="subtitle1">{t('powerSensor._freq')}</Typography>
                <Typography variant="h5">{getAttribute('_freq', 1)} Hz</Typography>
              </div>
              <div>
                <Typography variant="subtitle1">{t('powerSensor._pf')}</Typography>
                <Typography variant="h5">{getAttribute('_pf', 2)}</Typography>
              </div>
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
                <XAxis dataKey="name" interval="preserveStartEnd" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
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
});

export default PowerSensor;