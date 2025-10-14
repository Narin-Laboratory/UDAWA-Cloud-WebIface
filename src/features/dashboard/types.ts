export type AttributeValue = [number, string | number | boolean];

export interface DeviceAttributes {
  [key: string]: AttributeValue[];
}

export interface DeviceTimeseries {
  [key: string]: AttributeValue[];
}

export interface PowerSensorAttributes {
  [key: string]: AttributeValue[];
}

export interface Device {
  id: {
    entityType: string;
    id: string;
  };
  name: string;
  type: string;
  label: string;
}

export interface DeviceInfo extends Device {
  active: boolean;
  attributesServerScope: DeviceAttributes;
  attributesClientScope: DeviceAttributes;
  attributesSharedScope: DeviceAttributes;
  timeseries: DeviceTimeseries;
}