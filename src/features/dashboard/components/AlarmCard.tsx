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

interface AlarmInfo {
  code: number;
  ts: number;
}

const AlarmCard: React.FC = () => {
  const { device } = useDevice();
  const { t } = useTranslation();

  const [currentAlarm, setCurrentAlarm] = useState<AlarmInfo | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const alarmData = device?.timeseries?.alarm as { value: unknown; ts: number } | undefined;

  useEffect(() => {
    const rawCode = alarmData?.value;
    const timestamp = alarmData?.ts;

    const newAlarmCode =
      rawCode !== undefined &&
      !isNaN(Number(rawCode)) &&
      Number(rawCode) !== 0
        ? Number(rawCode)
        : null;

    if (newAlarmCode && newAlarmCode !== currentAlarm?.code) {
      setCurrentAlarm({ code: newAlarmCode, ts: timestamp });
      setIsDismissed(false);
    } else if (!newAlarmCode) {
      setCurrentAlarm(null);
    }
  }, [alarmData, currentAlarm?.code]);

  const handleClose = () => {
    setIsDismissed(true);
  };

  const isVisible = currentAlarm !== null && !isDismissed;

  if (!isVisible) {
    return null;
  }

  const alarmDetails = getAlarmDetails(currentAlarm.code);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" component="div">
              {t(alarmDetails.title)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t(alarmDetails.description)}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {new Date(currentAlarm.ts).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AlarmCard;
