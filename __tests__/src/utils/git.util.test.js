const {
  generateOriginUrlWithCreds,
  getBranchName,
} = require("../../../src/utils/git.util");

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
