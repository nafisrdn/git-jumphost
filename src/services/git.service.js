const exec = require("child_process").exec;
const { default: simpleGit } = require("simple-git");
const {
  SOURCE_REPO_URL,
  TARGET_REPO_URL,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
  REPOSITORY_DIR_PATH,
} = require("../config/app.config");
const {
  generateOriginUrlWithCreds,
  runGitCommand,
} = require("../utils/git.utils");
const { logger } = require("../utils/logger.utils");
const git = simpleGit(REPOSITORY_DIR_PATH);

const gitPullFromSource = async (branch) => {
  const sourceRemote = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const pullResult = await git.pull(sourceRemote, branch);

  logger.info(JSON.stringify(pullResult));
};

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
};

const discardAndResetRepo = async (branch) => {
  const sourceRemote = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  await switchBranch(branch)

  await runGitCommand("git clean -f");
  await runGitCommand("git reset --hard");

  await runGitCommand(`git fetch ${sourceRemote} ${branch}`);
  await runGitCommand(`git reset --hard FETCH_HEAD`);
};

const isBranchExistInLocal = async (branch) => {
  const localBranches = await git.branchLocal();

  const isExist = localBranches.all.includes(branch);

  return isExist;
};

const gitPushToTarget = async (branch) => {
  const targetRemote = generateOriginUrlWithCreds(
    TARGET_GIT_USERNAME,
    TARGET_GIT_PASSWORD,
    TARGET_REPO_URL
  );

  const pushResult = await git.push(targetRemote, branch, {
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

module.exports.discardAndResetRepo = discardAndResetRepo;
module.exports.switchBranch = switchBranch;
module.exports.gitPullFromSource = gitPullFromSource;
module.exports.gitPushToTarget = gitPushToTarget;
module.exports.initRepo = initRepo;
