const { logger } = require("./logger.utils");

module.exports.executeWithLogging = async (func, startMessage, endMessage) => {
  logger.info(startMessage);
  await func();
  logger.info(endMessage);
};
