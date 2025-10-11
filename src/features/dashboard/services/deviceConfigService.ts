import { getItem } from '../../../utils/storage';

export interface DeviceConfig {
  wssid?: string;
  wpass?: string;
  hname?: string;
  provDK?: string;
  provDS?: string;
}

export const getDeviceConfig = async (deviceId: string): Promise<DeviceConfig> => {
  const token = getItem('token');
  const server = getItem('server');

  if (!token || !server) {
    throw new Error('User not authenticated or server not set');
  }

  const response = await fetch(`https://${server}/api/plugins/telemetry/DEVICE/${deviceId}/values/attributes/SHARED_SCOPE`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch device config');
  }

  const attributes = await response.json();
  const config: DeviceConfig = {};
  attributes.forEach((attr: { key: string; value: any; }) => {
    config[attr.key as keyof DeviceConfig] = attr.value;
  });

  return config;
};

export const saveDeviceConfig = async (deviceId: string, config: DeviceConfig): Promise<void> => {
  const token = getItem('token');
  const server = getItem('server');

  if (!token || !server) {
    throw new Error('User not authenticated or server not set');
  }

  const response = await fetch(`https://${server}/api/plugins/telemetry/DEVICE/${deviceId}/attributes/SHARED_SCOPE`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Failed to save device config');
  }
};