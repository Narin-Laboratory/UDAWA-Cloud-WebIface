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

interface MurariMonitorProps {
  attributes: DynamicObject | undefined;
}

const MAX_DATA_POINTS = 720;

interface ChartData {
  name: string;
  _temp: number;
  _rh: number;
  _lux: number;
}

const MurariMonitor: React.FC<MurariMonitorProps> = React.memo(({ attributes }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (attributes) {
      const temp = Number(attributes._temp || 0);
      const rh = Number(attributes._rh || 0);
      const lux = Number(attributes._lux || 0);

      const newEntry: ChartData = {
        name: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        _temp: temp,
        _rh: rh,
        _lux: lux,
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
    { dataKey: '_temp', label: t('murariMonitor._temp'), color: '#8884d8' },
    { dataKey: '_rh', label: t('murariMonitor._rh'), color: '#82ca9d' },
    { dataKey: '_lux', label: t('murariMonitor._lux'), color: '#ffc658' },
  ];

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('murariMonitor.title')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {renderMetric(t('murariMonitor._temp'), getAttribute('_temp', 2), '°C')}
            {renderMetric(t('murariMonitor._rh'), getAttribute('_rh', 0), '%')}
            {renderMetric(t('murariMonitor._lux'), getAttribute('_lux', 0), 'lx')}
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

export default MurariMonitor;
