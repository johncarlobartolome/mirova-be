export default {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/", "/src/models/"],
};
