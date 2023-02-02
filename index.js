const http = require("http");
const exec = require("child_process").exec;

const sourceRepoUrl = "https://gitlab.com/nafisrdn/webhook-test.git";
const branch = "main";

const executePullGit = new Promise((resolve, reject) => {
  const pullCommand = `git --git-dir=repo/.git pull ${sourceRepoUrl} ${branch}`;

  exec(pullCommand, (error, stdout, stderr) => {
    if (error !== null) {
      reject(error);
    }

    resolve({ stdout, stderr });
  });
});

const executeRestoreGit = new Promise((resolve, reject) => {
  const restoreCommand = `git --git-dir=repo/.git restore .`;

  exec(restoreCommand, (error, stdout, stderr) => {
    if (error !== null) {
      reject(error);
    }

    resolve({ stdout, stderr });
  });
});

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });

    // const restoreGit = await executeRestoreGit();
    // console.log(restoreGit);

    const pullGit = await executePullGit();
    console.log(pullGit);

    res.write("ok");
    res.end();
  })
  .listen(8000);
