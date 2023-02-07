const exec = require("child_process").exec;
const path = require("path");
const { default: simpleGit } = require("simple-git");
const {
  SOURCE_REPO_URL,
  SOURCE_BRANCH,
  TARGET_REPO_URL,
  TARGET_BRANCH,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
  REPOSITORY_DIR_PATH,
} = require("../config/app.config");
const {
  runGitCommand,
  generateOriginUrlWithCreds,
} = require("../utils/git.utils");
const { logger } = require("../utils/logger.utils");
const git = simpleGit(REPOSITORY_DIR_PATH);

const gitPullFromSource = async () => {
  const sourceRemote = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const pullResult = await git.pull(sourceRemote, SOURCE_BRANCH);

  logger.info(JSON.stringify(pullResult));
};

const discardLocalChanges = async () => {
  const checkoutResult = await git.checkout();

  logger.info(checkoutResult);
};

const gitPushToTarget = async () => {
  const targetRemote = generateOriginUrlWithCreds(
    TARGET_GIT_USERNAME,
    TARGET_GIT_PASSWORD,
    TARGET_REPO_URL
  );

  const pushResult = await git.push(targetRemote, TARGET_BRANCH, {
    "--force": null,
  });

  logger.info(JSON.stringify(pushResult));
};

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

module.exports.discardLocalChanges = discardLocalChanges;
module.exports.generateOriginUrlWithCreds = generateOriginUrlWithCreds;
module.exports.gitPullFromSource = gitPullFromSource;
module.exports.gitPushToTarget = gitPushToTarget;
module.exports.initRepo = initRepo;
