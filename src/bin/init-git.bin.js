require("dotenv").config();

const fs = require("fs");

const { REPOSITORY_DIR_PATH } = require("../config/git.config");
const { logger } = require("../utils/logger.util");
const gitService = require("../services/git.service");
const { simpleGit, CleanOptions } = require("simple-git");

simpleGit().clean(CleanOptions.FORCE);

const createRepoDirectory = async () => {
  const repos = gitService.getRepositories();

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];

    logger.debug(
      `Creating empty directory for local repository: ${repo.localRepoDirectoryName}`
    );

    await fs.promises.mkdir(repo.localRepoDirectoryName, { recursive: true });

    logger.info(
      `Created empty directory for local repository: ${repo.localRepoDirectoryName}`
    );
  }
};

const replaceDirectoryIfExist = async () => {
  const isDirectoryExist = fs.existsSync(REPOSITORY_DIR_PATH);

  if (isDirectoryExist) {
    logger.debug(
      `Removing existing local repository from ${REPOSITORY_DIR_PATH}`
    );
    await fs.promises.rm(REPOSITORY_DIR_PATH, { recursive: true, force: true });
    logger.info(`Local repository removal successful`);
  }
};

const cloneRepo = async () => {
  await replaceDirectoryIfExist();
  await createRepoDirectory();

  const repos = gitService.getRepositories();

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];

    const git = simpleGit(repo.localRepoDirectoryName);

    const cloneResult = await git.clone(repo.sourceOriginUrlWithCreds, ".");

    logger.info(cloneResult);
  }
};

(async () => {
  try {
    logger.info(await cloneRepo());
    logger.info("Repository cloning successful");
  } catch (error) {
    logger.error(error);
  }
})();
