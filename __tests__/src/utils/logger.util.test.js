const { getLogLevel } = require("../../../src/utils/logger.util");

describe("getLogLevel", () => {
  it("should return 'debug' if the environment is DEV", () => {
    const logLevel = getLogLevel("DEV");
    expect(logLevel).toEqual("debug");
  });

  it("should return 'info' if the environment is not DEV", () => {
    const logLevel = getLogLevel("PROD");
    expect(logLevel).toEqual("info");
  });
});
