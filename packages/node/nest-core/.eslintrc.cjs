const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@rosmarinus/eslint-config-rosmarinus'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: path.resolve(__dirname, './tsconfig.eslint.json'),
  },
  globals: {},
};
