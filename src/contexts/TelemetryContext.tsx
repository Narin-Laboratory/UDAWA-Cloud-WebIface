import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import telemetryService from '../services/telemetryService';
import { useAuth } from './AuthContext';

const TelemetryContext = createContext<typeof telemetryService | null>(null);

export const useTelemetry = () => {
  return useContext(TelemetryContext);
};

interface TelemetryProviderProps {
  children: ReactNode;
}

export const TelemetryProvider: React.FC<TelemetryProviderProps> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && token) {
      telemetryService.connect(token);
    } else {
      telemetryService.disconnect();
    }

    return () => {
      telemetryService.disconnect();
    };
  }, [isAuthenticated, token]);

  return (
    <TelemetryContext.Provider value={telemetryService}>
      {children}
    </TelemetryContext.Provider>
  );
};