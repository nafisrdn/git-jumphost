require("dotenv").config();

const fs = require("fs");

const {
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  SOURCE_REPO_URL,
  REPOSITORY_DIR_PATH,
} = require("../config/app.config");
const { logger } = require("../utils/logger.utils");
const { generateOriginUrlWithCreds } = require("../utils/git.utils");
const { simpleGit, CleanOptions } = require("simple-git");
simpleGit().clean(CleanOptions.FORCE);

const createRepoDirectory = async () => {
  logger.info(
    `Creating empty directory for local repository in ${REPOSITORY_DIR_PATH}`
  );

  await fs.promises.mkdir(REPOSITORY_DIR_PATH);

  logger.info(`Created empty directory for local repository`);
};

const replaceDirectoryIfExist = async () => {
  const isDirectoryExist = fs.existsSync(REPOSITORY_DIR_PATH);

  if (isDirectoryExist) {
    logger.info(
      `Removing existing local repository from ${REPOSITORY_DIR_PATH}`
    );
    await fs.promises.rm(REPOSITORY_DIR_PATH, { recursive: true, force: true });
    logger.info(`Local repository removal successful`);
  }
};

const cloneRepo = async () => {
  await replaceDirectoryIfExist();
  await createRepoDirectory();

  const git = simpleGit(REPOSITORY_DIR_PATH);

  const sourceRemote = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const cloneResult = await git.clone(sourceRemote, ".");

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
