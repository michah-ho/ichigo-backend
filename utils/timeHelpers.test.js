const {
  getFirstDayOfTheWeek,
  getEntireWeek,
  isDate,
  setToMidnight,
} = require('./timeHelpers');

describe('tests for timeHelpers functions', () => {
  it('setToMidnight Should return a time at midnight despite the date time thats passed in', () => {
    const mockDateStr = '2026-03-14T08:12:12.100Z';
    const expected = '2026-03-14T07:00:00.000Z';
    const result = setToMidnight(mockDateStr);
    expect(result).toEqual(expected);
  });
  it('getFirstDayOfTheWeek should return the Sunday date of the week that of the date thats been passed in', () => {
    const mockDateStr = '2024-03-12T07:00:00.000Z';
    const expected = '2024-03-10T08:00:00.000Z';
    const result = getFirstDayOfTheWeek(mockDateStr);
    expect(result).toEqual(expected);
  });
  it('getEntireWeek should return an the week in the form of an array of the date that was passed in', () => {
    const mockDateStr = '2024-03-12T07:00:00.000Z';
    const expected = [
      '2024-03-12T07:00:00.000Z',
      '2024-03-13T07:00:00.000Z',
      '2024-03-14T07:00:00.000Z',
      '2024-03-15T07:00:00.000Z',
      '2024-03-16T07:00:00.000Z',
      '2024-03-17T07:00:00.000Z',
      '2024-03-18T07:00:00.000Z'
    ];
    expect(getEntireWeek(mockDateStr)).toEqual(expected);
  });
  it('Should return true when a good date format is passed in', () => {
    const mockDateStr = '2024-03-12T07:00:00.000Z';
    expect(isDate(mockDateStr)).toBeTruthy();
  });
  it('Should return false when a bad date format is passed in', () => {
    const mockDateStr = 'badDate';
    expect(isDate(mockDateStr)).toBeFalsy();
  });
});