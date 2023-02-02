const http = require("http");
const exec = require("child_process").exec;

const port = 8000;

const sourceRepoUrl = "https://gitlab.com/nafisrdn/webhook-test.git";
const targetRepoUrl = "https://gitlab.com/nafisrdn/test-git-3.git";

const sourceBranch = "main";
const targetBranch = "main";

const runGitCommand = (command) =>
  new Promise((resolve, reject) => {
    exec(command, { cwd: "repo" }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ stdout, stderr });
    });
  });

const gitPullFromSource = async () => {
  const pullCommand = `git pull ${sourceRepoUrl} ${sourceBranch}`;
  const pullResult = await runGitCommand(pullCommand);
  console.log(pullResult);
};

const executeRestoreGit = async () => {
  const restoreCommand = `git checkout .`;
  const restoreResult = await runGitCommand(restoreCommand);
  console.log(restoreResult);
};

const gitPushToTarget = async () => {
  const pushCommand = `git push ${targetRepoUrl} ${sourceBranch}:${targetBranch}`;
  const pushResult = await runGitCommand(pushCommand);
  console.log(pushResult);
};

let taskCount = 0;

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });

    console.log(`======= ${taskCount} =======`);
    console.log("Discard local changes...");
    await executeRestoreGit();
    console.log("Discard done");

    console.log("Pulling from source...");
    await gitPullFromSource();
    console.log("Pull done");

    console.log("Discard local changes...");
    await executeRestoreGit();
    console.log("Discard done");

    console.log("Pushing to target...");
    await gitPushToTarget();
    console.log("Push done");
    console.log(`======= = =======`);

    taskCount++;

    res.write("ok");
    res.end();
  })
  .listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
