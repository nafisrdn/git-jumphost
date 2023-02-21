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

const discardAndResetRepo = (repo, branch) =>
  commonUtils.executeWithLogging(
    async () => {
      await repo.discardAndResetRepo(branch);
    },
    `Discarding and resetting local changes for ${repo.sourceRepoUrl} - ${branch}`,
    `Local changes discarded and resetted for ${repo.sourceRepoUrl} - ${branch}`
  );

const gitPushToTarget = (repo, branch) =>
  commonUtils.executeWithLogging(
    async () => {
      await repo.gitPushToTarget(branch);
    },
    `Pushing to target for ${repo.sourceRepoUrl} - ${branch}`,
    `Push successful for ${repo.sourceRepoUrl} - ${branch}`
  );

const gitFetchFromSource = (repo, branch) =>
  commonUtils.executeWithLogging(
    async () => {
      await repo.gitFetchFromSource(branch);
    },
    `Fetching from source for ${repo.sourceRepoUrl} - ${branch}`,
    `Fetch successful`
  );

const handleGitFlow = async (repo, branch) => {
  await discardAndResetRepo(repo, branch);
  await gitFetchFromSource(repo, branch);
  await gitPushToTarget(repo, branch);
};

const handleRequest = async (req, res) => {
  try {
    validateWebhookToken(req);
    const body = await httpUtils.getRequestBody(req);
    const branch = gitUtils.getBranchName(body);
    const repo = gitService.getRepoBySourceUrl(body.repository.git_http_url);

    await handleGitFlow(repo, branch);

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("ok");
  } catch (error) {
    res.writeHead(400);
    logger.error(error);
  }
  res.end();
};

const startServer = () => {
  http.createServer(handleRequest).listen(appConfig.PORT, () => {
    logger.info(`Jumphost version ${appConfig.VERSION}`);
    logger.info(`Server is listening on port ${appConfig.PORT}`);
  });
};

(async () => {
  try {
    startServer();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
