module.exports.PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

module.exports.SOURCE_REPO_URL = process.env.SOURCE_REPO_URL;
module.exports.TARGET_REPO_URL = process.env.TARGET_REPO_URL;

module.exports.SOURCE_BRANCH = process.env.SOURCE_BRANCH;
module.exports.TARGET_BRANCH = process.env.TARGET_BRANCH;

module.exports.SOURCE_GIT_USERNAME = process.env.SOURCE_GIT_USERNAME;
module.exports.SOURCE_GIT_PASSWORD = process.env.SOURCE_GIT_PASSWORD;

module.exports.TARGET_GIT_USERNAME = process.env.TARGET_GIT_USERNAME;
module.exports.TARGET_GIT_PASSWORD = process.env.TARGET_GIT_PASSWORD;
