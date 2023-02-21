const exec = require("child_process").exec;
const { removeUrlProtocol } = require("./http.util");

const runGitCommand = (command, cwd = null) =>
  new Promise((resolve, reject) => {
    exec(`${command} 2>&1`, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(`${error} \nstderr: ${stderr} \nstdout: ${stdout}`);
      }
      resolve(stdout);
    });
  });

const generateOriginUrlWithCreds = (gitUsername, gitPassowrd, repoUrl) =>
  `https://${gitUsername}:${gitPassowrd}@${removeUrlProtocol(repoUrl)}`;

const getBranchName = (body) => {
  const { ref } = body;

  const branchIndex = ref.indexOf("heads/") + "heads/".length;
  const branchName = ref.substring(branchIndex);

  return branchName;
};

module.exports = {
  runGitCommand,
  generateOriginUrlWithCreds,
  getBranchName,
};
