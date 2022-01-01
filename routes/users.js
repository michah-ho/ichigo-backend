const express = require("express");
const router = express.Router();
const {
  isDate,
  isRewardRedeemable,
} = require("../utils/timeHelpers.js");
const {
  createRewardData,
  getRewardsFromUser,
  getUserData,
  createUser,
  updateUser,
  findRewardIdxByDate,
  updateUserReward
} = require("../utils/dataHelpers.js");

router.get("/:id/rewards", (req, res) => {
  const atTime = req.query.at;

  if (!isDate(atTime)) {
    return res
      .status(400)
      .send({
        error: { message: "Please use a proper date for the at query param" },
      });
  }
  const userId = req.params["id"];
  const userData = getUserData(userId)
  const rewardsFromUser = userData ? getRewardsFromUser(userData, atTime) : null;
  if (!userData) {
    const newRewardData = createRewardData(atTime);
    createUser({
      response: res,
      userId,
      newData: newRewardData, 
    });
  } else if(userData && !rewardsFromUser){
    const newRewardData = createRewardData(atTime);
    updateUser({
      response: res,
      userId,
      newData: newRewardData,
    })
  } else {
    res.status(200).send({ data: rewardsFromUser });
  }
});

router.patch("/:id/rewards/:at/redeem", (req, res) => {
  const atTime = req.params["at"];
  const userId = req.params["id"];

  if (!isDate(atTime)) {
    return res
      .status(400)
      .send({
        error: { message: "Please use a proper date for the at query param" },
      });
  }
  const userData = getUserData(userId)
  if (!userData) {
    return res
      .status(400)
      .send({
        error: {
          message: "The User ID that you have specified does not exist",
        },
      });
  }
  const rewardIdx = findRewardIdxByDate(userData, atTime)
  if (rewardIdx === -1) {
    return res
      .status(400)
      .send({
        error: { message: "The date that you specified does not exist." },
      });
  }
  const reward = userData.data[rewardIdx];
  const isReedemable = isRewardRedeemable(reward.expiresAt);
  if (!isReedemable) {
    return res.status(400).send({error: { message: "Your reward has already expired"}})
  }
  updateUserReward({response: res, userId: userId, rewardIdx});
});

module.exports = router;
