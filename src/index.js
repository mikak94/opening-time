const MINS_IN_HOUR = 60;
const RADIX = 10;
const ALL_DAY_OPEN_VAL = [[0, 0], [23, 59]];
const DAYS_IN_WEEK = 7;

const toJSWeek = timetable => ([
  // 'shift' the last item (sunday) to the 0th index
  // `cause it`s the last day of the week for normal people
  ...timetable.slice(-1),
  ...timetable.slice(0, -1),
]);

const getMinsSinceDayStarted = (h, m) => ((h * MINS_IN_HOUR) + m);
const parseTimeStr = str => str.split(':').map(v => parseInt(v, RADIX));
const clone = date => new Date(date);

const mutablySetHM = date => (h, m) => {
  date.setHours(h);
  date.setMinutes(m);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const SUNDAY_ERR_MESSAGE = 'You must explicitly specify whether you give sunday-first (US) week timetable or not by passing boolean isUSInput argument to the OpeningTime constructor';
const LENGTH_MISMATCH_ERR = 'Invalid timetable passed to the constructor. The length of the timetable must be 7';

export class OpeningTime {
  constructor(timetable, isUSInput = null) {
    if (timetable.length !== DAYS_IN_WEEK) {
      throw new Error(LENGTH_MISMATCH_ERR);
    }
    if (isUSInput === null) {
      throw new Error(SUNDAY_ERR_MESSAGE);
    }

    this.timetable = (
      isUSInput ? timetable : toJSWeek(timetable)
    ).map(day => (day instanceof Array ? day.map(parseTimeStr) : day));
  }

  isAlwaysOpen() {
    return this.timetable.every(day => (day === true));
  }

  isWorkingOnDay(date) {
    const weekDayIdx = date.getDay();
    return this.timetable[weekDayIdx] !== null;
  }

  getClosingTime(date) {
    const i = clone(date);

    while (!(this.timetable[(i.getDay() + 1) % DAYS_IN_WEEK] instanceof Array)) {
      i.setDate(i.getDate() + 1);
    }

    const weekDayVal = this.timetable[i.getDay()];
    const [, end] = weekDayVal === true ? ALL_DAY_OPEN_VAL : weekDayVal;

    return mutablySetHM(clone(i))(...end);
  }

  getNearestWorkTime(date) {
    if (this.isAlwaysOpen()) return { alwaysOpen: true };
    if (this.isWorkingAt(date)) {
      return { openTill: this.getClosingTime(date) };
    }

    const i = clone(date);

    while (!this.isWorkingOnDay(i)) {
      i.setDate(i.getDate() + 1);
    }

    const weekDayVal = this.timetable[i.getDay()];
    const [start] = weekDayVal === true ? ALL_DAY_OPEN_VAL : weekDayVal;

    const opensAt = mutablySetHM(clone(i))(...start);

    return { opensAt };
  }

  isWorkingAt(date) {
    const weekDayIdx = date.getDay();

    if (this.timetable[weekDayIdx] === null) return false;
    if (this.timetable[weekDayIdx] === true) return true;

    const nowNum = getMinsSinceDayStarted(date.getHours(), date.getMinutes());
    const [start, end] = this.timetable[weekDayIdx];

    const startNum = getMinsSinceDayStarted(...start);
    const endNum = getMinsSinceDayStarted(...end);

    return (nowNum >= startNum && nowNum <= endNum);
  }
}


const getNearestWorkTime = (date, timetable, isUSInput = false) => (
  new OpeningTime(timetable, isUSInput)
).getNearestWorkTime(date);

export default getNearestWorkTime;
