require("dotenv").config();

const exec = require("child_process").exec;
const http = require("http");
const { PORT, ENVIRONMENT } = require("./src/config/app.config");
const {
  executeRestoreGit,
  gitPullFromSource,
  gitPushToTarget,
} = require("./src/services/git.service");

let taskCount = 0;

const initRepo = () =>
  new Promise((resolve, reject) => {
    const buildProcess = exec(`npm run build`);

    buildProcess.stdout.on("data", (data) => {
      console.log(data);
    });

    buildProcess.stderr.on("data", (error) => {
      reject(error);
    });

    buildProcess.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Build process exited with code: ${code}`);
      }
    });
  });

(async () => {
  if (ENVIRONMENT === "PROD") {
    await initRepo();
  }

  http
    .createServer(async (req, res) => {
      try {
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

        res.write("ok");
      } catch (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });

        console.log(error);

        res.write(error);
      }

      taskCount++;
      res.end();
    })
    .listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
})();
