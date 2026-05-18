const { execFile } = require("child_process");
const { promisify } = require("util");
const { getDbConfig } = require("../config/db.config");

const execFileAsync = promisify(execFile);

async function runMysqlQuery(query) {
  const dbConfig = getDbConfig();
  try {
    const { stdout, stderr } = await execFileAsync(
      "mysql",
      [
        "-h",
        dbConfig.host,
        "-P",
        String(dbConfig.port),
        "-u",
        dbConfig.user,
        "-D",
        dbConfig.database,
        "--batch",
        "--raw",
        "--silent",
        "--skip-column-names",
        "-e",
        query,
      ],
      {
        env: {
          ...process.env,
          MYSQL_PWD: dbConfig.password,
        },
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    if (stderr) {
      console.error("MySQL stderr:", stderr);
    }

    return stdout.trim();
  } catch (error) {
    console.error("MySQL query execution error:", error.message);
    console.error("Query was:", query);
    throw error;
  }
}

module.exports = {
  runMysqlQuery,
};