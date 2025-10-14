import { useEffect, useCallback } from 'react';
import { getDeviceInfo } from '../services/deviceService';
import {
  connectWebSocket,
  disconnectWebSocket,
} from '../services/websocketService';
import type { DeviceInfo } from '../types';

export const useDeviceData = (
  deviceId: string | undefined,
  setDevice: React.Dispatch<React.SetStateAction<DeviceInfo | null>>,
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
          const newDevice = { ...prevDevice } as DeviceInfo;
          const a = data.data as { [key: string]: [number, string | number | boolean][] };

          switch (data.subscriptionId) {
            case 1:
              newDevice.attributesServerScope = {
                ...newDevice.attributesServerScope,
                ...a,
              };
              break;
            case 2:
              newDevice.attributesClientScope = {
                ...newDevice.attributesClientScope,
                ...a,
              };
              break;
            case 3:
              newDevice.attributesSharedScope = {
                ...newDevice.attributesSharedScope,
                ...a,
              };
              break;
            case 4:
              newDevice.timeseries = {
                ...newDevice.timeseries,
                ...a,
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

  const onWebSocketError = useCallback((error: Event) => {
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