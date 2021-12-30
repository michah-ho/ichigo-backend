const fs = require("fs");

function generateUserRedeemRow(availableAt) {
  const tempDate = new Date(new Date(availableAt).setHours(0,0,0,0)); // always set to midnight
  const expiresAt = new Date(tempDate.setDate(tempDate.getDate() + 1)).toISOString();
  return { availableAt, redeemedAt: null, expiresAt };
};

function getJSONfromFile(path) {
  const data = fs.readFileSync(path);
  const userData = JSON.parse(data);
  return userData;
}

function writeToJSONFile(res, path, inputData, outputData) {
  fs.writeFile(
    path,
    JSON.stringify(inputData),
    "utf8",
    (err) => {
      if (err) {
        res
          .status(500)
          .send({
            error: { message: "There was an error writing the file" },
          });
      } else {
        res.status(200).send(outputData);
      }
    }
  );
}

module.exports = {
  generateUserRedeemRow,
  getJSONfromFile,
  writeToJSONFile
};