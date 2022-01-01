const fs = require('fs');

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
        const result = outputData ? outputData : inputData;
        res.status(200).send(result);
      }
    }
  );
}

module.exports = {
  getJSONfromFile,
  writeToJSONFile,
}