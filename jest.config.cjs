const { join } = require("path");
const internet_identity = join(
  __dirname,
  "src/frontend/generated/internet_identity_idl.ts"
);

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "dfx-generated/internet_identity": internet_identity,
  },
  setupFiles: [`<rootDir>/src/frontend/test-setup.ts`],
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.spec.json",
    },
  },
  // These two transform options make sure that jest can process files that include ES modules
  // (in particular, files that have lit-html import)
  transform: { "\\.[jt]sx?$": "ts-jest" },
  transformIgnorePatterns: ["node_modules/(?!@?lit)"],
};
