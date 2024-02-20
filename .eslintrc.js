module.exports = {
  "extends": "next/core-web-vitals",
  rules: {
    "react/no-unescaped-entities": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
  },
};