require("dotenv").config();

const http = require("http");
const { PORT, ENVIRONMENT, WEBHOOK_TOKEN } = require("./src/config/app.config");
const {
  discardLocalChanges,
  gitPullFromSource,
  gitPushToTarget,
  initRepo,
} = require("./src/services/git.service");
const { logger } = require("./src/utils/logger.utils");

const executeAndLog = async (func, startMessage, endMessage) => {
  logger.info(startMessage);
  await func();
  logger.info(endMessage);
};

const validateWebhookToken = (req) => {
  const webhookToken = req.headers["x-gitlab-token"];
  if (!webhookToken || webhookToken !== WEBHOOK_TOKEN) {
    throw new Error("invalid webhook token");
  }
};

const handleRequest = async (req, res) => {
  try {
    validateWebhookToken(req);
    res.writeHead(200, { "Content-Type": "text/plain" });

    const discardStartMessage = "Discarding local changes";
    const discardEndMessage = "Local changes discarded";

    await executeAndLog(
      discardLocalChanges,
      discardStartMessage,
      discardEndMessage
    );

    await executeAndLog(
      gitPullFromSource,
      "Pulling from source",
      "Pull successful"
    );

    await executeAndLog(
      discardLocalChanges,
      discardStartMessage,
      discardEndMessage
    );

    await executeAndLog(
      gitPushToTarget,
      "Pushing to target",
      "Push successful"
    );

    res.write("ok");
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    logger.error(error);
  }
  res.end();
};

const startServer = () => {
  http.createServer(handleRequest).listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
  });
};

(async () => {
  try {
    if (ENVIRONMENT === "PROD") {
      await initRepo();
    }

    startServer();
  } catch (error) {
    logger.error(error);
  }
})();
