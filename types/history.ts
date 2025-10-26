export type HistoryLog = {
 id: string;
 timestamp: string;
 type:
  | 'LIGHT_ON_MANUAL'
  | 'LIGHT_ON_AUTO'
  | 'LIGHT_OFF_MANUAL'
  | 'LIGHT_OFF_AUTO'
  | 'MOTION_DETECTED';

 deviceName: string;
 actorName: string | null;
};

export type HistoryFilter =
 | 'semua'
 | 'motion'
 | 'lampu_on'
 | 'lampu_off';