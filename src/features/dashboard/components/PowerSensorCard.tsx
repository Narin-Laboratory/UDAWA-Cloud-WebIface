import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

interface PowerSensorData {
  watt: number;
  ener: number;
  amp: number;
  volt: number;
  pf: number;
  freq: number;
}

const PowerSensorCard: React.FC = () => {
  const { t } = useTranslation();
  const [powerSensor] = useState<PowerSensorData>({
    watt: 120,
    ener: 5.6,
    amp: 0.5,
    volt: 240,
    pf: 98,
    freq: 50,
  });

  // Mock energy price
  const energyPrice = {
    value: 0.15,
    currency: 'USD',
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {t('power_usage_header', 'Power Usage')}
        </Typography>
        <Grid container spacing={2} textAlign="center">
          <Grid item xs={4}>
            <Typography variant="h4">{powerSensor.watt}</Typography>
            <Typography variant="caption">{t('watt_unit', 'Watt')}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">{powerSensor.ener}</Typography>
            <Typography variant="caption">{t('kwh_unit', 'kWh')}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">
              {(powerSensor.ener * energyPrice.value).toFixed(2)}
            </Typography>
            <Typography variant="caption">{energyPrice.currency}</Typography>
          </Grid>
        </Grid>
        <Box mt={2} borderTop={1} borderColor="divider" pt={2}>
          <Grid container spacing={1} textAlign="center">
            <Grid item xs={3}>
              <Typography variant="body2">{powerSensor.amp} A</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{powerSensor.volt} V</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{powerSensor.pf} %</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{powerSensor.freq} Hz</Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PowerSensorCard;