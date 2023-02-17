const { generateOriginUrlWithCreds } = require("../../../src/utils/git.util");

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
