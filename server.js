const http = require("http");
const { handleRequest } = require("./src/app");

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Penghu People API is running at http://0.0.0.0:${PORT}`);
  console.log(`Accessible via: http://100.77.172.55:${PORT}`);
});

// 捕獲未處理的錯誤
server.on("error", (error) => {
  console.error("Server error:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // 不中止進程，繼續運行
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
