const path = require("path");
const {
  SOURCE_REPO_URL,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_REPO_URL,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
  REPOSITORY_DIR_PATH,
} = require("../config/git.config");

const exec = require("child_process").exec;

const runGitCommand = (command, useCwd = true) =>
  new Promise((resolve, reject) => {
    exec(
      `${command} 2>&1`,
      { cwd: useCwd ? "repo" : null },
      (error, stdout, stderr) => {
        if (error) {
          reject(`${error} \nstderr: ${stderr} \nstdout: ${stdout}`);
        }
        resolve(stdout);
      }
    );
  });

const generateOriginUrlWithCreds = (gitUsername, gitPassowrd, repoUrl) =>
  `https://${gitUsername}:${gitPassowrd}@${repoUrl}`;

const getBranchName = (body) => {
  const { ref } = body;

  const branchIndex = ref.indexOf("heads/") + "heads/".length;
  const branchName = ref.substring(branchIndex);

  return branchName;
};

const getRepoLocalDirectory = (sourceRepoUrl, targetRepoUrl) =>
  path.join(
    REPOSITORY_DIR_PATH,
    `${sourceRepoUrl.replace(/\//g, "-")}_${targetRepoUrl.replace(/\//g, "-")}`
  );

const getReposInfo = () => {
  const repos = [];

  SOURCE_REPO_URL.split(",").forEach((sourceRepoUrl, index) => {
    const sourceGitUsername = SOURCE_GIT_USERNAME.split(",")[index];
    const sourceGitPassword = SOURCE_GIT_PASSWORD.split(",")[index];

    const targetRepoUrl = TARGET_REPO_URL.split(",")[index];
    const targetGitUsername = TARGET_GIT_USERNAME.split(",")[index];
    const targetGitPassword = TARGET_GIT_PASSWORD.split(",")[index];

    const repo = {
      localRepoDirectoryName: getRepoLocalDirectory(
        sourceRepoUrl,
        TARGET_REPO_URL.split(",")[index]
      ),

      sourceRepoUrl,
      sourceGitUsername,
      sourceGitPassword,
      sourceOriginUrlWithCreds: generateOriginUrlWithCreds(
        sourceGitUsername,
        sourceGitPassword,
        sourceRepoUrl
      ),

      targetRepoUrl,
      targetGitUsername,
      targetGitPassword,
      sourceOriginUrlWithCreds: generateOriginUrlWithCreds(
        targetGitUsername,
        targetGitPassword,
        targetRepoUrl
      ),
    };

    repos.push(repo);
  });

  return repos;
};

module.exports = {
  runGitCommand,
  generateOriginUrlWithCreds,
  getBranchName,
  getReposInfo,
  getRepoLocalDirectory,
};
