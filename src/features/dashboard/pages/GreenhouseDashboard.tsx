import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import {
  Monitor as MonitorIcon,
  Tune as TuneIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
      id={`greenhouse-tabpanel-${index}`}
      aria-labelledby={`greenhouse-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `greenhouse-tab-${index}`,
    'aria-controls': `greenhouse-tabpanel-${index}`,
  };
}

const GreenhouseDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="greenhouse dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={t('dashboard.tabs.monitor')}
            icon={<MonitorIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label={t('dashboard.tabs.control')}
            icon={<TuneIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label={t('dashboard.tabs.analytic')}
            icon={<AnalyticsIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label={t('dashboard.tabs.config')}
            icon={<SettingsIcon />}
            iconPosition="start"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {t('dashboard.tabs.monitor')}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {t('dashboard.tabs.control')}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {t('dashboard.tabs.analytic')}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {t('dashboard.tabs.config')}
      </TabPanel>
    </Box>
  );
};

export default GreenhouseDashboard;
