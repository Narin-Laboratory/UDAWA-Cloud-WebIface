import { getItem, setItem } from '../../../utils/storage';

const DEVICES_CACHE_KEY = 'devices';

const handleAuthFailure = () => {
  try {
    // Clear local auth-related storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('server');
  } catch {
    // ignore
  }
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export interface Device {
  id: {
    entityType: string;
    id: string;
  };
  name: string;
  type: string;
  label: string;
}

// This type is the correct way to define an object with dynamic keys.
export type DynamicObject = {
  [key: string]: any; // Using 'any' is common and flexible for this pattern.
};

// --- CORRECTED INTERFACE ---
// All dynamic scopes now correctly use DynamicObject.
export interface DeviceInfo extends Device {
  active: boolean;
  attributesServerScope: DynamicObject;
  attributesClientScope: DynamicObject;
  attributesSharedScope: DynamicObject;
  timeseries: DynamicObject;
}

export const getDevices = async (force = false): Promise<DeviceInfo[]> => {
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

  if (response.status === 401) {
    handleAuthFailure();
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }

  const devices: Device[] = await response.json();

  const devicesWithInfo = await Promise.all(
    devices.map(device => getDeviceInfo(device.id.id))
  );

  setItem(DEVICES_CACHE_KEY, devicesWithInfo);
  return devicesWithInfo;
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

  if (response.status === 401) {
    handleAuthFailure();
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch device info');
  }

  const deviceInfo = await response.json();

  // Initialize scopes if they don't exist in the initial fetch
  return {
    ...deviceInfo,
    attributesServerScope: deviceInfo.attributesServerScope || {},
    attributesClientScope: deviceInfo.attributesClientScope || {},
    attributesSharedScope: deviceInfo.attributesSharedScope || {},
    timeseries: deviceInfo.timeseries || {},
  };
};

export const saveDeviceAttributes = async (
  entityType: string,
  entityId: string,
  scope: string,
  attributes: object
): Promise<void> => {
  const token = getItem('token');
  const server = getItem('server');

  if (!token || !server) {
    throw new Error('User not authenticated or server not set');
  }

  const response = await fetch(
    `https://${server}/api/plugins/telemetry/${entityType}/${entityId}/attributes/${scope}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(attributes),
    }
  );
  console.log(attributes);

  if (response.status === 401) {
    handleAuthFailure();
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    throw new Error('Failed to save device attributes');
  }
};

export const rpcV2 = async (
  entityId: string,
  method: string,
  params: object
): Promise<void> => {
  const token = getItem('token');
  const server = getItem('server');

  if (!token || !server) {
    throw new Error('User not authenticated or server not set');
  }

  const payload = {
    method: method,
    params: params,
    persistent: false,
    timeout: 15000,
  };

  const response = await fetch(`https://${server}/api/rpc/twoway/${entityId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    handleAuthFailure();
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    throw new Error('Failed to execute rpcv2');
  }
};