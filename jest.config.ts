const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

// const nextJest = require("next/jest");

// const createJestConfig = nextJest({
//   dir: "./",
// });

// const customJestConfig = {
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
//   testEnvironment: "jsdom",
//   transform: {
//     // Transforms TS and TSX files using ts-jest
//     "^.+\\.(ts|tsx)$": "ts-jest",
//     // Optional: If you have custom JavaScript that needs transpiling (outside of Next.js)
//     "^.+\\.js$": "babel-jest",
//   },
//   // If you're using TypeScript without Babel, you might not need the js transform line
//   moduleNameMapper: {
//     // If you're mocking CSS modules or other static assets
//   },
//   // Specify global configs for ts-jest if needed
//   globals: {
//     'ts-jest': {
//       tsconfig: '<rootDir>/tsconfig.json', // Or your custom tsconfig path. Not a real dir?
//       "useESM": true,
//     }
//   }
// };

module.exports = createJestConfig(customJestConfig);