const fs = require("fs/promises");
const path = require("path");

const dataFilePath = path.join(__dirname, "..", "..", "penghuPeople.json");

async function readPenghuPeopleFile() {
  const rawContent = await fs.readFile(dataFilePath, "utf8");

  try {
    return JSON.parse(rawContent);
  } catch {
    const error = new Error("Invalid JSON format in penghuPeople.json");
    error.code = "INVALID_JSON";
    throw error;
  }
}

module.exports = {
  readPenghuPeopleFile,
};