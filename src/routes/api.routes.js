const {
  getHealth,
  getTableData,
} = require("../controllers/api.controller");

async function routeRequest(req) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // Health check
  if (pathname === "/" || pathname === "/health") {
    return getHealth();
  }

  // Dynamic API endpoint: /api/:tableName
  if (pathname.startsWith("/api/")) {
    const tableName = pathname.replace(/^\/api\//, "").trim();
    
    if (tableName) {
      return getTableData(tableName);
    }
  }

  return null;
}

module.exports = {
  routeRequest,
};