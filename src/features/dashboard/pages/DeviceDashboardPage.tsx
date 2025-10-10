import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tab, Tabs, Typography, CircularProgress } from '@mui/material';
import DeviceDetailsCard from '../components/DeviceDetailsCard';
import { getDeviceInfo } from '../services/deviceService';
import type { DeviceInfo } from '../services/deviceService';

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
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (deviceId) {
      setLoading(true);
      getDeviceInfo(deviceId)
        .then((data) => {
          if (data) {
            setDevice(data);
          } else {
            setDevice(null);
          }
        })
        .catch(() => {
          setDevice(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
      <DeviceDetailsCard device={device} />
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