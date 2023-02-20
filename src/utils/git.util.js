const {
  SOURCE_REPO_URL,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_REPO_URL,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
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
  `${sourceRepoUrl.replace(/\//g, "-")}_${targetRepoUrl.replace(/\//g, "-")}`;

const getReposInfo = () => {
  const repos = [];

  SOURCE_REPO_URL.split(",").forEach((sourceRepoUrl, index) => {
    const repo = {
      localRepoDirectoryName: getRepoLocalDirectory(
        sourceRepoUrl,
        TARGET_REPO_URL.split(",")[index]
      ),
      sourceRepoUrl,
      sourceGitUsername: SOURCE_GIT_USERNAME.split(",")[index],
      sourceGitPassword: SOURCE_GIT_PASSWORD.split(",")[index],

      targetRepoUrl: TARGET_REPO_URL.split(",")[index],
      targetGitUsername: TARGET_GIT_USERNAME.split(",")[index],
      targetGitPassword: TARGET_GIT_PASSWORD.split(",")[index],
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
