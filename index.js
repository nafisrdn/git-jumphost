require("dotenv").config();

const http = require("http");
const { PORT, ENVIRONMENT, WEBHOOK_TOKEN } = require("./src/config/app.config");
const gitService = require("./src/services/git.service");
const httpUtils = require("./src/utils/http.utils");
const gitUtils = require("./src/utils/git.utils");
const commonUtils = require("./src/utils/common.utils");
const { logger } = require("./src/utils/logger.utils");

const validateWebhookToken = (req) => {
  const webhookToken = req.headers["x-gitlab-token"];
  if (!webhookToken || webhookToken !== WEBHOOK_TOKEN) {
    throw new Error("Invalid webhook token");
  }
};

const handleGitFlow = async (branch) => {
  await commonUtils.executeWithLogging(
    async () => {
      await gitService.discardAndResetRepo(branch);
    },
    `Discarding and resetting local changes for ${branch} branch`,
    `Local changes discarded and resetted for ${branch} branch`
  );

  await commonUtils.executeWithLogging(
    async () => {
      await gitService.gitPullFromSource(branch);
    },
    `Pulling from source for ${branch} branch`,
    `Pull successful for ${branch} branch`
  );

  await commonUtils.executeWithLogging(
    async () => {
      await gitService.discardAndResetRepo(branch);
    },
    `Discarding and resetting local changes for ${branch} branch`,
    `Local changes discarded and resetted for ${branch} branch`
  );

  await commonUtils.executeWithLogging(
    async () => {
      await gitService.gitPushToTarget(branch);
    },
    `Pushing to target for ${branch} branch`,
    `Push successful for ${branch} branch`
  );
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
      await gitService.initRepo();
    }
    startServer();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
