import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeviceDetailsCard from './DeviceDetailsCard';

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export interface TabInfo {
  label: string;
  content: React.ReactNode;
}

interface DeviceDashboardProps {
  tabs: TabInfo[];
}

const DeviceDashboard: React.FC<DeviceDashboardProps> = ({ tabs }) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    void event;
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DeviceDetailsCard />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label={t('device.dashboardTabs.ariaLabel')}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default DeviceDashboard;