const exec = require("child_process").exec;

const runGitCommand = (command, useCwd = true) =>
  new Promise((resolve, reject) => {
    exec(
      `${command} 2>&1`,
      { cwd: useCwd ? "repo" : null },
      (error, stdout, stderr) => {
        if (error) {
          reject(`${error} \nstderr: ${stderr} \nstdout: ${stdout}`);
        }
        resolve(stdout);
      }
    );
  });

const generateOriginUrlWithCreds = (gitUsername, gitPassowrd, repoUrl) =>
  `https://${gitUsername}:${gitPassowrd}@${repoUrl}`;

module.exports.runGitCommand = runGitCommand;
module.exports.generateOriginUrlWithCreds = generateOriginUrlWithCreds;
