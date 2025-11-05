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
  const [isVisible, setIsVisible] = useState(false);
  const [lastSeenAlarmCode, setLastSeenAlarmCode] = useState<number | undefined>(
    undefined
  );

  const alarmCode = device?.timeseries?.alarm as number | undefined;

  useEffect(() => {
    if (alarmCode && alarmCode !== 0 && alarmCode !== lastSeenAlarmCode) {
      setIsVisible(true);
      setLastSeenAlarmCode(alarmCode);
    }
  }, [alarmCode, lastSeenAlarmCode]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !alarmCode) {
    return null;
  }

  const alarmDetails = getAlarmDetails(alarmCode);

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
