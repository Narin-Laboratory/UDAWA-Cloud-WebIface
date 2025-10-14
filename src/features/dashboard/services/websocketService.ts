import { getItem } from '../../../utils/storage';

let websocket: WebSocket | null = null;
let lastDeviceId: string | null = null;

export const connectWebSocket = (
  deviceId: string,
  onMessage: (data: MessageEvent) => void,
  onError: (error: Event) => void
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
    console.log('Missing token or server information');
    return;
  }

  const wsUrl = `wss://${server}/api/ws`;
  websocket = new WebSocket(wsUrl);
  lastDeviceId = deviceId;

  websocket.onopen = () => {
    console.log('WebSocket connection opened');
    const authCmd = {
      authCmd: {
        cmdId: 0,
        token: token,
      },
      cmds: [
        {
          entityType: 'DEVICE',
          entityId: deviceId,
          scope: 'SERVER_SCOPE',
          cmdId: 1,
          type: 'ATTRIBUTES',
        },
        {
          entityType: 'DEVICE',
          entityId: deviceId,
          scope: 'CLIENT_SCOPE',
          cmdId: 2,
          type: 'ATTRIBUTES',
        },
        {
          entityType: 'DEVICE',
          entityId: deviceId,
          scope: 'SHARED_SCOPE',
          cmdId: 3,
          type: 'ATTRIBUTES',
        },
        {
          entityType: 'DEVICE',
          entityId: deviceId,
          scope: 'LATEST_TELEMETRY',
          cmdId: 4,
          type: 'TIMESERIES',
        },
      ],
    };
    //console.log('Sending auth command:', authCmd);
    websocket?.send(JSON.stringify(authCmd));
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  websocket.onerror = (event) => {
    console.error('WebSocket error:', event);
    onError(event);
  };

  websocket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
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