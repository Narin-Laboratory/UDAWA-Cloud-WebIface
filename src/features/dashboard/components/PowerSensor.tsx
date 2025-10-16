import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Box,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DynamicObject } from 'src/features/dashboard/services/deviceService.ts';

interface PowerSensorProps {
  attributes: DynamicObject | undefined;
}

const MAX_DATA_POINTS = 720;

interface ChartData {
  name: string;
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
      const amp = Number(attributes._amp || 0);
      const volt = Number(attributes._volt || 0);
      const watt = Number(attributes._watt || 0);
      const pf = Number(attributes._pf || 0);

      const newEntry: ChartData = {
        name: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        _amp: amp,
        _volt: volt,
        _watt: watt,
        _pf: pf,
      };

      setChartData(prevData => {
        if (
          prevData.length > 0 &&
          prevData[prevData.length - 1].name === newEntry.name
        ) {
          return prevData;
        }

        const updatedData = [...prevData, newEntry];
        return updatedData.length > MAX_DATA_POINTS
          ? updatedData.slice(updatedData.length - MAX_DATA_POINTS)
          : updatedData;
      });
    }
  }, [attributes]);

  const getAttribute = (key: string, toFixed?: number) => {
    const value = attributes?.[key];
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return toFixed !== undefined
      ? num.toFixed(toFixed)
      : String(Math.round(num));
  };

  const renderMetric = (label: string, value: string, unit: string) => (
    <Box
      sx={{
        textAlign: 'center',
        flex: '1 1 calc(50% - 1rem)',
        '@media (min-width:600px)': {
          flex: '1 1 calc(33.333% - 1rem)',
        },
        '@media (min-width:900px)': {
          flex: '1 1 calc(16.666% - 1rem)',
        },
        p: 1,
      }}
    >
      <Typography variant="subtitle1">{label}</Typography>
      <Typography variant="h5">
        {value} {unit}
      </Typography>
    </Box>
  );

  const charts = [
    { dataKey: '_amp', label: t('powerSensor._amp'), color: '#8884d8' },
    { dataKey: '_volt', label: t('powerSensor._volt'), color: '#82ca9d' },
    { dataKey: '_watt', label: t('powerSensor._watt'), color: '#ffc658' },
    { dataKey: '_pf', label: t('powerSensor._pf'), color: '#ff7300' },
  ];

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('powerSensor.title')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {renderMetric(t('powerSensor._amp'), getAttribute('_amp', 2), 'A')}
            {renderMetric(t('powerSensor._volt'), getAttribute('_volt', 0), 'V')}
            {renderMetric(t('powerSensor._watt'), getAttribute('_watt', 0), 'W')}
            {renderMetric(t('powerSensor._ener'), getAttribute('_ener', 2), 'kWh')}
            {renderMetric(t('powerSensor._freq'), getAttribute('_freq', 1), 'Hz')}
            {renderMetric(t('powerSensor._pf'), getAttribute('_pf', 2), '')}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {charts.map(chart => (
          <Box
            key={chart.dataKey}
            sx={{
              flex: '1 1 100%',
              '@media (min-width:900px)': {
                flex: '1 1 calc(50% - 1rem)',
              },
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="subtitle1" align="center">
                  {chart.label}
                </Typography>
                <ResponsiveContainer
                  width="100%"
                  height={isMobile ? 200 : 300}
                >
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval="preserveStartEnd"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={chart.dataKey}
                      name={chart.label}
                      stroke={chart.color}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Stack>
  );
});

export default PowerSensor;