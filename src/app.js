const { routeRequest } = require("./routes/api.routes");
const { sendJson } = require("./utils/response");

async function handleRequest(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, {
      status: "error",
      message: "Method Not Allowed",
    });
  }

  try {
    const response = await routeRequest(req);

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