import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import type { TabInfo } from '../../components/DeviceDashboard';
import DeviceDashboard from '../../components/DeviceDashboard';
import DeviceGenericConfig from '../../components/DeviceGenericConfig';
import { useDevice } from '../../hooks/useDevice';
import TimeseriesVisualizer from '../../components/TimeseriesVisualizer';
import DamodarMonitor from '../../components/DamodarMonitor';
import DeviceOperation from '../../components/DeviceOperation';

const DamodarDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { device } = useDevice();

  const tabs: TabInfo[] = [
    {
      label: t('device.dashboardTabs.monitor'),
      content: <DamodarMonitor attributes={device?.attributesClientScope} />,
    },
    {
      label: t('device.dashboardTabs.analytic'),
      content: device ? <TimeseriesVisualizer deviceId={device.id.id} entityType={device.id.entityType} /> : null,
    },
    {
      label: t('device.dashboardTabs.config'),
      content: (
        <Stack spacing={2}>
          <DeviceGenericConfig attributes={device?.attributesClientScope} deviceId={device?.id.id} entityType={device?.id.entityType} />
          <DeviceOperation />
        </Stack>
      ),
    },
  ];

  return <DeviceDashboard tabs={tabs} />;
};

export default DamodarDashboard;
