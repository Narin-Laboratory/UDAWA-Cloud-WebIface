import { getItem, setItem } from '../../../utils/storage';

const DEVICES_CACHE_KEY = 'devices';

export interface Device {
  id: {
    entityType: string;
    id: string;
  };
  name: string;
  type: string;
  label: string;
}

export interface DeviceInfo extends Device {
  active: boolean;
  ipAddress?: string;
  ssid?: string;
  signal?: number;
  battery?: number;
  firmwareVersion?: string;
  heap?: number;
}

export const getDevices = async (force = false): Promise<Device[]> => {
  const cachedDevices = getItem(DEVICES_CACHE_KEY);

  if (cachedDevices && !force) {
    return cachedDevices;
  }

  const token = getItem('token');
  const user = getItem('user');
  const server = getItem('server');

  if (!token || !user || !server) {
    throw new Error('User not authenticated or server not set');
  }

  const response = await fetch(`https://${server}/api/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      parameters: {
        rootId: user.customerId.id,
        rootType: 'CUSTOMER',
        direction: 'FROM',
        relationTypeGroup: 'COMMON',
        maxLevel: 3,
        fetchLastLevelOnly: false,
      },
      relationType: 'Contains',
      deviceTypes: ['UDAWA Gadadar', 'UDAWA Damodar', 'UDAWA Murari'],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }

  const devices = await response.json();
  setItem(DEVICES_CACHE_KEY, devices);
  return devices;
};

export const getDeviceInfo = async (deviceId: string): Promise<DeviceInfo> => {
  const token = getItem('token');
  const server = getItem('server');

  if (!token || !server) {
    throw new Error('User not authenticated or server not set');
  }

  const response = await fetch(`https://${server}/api/device/info/${deviceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch device info');
  }

  const deviceInfo = await response.json();

  // Add mock data for additional fields as the API doesn't provide them yet
  return {
    ...deviceInfo,
    ipAddress: '192.168.1.10',
    ssid: 'MyWiFi',
    signal: 85,
    battery: 95,
    firmwareVersion: '1.0.0',
    heap: 12345,
  };
};