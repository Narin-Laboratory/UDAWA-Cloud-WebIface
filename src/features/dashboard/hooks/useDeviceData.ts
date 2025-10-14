import { useEffect, useCallback } from 'react';
import { getDeviceInfo } from '../services/deviceService';
import {
  connectWebSocket,
  disconnectWebSocket,
} from '../services/websocketService';
import type { Device } from '../types/device';

export const useDeviceData = (
  deviceId: string | undefined,
  setDevice: React.Dispatch<React.SetStateAction<Device | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const onWebSocketMessage = useCallback(
    (data: {
      data?: { [key: string]: [number, unknown] };
      subscriptionId?: number;
    }) => {
      if (data.data) {
        setDevice((prevDevice) => {
          if (!prevDevice) return null;
          const newDevice = { ...prevDevice };

          switch (data.subscriptionId) {
            case 1:
              newDevice.attributesServerScope = {
                ...newDevice.attributesServerScope,
                ...data.data,
              };
              break;
            case 2:
              newDevice.attributesClientScope = {
                ...newDevice.attributesClientScope,
                ...data.data,
              };
              break;
            case 3:
              newDevice.attributesSharedScope = {
                ...newDevice.attributesSharedScope,
                ...data.data,
              };
              break;
            case 4:
              newDevice.timeseries = {
                ...newDevice.timeseries,
                ...data.data,
              };
              break;
            default:
              break;
          }
          return newDevice;
        });
      }
    },
    [setDevice]
  );

  const onWebSocketError = useCallback((error: Error) => {
    console.error(error);
  }, []);

  useEffect(() => {
    if (deviceId) {
      setLoading(true);
      getDeviceInfo(deviceId)
        .then((data) => {
          setDevice(data);
        })
        .catch(() => {
          setDevice(null);
        })
        .finally(() => {
          setLoading(false);
        });

      connectWebSocket(deviceId, onWebSocketMessage, onWebSocketError);
    }

    return () => {
      disconnectWebSocket();
    };
  }, [
    deviceId,
    onWebSocketMessage,
    onWebSocketError,
    setDevice,
    setLoading,
  ]);
};