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

const initRepositories = async (initLocalRepo = false) => {
  for (let i = 0; i < SOURCE_REPO_URL.split(",").length; i++) {
    const sourceRepoUrl = SOURCE_REPO_URL.split(",")[i];
    const sourceGitUsername = SOURCE_GIT_USERNAME.split(",")[i];
    const sourceGitPassword = SOURCE_GIT_PASSWORD.split(",")[i];

    const targetRepoUrl = TARGET_REPO_URL.split(",")[i];
    const targetGitUsername = TARGET_GIT_USERNAME.split(",")[i];
    const targetGitPassword = TARGET_GIT_PASSWORD.split(",")[i];

    const repo = new GitRepository(
      sourceRepoUrl,
      sourceGitUsername,
      sourceGitPassword,
      targetRepoUrl,
      targetGitUsername,
      targetGitPassword
    );

    if (initLocalRepo) {
      await repo.initLocalRepo();
    }

    await repo.initGit();

    repositories[i] = repo;
  }
};

const getRepositories = () => {
  return repositories;
};

const getRepoBySourceUrl = (url) =>
  getRepositories().filter((repo) => repo.sourceRepoUrl === url)[0];

module.exports = { initRepositories, getRepositories, getRepoBySourceUrl };
