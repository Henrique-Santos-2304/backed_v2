const config = require("./jest.config");

module.exports = {
  ...config,
  testEnvironment: "./prisma/prisma-test-environment.ts",
  testRegex: "spec.ts$",
};
