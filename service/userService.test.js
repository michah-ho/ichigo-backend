const {
  createRewardData,
  getUserData,
  getRewardsFromUser,
  createUser,
  updateUser,
  findRewardIdxByDate,
} = require('./userServices');

const { getAllUserData, writeUserData } = require("../db/user-db");
const {
  mockRewardsData,
  mockAllUserData
} = require('./mockServiceData');

jest.mock('../db/user-db', () => {
  const {
    mockAllUserData
  } = require('./mockServiceData');
  return { 
    getAllUserData: jest.fn().mockResolvedValue(mockAllUserData),
    writeUserData: jest.fn().mockResolvedValue(mockAllUserData['1'])
  };
});

describe('Tests for userService functions', () => {
  const mockUserId = '1';

  it('createRewardData should generate expected rewards data', () => {
    const mockDate = "2024-03-14T07:12:00.000Z";
    const result = createRewardData(mockDate);
    expect(result).toEqual(mockRewardsData);
  });
  it('getUserData should return a data for a specific user', async () => {
    const result = await getUserData(mockUserId);
    expect(getAllUserData).toHaveBeenCalled();
    expect(result).toEqual(mockAllUserData[mockUserId]);
  });
  it('getRewardsFromUser should return a the specific 7 days from a user', () => {
    const mockAtTime = "2024-03-13T07:00:00.000Z";
    const result = getRewardsFromUser(mockAllUserData[mockUserId], mockAtTime);
    expect(result).toEqual(mockRewardsData);
  });
  it('createUser should call writeUserData, and the result should equal the newData property', async () => {
    const result = await createUser({
      userId: '1',
      newData: mockAllUserData[mockUserId]
    });
    expect(writeUserData).toHaveBeenCalled();
    expect(result).toEqual(mockAllUserData[mockUserId]);
  });
  it('updateUser should call writeUserData, and the result should equal the newData property', async () => {
    const result = await updateUser({
      userId: '1',
      newData: mockAllUserData[mockUserId].data
    });
    expect(writeUserData).toHaveBeenCalled();
    expect(result).toEqual(mockAllUserData[mockUserId]);
  });
  it('findRewardIdxByDate should return the index of the specified reward if it exists in userData', () => {
    const mockDate = "2024-03-14T07:00:00.000Z";
    const result = findRewardIdxByDate(mockAllUserData[mockUserId], mockDate);
    expect(result).toEqual(4); // should be the 5th item in the mock userdata array
  });
});