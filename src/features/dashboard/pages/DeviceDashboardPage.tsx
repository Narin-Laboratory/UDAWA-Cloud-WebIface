import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../contexts/DeviceContext';
import { useDeviceData } from '../hooks/useDeviceData';

const GadadarDashboard = React.lazy(
  () => import('./device-dashboards/GadadarDashboard')
);
const DamodarDashboard = React.lazy(
  () => import('./device-dashboards/DamodarDashboard')
);
const MurariDashboard = React.lazy(
  () => import('./device-dashboards/MurariDashboard')
);

const DeviceDashboardPage: React.FC = () => {
  const { deviceId, deviceType } = useParams<{
    deviceId: string;
    deviceType: string;
  }>();
  const { device, setDevice } = useDevice();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);

  useDeviceData(deviceId, setDevice, setLoading);

  const DeviceDashboardComponent = useMemo(() => {
    if (!deviceType) return null;
    switch (deviceType.toLowerCase()) {
      case 'udawa-gadadar':
        return GadadarDashboard;
      case 'udawa-damodar':
        return DamodarDashboard;
      case 'udawa-murari':
        return MurariDashboard;
      default:
        return null;
    }
  }, [deviceType]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!device) {
    return <Typography>{t('device.notFound')}</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <React.Suspense fallback={<CircularProgress />}>
        {DeviceDashboardComponent ? (
          <DeviceDashboardComponent />
        ) : (
          <Typography>{t('device.unsupported')}</Typography>
        )}
      </React.Suspense>
    </Box>
  );
};

export default DeviceDashboardPage;