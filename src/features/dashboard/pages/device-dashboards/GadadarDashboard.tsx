import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TabInfo } from '../../components/DeviceDashboard';
import DeviceDashboard from '../../components/DeviceDashboard';
import DeviceGenericConfig from '../../components/DeviceGenericConfig';
import { useDevice } from '../../contexts/DeviceContext';
import RelaysController from '../../components/RelaysController';

const GadadarDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { device } = useDevice();

  const tabs: TabInfo[] = [
    {
      label: t('device.dashboardTabs.monitor'),
      content: t('device.dashboardTabs.monitorContent'),
    },
    {
      label: t('device.dashboardTabs.control'),
      content: <RelaysController device={device} />,
    },
    {
      label: t('device.dashboardTabs.analytic'),
      content: t('device.dashboardTabs.analyticContent'),
    },
    {
      label: t('device.dashboardTabs.config'),
      content: <DeviceGenericConfig device={device} />,
    },
  ];

  return <DeviceDashboard tabs={tabs} />;
};

export default GadadarDashboard;