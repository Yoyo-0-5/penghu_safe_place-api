const {
  getHealth,
  getTableData,
  getDoc,
} = require("../controllers/api.controller");
const { handleUpload } = require("../controllers/upload.controller");

async function routeRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // Health check
  if (req.method === "GET" && (pathname === "/" || pathname === "/health")) {
    return getHealth();
  }

  // Upload image
  if (req.method === "POST" && pathname === "/api/upload") {
    return handleUpload(req, res);
  }

  // API Documentation
  if (req.method === "GET" && pathname === "/api/doc") {
    return getDoc();
  }

  // Dynamic API endpoint: /api/:tableName
  if (req.method === "GET" && pathname.startsWith("/api/")) {
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