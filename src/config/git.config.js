const path = require("path");

const SOURCE_REPO_URL = process.env.SOURCE_REPO_URL;
const TARGET_REPO_URL = process.env.TARGET_REPO_URL;

const SOURCE_GIT_USERNAME = process.env.SOURCE_GIT_USERNAME;
const SOURCE_GIT_PASSWORD = process.env.SOURCE_GIT_PASSWORD;

const TARGET_GIT_USERNAME = process.env.TARGET_GIT_USERNAME;
const TARGET_GIT_PASSWORD = process.env.TARGET_GIT_PASSWORD;

const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

const REPOSITORY_DIR_PATH = path.join(__dirname, "../../repo");

module.exports = {
  SOURCE_REPO_URL,
  TARGET_REPO_URL,
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  TARGET_GIT_USERNAME,
  TARGET_GIT_PASSWORD,
  WEBHOOK_TOKEN,
  REPOSITORY_DIR_PATH,
};
