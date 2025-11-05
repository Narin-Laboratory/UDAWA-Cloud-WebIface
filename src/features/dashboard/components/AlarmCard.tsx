import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getAlarmDetails } from '../utils/alarmUtils';
import { useDevice } from '../hooks/useDevice';

const AlarmCard: React.FC = () => {
  const { device } = useDevice();
  const { t } = useTranslation();

  const [currentAlarm, setCurrentAlarm] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const alarmData = device?.timeseries?.alarm;

  useEffect(() => {
    // Safely extract the alarm code, whether it's a primitive or an object with a 'value' property
    const rawCode =
      alarmData && typeof alarmData === 'object' && 'value' in alarmData
        ? (alarmData as { value: unknown }).value
        : alarmData;

    // Ensure the extracted code is a valid number, otherwise treat as null (no alarm)
    const newAlarm =
      rawCode !== undefined &&
      !isNaN(Number(rawCode)) &&
      Number(rawCode) !== 0
        ? Number(rawCode)
        : null;

    // If the incoming alarm is different from the one we are currently tracking
    if (newAlarm !== currentAlarm) {
      // Start tracking the new alarm code
      setCurrentAlarm(newAlarm);
      // Reset the dismissal state, so the new alarm is always shown
      setIsDismissed(false);
    }
  }, [alarmData, currentAlarm]);

  const handleClose = () => {
    setIsDismissed(true);
  };

  const isVisible = currentAlarm !== null && !isDismissed;

  if (!isVisible) {
    return null;
  }

  const alarmDetails = getAlarmDetails(currentAlarm);

  if (!alarmDetails) {
    return null;
  }

  return (
    <Card
      data-testid="alarm-card"
      variant="outlined"
      sx={{
        width: '100%',
        mb: 2,
        borderColor: 'warning.main',
        backgroundColor: 'warning.light',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            {t(alarmDetails.title)}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2">{t(alarmDetails.description)}</Typography>
      </CardContent>
    </Card>
  );
};

export default AlarmCard;
