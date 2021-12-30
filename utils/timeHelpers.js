function setToMidnight(date) {
  return new Date(date).setHours(0,0,0,0);
}

function getFirstDayOfTheWeek(date) {
  let dateGiven = new Date(setToMidnight(date));
  const firstDayOfTheWeek = new Date(dateGiven.setDate(dateGiven.getDate() - dateGiven.getDay())).toISOString();
  return firstDayOfTheWeek;
}

function getEntireWeek(firstDay) {
  const weekArr = [];
  weekArr.push(firstDay);
  const tempDate = new Date(setToMidnight(firstDay)); //force to midnight
  for(let i = 0; i < 6; i++) {
    weekArr.push(new Date(tempDate.setDate(tempDate.getDate() + 1)).toISOString());
  }
  return weekArr;
}

function isDate(date) {
  return !isNaN(new Date(date)) && new Date(date) !== "Invalid Date";
}

function isRewardRedeemable(expiresAt) {
  const expiresDate = new Date(expiresAt);
  const currentDate = new Date();
  return currentDate <= expiresDate;
}

module.exports = {
  getFirstDayOfTheWeek,
  getEntireWeek,
  isDate,
  setToMidnight,
  isRewardRedeemable
};