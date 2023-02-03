const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ message, timestamp, level }) =>
        `[${timestamp}] ${level}: ${message.replace(/\n/g, " ").trim()}`
    )
  ),
  transports: [new winston.transports.Console()],
});

module.exports = { logger };
