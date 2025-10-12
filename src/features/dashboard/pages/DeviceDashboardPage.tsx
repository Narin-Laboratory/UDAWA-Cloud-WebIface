import React, { useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getDeviceInfo } from '../services/deviceService';
import { useDevice } from '../contexts/DeviceContext';
import {
  connectWebSocket,
  disconnectWebSocket,
} from '../services/websocketService';

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

  const onWebSocketMessage = useCallback(
    (data: {
      data?: { [key: string]: [number, unknown] };
      subscriptionId?: number;
    }) => {
      if (data.data) {
        setDevice((prevDevice) => {
          if (!prevDevice) return null;
          const newDevice = { ...prevDevice };

          switch (data.subscriptionId) {
            case 1:
              newDevice.attributesServerScope = {
                ...newDevice.attributesServerScope,
                ...data.data,
              };
              break;
            case 2:
              newDevice.attributesClientScope = {
                ...newDevice.attributesClientScope,
                ...data.data,
              };
              break;
            case 3:
              newDevice.attributesSharedScope = {
                ...newDevice.attributesSharedScope,
                ...data.data,
              };
              break;
            case 4:
              newDevice.timeseries = {
                ...newDevice.timeseries,
                ...data.data,
              };
              break;
            default:
              break;
          }
          return newDevice;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onWebSocketError = useCallback((error: Error) => {
    console.error(error);
  }, []);

  useEffect(() => {
    if (deviceId) {
      setLoading(true);
      getDeviceInfo(deviceId)
        .then((data) => {
          setDevice(data);
        })
        .catch(() => {
          setDevice(null);
        })
        .finally(() => {
          setLoading(false);
        });

      connectWebSocket(deviceId, onWebSocketMessage, onWebSocketError);
    }

    return () => {
      disconnectWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, onWebSocketMessage, onWebSocketError]);

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