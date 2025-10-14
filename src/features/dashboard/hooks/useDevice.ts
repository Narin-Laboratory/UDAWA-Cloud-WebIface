import { useContext } from 'react';
import { DeviceContext } from '../contexts/context';
import type { DeviceContextType } from '../contexts/context';

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};