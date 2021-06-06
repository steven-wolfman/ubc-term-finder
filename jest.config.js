const { defaults } = require("jest-config");

module.exports = {
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [...defaults.testMatch, "./tests/**/?*(*.)+[jt]s?(x)"],
  moduleDirectories: [...defaults.moduleDirectories, "src"],
};
