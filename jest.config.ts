const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Workaround for uuid having both ESM and CommonJS module exports and producing a 'Unexpected token "export"' error
    // https://stackoverflow.com/q/72163561/84369
    //
    // '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
      '^uuid$': require.resolve('uuid'),
  },
  watchPathIgnorePatterns: [
    "node_modules",
    "\\.next"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/"
  ]
};


// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);