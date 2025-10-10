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

const mockDevices: DeviceInfo[] = [
  {
    id: { entityType: 'DEVICE', id: 'gadadar-01' },
    name: 'gadadar-01',
    type: 'UDAWA Gadadar',
    label: 'UDAWA Gadadar',
    active: true,
    ipAddress: '192.168.1.10',
    ssid: 'MyWiFi',
    signal: 85,
    battery: 95,
    firmwareVersion: '1.0.0',
    heap: 12345,
  },
  {
    id: { entityType: 'DEVICE', id: 'damodar-01' },
    name: 'damodar-01',
    type: 'UDAWA Damodar',
    label: 'UDAWA Damodar',
    active: true,
    ipAddress: '192.168.1.11',
    ssid: 'MyWiFi',
    signal: 80,
    battery: 90,
    firmwareVersion: '1.1.0',
    heap: 23456,
  },
  {
    id: { entityType: 'DEVICE', id: 'murari-01' },
    name: 'murari-01',
    type: 'UDAWA Murari',
    label: 'UDAWA Murari',
    active: false,
    ipAddress: '192.168.1.12',
    ssid: 'MyWiFi',
    signal: 75,
    battery: 85,
    firmwareVersion: '1.2.0',
    heap: 34567,
  },
];

export const getDevices = async (force = false): Promise<Device[]> => {
  const cachedDevices = getItem(DEVICES_CACHE_KEY);

  if (cachedDevices && !force) {
    return cachedDevices;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const devices = mockDevices.map(({ id, name, type, label }) => ({
        id,
        name,
        type,
        label,
      }));
      setItem(DEVICES_CACHE_KEY, devices);
      resolve(devices);
    }, 500);
  });
};

export const getDeviceInfo = async (deviceId: string): Promise<DeviceInfo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const device = mockDevices.find((d) => d.id.id === deviceId);
      if (device) {
        resolve(device);
      } else {
        reject(new Error('Failed to fetch device info'));
      }
    }, 200);
  });
};