import { useState } from 'react';
import type { ReactNode } from 'react';
import type { DeviceInfo } from '../types';
import { DeviceContext } from './context';

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<DeviceInfo | null>(null);

  return (
    <DeviceContext.Provider value={{ device, setDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};
