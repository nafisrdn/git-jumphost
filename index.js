require("dotenv").config();

const http = require("http");
const { PORT } = require("./src/config/app.config");
const {
  executeRestoreGit,
  gitPullFromSource,
  gitPushToTarget,
} = require("./src/services/git.service");

let taskCount = 0;

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
