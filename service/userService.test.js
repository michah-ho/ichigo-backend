const {
  createRewardData,
  getUserData,
  getRewardsFromUser,
  createUser,
  updateUser,
  findRewardIdxByDate,
  updateUserReward
} = require('./userService');

const { getAllUserData, writeUserData } = require("../db/user-db");
const {
  mockRewardsData,
  mockAllUserData
} = require('./mockServiceData');

jest.mock('../db/user-db', () => {
  const {
    mockAllUserData
  } = require('./mockServiceData');
  const rejectedValue = { error: { message: 'Something wrong happened'}};
  return { 
    getAllUserData: jest.fn().mockResolvedValueOnce(mockAllUserData).mockRejectedValueOnce(rejectedValue).mockResolvedValue(mockAllUserData),
    writeUserData: jest.fn().mockResolvedValueOnce(mockAllUserData['1']).mockRejectedValueOnce(rejectedValue).mockResolvedValueOnce(mockAllUserData['1']).mockRejectedValueOnce(rejectedValue).mockResolvedValueOnce(mockAllUserData['1']).mockRejectedValueOnce(rejectedValue)
  };
});

describe('Tests for userService functions', () => {
  const mockUserId = '1';
  const rejectedValue = { error: { message: 'Something wrong happened'}};

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
  it('getUserData should throw error when reading file fails', async () => {
    try {
      await getUserData(mockUserId);
    } catch(err) {
      expect(err).toEqual(rejectedValue);
    }
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
  it('createUser should throw error with expected mock object', async () => {
    try {
      await createUser({
        userId: '1',
        newData: mockAllUserData[mockUserId]
      });
    } catch(err) {
      expect(err).toEqual(rejectedValue);
    }
  });
  it('updateUser should call writeUserData, and the result should equal the newData property', async () => {
    const result = await updateUser({
      userId: '1',
      newData: mockAllUserData[mockUserId].data
    });
    expect(writeUserData).toHaveBeenCalled();
    expect(result).toEqual(mockAllUserData[mockUserId]);
  });
  it('updateUser should throw error with expected mock object', async () => { 
    try{
      await updateUser({
        userId: '1',
        newData: mockAllUserData[mockUserId].data
      });
    } catch(err) {
      expect(err).toEqual(rejectedValue);
    }
  });
  it('findRewardIdxByDate should return the index of the specified reward if it exists in userData', () => {
    const mockDate = "2024-03-14T07:00:00.000Z";
    const result = findRewardIdxByDate(mockAllUserData[mockUserId], mockDate);
    expect(result).toEqual(4); // should be the 5th item in the mock userdata array
  });
  it('updateUserReward should call writeUserData, and the result should equal the newData property', async () => {
    const result = await updateUserReward({
      userId: '1',
      rewardIdx: 4,
    });
    expect(writeUserData).toHaveBeenCalled();
    expect(result).toEqual(mockAllUserData[mockUserId]);
  });
  it('updateUserReward should throw error with expected mock object', async () => { 
    try{
      await updateUserReward({
        userId: '1',
        rewardIdx: 4,
      });
    } catch(err) {
      expect(err).toEqual(rejectedValue);
    }
  });
});