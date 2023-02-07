require("dotenv").config();

const path = require("path");
const fs = require("fs");

const {
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  SOURCE_REPO_URL,
} = require("../config/app.config");
const { generateOriginUrlWithCreds } = require("../services/git.service");
const { logger } = require("../utils/logger.utils");

const { simpleGit, CleanOptions } = require("simple-git");
simpleGit().clean(CleanOptions.FORCE);

const repoDirPath = path.join(__dirname, "../../repo");

const createRepoDirectory = async () => {
  logger.info(
    `Creating empty directory for local repository in ${repoDirPath}`
  );

  await fs.promises.mkdir(repoDirPath);

  logger.info(`Created empty directory for local repository`);
};

const replaceDirectoryIfExist = async () => {
  const isDirectoryExist = fs.existsSync(repoDirPath);

  if (isDirectoryExist) {
    logger.info(`Removing existing local repository from ${repoDirPath}`);
    await fs.promises.rm(repoDirPath, { recursive: true, force: true });
    logger.info(`Local repository removal successful`);
  }
};

const cloneRepo = async () => {
  await replaceDirectoryIfExist();
  await createRepoDirectory();

  const git = simpleGit(repoDirPath);

  const sourceRemote = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const cloneResult = await git.clone(sourceRemote, "./repo");

  return cloneResult;
};

(async () => {
  try {
    logger.info(await cloneRepo());
    logger.info("Repository cloning successful");
  } catch (error) {
    logger.error(error);
  }
})();
