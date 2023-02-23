const {
  runGitCommand,
  generateOriginUrlWithCreds,
  getBranchName,
} = require("../../../src/utils/git.util");
const childProcess = require("child_process");

jest.mock("child_process");

describe("runGitCommand", () => {
  beforeEach(() => {
    childProcess.exec.mockClear();
  });

  it("should call exec function with no cwd argument", async () => {
    childProcess.exec.mockImplementation((cmd, opt, callback) => {
      callback(null, "stdout", null);
    });

    await runGitCommand("git test command");

    expect(childProcess.exec).toHaveBeenCalledWith(
      "git test command 2>&1",
      { cwd: null },
      expect.any(Function)
    );
  });

  it("should call exec function with cwd argument", async () => {
    childProcess.exec.mockImplementation((cmd, opt, callback) => {
      callback(null, "stdout", null);
    });

    await runGitCommand("git test command", "/path/to/repo");

    expect(childProcess.exec).toHaveBeenCalledWith(
      "git test command 2>&1",
      { cwd: "/path/to/repo" },
      expect.any(Function)
    );
  });

  it("should return a promise", () => {
    const result = runGitCommand("git status");
    expect(result).toBeInstanceOf(Promise);
  });

  it("should resolve with ok output on success", async () => {
    childProcess.exec.mockImplementation((cmd, opt, callback) => {
      callback(null, "ok", null);
    });

    const result = await runGitCommand("git test command");
    expect(result).toBe("ok");
  });

  it("should reject with error message on failure", async () => {
    childProcess.exec.mockImplementation((cmd, opt, callback) => {
      callback(new Error("test error"), null, "error 2");
    });

    await expect(runGitCommand("git test command")).rejects.toBe(
      "Error: test error \nstderr: error 2 \nstdout: null"
    );
  });
});

describe("generateOriginUrlWithCreds", () => {
  it("should generate origin URL with credentials", () => {
    const url = generateOriginUrlWithCreds(
      "username",
      "password",
      "github.com/user/repo.git"
    );

    expect(url).toBe("https://username:password@github.com/user/repo.git");
  });
});

describe("getBranchName", () => {
  it("should extract branch name from ref", () => {
    const body = { ref: "refs/heads/main" };
    const branchName = getBranchName(body);

    expect(branchName).toBe("main");
  });
});
