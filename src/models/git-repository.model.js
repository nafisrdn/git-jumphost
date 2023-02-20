const path = require("path");
const { REPOSITORY_DIR_PATH } = require("../config/git.config");
const { generateOriginUrlWithCreds } = require("../utils/git.util");
const { removeUrlProtocol } = require("../utils/http.util");

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

  getRepoLocalDirectory() {
    return path.join(
      REPOSITORY_DIR_PATH,
      `${removeUrlProtocol(this.sourceRepoUrl).replace(
        /\//g,
        "-"
      )}_${removeUrlProtocol(this.targetRepoUrl).replace(/\//g, "-")}`
    );
  }

  getSourceOriginUrlWithCreds() {
    return generateOriginUrlWithCreds(
      this.sourceGitUsername,
      this.sourceGitPassword,
      this.sourceRepoUrl
    );
  }

  getTargetOriginUrlWithCreds() {
    return generateOriginUrlWithCreds(
      this.targetGitUsername,
      this.targetGitPassword,
      this.targetRepoUrl
    );
  }
}

module.exports = GitRepository;
