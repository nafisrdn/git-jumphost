const http = require("http");
const exec = require("child_process").exec;

const sourceRepoUrl = "https://gitlab.com/nafisrdn/webhook-test.git";
const targetRepoUrl = "https://gitlab.com/nafisrdn/test-git-2.git";

const branch = "main";

const runGitCommand = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ stdout, stderr });
    });
  });

const gitPullFromSource = async () => {
  const pullCommand = `git --git-dir=repo/.git pull ${sourceRepoUrl} ${branch}`;
  const pullResult = await runGitCommand(pullCommand);
  console.log(pullResult);
};

const executeRestoreGit = async () => {
  const restoreCommand = `git --git-dir=repo/.git --work-tree=repo checkout .`;
  const restoreResult = await runGitCommand(restoreCommand);
  console.log(restoreResult);
};

const gitPushToTarget = async () => {
  const pushCommand = `git --git-dir=repo/.git push ${targetRepoUrl} ${branch}`;
  const pushResult = await runGitCommand(pushCommand);
  console.log(pushResult);
};

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });

    console.log("Discard local changes...");
    await executeRestoreGit();
    console.log("Discard done");

    console.log("Pulling from source...");
    await gitPullFromSource();
    console.log("Pull done");

    res.write("ok");
    res.end();
  })
  .listen(8000);
