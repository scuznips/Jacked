const html = require("eslint-plugin-html");
const globals = require("globals");

module.exports = [
  {
    files: ["**/*.html"],
    plugins: { html },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    rules: {
      "no-unused-vars": ["warn", {
        vars: "local",
        argsIgnorePattern: "^e$",
        caughtErrorsIgnorePattern: "^e$",
      }],
      "no-undef": "error",
      "no-redeclare": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-const-assign": "error",
      "no-fallthrough": "error",
      "no-case-declarations": "error",
      "eqeqeq": ["warn", "smart"],
    },
  },
  {
    files: ["sw.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.serviceworker,
      },
    },
  },
];
