const winston = require("winston");
const appConfig = require("../config/app.config");
const DailyRotateFile = require("winston-daily-rotate-file");

const getLogLevel = (env) => (env === "DEV" ? "debug" : "info");

const logFileName = appConfig.LOGS_DIRECTORY + "/jumphost-%DATE%.log";

const generateLogText = (info) => {
  let transformedMessage = message.replace(/\n/g, " ").trim();

  if (info instanceof Error) {
    transformedMessage = `${info.message} ${info.stack}`;
  }

  return `[${timestamp}] ${level}: ${transformedMessage}`;
};

const logConfiguration = {
  level: getLogLevel(appConfig.ENVIRONMENT),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: logFileName,
      datePattern: "DD-MM-YYYY",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    winston.format.printf((info) => generateLogText(info))
  ),
};
const logger = winston.createLogger(logConfiguration);

module.exports = { logger, getLogLevel, generateLogText };
