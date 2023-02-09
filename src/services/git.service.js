const exec = require("child_process").exec;
const simpleGit = require("simple-git");
const gitConfig = require("../config/git.config");
const gitUtils = require("../utils/git.util");
const { logger } = require("../utils/logger.util");
const git = simpleGit(gitConfig.REPOSITORY_DIR_PATH);

const switchBranch = async (branch) => {
  const localBranchExists = await isBranchExistInLocal(branch);

  if (localBranchExists) {
    logger.info(`Branch "${branch}" exists in local`);
    await git.checkout(branch);
  } else {
    logger.info(`Branch "${branch}" does not exist in local, creating it`);
    await git.checkoutLocalBranch(branch);
    logger.info(`Branch "${branch}" successfully created`);
  }

  logger.info(`Using branch "${branch}" for the following git actions`);
};

const discardAndResetRepo = async (branch) => {
  await switchBranch(branch);

  await gitUtils.runGitCommand("git clean -f");
  await gitUtils.runGitCommand("git reset --hard");
};

const isBranchExistInLocal = async (branch) => {
  const localBranches = await git.branchLocal();

  const isExist = localBranches.all.includes(branch);

  return isExist;
};

const gitPushToTarget = async (branch) => {
  const targetRemote = gitUtils.generateOriginUrlWithCreds(
    gitConfig.TARGET_GIT_USERNAME,
    gitConfig.TARGET_GIT_PASSWORD,
    gitConfig.TARGET_REPO_URL
  );

  const pushResult = await git.push(targetRemote, branch, {
    "--force": null,
  });

  logger.debug(JSON.stringify(pushResult));
};

const initRepo = () =>
  new Promise((resolve, reject) => {
    const buildProcess = exec(`npm run build`);

    buildProcess.stdout.on("data", (data) => {
      logger.debug(data);
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

const gitFetchFromSource = async (branch) => {
  const sourceRemote = gitUtils.generateOriginUrlWithCreds(
    gitConfig.SOURCE_GIT_USERNAME,
    gitConfig.SOURCE_GIT_PASSWORD,
    gitConfig.SOURCE_REPO_URL
  );

  const fetchResult = await gitUtils.runGitCommand(
    `git fetch ${sourceRemote} ${branch}`
  );
  logger.debug(fetchResult);

  const resetHard = await gitUtils.runGitCommand(`git reset --hard FETCH_HEAD`);
  logger.debug(resetHard);
};

module.exports.discardAndResetRepo = discardAndResetRepo;
module.exports.switchBranch = switchBranch;
module.exports.gitPushToTarget = gitPushToTarget;
module.exports.initRepo = initRepo;
module.exports.gitFetchFromSource = gitFetchFromSource;
