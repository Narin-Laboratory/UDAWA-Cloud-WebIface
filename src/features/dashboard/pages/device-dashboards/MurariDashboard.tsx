import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TabInfo } from '../../components/DeviceDashboard';
import DeviceDashboard from '../../components/DeviceDashboard';

const MurariDashboard: React.FC = () => {
  const { t } = useTranslation();

  const tabs: TabInfo[] = [
    {
      label: t('device.dashboardTabs.monitor'),
      content: t('device.dashboardTabs.monitorContent'),
    },
    {
      label: t('device.dashboardTabs.control'),
      content: t('device.dashboardTabs.controlContent'),
    },
    {
      label: t('device.dashboardTabs.analytic'),
      content: t('device.dashboardTabs.analyticContent'),
    },
    {
      label: t('device.dashboardTabs.config'),
      content: t('device.dashboardTabs.configContent'),
    },
  ];

  return <DeviceDashboard tabs={tabs} />;
};

export default MurariDashboard;