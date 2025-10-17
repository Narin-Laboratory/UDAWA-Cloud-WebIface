import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, CircularProgress, SelectChangeEvent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AggregationType, TimeseriesResponse } from '../types';
import { useDevice } from '../hooks/useDevice';
import { getTimeseriesKeys, getTimeseriesData } from '../services/deviceService';

const TimeseriesComponent: React.FC = () => {
    const { t } = useTranslation();
    const { device } = useDevice();
    const [keys, setKeys] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>('');
    const [data, setData] = useState<TimeseriesResponse>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [timeRange, setTimeRange] = useState<string>('lastDay');
    const [aggregation, setAggregation] = useState<AggregationType>('AVG');

    useEffect(() => {
        if (device) {
            const fetchKeys = async () => {
                try {
                    const response = await getTimeseriesKeys(device.id.entityType, device.id.id);
                    setKeys(response);
                    if (response.length > 0) {
                        setSelectedKey(response[0]);
                    }
                } catch (error) {
                    console.error('Failed to fetch timeseries keys', error);
                }
            };
            fetchKeys();
        }
    }, [device]);

    useEffect(() => {
        if (device && selectedKey) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const endTs = Date.now();
                    let startTs = endTs - 24 * 60 * 60 * 1000; // last day
                    if (timeRange === 'lastHour') {
                        startTs = endTs - 60 * 60 * 1000;
                    } else if (timeRange === 'lastWeek') {
                        startTs = endTs - 7 * 24 * 60 * 60 * 1000;
                    }

                    const response = await getTimeseriesData(
                        device.id.entityType,
                        device.id.id,
                        selectedKey,
                        startTs,
                        endTs,
                        aggregation,
                        timeRange === 'lastHour' ? 60000 : 3600000
                    );
                    setData(response);
                } catch (error) {
                    console.error('Failed to fetch timeseries data', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [device, selectedKey, timeRange, aggregation]);

    const handleKeyChange = (event: SelectChangeEvent<string>) => {
        setSelectedKey(event.target.value);
    };

    const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
        setTimeRange(event.target.value);
    };

    const handleAggregationChange = (event: SelectChangeEvent<AggregationType>) => {
        setAggregation(event.target.value as AggregationType);
    };

    const chartData = data[selectedKey] ? data[selectedKey].map(item => ({ ...item, value: Number(item.value) })) : [];

    return (
        <Box>
            <Typography variant="h6">{t('device.dashboardTabs.analytic')}</Typography>
            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                <FormControl>
                    <InputLabel>{t('device.timeseries.key')}</InputLabel>
                    <Select value={selectedKey} onChange={handleKeyChange}>
                        {keys.map(key => (
                            <MenuItem key={key} value={key}>{key}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>{t('device.timeseries.timeRange')}</InputLabel>
                    <Select value={timeRange} onChange={handleTimeRangeChange}>
                        <MenuItem value={'lastHour'}>{t('device.timeseries.lastHour')}</MenuItem>
                        <MenuItem value={'lastDay'}>{t('device.timeseries.lastDay')}</MenuItem>
                        <MenuItem value={'lastWeek'}>{t('device.timeseries.lastWeek')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>{t('device.timeseries.aggregation')}</InputLabel>
                    <Select value={aggregation} onChange={handleAggregationChange}>
                        <MenuItem value={'MIN'}>{t('device.timeseries.min')}</MenuItem>
                        <MenuItem value={'MAX'}>{t('device.timeseries.max')}</MenuItem>
                        <MenuItem value={'AVG'}>{t('device.timeseries.avg')}</MenuItem>
                        <MenuItem value={'SUM'}>{t('device.timeseries.sum')}</MenuItem>
                        <MenuItem value={'COUNT'}>{t('device.timeseries.count')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? <CircularProgress /> : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ts" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Box>
    );
};

export default TimeseriesComponent;