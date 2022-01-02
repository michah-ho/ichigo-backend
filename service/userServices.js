const {
  getFirstDayOfTheWeek,
  getEntireWeek,
  setToMidnight,
} = require("../utils/timeHelpers");
const { getAllUserData, writeUserData } = require("../db/user-db");

function generateUserRedeemRow(availableAt) {
  const tempDate = new Date(new Date(availableAt).setHours(0, 0, 0, 0)); // always set to midnight
  const expiresAt = new Date(
    tempDate.setDate(tempDate.getDate() + 1)
  ).toISOString();
  return { availableAt, redeemedAt: null, expiresAt };
}

function createRewardData(atTime) {
  const firstDayOfTheWeek = getFirstDayOfTheWeek(atTime);
  const weekOfDate = getEntireWeek(firstDayOfTheWeek);
  return weekOfDate.map((element) => generateUserRedeemRow(element));
}

async function getUserData(userId) {
  try {
    const userData = await getAllUserData();
    return userData[userId];
  } catch (err) {
    throw err;
  }
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

async function createUser({ userId, newData }) {
  try {
    const userData = await getAllUserData();
    const newUserData = {
      ...userData,
      [userId]: {
        data: newData,
      },
    };
    return await writeUserData(newUserData, newUserData[userId]);
  } catch (err) {
    throw err;
  }
}
async function updateUser({ userId, newData }) {
  try {
    const userData = await getAllUserData();
    const newUserData = {
      ...userData,
      [userId]: {
        data: [...userData[userId].data, ...newData],
      },
    };
    return await writeUserData(newUserData, { data: newData});
  } catch (err) {
    throw err;
  }
}

function findRewardIdxByDate(userData, atTime) {
  const atIsoTime = new Date(setToMidnight(atTime)).toISOString();
  const rewardIdx = userData.data.findIndex(
    (element) => element.availableAt === atIsoTime
  );
  return rewardIdx;
}

async function updateUserReward({ userId, rewardIdx }) {
  try {
    const userData = await getAllUserData();
    userData[userId].data[rewardIdx].redeemedAt = new Date().toISOString();
    return await writeUserData(userData, {
      data: userData[userId].data[rewardIdx],
    });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createRewardData,
  getUserData,
  getRewardsFromUser,
  createUser,
  updateUser,
  findRewardIdxByDate,
  updateUserReward,
};
