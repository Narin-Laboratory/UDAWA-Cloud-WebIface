import React, { useState, ReactNode } from 'react';
import type { DeviceInfo } from '../services/deviceService';
import { DeviceContext } from './context';

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<DeviceInfo | null>(null);

  return (
    <DeviceContext.Provider value={{ device, setDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};
