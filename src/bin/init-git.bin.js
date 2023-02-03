require("dotenv").config();

const path = require("path");
const fs = require("fs");

const {
  SOURCE_GIT_USERNAME,
  SOURCE_GIT_PASSWORD,
  SOURCE_REPO_URL,
} = require("../config/app.config");
const {
  generateOriginUrlWithCreds,
  runGitCommand,
} = require("../services/git.service");

const repoDirPath = path.join(__dirname, "../../repo");

const cloneRepo = async () => {
  const isDirectoryExist = fs.existsSync(repoDirPath);

  if (isDirectoryExist) {
    console.log("Removing existing repo directory...");
    fs.rmSync(repoDirPath, { recursive: true, force: true });
    console.log("Remove done");
  }

  const generatedUrl = generateOriginUrlWithCreds(
    SOURCE_GIT_USERNAME,
    SOURCE_GIT_PASSWORD,
    SOURCE_REPO_URL
  );

  const repoDirectory = repoDirPath;

  const cloneCommand = `git clone ${generatedUrl} ${repoDirectory}`;

  const clonseResult = await runGitCommand(cloneCommand, false);
  console.log(clonseResult);
};

(async () => {
  console.log(`Cloning repo from ${SOURCE_REPO_URL}...`);
  await cloneRepo();
  console.log("Clone done");
})();
