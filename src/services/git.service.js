const exec = require("child_process").exec;

const {
  SOURCE_REPO_URL,
  SOURCE_BRANCH,
  TARGET_REPO_URL,
  TARGET_BRANCH,
} = require("../config/app.config");

const runGitCommand = (command) =>
  new Promise((resolve, reject) => {
    exec(command, { cwd: "repo" }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ stdout, stderr });
    });
  });

const gitPullFromSource = async () => {
  const pullCommand = `git pull ${SOURCE_REPO_URL} ${SOURCE_BRANCH}`;
  const pullResult = await runGitCommand(pullCommand);
  console.log(pullResult);
};

const executeRestoreGit = async () => {
  const restoreCommand = `git checkout .`;
  const restoreResult = await runGitCommand(restoreCommand);
  console.log(restoreResult);
};

const gitPushToTarget = async () => {
  const pushCommand = `git push ${TARGET_REPO_URL} ${TARGET_BRANCH}`;
  const pushResult = await runGitCommand(pushCommand);
  console.log(pushResult);
};

module.exports.executeRestoreGit = executeRestoreGit;
module.exports.gitPullFromSource = gitPullFromSource;
module.exports.executeRestoreGit = executeRestoreGit;
module.exports.gitPushToTarget = gitPushToTarget;
