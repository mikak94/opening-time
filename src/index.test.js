import getNearestWorkTime, { OpeningTime } from './index';

const mockTimetable = [
  true, // start with monday
  true,
  ['10:30', '21:00'],
  ['11:30', '21:30'],
  ['09:00', '22:30'],
  null,
  null,
];
const mockAlwaysOpenTimetable = Array(7).fill(true);

describe('OpeningTime test', () => {
  it('should throw if invalid timetable is passed to the constructor', () => {
    expect(() => (new OpeningTime([], true))).toThrow();
  });
  it('should throw if isUSInput arg not passed to the constructor', () => {
    expect(() => (new OpeningTime(mockTimetable))).toThrow();
  });
  it('should handle all day open days if now closed', () => {
    const testDate = new Date('2018-04-22T11:00');
    expect(getNearestWorkTime(testDate, mockTimetable)).toEqual({
      opensAt: new Date('2018-04-23T00:00')
    });
  });
  it('should handle all day open days if now open', () => {
    const testDate = new Date('2018-04-23T11:00');
    expect(getNearestWorkTime(testDate, mockTimetable)).toEqual({
      openTill: new Date('2018-04-24T23:59')
    });
  });
  it('should handle ordinary days if now closed', () => {
    const testDate = new Date('2018-04-25T09:00');
    expect(getNearestWorkTime(testDate, mockTimetable)).toEqual({
      opensAt: new Date('2018-04-25T10:30')
    });
  });
  it('should handle ordinary days if now open', () => {
    const testDate = new Date('2018-04-25T20:00');
    expect(getNearestWorkTime(testDate, mockTimetable)).toEqual({
      openTill: new Date('2018-04-25T21:00')
    });
  });
  it('should handle 24/7 timetables', () => {
    const testDate = new Date('2018-04-25T20:00');
    expect(getNearestWorkTime(testDate, mockAlwaysOpenTimetable)).toEqual({
      alwaysOpen: true,
    });
  });
});
