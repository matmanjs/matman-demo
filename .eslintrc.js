module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['plugin:react/recommended', '@tencent/eslint-config-tencent'],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
