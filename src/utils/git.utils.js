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

module.exports.runGitCommand = runGitCommand;
