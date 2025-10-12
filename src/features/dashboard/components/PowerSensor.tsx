import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import type { Device } from '../services/deviceService';

function getWatt(str: string): string {
  const num = parseFloat(str);
  if (Number.isNaN(num)) {
    return 'N/A';
  }
  if (num < 1) {
    return num.toFixed(3);
  } else if (num < 10) {
    return num.toFixed(2);
  } else if (num < 100) {
    return num.toFixed(1);
  } else {
    return String(Math.round(num));
  }
}

const PowerSensor: React.FC<{ device: Device | null }> = ({ device }) => {
  const { t } = useTranslation();

  const getAttribute = (key: string) => {
    if (device && device.attributesClientScope && device.attributesClientScope[key]) {
      return device.attributesClientScope[key][0][1];
    }
    return 'N/A';
  };

  const sensorItems = [
    { label: t('powerSensor._amp'), value: getAttribute('_amp'), unit: 'A' },
    { label: t('powerSensor._ener'), value: getAttribute('_ener'), unit: 'kWh' },
    { label: t('powerSensor._freq'), value: getAttribute('_freq'), unit: 'Hz' },
    { label: t('powerSensor._pf'), value: getAttribute('_pf'), unit: '' },
    { label: t('powerSensor._volt'), value: getAttribute('_volt'), unit: 'V' },
    { label: t('powerSensor._watt'), value: getWatt(getAttribute('_watt')), unit: 'W' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('powerSensor.title')}
        </Typography>
        <Grid container spacing={2}>
          {sensorItems.map((item, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Typography variant="subtitle1">{item.label}</Typography>
              <Typography variant="h5">
                {item.value} {item.unit}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PowerSensor;