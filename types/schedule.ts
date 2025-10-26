export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Schedule = {
 id: string;
 startTime: string;
 days: DayIndex[];
 endTime?: string;

 command: string;
 value?: string;
 isEnabled: boolean;
};