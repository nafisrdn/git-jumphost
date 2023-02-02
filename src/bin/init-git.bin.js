require("dotenv").config();
const path = require("path");

const {
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  SOURCE_REPO_URL,
} = require("../config/app.config");
const {
  generateOriginUrlWithCreds,
  runGitCommand,
} = require("../services/git.service");

const cloneRepo = async () => {
  const generatedUrl = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const repoDirectory = path.join(__dirname, "../../repo");

  const cloneCommand = `git clone ${generatedUrl} ${repoDirectory}`;

  const clonseResult = await runGitCommand(cloneCommand, false);
  console.log(clonseResult);
};

(async () => {
  console.log(`Cloning repo from ${SOURCE_REPO_URL}...`);
  await cloneRepo();
  console.log("Clone done");
})();
