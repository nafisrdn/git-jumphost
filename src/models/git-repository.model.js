const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");

const gitConfig = require("../config/git.config");
const httpUtil = require("../utils/http.util");
const gitUtil = require("../utils/git.util");
const { logger } = require("../utils/logger.util");

class GitRepository {
  constructor(
    sourceRepoUrl,
    sourceGitUsername,
    sourceGitPassword,
    targetRepoUrl,
    targetGitUsername,
    targetGitPassword
  ) {
    this.sourceRepoUrl = sourceRepoUrl;
    this.sourceGitUsername = sourceGitUsername;
    this.sourceGitPassword = sourceGitPassword;

    this.targetRepoUrl = targetRepoUrl;
    this.targetGitUsername = targetGitUsername;
    this.targetGitPassword = targetGitPassword;
  }

  async initGit() {
    simpleGit().clean(simpleGit.CleanOptions.FORCE);

    const options = {
      baseDir: this.getRepoLocalDirectory(),
      binary: "git",
      trimmed: false,
    };

    this.git = simpleGit(options);
  }

  async initLocalRepo() {
    await this.removeLocalDirectory();
    await this.createLocalRepoDirectory();

    await this.initGit();

    const cloneResult = await this.git.clone(
      this.getOriginUrlWithCreds("source"),
      "."
    );

    logger.info(cloneResult);
  }

  async createLocalRepoDirectory() {
    logger.debug(
      `Creating empty directory for local repository: ${this.getRepoLocalDirectory()}`
    );

    await fs.promises.mkdir(this.getRepoLocalDirectory(), {
      recursive: true,
    });

    logger.info(
      `Created empty directory for local repository: ${this.getRepoLocalDirectory()}`
    );
  }

  async removeLocalDirectory() {
    logger.debug(
      `Removing existing local repository from ${this.getRepoLocalDirectory()}`
    );

    await fs.promises.rm(this.getRepoLocalDirectory(), {
      recursive: true,
      force: true,
    });

    logger.info(
      `Local repository ${this.getRepoLocalDirectory()} removal successful`
    );
  }

  getRepoLocalDirectory() {
    return path.join(
      gitConfig.REPOSITORY_DIR_PATH,
      `${httpUtil
        .removeUrlProtocol(this.sourceRepoUrl)
        .replace(/\//g, "-")}_${httpUtil
        .removeUrlProtocol(this.targetRepoUrl)
        .replace(/\//g, "-")}`
    );
  }

  getOriginUrlWithCreds(alias) {
    if (alias === "source") {
      return gitUtil.generateOriginUrlWithCreds(
        this.sourceGitUsername,
        this.sourceGitPassword,
        this.sourceRepoUrl
      );
    } else {
      return gitUtil.generateOriginUrlWithCreds(
        this.targetGitUsername,
        this.targetGitPassword,
        this.targetRepoUrl
      );
    }
  }

  async isBranchExistInLocal(branch) {
    const localBranches = await this.git.branchLocal();

    const isExist = localBranches.all.includes(branch);

    return isExist;
  }

  async switchBranch(branch) {
    const localBranchExists = await this.isBranchExistInLocal(branch);

    if (localBranchExists) {
      logger.info(`Branch "${branch}" exists in local`);
      await this.git.checkout(branch);
    } else {
      logger.info(`Branch "${branch}" does not exist in local, creating it`);
      await this.git.checkoutLocalBranch(branch);
      logger.info(`Branch "${branch}" successfully created`);
    }

    logger.info(`Using branch "${branch}" for the following git actions`);
  }

  async discardAndResetRepo(branch) {
    await this.switchBranch(branch);

    await gitUtil.runGitCommand("git clean -f", this.getRepoLocalDirectory());
    await gitUtil.runGitCommand(
      "git reset --hard",
      this.getRepoLocalDirectory()
    );
  }

  async gitPushToTarget(branch) {
    const targetOriginUrl = this.getOriginUrlWithCreds("target");

    const pushResult = await this.git.push(targetOriginUrl, branch, {
      "--force": null,
    });

    logger.debug(JSON.stringify(pushResult));
  }

  async gitFetchFromSource(branch) {
    const fetchResult = await gitUtil.runGitCommand(
      `git fetch ${this.getOriginUrlWithCreds("source")} ${branch}`,
      this.getRepoLocalDirectory()
    );

    logger.debug(fetchResult);

    const resetHard = await gitUtil.runGitCommand(
      `git reset --hard FETCH_HEAD`,
      this.getRepoLocalDirectory()
    );

    logger.debug(resetHard);
  }
}

module.exports = GitRepository;
