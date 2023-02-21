const exec = require("child_process").exec;

const { logger } = require("../utils/logger.util");
const {
  SOURCE_REPO_URL,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_REPO_URL,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
} = require("../config/git.config");
const GitRepository = require("../models/git-repository.model");

const getRepositories = () => {
  const repos = [];

  SOURCE_REPO_URL.split(",").forEach((sourceRepoUrl, index) => {
    const sourceGitUsername = SOURCE_GIT_USERNAME.split(",")[index];
    const sourceGitPassword = SOURCE_GIT_PASSWORD.split(",")[index];

    const targetRepoUrl = TARGET_REPO_URL.split(",")[index];
    const targetGitUsername = TARGET_GIT_USERNAME.split(",")[index];
    const targetGitPassword = TARGET_GIT_PASSWORD.split(",")[index];

    const repo = new GitRepository(
      sourceRepoUrl,
      sourceGitUsername,
      sourceGitPassword,
      targetRepoUrl,
      targetGitUsername,
      targetGitPassword
    );

    repos.push(repo);
  });

  return repos;
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

const getRepoBySourceUrl = (url) =>
  getRepositories().filter((repo) => repo.sourceRepoUrl === url)[0];

module.exports = { initRepo, getRepositories, getRepoBySourceUrl };
