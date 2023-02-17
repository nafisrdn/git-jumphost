module.exports.PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
module.exports.ENVIRONMENT = process.env.ENVIRONMENT || "DEV";
module.exports.LOGS_DIRECTORY =
  process.env.LOGS_DIRECTORY || path.join(__dirname, "../../logs");
module.exports.VERSION = "1.2.4";
