import { toast } from 'react-toastify';

const WS_URL = `${
  window.location.protocol === 'https:' ? 'wss:' : 'ws:'
}//${window.location.host}/api/ws`;

interface AuthCmd {
  cmdId: number;
  token: string;
}

interface SubscriptionCmd {
  entityType: string;
  entityId: string;
  scope: string;
  cmdId: number;
  type: 'TIMESERIES' | 'ATTRIBUTES';
  keys: string;
}

interface TelemetrySubscription {
  subscriptionId: string;
  cmdId: number;
  callback: (data: any) => void;
}

class TelemetryService {
  private ws: WebSocket | null = null;
  private cmdId = 0;
  private subscriptions: Map<string, TelemetrySubscription> = new Map();
  private pendingSubscriptions: Map<number, TelemetrySubscription> = new Map();
  private static instance: TelemetryService;

  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public connect(token: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      const authCmd: AuthCmd = {
        cmdId: this.getCmdId(),
        token: token,
      };
      this.ws?.send(JSON.stringify({ authCmd }));
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.subscriptionId && message.data) {
        const subscription = this.subscriptions.get(message.subscriptionId.toString());
        if (subscription) {
          subscription.callback(message.data);
        }
      } else if (message.cmdId && this.pendingSubscriptions.has(message.cmdId)) {
        const subscription = this.pendingSubscriptions.get(message.cmdId);
        if (subscription) {
          if (message.errorCode === 0) {
            subscription.subscriptionId = message.subscriptionId.toString();
            this.subscriptions.set(subscription.subscriptionId, subscription);
            this.pendingSubscriptions.delete(message.cmdId);
          } else {
            toast.error(`Subscription failed: ${message.errorMsg}`);
            this.pendingSubscriptions.delete(message.cmdId);
          }
        }
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
    };

    this.ws.onerror = (error) => {
      toast.error('WebSocket error');
      console.error('WebSocket error:', error);
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public subscribe(
    entityType: string,
    entityId: string,
    type: 'TIMESERIES' | 'ATTRIBUTES',
    keys: string[],
    callback: (data: any) => void,
    scope?: string
  ) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      toast.error('WebSocket is not connected.');
      return null;
    }

    const cmdId = this.getCmdId();
    const subscriptionCmd: SubscriptionCmd = {
      entityType,
      entityId,
      scope: scope || (type === 'TIMESERIES' ? 'LATEST_TELEMETRY' : 'SERVER_SCOPE'),
      cmdId,
      type,
      keys: keys.join(','),
    };

    const subscription: TelemetrySubscription = {
      subscriptionId: '',
      cmdId: cmdId,
      callback: callback,
    };

    this.pendingSubscriptions.set(cmdId, subscription);

    const payload =
      type === 'TIMESERIES'
        ? { tsSubCmds: [subscriptionCmd] }
        : { attrSubCmds: [subscriptionCmd] };

    this.ws.send(JSON.stringify(payload));

    return cmdId;
  }

  public unsubscribe(cmdId: number) {
    let subToUnsubscribe: TelemetrySubscription | undefined;
    if (this.pendingSubscriptions.has(cmdId)) {
        this.pendingSubscriptions.delete(cmdId);
        return;
    } else {
        for(const sub of this.subscriptions.values()){
            if(sub.cmdId === cmdId){
                subToUnsubscribe = sub;
                break;
            }
        }
    }

    if (subToUnsubscribe) {
        this.subscriptions.delete(subToUnsubscribe.subscriptionId);
        // Unsubscribe command to server is not implemented due to lack of documentation.
    }
  }

  private getCmdId() {
    return this.cmdId++;
  }
}

export default TelemetryService.getInstance();