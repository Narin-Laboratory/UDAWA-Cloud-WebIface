import { getItem, setItem } from '../../../utils/storage';

const API_URL = import.meta.env.VITE_API_URL;
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
}

export const getDevices = async (force = false): Promise<Device[]> => {
  const cachedDevices = getItem(DEVICES_CACHE_KEY);

  if (cachedDevices && !force) {
    return cachedDevices;
  }

  const token = getItem('token');
  const user = getItem('user');

  if (!token || !user) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/devices`, {
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

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/device/info/${deviceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch device info');
  }

  return response.json();
};