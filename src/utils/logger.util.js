const winston = require("winston");
const appConfig = require("../config/app.config");

const logger = winston.createLogger({
  level: appConfig.ENVIRONMENT === "DEV" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => {
      const { message, timestamp, level } = info;

      let transformedMessage = message.replace(/\n/g, " ").trim();

      if (info instanceof Error) {
        transformedMessage = `${info.message} ${info.stack}`;
      }
      return `[${timestamp}] ${level}: ${transformedMessage}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports.logger = logger;
