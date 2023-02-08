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
const { getRequestBody } = require("./src/utils/http.utils");
const { getBranchName } = require("./src/utils/git.utils");

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
    const body = await getRequestBody(req);
    const branch = getBranchName(body);

    res.writeHead(200, { "Content-Type": "text/plain" });
    logger.info(`Branch: ${branch}`);

    const discardStartMessage = "Discarding local changes";
    const discardEndMessage = "Local changes discarded";

    await executeAndLog(
      async () => {
        await discardLocalChanges(branch);
      },
      discardStartMessage,
      discardEndMessage
    );

    await executeAndLog(
      async () => {
        await gitPullFromSource(branch);
      },
      "Pulling from source",
      "Pull successful"
    );

    await executeAndLog(
      async () => {
        await discardLocalChanges(branch);
      },
      discardStartMessage,
      discardEndMessage
    );

    await executeAndLog(
      async () => {
        await gitPushToTarget(branch);
      },
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
