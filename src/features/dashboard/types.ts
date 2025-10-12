export interface DeviceInfo {
  active: boolean;
  id: {
    entityType: string;
    id: string;
  };
  name: string;
  type: string;
  label: string;
  attributesServerScope: {
    [key: string]: [number, any][];
  };
  attributesClientScope: {
    [key: string]: [number, any][];
  };
  attributesSharedScope: {
    [key: string]: [number, any][];
  };
  timeseries: {
    [key: string]: [number, any][];
  };
}