const exec = require("child_process").exec;

const {
  SOURCE_REPO_URL,
  SOURCE_BRANCH,
  TARGET_REPO_URL,
  TARGET_BRANCH,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
} = require("../config/app.config");

const runGitCommand = (command, useCwd = true) =>
  new Promise((resolve, reject) => {
    exec(
      `${command} 2>&1`,
      { cwd: useCwd ? "repo" : null },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            `${error} \nstderr: ${stderr} \nstdout: ${stdout}`
          );
        }
        resolve(stdout);
      }
    );
  });

const generateOriginUrlWithCreds = (gitUsername, gitPassowrd, repoUrl) =>
  `https://${gitUsername}:${gitPassowrd}@${repoUrl}`;

const gitPullFromSource = async () => {
  const generatedUrl = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const pullCommand = `git pull ${generatedUrl} ${SOURCE_BRANCH}`;
  const pullResult = await runGitCommand(pullCommand);
  console.log(pullResult);
};

const executeRestoreGit = async () => {
  const restoreCommand = `git checkout .`;
  const restoreResult = await runGitCommand(restoreCommand);
  console.log(restoreResult);
};

const gitPushToTarget = async () => {
  const generatedUrl = generateOriginUrlWithCreds(
    TARGET_GIT_USERNAME,
    TARGET_GIT_PASSWORD,
    TARGET_REPO_URL
  );

  const pushCommand = `git push --force ${generatedUrl} ${TARGET_BRANCH}`;
  const pushResult = await runGitCommand(pushCommand);
  console.log(pushResult);
};

module.exports.runGitCommand = runGitCommand;
module.exports.executeRestoreGit = executeRestoreGit;
module.exports.generateOriginUrlWithCreds = generateOriginUrlWithCreds;
module.exports.gitPullFromSource = gitPullFromSource;
module.exports.executeRestoreGit = executeRestoreGit;
module.exports.gitPushToTarget = gitPushToTarget;
