const express = require("express");
const router = express.Router();
const { isDate, isRewardRedeemable } = require("../utils/timeHelpers.js");
const {
  createRewardData,
  getRewardsFromUser,
  getUserData,
  createUser,
  updateUser,
  findRewardIdxByDate,
  updateUserReward,
} = require("../service/userService.js");
const { STATUSCODES } = require("../config/constants");

const getRewardsRoute = async (req, res) => {
  const atTime = req.query.at;
  if (!isDate(atTime)) {
    return res.status(STATUSCODES['BAD_REQUEST']).send({
      error: { message: "Please use a proper date for the at query param" },
    });
  }
  const userId = req.params["id"];
  let userData;
  try {
    userData = await getUserData(userId);
  } catch (err) {
    return res.status(STATUSCODES['INTERNAL_SERVER_ERROR']).send(err);
  }
  const rewardsFromUser = userData
    ? getRewardsFromUser(userData, atTime)
    : null;
  if (userData === null || userData === undefined) {
    const newRewardData = createRewardData(atTime);
    try {
      const result = await createUser({
        userId,
        newData: newRewardData,
      });
      return res.status(STATUSCODES['OK']).send(result);
    } catch (err) {
      return res.status(STATUSCODES['BAD_REQUEST']).send(err);
    }
  } else if (userData && rewardsFromUser === null) {
    const newRewardData = createRewardData(atTime);
    try {
      const result = await updateUser({
        userId,
        newData: newRewardData,
      });
      return res.status(STATUSCODES['OK']).send(result);
    } catch (err) {
      return res.status(STATUSCODES['BAD_REQUEST']).send(err);
    }
  } else {
    return res.status(STATUSCODES['OK']).send({ data: rewardsFromUser });
  }
}

const patchRewardsRoute = async (req, res) => {
  const atTime = req.params["at"];
  const userId = req.params["id"];
  if (!isDate(atTime)) {
    return res.status(STATUSCODES['BAD_REQUEST']).send({
      error: { message: "Please use a proper date for the at query param" },
    });
  }
  let userData;
  try {
    userData = await getUserData(userId);
  } catch (err) {
    return res.status(STATUSCODES['INTERNAL_SERVER_ERROR']).send(err);
  }
  if (!userData) {
    return res.status(STATUSCODES['BAD_REQUEST']).send({
      error: {
        message: "The User ID that you have specified does not exist",
      },
    });
  }
  const rewardIdx = findRewardIdxByDate(userData, atTime);
  if (rewardIdx === -1) {
    return res.status(STATUSCODES['BAD_REQUEST']).send({
      error: { message: "The date that you specified does not exist." },
    });
  }
  const reward = userData.data[rewardIdx];
  const isRedeemable = isRewardRedeemable(reward.expiresAt);
  if (!isRedeemable) {
    return res
      .status(STATUSCODES['BAD_REQUEST'])
      .send({ error: { message: "Your reward has already expired" } });
  }
  try {
    const result = await updateUserReward({ userId: userId, rewardIdx });
    return res.status(STATUSCODES['OK']).send(result);
  } catch (err) {
    return res.status(STATUSCODES['BAD_REQUEST']).send(err);
  }
}

router.get("/:id/rewards", getRewardsRoute);
router.patch("/:id/rewards/:at/redeem", patchRewardsRoute);

module.exports = { 
  userRouter: router,
  getRewardsRoute,
  patchRewardsRoute
}
