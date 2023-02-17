const { getLogLevel } = require("../../../src/utils/logger.util");

describe("getLogLevel", () => {
  test.each([
    ["DEV", "debug"],
    ["PROD", "info"],
  ])("returns the correct log level for %s", (env, expectedLogLevel) => {
    const logLevel = getLogLevel(env);
    expect(logLevel).toBe(expectedLogLevel);
  });
});
