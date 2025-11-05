/**
 * @brief UDAWA Common Alarm Code Definition
 */
export const alarmCodeDescriptions: { [key: number]: { title: string; description: string } } = {
  110: {
    title: 'alarm.110.title',
    description: 'alarm.110.description',
  },
  111: {
    title: 'alarm.111.title',
    description: 'alarm.111.description',
  },
  112: {
    title: 'alarm.112.title',
    description: 'alarm.112.description',
  },
  120: {
    title: 'alarm.120.title',
    description: 'alarm.120.description',
  },
  121: {
    title: 'alarm.121.title',
    description: 'alarm.121.description',
  },
  122: {
    title: 'alarm.122.title',
    description: 'alarm.122.description',
  },
  123: {
    title: 'alarm.123.title',
    description: 'alarm.123.description',
  },
  124: {
    title: 'alarm.124.title',
    description: 'alarm.124.description',
  },
  125: {
    title: 'alarm.125.title',
    description: 'alarm.125.description',
  },
  126: {
    title: 'alarm.126.title',
    description: 'alarm.126.description',
  },
  127: {
    title: 'alarm.127.title',
    description: 'alarm.127.description',
  },
  128: {
    title: 'alarm.128.title',
    description: 'alarm.128.description',
  },
  129: {
    title: 'alarm.129.title',
    description: 'alarm.129.description',
  },
  130: {
    title: 'alarm.130.title',
    description: 'alarm.130.description',
  },
  131: {
    title: 'alarm.131.title',
    description: 'alarm.131.description',
  },
  132: {
    title: 'alarm.132.title',
    description: 'alarm.132.description',
  },
  133: {
    title: 'alarm.133.title',
    description: 'alarm.133.description',
  },
  140: {
    title: 'alarm.140.title',
    description: 'alarm.140.description',
  },
  141: {
    title: 'alarm.141.title',
    description: 'alarm.141.description',
  },
  142: {
    title: 'alarm.142.title',
    description: 'alarm.142.description',
  },
  143: {
    title: 'alarm.143.title',
    description: 'alarm.143.description',
  },
  144: {
    title: 'alarm.144.title',
    description: 'alarm.144.description',
  },
  145: {
    title: 'alarm.145.title',
    description: 'alarm.145.description',
  },
  150: {
    title: 'alarm.150.title',
    description: 'alarm.150.description',
  },
  210: {
    title: 'alarm.210.title',
    description: 'alarm.210.description',
  },
  211: {
    title: 'alarm.211.title',
    description: 'alarm.211.description',
  },
  212: {
    title: 'alarm.212.title',
    description: 'alarm.212.description',
  },
  213: {
    title: 'alarm.213.title',
    description: 'alarm.213.description',
  },
  214: {
    title: 'alarm.214.title',
    description: 'alarm.214.description',
  },
  215: {
    title: 'alarm.215.title',
    description: 'alarm.215.description',
  },
  216: {
    title: 'alarm.216.title',
    description: 'alarm.216.description',
  },
  217: {
    title: 'alarm.217.title',
    description: 'alarm.217.description',
  },
  218: {
    title: 'alarm.218.title',
    description: 'alarm.218.description',
  },
  220: {
    title: 'alarm.220.title',
    description: 'alarm.220.description',
  },
  230: {
    title: 'alarm.230.title',
    description: 'alarm.230.description',
  },
  231: {
    title: 'alarm.231.title',
    description: 'alarm.231.description',
  },
  232: {
    title: 'alarm.232.title',
    description: 'alarm.232.description',
  },
  233: {
    title: 'alarm.233.title',
    description: 'alarm.233.description',
  },
  234: {
    title: 'alarm.234.title',
    description: 'alarm.234.description',
  },
  235: {
    title: 'alarm.235.title',
    description: 'alarm.235.description',
  },
  236: {
    title: 'alarm.236.title',
    description: 'alarm.236.description',
  },
  240: {
    title: 'alarm.240.title',
    description: 'alarm.240.description',
  },
  241: {
    title: 'alarm.241.title',
    description: 'alarm.241.description',
  },
  242: {
    title: 'alarm.242.title',
    description: 'alarm.242.description',
  },
  243: {
    title: 'alarm.243.title',
    description: 'alarm.243.description',
  },
};

export const getAlarmDetails = (alarmCode: number) => {
  return alarmCodeDescriptions[alarmCode];
};
