const winston = require("winston");
const appConfig = require("../config/app.config");
const DailyRotateFile = require("winston-daily-rotate-file");

const logConfiguration = {
  level: appConfig.ENVIRONMENT === "DEV" ? "debug" : "info",
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: appConfig.LOGS_DIRECTORY + "/jumphost-%DATE%.log",
      datePattern: "DD-MM-YYYY",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    winston.format.printf((info) => {
      const { message, timestamp, level } = info;

      let transformedMessage = message.replace(/\n/g, " ").trim();

      if (info instanceof Error) {
        transformedMessage = `${info.message} ${info.stack}`;
      }
      return `[${timestamp}] ${level}: ${transformedMessage}`;
    })
  ),
};
const logger = winston.createLogger(logConfiguration);

module.exports.logger = logger;
