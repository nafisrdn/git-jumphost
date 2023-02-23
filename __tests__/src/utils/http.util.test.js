const {
  getRequestBody,
  removeUrlProtocol,
} = require("../../../src/utils/http.util");

describe("getRequestBody", () => {
  test("should parse JSON body", async () => {
    const req = {
      on: jest.fn((event, callback) => {
        if (event === "data") {
          callback('{"key": "value"}');
        } else if (event === "end") {
          callback();
        }
      }),
    };

    const body = await getRequestBody(req);
    expect(body).toEqual({ key: "value" });
  });

  test("should reject on error", async () => {
    const req = {
      on: jest.fn((event, callback) => {
        if (event === "error") {
          callback(new Error("Some error"));
        }
      }),
    };

    await expect(getRequestBody(req)).rejects.toThrow("Some error");
  });
});

describe("removeUrlProtocol", () => {
  test("should remove http:// protocol", () => {
    const url = "http://example.com";
    expect(removeUrlProtocol(url)).toBe("example.com");
  });

  test("should remove https:// protocol", () => {
    const url = "https://example.com";
    expect(removeUrlProtocol(url)).toBe("example.com");
  });

  test("should leave non-protocol URLs unchanged", () => {
    const url = "example.com";
    expect(removeUrlProtocol(url)).toBe("example.com");
  });
});
