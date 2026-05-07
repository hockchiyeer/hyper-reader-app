const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

let staticServer;
let staticBaseUrl;

function contentTypeFor(filePath) {
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8"
  }[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function startStaticServer(projectRoot) {
  if (staticServer && staticBaseUrl) return Promise.resolve(staticBaseUrl);

  return new Promise((resolve, reject) => {
    const root = path.resolve(projectRoot);
    const rootWithSeparator = root.endsWith(path.sep) ? root : `${root}${path.sep}`;

    staticServer = http.createServer((request, response) => {
      const requestUrl = new URL(request.url, "http://127.0.0.1");
      const requestPath = decodeURIComponent(requestUrl.pathname === "/" ? "/hyperreader_full_app.html" : requestUrl.pathname);
      const filePath = path.resolve(root, `.${requestPath}`);

      if (!filePath.startsWith(rootWithSeparator)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      fs.readFile(filePath, (error, content) => {
        if (error) {
          response.writeHead(404);
          response.end("Not found");
          return;
        }

        response.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
        response.end(content);
      });
    });

    staticServer.on("error", reject);
    staticServer.listen(0, "127.0.0.1", () => {
      const address = staticServer.address();
      staticBaseUrl = `http://127.0.0.1:${address.port}`;
      resolve(staticBaseUrl);
    });
  });
}

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    downloadsFolder: "cypress/downloads",
    fixturesFolder: "cypress/fixtures",
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    viewportWidth: 1280,
    viewportHeight: 800,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)]
      }));

      config.baseUrl = await startStaticServer(config.projectRoot);
      return config;
    }
  }
});
