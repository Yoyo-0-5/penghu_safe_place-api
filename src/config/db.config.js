function getDbConfig() {
  return {
    host: process.env.DB_HOST || "192.168.50.41",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "0000",
    database: process.env.DB_NAME || "community_envoys",
  };
}

module.exports = {
  getDbConfig,
};