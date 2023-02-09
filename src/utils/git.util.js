const exec = require("child_process").exec;

module.exports.runGitCommand = (command, useCwd = true) =>
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

module.exports.generateOriginUrlWithCreds = (
  gitUsername,
  gitPassowrd,
  repoUrl
) => `https://${gitUsername}:${gitPassowrd}@${repoUrl}`;

module.exports.getBranchName = (body) => {
  const { ref } = body;

  const branchIndex = ref.indexOf("heads/") + "heads/".length;
  const branchName = ref.substring(branchIndex);

  return branchName;
};
