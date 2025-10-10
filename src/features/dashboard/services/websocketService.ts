import { getItem } from '../../../utils/storage';

let websocket: WebSocket | null = null;
let lastDeviceId: string | null = null;

export const connectWebSocket = (
  deviceId: string,
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  if (websocket && lastDeviceId === deviceId) {
    return;
  }

  if (websocket) {
    websocket.close();
  }

  const token = getItem('token');
  const server = getItem('server');

  if (!token || !server) {
    onError(new Error('User not authenticated or server not set'));
    return;
  }

  const wsUrl = `wss://${server}/api/ws`;
  websocket = new WebSocket(wsUrl);
  lastDeviceId = deviceId;

  websocket.onopen = () => {
    const authCmd = {
      authCmd: {
        cmdId: 10,
        token: token,
      },
      cmds: [
        {
          entityType: 'DEVICE',
          entityId: deviceId,
          scope: 'LATEST_TELEMETRY',
          cmdId: 10,
          type: 'TIMESERIES',
        },
      ],
    };
    websocket?.send(JSON.stringify(authCmd));
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  websocket.onerror = (error) => {
    onError(error);
  };

  websocket.onclose = () => {
    lastDeviceId = null;
  };
};

export const disconnectWebSocket = () => {
  if (websocket) {
    websocket.close();
    websocket = null;
    lastDeviceId = null;
  }
};