import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { DeviceInfo } from '../services/deviceService';

export interface DeviceContextType {
  device: DeviceInfo | null;
  setDevice: Dispatch<SetStateAction<DeviceInfo | null>>;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);