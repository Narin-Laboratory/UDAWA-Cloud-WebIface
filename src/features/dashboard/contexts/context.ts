import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DeviceInfo } from '../types';

export interface DeviceContextType {
  device: DeviceInfo | null;
  setDevice: Dispatch<SetStateAction<DeviceInfo | null>>;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);