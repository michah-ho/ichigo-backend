const { getAllUserData, writeUserData } = require('./user-db');

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn().mockResolvedValue(JSON.stringify({ "1" : "data"})),
    writeFile: jest.fn().mockResolvedValue(),
  }, 
}));

describe('test getAllUserData', () => {
  it('should read data from the users.json file', async () => {
    const result = await getAllUserData();
    expect(result).toHaveProperty("1");
  });
});

describe('test, writeUserData', () => {
  it('should return mockOutputData given to it', async () => {
    const mockData = { "1" : { data : [{ redeemAt: "fakedata", availableAt: 'fakeDate', expiresAt: 'fakeDate'}]}};
    const result = await writeUserData(mockData, mockData);
    expect(result).toEqual(mockData);
  });
});