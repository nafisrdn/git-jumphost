const exec = require("child_process").exec;

const {
  runGitCommand,
  generateOriginUrlWithCreds,
  getBranchName,
} = require("../../../src/utils/git.util");

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("runGitCommand", () => {
  it("should call exec function with no cwd argument", async () => {
    const mockExec = jest.requireMock("child_process").exec;
    mockExec.mockImplementation((cmd, opt, callback) => {
      callback(null, "stdout", null);
    });

    await runGitCommand("git test command");

    expect(exec).toHaveBeenCalledWith(
      "git test command 2>&1",
      { cwd: null },
      expect.any(Function)
    );
  });

  it("should call exec function with cwd argument", async () => {
    const mockExec = jest.requireMock("child_process").exec;

    mockExec.mockImplementation((cmd, opt, callback) => {
      callback(null, "stdout", null);
    });

    await runGitCommand("git test command", "/path/to/repo");

    expect(exec).toHaveBeenCalledWith(
      "git test command 2>&1",
      { cwd: "/path/to/repo" },
      expect.any(Function)
    );
  });

  it("should return a promise", () => {
    const result = runGitCommand("git status");
    expect(result).toBeInstanceOf(Promise);
  });

  it("should resolve with stdout output on success", () => {
    const mockExec = jest.requireMock("child_process").exec;

    mockExec.mockImplementation((cmd, opt, callback) => {
      callback(null, "stdout", null);
    });

    expect(runGitCommand("git test command")).resolves.toBe("stdout");
  });

  test("test", async () => {
    const mockExec = jest.requireMock("child_process").exec;

    mockExec.mockImplementation((cmd, opt, callback) => {
      callback(new Error("test error"), null, "error 2");
    });

    expect(runGitCommand("git test command")).rejects.toBe(
      "Error: test error \nstderr: error 2 \nstdout: null"
    );
  });

  xit("should reject with error message on failure", () => {
    const mockExec = jest.requireMock("child_process").exec;

    mockExec.mockImplementation((cmd, opt, callback) => {
      callback(new Error("test error"), "s", "stderr");
    });

    expect(runGitCommand("git test command")).rejects.toThrow("a");
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
