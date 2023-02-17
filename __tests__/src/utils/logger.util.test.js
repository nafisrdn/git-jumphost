const {
  getLogLevel,
  generateLogText,
} = require("../../../src/utils/logger.util");

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

describe("generateLogText", () => {
  test("formats regular message correctly", () => {
    const info = {
      message: "This is a test message",
      timestamp: "10-02-2022 15:30:00",
      level: "info",
    };

    expect(generateLogText(info)).toBe(
      "[10-02-2022 15:30:00] info: This is a test message"
    );
  });

  test("formats error message correctly", () => {
    const error = new Error("Test error message");
    error.stack = "Error: Test error message";

    const info = {
      message: error.message,
      stack: error.stack,
      timestamp: "10-02-2022 15:30:00",
      level: "error",
    };

    expect(generateLogText(info)).toBe(
      "[10-02-2022 15:30:00] error: Test error message"
    );
  });
});
