const { routeRequest } = require("./routes/api.routes");
const { sendJson } = require("./utils/response");

async function handleRequest(req, res) {
  // 处理 CORS 预检请求 (OPTIONS)
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return sendJson(res, 405, {
      status: "error",
      message: "Method Not Allowed",
    });
  }

  try {
    const response = await routeRequest(req, res);

    if (!response) {
      return sendJson(res, 404, {
        status: "error",
        message: "Not Found",
      });
    }

    return sendJson(res, response.statusCode, response.body);
  } catch (error) {
    console.error("Unhandled request error:", error);
    return sendJson(res, 500, {
      status: "error",
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  handleRequest,
};