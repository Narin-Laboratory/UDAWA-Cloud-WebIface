import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tab, Tabs, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeviceDetailsCard from '../components/DeviceDetailsCard';
import { getDeviceInfo } from '../services/deviceService';
import { useDevice } from '../contexts/DeviceContext';
import {
  connectWebSocket,
  disconnectWebSocket,
} from '../services/websocketService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const DeviceDashboardPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const { device, setDevice } = useDevice();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);
  const [tabValue, setTabValue] = React.useState(0);

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
              if (telemetry.fmVersion) newDevice.firmwareVersion = telemetry.fmVersion[0][1];
              if (telemetry.heap) newDevice.heap = telemetry.heap[0][1];
              if (telemetry.lastActivityTime) newDevice.lastSeen = new Date(parseInt(telemetry.lastActivityTime[0][1])).toLocaleString();

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
  }, [deviceId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!device) {
    return <Typography>{t('device.notFound')}</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DeviceDetailsCard />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label={t('device.dashboardTabs.ariaLabel')}>
          <Tab label={t('device.dashboardTabs.monitor')} />
          <Tab label={t('device.dashboardTabs.control')} />
          <Tab label={t('device.dashboardTabs.config')} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {t('device.dashboardTabs.monitorContent')}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {t('device.dashboardTabs.controlContent')}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {t('device.dashboardTabs.configContent')}
      </TabPanel>
    </Box>
  );
};

export default DeviceDashboardPage;