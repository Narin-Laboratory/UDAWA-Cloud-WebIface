import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../hooks/useDevice';
import { getTimeseriesKeys, getTimeseriesData } from '../services/deviceService';
import { transformTimeseriesData } from '../utils/dataTransformer';
import type { ChartDataPoint } from '../utils/dataTransformer';

const TimeseriesVisualizer: React.FC = () => {
  const { t } = useTranslation();
  const { device } = useDevice();
  const [keys, setKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Default to the last 24 hours
  const now = useMemo(() => new Date(), []);
  const yesterday = useMemo(() => new Date(now.getTime() - 24 * 60 * 60 * 1000), [now]);

  const [startTs, setStartTs] = useState<Date>(yesterday);
  const [endTs, setEndTs] = useState<Date>(now);
  const [aggregation, setAggregation] = useState('AVG');

  useEffect(() => {
    if (device) {
      setLoading(true);
      getTimeseriesKeys(device.id.entityType, device.id.id)
        .then(fetchedKeys => {
          setKeys(fetchedKeys);
          if (fetchedKeys.length > 0) {
            setSelectedKey(fetchedKeys[0]);
          }
        })
        .catch(() => setError(t('timeseriesVisualizer.fetchKeysError')))
        .finally(() => setLoading(false));
    }
  }, [device, t]);

  const fetchData = () => {
    if (!device || !selectedKey) return;

    setLoading(true);
    setError(null);

    getTimeseriesData(device.id.entityType, device.id.id, {
      keys: selectedKey,
      startTs: startTs.getTime(),
      endTs: endTs.getTime(),
      agg: aggregation,
      limit: 1000,
    })
      .then(apiData => {
        const transformedData = transformTimeseriesData(apiData, selectedKey);
        setData(transformedData);
      })
      .catch(() => setError(t('timeseriesVisualizer.fetchDataError', { key: selectedKey })))
      .finally(() => setLoading(false));
  };


  if (!device) {
    return <Typography>{t('timeseriesVisualizer.noDevice')}</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('timeseriesVisualizer.title')}
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>{t('timeseriesVisualizer.keyLabel')}</InputLabel>
            <Select
              value={selectedKey}
              label={t('timeseriesVisualizer.keyLabel')}
              onChange={e => setSelectedKey(e.target.value as string)}
            >
              {keys.map(key => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label={t('timeseriesVisualizer.startDateLabel')}
            type="datetime-local"
            value={startTs.toISOString().slice(0, 16)}
            onChange={e => setStartTs(new Date(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label={t('timeseriesVisualizer.endDateLabel')}
            type="datetime-local"
            value={endTs.toISOString().slice(0, 16)}
            onChange={e => setEndTs(new Date(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>{t('timeseriesVisualizer.aggregationLabel')}</InputLabel>
            <Select
              value={aggregation}
              label={t('timeseriesVisualizer.aggregationLabel')}
              onChange={e => setAggregation(e.target.value as string)}
            >
              <MenuItem value="AVG">{t('timeseriesVisualizer.aggregationAvg')}</MenuItem>
              <MenuItem value="MIN">{t('timeseriesVisualizer.aggregationMin')}</MenuItem>
              <MenuItem value="MAX">{t('timeseriesVisualizer.aggregationMax')}</MenuItem>
              <MenuItem value="SUM">{t('timeseriesVisualizer.aggregationSum')}</MenuItem>
              <MenuItem value="COUNT">{t('timeseriesVisualizer.aggregationCount')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button variant="contained" onClick={fetchData} fullWidth>
            {t('timeseriesVisualizer.fetchButton')}
          </Button>
        </Grid>
      </Grid>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ height: 400, width: '100%' }}>
        {data.length > 0 ? (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name={selectedKey}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          !loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography>
                {t('timeseriesVisualizer.noData')}
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default TimeseriesVisualizer;