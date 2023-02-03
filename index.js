require("dotenv").config();

const http = require("http");
const { PORT, ENVIRONMENT, WEBHOOK_TOKEN } = require("./src/config/app.config");
const {
  executeRestoreGit,
  gitPullFromSource,
  gitPushToTarget,
  initRepo,
} = require("./src/services/git.service");
const { logger } = require("./src/utils/logger.utils");

(async () => {
  try {
    if (ENVIRONMENT === "PROD") {
      await initRepo();
    }

    http
      .createServer(async (req, res) => {
        try {
          res.writeHead(200, { "Content-Type": "text/plain" });

          const webhookToken = req.headers["x-gitlab-token"];

          if (!webhookToken || webhookToken !== WEBHOOK_TOKEN) {
            throw new Error("invalid webhook token");
          }

          logger.info("Discarding local changes");
          await executeRestoreGit();
          logger.info("Local changes discarded");

          logger.info("Pulling from source");
          await gitPullFromSource();
          logger.info("Pull successful");

          logger.info("Discarding local changes");
          await executeRestoreGit();
          logger.info("Local changes discarded");

          logger.info("Pushing to target");
          await gitPushToTarget();
          logger.info("Push successful");

          res.write("ok");
        } catch (error) {
          res.writeHead(500, { "Content-Type": "text/plain" });

          logger.error(error);
        }

        res.end();
      })
      .listen(PORT, () => {
        logger.info(`Server is listening on port ${PORT}`);
      });
  } catch (error) {
    logger.error(error);
  }
})();
