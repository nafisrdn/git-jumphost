const {
  SOURCE_REPO_URL,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_REPO_URL,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
} = require("../config/git.config");
const GitRepository = require("../models/git-repository.model");

let repositories = [];

const initRepositories = (initLocalRepo = false) => {
  SOURCE_REPO_URL.split(",").forEach(async (sourceRepoUrl, index) => {
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

    if (initLocalRepo) await repo.initLocalRepo();

    await repo.initGit();

    repositories[index] = repo;
  });
};

const getRepositories = () => {
  return repositories;
};

const getRepoBySourceUrl = (url) =>
  getRepositories().filter((repo) => repo.sourceRepoUrl === url)[0];

module.exports = { initRepositories, getRepositories, getRepoBySourceUrl };
