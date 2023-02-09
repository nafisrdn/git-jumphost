require("dotenv").config();

const http = require("http");
const appConfig = require("./src/config/app.config");
const gitConfig = require("./src/config/git.config");
const gitService = require("./src/services/git.service");
const httpUtils = require("./src/utils/http.util");
const gitUtils = require("./src/utils/git.util");
const commonUtils = require("./src/utils/common.util");
const { logger } = require("./src/utils/logger.util");

const validateWebhookToken = (req) => {
  const webhookToken = req.headers["x-gitlab-token"];
  if (!webhookToken || webhookToken !== gitConfig.WEBHOOK_TOKEN) {
    throw new Error("Invalid webhook token");
  }
};

const discardAndResetRepo = (branch) =>
  commonUtils.executeWithLogging(
    async () => {
      await gitService.discardAndResetRepo(branch);
    },
    `Discarding and resetting local changes for ${branch} branch`,
    `Local changes discarded and resetted for ${branch} branch`
  );

const gitPullFromSource = (branch) =>
  commonUtils.executeWithLogging(
    async () => {
      await gitService.gitPullFromSource(branch);
    },
    `Pulling from source for ${branch} branch`,
    `Pull successful for ${branch} branch`
  );

const gitPushToTarget = (branch) =>
  commonUtils.executeWithLogging(
    async () => {
      await gitService.gitPushToTarget(branch);
    },
    `Pushing to target for ${branch} branch`,
    `Push successful for ${branch} branch`
  );

const handleGitFlow = async (branch) => {
  await discardAndResetRepo(branch);
  await gitPullFromSource(branch);
  await discardAndResetRepo(branch);
  await gitPushToTarget(branch);
};

const handleRequest = async (req, res) => {
  try {
    validateWebhookToken(req);
    const body = await httpUtils.getRequestBody(req);
    const branch = gitUtils.getBranchName(body);

    await handleGitFlow(branch);

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("ok");
  } catch (error) {
    res.writeHead(500);
    logger.error(error);
  }
  res.end();
};

const startServer = () => {
  http.createServer(handleRequest).listen(appConfig.PORT, () => {
    logger.info("Jumphost version 1.2");
    logger.info(`Server is listening on port ${appConfig.PORT}`);
  });
};

(async () => {
  try {
    if (appConfig.ENVIRONMENT === "PROD") {
      await gitService.initRepo();
    }

    startServer();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
