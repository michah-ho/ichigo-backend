const { getFirstDayOfTheWeek, getEntireWeek, setToMidnight } = require('./timeHelpers');
const { getJSONfromFile, writeToJSONFile } = require('../db');

function generateUserRedeemRow(availableAt) {
  const tempDate = new Date(new Date(availableAt).setHours(0,0,0,0)); // always set to midnight
  const expiresAt = new Date(tempDate.setDate(tempDate.getDate() + 1)).toISOString();
  return { availableAt, redeemedAt: null, expiresAt };
};

function createRewardData(atTime) {
  const firstDayOfTheWeek = getFirstDayOfTheWeek(atTime);
  const weekOfDate = getEntireWeek(firstDayOfTheWeek);
  return weekOfDate.map((element) =>
    generateUserRedeemRow(element)
  );
}

function getUserData(userId) {
  const userData = getJSONfromFile("./db/users.json");
  return userData[userId];
}

function getRewardsFromUser(userData, atTime) {
  const firstDayOfTheWeek = getFirstDayOfTheWeek(atTime);
  const rewardIdx = userData
    ? userData.data.findIndex(
        (element) => element.availableAt === firstDayOfTheWeek
      )
    : -1;
  return rewardIdx > -1 ? userData.data.slice(rewardIdx, rewardIdx + 7) : null;
}

function createUser({ response, userId, newData }) {
  const newUserData = {
    [userId]: {
      data: newData
    },
  };
  writeToJSONFile(response, "./db/users.json", newUserData, newUserData[userId]);
}
function updateUser({ response, userId, newData }) {
  const userData = getJSONfromFile("./db/users.json");
  const newUserData = {
    ...userData,
    [userId]: {
      data: [...userData[userId].data, ...newData]
    }
  }
  writeToJSONFile(response, "./db/users.json", newUserData, newData);
}

function findRewardIdxByDate(userData, atTime) {
  const atIsoTime = new Date(setToMidnight(atTime)).toISOString();
  const rewardIdx = userData.data.findIndex(
    (element) => element.availableAt === atIsoTime
  );
  return rewardIdx;
}

function updateUserReward({ response, userId, rewardIdx }) {
  const userData = getJSONfromFile("./db/users.json");
  userData[userId].data[rewardIdx].redeemedAt = new Date().toISOString();
  writeToJSONFile(response, "./db/users.json", userData, { data: userData[userId].data[rewardIdx] });
}

module.exports = {
  createRewardData,
  getUserData,
  getRewardsFromUser,
  createUser,
  updateUser,
  findRewardIdxByDate,
  updateUserReward
};