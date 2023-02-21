const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(JSON.parse(body));
    });
    req.on("error", (error) => {
      reject(error);
    });
  });
};

const removeUrlProtocol = (url) => url.replace(/^https?:\/\//i, "");

module.exports = { getRequestBody, removeUrlProtocol };
