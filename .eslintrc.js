

module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    "browser": true,
    "es2021": true,
    "jest": true,
    "node": true,
  },
  extends: [
    // "eslint:recommended", -- This really should be enabled --
    // "plugin:react/recommended",
    // "plugin:promise/recommended", -- Lots of mistakes to tackle
    "next/core-web-vitals",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "off", // I've never seen these addressed or fixed, disable the noise
    "@next/next/no-img-element": "off",
    "no-unused-vars": "off",  // Disable the base rule as it can report incorrect errors, use TS specific below
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "@typescript-eslint/no-unused-vars": ['error', { "args": "none" }], // { argsIgnorePattern: '^_' } -Enable the TypeScript-specific rule
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "prefer-const": "off", // "warn"
  },
  plugins: [
    "@typescript-eslint",
    "jest",
    "react",
    "promise",
  ],
};
