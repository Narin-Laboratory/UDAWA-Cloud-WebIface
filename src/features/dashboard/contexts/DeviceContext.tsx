import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { DeviceInfo } from '../services/deviceService';

interface DeviceContextType {
  device: DeviceInfo | null;
  setDevice: (device: DeviceInfo | null) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<DeviceInfo | null>(null);

  return (
    <DeviceContext.Provider value={{ device, setDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};