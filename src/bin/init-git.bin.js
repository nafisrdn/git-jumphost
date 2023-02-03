require("dotenv").config();

const path = require("path");
const fs = require("fs");

const {
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  SOURCE_REPO_URL,
} = require("../config/app.config");
const {
  generateOriginUrlWithCreds,
  runGitCommand,
} = require("../services/git.service");
const { logger } = require("../utils/logger.utils");

const repoDirPath = path.join(__dirname, "../../repo");

const cloneRepo = async () => {
  const isDirectoryExist = fs.existsSync(repoDirPath);

  if (isDirectoryExist) {
    logger.info(`Removing existing local repository from ${repoDirPath}`);
    fs.rmSync(repoDirPath, { recursive: true, force: true });
    logger.info(`Removing successful`);
  }

  const generatedUrl = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const repoDirectory = repoDirPath;

  const cloneCommand = `git clone ${generatedUrl} ${repoDirectory}`;

  const clonseResult = await runGitCommand(cloneCommand, false);

  return clonseResult;
};

(async () => {
  logger.info(await cloneRepo());
  logger.info("Cloning successful");
})();
