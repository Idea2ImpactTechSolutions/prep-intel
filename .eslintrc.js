module.exports = {
  env: {
    "browser": true,
    "es2021": true,
    "jest": true
  },
  extends: [
    // "eslint:recommended", -- This really should be enabled --
    "next/core-web-vitals",
    "plugin:jest/recommended",
  ],
  rules: {
    "react/no-unescaped-entities": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
  },
  plugins: ["jest"],
};