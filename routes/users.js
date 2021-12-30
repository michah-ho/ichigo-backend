const express = require("express");
const router = express.Router();
const {
  getEntireWeek,
  isDate,
  getFirstDayOfTheWeek,
  setToMidnight,
  isRewardRedeemable,
} = require("../utils/timeHelpers.js");
const {
  generateUserRedeemRow,
  getJSONfromFile,
  writeToJSONFile,
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
  const firstDayOfTheWeek = getFirstDayOfTheWeek(atTime);
  const user = req.params["id"];
  const userData = getJSONfromFile("./db/users.json");
  const availableAtFirstDayPos = userData[user]
    ? userData[user].data.findIndex(
        (element) => element.availableAt === firstDayOfTheWeek
      )
    : -1;
  if (!userData[user] || availableAtFirstDayPos === -1) {
    const weekOfDate = getEntireWeek(firstDayOfTheWeek);
    const redeemDataArr = weekOfDate.map((element) =>
      generateUserRedeemRow(element)
    );
    const newUserData = {
      ...userData,
      [user]: {
        data: userData[user]
          ? [...userData[user].data, ...redeemDataArr]
          : redeemDataArr,
      },
    };
    writeToJSONFile(res, "./db/users.json", newUserData, redeemDataArr);
  } else {
    const filteredResult = userData[user].data.slice(
      availableAtFirstDayPos,
      availableAtFirstDayPos + 7
    );
    res.status(200).send({ data: filteredResult });
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
  const userData = getJSONfromFile("./db/users.json");

  if (!userData[userId]) {
    return res
      .status(400)
      .send({
        error: {
          message: "The User ID that you have specified does not exist",
        },
      });
  }
  const atIsoTime = new Date(setToMidnight(atTime)).toISOString();
  const rewardIdx = userData[userId].data.findIndex(
    (element) => element.availableAt === atIsoTime
  );

  if (rewardIdx === -1) {
    return res
      .status(400)
      .send({
        error: { message: "The date that you specified does not exist." },
      });
  }
  const reward = userData[userId].data[rewardIdx];
  const isReedemable = isRewardRedeemable(reward.expiresAt);

  if (!isReedemable) {
    return res.status(400).send({error: { message: "Your reward has already expired"}})
  }
  userData[userId].data[rewardIdx].redeemedAt = new Date().toISOString();
  writeToJSONFile(res, "./db/users.json", userData, { data: reward });
});

module.exports = router;
