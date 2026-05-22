const fs = require("fs");
const path = require("path");
const {
  readDatabaseTableByName,
  getDatabaseTableNames,
} = require("../services/databaseTables.service");
const { getDbConfig } = require("../config/db.config");

async function getHealth() {
  try {
    const tableNames = await getDatabaseTableNames();
    const endpoints = [
      "/api/doc",
      "/api/upload",
      ...tableNames.map((tableName) => `/api/${tableName}`)
    ];

    return {
      statusCode: 200,
      body: {
        status: "ok",
        message: "API is running",
        database: getDbConfig().database,
        availableTables: tableNames.length,
        endpoints,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        status: "error",
        message: "Failed to retrieve table list",
      },
    };
  }
}

async function getTableData(tableName) {
  try {
    const table = await readDatabaseTableByName(tableName);

    if (table === null) {
      return {
        statusCode: 404,
        body: {
          status: "error",
          message: `Table '${tableName}' not found`,
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        status: "success",
        database: getDbConfig().database,
        tableName,
        rowCount: table.length,
        rows: table,
      },
    };
  } catch (error) {
    console.error(`Error reading table ${tableName}:`, error);
    return {
      statusCode: 500,
      body: {
        status: "error",
        message: `Failed to read table '${tableName}'`,
      },
    };
  }
}

async function getDoc() {
  try {
    const docPath = path.join(__dirname, "../../api/doc.md");
    const docContent = fs.readFileSync(docPath, "utf8");
    return {
      statusCode: 200,
      contentType: "text/markdown",
      body: docContent,
    };
  } catch (error) {
    console.error("Error reading doc file:", error);
    return {
      statusCode: 500,
      body: {
        status: "error",
        message: "Failed to read API documentation",
      },
    };
  }
}

module.exports = {
  getHealth,
  getTableData,
  getDoc,
};