const http = require("http");
const exec = require("child_process").exec;

const sourceRepoUrl = "https://gitlab.com/nafisrdn/webhook-test.git";
const targetRepoUrl = "https://gitlab.com/nafisrdn/test-git-2.git";

const branch = "main";

const gitPullFromSource = () =>
  new Promise((resolve, reject) => {
    const pullCommand = `git --git-dir=repo/.git pull ${sourceRepoUrl} ${branch}`;

    exec(pullCommand, (error, stdout, stderr) => {
      if (error !== null) {
        reject(error);
      }

      resolve({ stdout, stderr });
    });
  });

const executeRestoreGit = () =>
  new Promise((resolve, reject) => {
    const restoreCommand = `git --git-dir=repo/.git --work-tree=repo checkout .`;

    exec(restoreCommand, (error, stdout, stderr) => {
      if (error !== null) {
        reject(error);
      }

      resolve({ stdout, stderr });
    });
  });

const gitPushToTarget = () =>
  new Promise((resolve, reject) => {
    const pushCommand = `git --git-dir=repo/.git pull ${targetRepoUrl} ${branch}`;

    exec(pushCommand, (error, stdout, stderr) => {
      if (error !== null) {
        reject(error);
      }

      resolve({ stdout, stderr });
    });
  });

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });

    console.log("Discard local changes...");
    const restore = await executeRestoreGit();
    console.log(restore);
    console.log("Discard done");

    console.log("Pulling from source...");
    const pullGit = await gitPullFromSource();
    console.log(pullGit);
    console.log("Pull done");

    res.write("ok");
    res.end();
  })
  .listen(8000);
