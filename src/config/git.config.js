const path = require("path");

module.exports.SOURCE_REPO_URL = process.env.SOURCE_REPO_URL;
module.exports.TARGET_REPO_URL = process.env.TARGET_REPO_URL;

module.exports.SOURCE_GIT_USERNAME = process.env.SOURCE_GIT_USERNAME;
module.exports.SOURCE_GIT_PASSWORD = process.env.SOURCE_GIT_PASSWORD;

module.exports.TARGET_GIT_USERNAME = process.env.TARGET_GIT_USERNAME;
module.exports.TARGET_GIT_PASSWORD = process.env.TARGET_GIT_PASSWORD;

module.exports.WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

module.exports.REPOSITORY_DIR_PATH = path.join(__dirname, "../../repo");