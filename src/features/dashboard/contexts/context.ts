import { createContext } from 'react';
import type { DeviceInfo } from '../services/deviceService';

export interface DeviceContextType {
  device: DeviceInfo | null;
  setDevice: (device: DeviceInfo | null) => void;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);