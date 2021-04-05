module.exports = {
  parser: `@babel/eslint-parser`,
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: [`@babel/preset-react`],
    },
    ecmaVersion: 2018,
    sourceType: `module`,
  },
  extends: [
    `eslint:recommended`,
    `plugin:react/recommended`,
    `plugin:prettier/recommended`,
  ],
  plugins: [`prettier`, `react`],
  env: {
    browser: true,
    es6: true,
    node: true,
  },

  rules: {
    quotes: [`error`, `backtick`],
    "react/no-unescaped-entities": `off`,
    "react/prop-types": `off`,
  },
  settings: {
    react: {
      version: `detect`,
    },
  },
}
