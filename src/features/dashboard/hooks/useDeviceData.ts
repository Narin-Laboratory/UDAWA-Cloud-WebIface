import { useEffect, useCallback } from 'react';
import { getDeviceInfo } from '../services/deviceService';
import {
  connectWebSocket,
  disconnectWebSocket,
} from '../services/websocketService';
import type { DeviceInfo } from '../services/deviceService';

// A flexible type for the incoming websocket data to handle the nested array structure
type WebSocketData = {
  data?: { [key: string]: [number, string | number | boolean][]; };
  subscriptionId?: number;
};

export const useDeviceData = (
  deviceId: string | undefined,
  setDevice: React.Dispatch<React.SetStateAction<DeviceInfo | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const onWebSocketMessage = useCallback(
    (data: WebSocketData) => {
      if (!data.data) return;

      setDevice((prevDevice) => {
        if (!prevDevice) return null;

        const newDevice = { ...prevDevice };

        if (data.subscriptionId === 4) { // Handle TIMESERIES specifically
          const transformedData = Object.fromEntries(
            Object.entries(data.data || {}).map(([key, valueArray]) => {
              const ts = valueArray?.[0]?.[0];
              const value = valueArray?.[0]?.[1];
              return [key, { value, ts }];
            })
          );
          newDevice.timeseries = { ...newDevice.timeseries, ...transformedData };
        } else { // Handle other scopes as before
          const transformedData = Object.fromEntries(
            Object.entries(data.data || {}).map(([key, valueArray]) => {
              const value = valueArray?.[0]?.[1];
              return [key, value];
            })
          );

          switch (data.subscriptionId) {
            case 1: // SERVER_SCOPE
              newDevice.attributesServerScope = { ...newDevice.attributesServerScope, ...transformedData };
              break;
            case 2: // CLIENT_SCOPE
              newDevice.attributesClientScope = { ...newDevice.attributesClientScope, ...transformedData };
              break;
            case 3: // SHARED_SCOPE
              newDevice.attributesSharedScope = { ...newDevice.attributesSharedScope, ...transformedData };
              break;
            default:
              break;
          }
        }
        return newDevice;
      });
    },
    [setDevice]
  );

  const onWebSocketError = useCallback((error: Event) => {
    console.error('WebSocket Error:', error);
  }, []);

  useEffect(() => {
    if (deviceId) {
      setLoading(true);
      getDeviceInfo(deviceId)
        .then((data) => {
          setDevice(data);
          // Establish WebSocket connection only after fetching initial data
          connectWebSocket(deviceId, onWebSocketMessage, onWebSocketError);

        })
        .catch((error) => {
          console.error("Failed to get device info:", error);
          setDevice(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    // Cleanup function to disconnect WebSocket
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
