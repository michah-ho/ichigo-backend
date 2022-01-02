const fs = require("fs").promises;

async function getAllUserData() {
  try {
    const result = await fs.readFile("./db/users.json", "utf8", (err, data) => {
      if (err) {
        return err;
      }
      return data;
    });
    return JSON.parse(result);
  } catch (err) {
    throw {
      error: { message: "There was an error reading the file", code: err.code },
    };
  }
}

async function writeUserData(inputData, outputData) {
  try {
    const result = await fs.writeFile(
      "./db/users.json",
      JSON.stringify(inputData),
      "utf8",
      (err) => {
        if (err) {
          return err;
        }
      }
    );
    return outputData;
  } catch (err) {
    throw {
      error: { message: "There was an error writing to the file", code: err.code },
    };
  }
}

module.exports = {
  getAllUserData,
  writeUserData,
};