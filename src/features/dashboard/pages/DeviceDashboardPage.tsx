import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tab, Tabs, Typography, CircularProgress } from '@mui/material';
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
              Object.keys(data.data).forEach((key) => {
                newDevice[key] = data.data[key][0][1];
              });
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
    return <Typography>Device not found</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DeviceDetailsCard />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="device dashboard tabs">
          <Tab label="Monitor" />
          <Tab label="Control" />
          <Tab label="Config" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        Monitor content goes here.
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        Control content goes here.
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        Config content goes here.
      </TabPanel>
    </Box>
  );
};

export default DeviceDashboardPage;