
export type TimetableEntry = boolean | null | [ string, string ];
export type NearestWorkTime = { alwaysOpen: true } | { openTill: Date } | { opensAt: Date };
export class OpeningTime {
  constructor(timetable: TimetableEntry[], usWeek: boolean)
  public isWorkingAt(date: Date): boolean
  public isAlwaysOpen(): boolean
  public getNearestWorkTime(date: Date): NearestWorkTime
}
export default function getNearestWorkTime(date: Date, timetable: TimetableEntry[], usWeek?: boolean): NearestWorkTime;
