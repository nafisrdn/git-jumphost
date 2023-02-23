const path = require("path");

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const ENVIRONMENT = process.env.ENVIRONMENT || "DEV";
const LOGS_DIRECTORY =
  process.env.LOGS_DIRECTORY || path.join(__dirname, "../../logs");
const VERSION = "1.3.1";

module.exports = {
  PORT,
  ENVIRONMENT,
  LOGS_DIRECTORY,
  VERSION,
};
