require("dotenv").config();

const exec = require("child_process").exec;
const http = require("http");
const { PORT, ENVIRONMENT } = require("./src/config/app.config");
const {
  executeRestoreGit,
  gitPullFromSource,
  gitPushToTarget,
} = require("./src/services/git.service");
const { logger } = require("./src/utils/logger.utils");

const initRepo = () =>
  new Promise((resolve, reject) => {
    const buildProcess = exec(`npm run build`);

    buildProcess.stdout.on("data", (data) => {
      logger.info(data);
    });

    buildProcess.stderr.on("data", (error) => {
      reject(error);
    });

    buildProcess.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Build process exited with code: ${code}`);
      }
    });
  });

(async () => {
  if (ENVIRONMENT === "PROD") {
    try {
      await initRepo();
    } catch (error) {
      logger.error(error);
    }
  }

  http
    .createServer(async (req, res) => {
      try {
        res.writeHead(200, { "Content-Type": "text/plain" });

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
})();
