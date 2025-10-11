import React, { useEffect, useMemo } from 'react';
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

      connectWebSocket(
        deviceId,
        (data) => {
          if (data.data) {
            setDevice((prevDevice) => {
              if (!prevDevice) return null;
              const newDevice = { ...prevDevice };
              const telemetry = data.data;

              if (telemetry.wssid) newDevice.ssid = telemetry.wssid[0][1];
              if (telemetry.ipad) newDevice.ipAddress = telemetry.ipad[0][1];
              if (telemetry.rssi) newDevice.signal = telemetry.rssi[0][1];
              if (telemetry.batt) newDevice.battery = telemetry.batt[0][1];
              if (telemetry.fmVersion)
                newDevice.firmwareVersion = telemetry.fmVersion[0][1];
              if (telemetry.heap) newDevice.heap = telemetry.heap[0][1];
              if (telemetry.lastActivityTime)
                newDevice.lastSeen = new Date(
                  parseInt(telemetry.lastActivityTime[0][1])
                ).toLocaleString();
              if (telemetry.fw_state)
                newDevice.fw_state = telemetry.fw_state[0][1];
              return newDevice;
            });
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }

    return () => {
      disconnectWebSocket();
    };
  }, [deviceId, setDevice]);

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