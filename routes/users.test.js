const { getRewardsRoute, patchRewardsRoute } = require('./users.js');

jest.mock('../db/user-db', () => {
  const {
    mockAllUserData,
  } = require('../service/mockServiceData');
  return { 
    getAllUserData: jest.fn().mockRejectedValueOnce({}).mockResolvedValueOnce({}).mockResolvedValue(mockAllUserData)
  };
});

jest.mock('../service/userService', () => {
  const {
    mockAllUserData,
    mockRewardsData,
    mockAllUserDataOld,
  } = require('../service/mockServiceData');
  return {
    createRewardData: jest.fn().mockResolvedValue(mockRewardsData),
    getUserData: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(mockAllUserData['1']).mockResolvedValueOnce(mockAllUserData['1']).mockResolvedValueOnce(null).mockResolvedValueOnce(mockAllUserData['1']).mockResolvedValueOnce(mockAllUserDataOld['1']).mockResolvedValueOnce(mockAllUserData['1']),
    createUser: jest.fn().mockResolvedValueOnce(mockAllUserData['1']),
    getRewardsFromUser: jest.fn().mockReturnValueOnce(null).mockReturnValue(mockRewardsData),
    findRewardIdxByDate: jest.fn().mockReturnValueOnce(-1).mockReturnValue(4),
  }
});

describe('getRewardsRoute tests', () => {
  const mockBadRequest = { error: { message: "bad request"} };
  const mockOkRequest = { data: 'results' };
  it('getRewardsRoute should throw a bad request if its a bad date', async () => {
    const mockReq = {
      query : {
        at: "badDate"
      },
      params: {
        id: '1'
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockBadRequest)}),
    }
    const result = await getRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockBadRequest);
  });
  it('getRewardsRoute should create a user if there is no userData', async () => {
    const mockReq = {
      query : {
        at: "2022-03-19T12:00:00Z"
      },
      params: {
        id: '1'
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockOkRequest)}),
    }
    const result = await getRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockOkRequest);
  });
  it('getRewardsRoute should create a user with an array of rewards', async () => {
    const mockReq = {
      query : {
        at: "2022-03-19T12:00:00Z"
      },
      params: {
        id: '1'
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockOkRequest)}),
    }
    const result = await getRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockOkRequest);
  });
  it('getRewardsRoute should update the user with an array of rewards', async () => {
    const mockReq = {
      query : {
        at: "2022-03-19T12:00:00Z"
      },
      params: {
        id: '1'
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockOkRequest)}),
    }
    const result = await getRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockOkRequest);
  });
  it('getRewardsRoute should return OK if user and rewards from user exists', async () => {
    const mockReq = {
      query : {
        at: "2022-03-19T12:00:00Z"
      },
      params: {
        id: '1'
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockOkRequest)}),
    }
    const result = await getRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockOkRequest);
  });
});

describe('patchRewardsRoute tests', () => {
  const mockBadRequest = { error: { message: "bad request"} };
  const mockOkRequest = { data: 'results' };

  it('patchRewardsRoute should throw a bad request if its a bad date', async () => {
    const mockReq = {
      params: {
        id: '1',
        at: "badDate"
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockBadRequest)}),
    }
    const result = await patchRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockBadRequest);
  });

  it('patchRewardsRoute should throw a bad request if its the User doesnt exist', async () => {
    const mockReq = {
      params: {
        id: '1',
        at: "2022-03-19T12:00:00Z"
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockBadRequest)}),
    }
    const result = await patchRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockBadRequest);
  });

  it('patchRewardsRoute should throw a bad request if the reward doesnt exist for the user', async () => {
    const mockReq = {
      params: {
        id: '1',
        at: "2022-03-19T12:00:00Z"
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockBadRequest)}),
    }
    const result = await patchRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockBadRequest);
  });

  it('patchRewardsRoute should throw a bad request if the reward is not redeemable', async () => {
    const mockReq = {
      params: {
        id: '1',
        at: "2022-03-19T12:00:00Z"
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockBadRequest)}),
    }
    const result = await patchRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockBadRequest);
  });

  it('patchRewardsRoute should be an okay response when all data exists and is good', async () => {
    const mockReq = {
      params: {
        id: '1',
        at: "2022-03-19T12:00:00Z"
      }
    }
    const mockRes = {
      status: () => ({ send: () => (mockOkRequest)}),
    }
    const result = await patchRewardsRoute(mockReq, mockRes);
    expect(result).toEqual(mockOkRequest);
  });
});