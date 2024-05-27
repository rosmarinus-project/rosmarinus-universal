{
  "name": "@rosmarinus/{{ projectName }}",
  "version": "0.0.0",
  "description": "{{ projectName }} for rosmarinus projects",
  "main": "dist/cjs/index.js",
  "module": "dist/es/index.js",
  "type": "module",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "exports": {
    ".": {
      "import": "./dist/es/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/es/index.d.ts"
    }
  },
  "scripts": {
    "dev": "rollup -c rollup.config.js -w",
    "build": "rimraf dist && rollup -c rollup.config.js",
    "test:unit": "jest --runInBand"
  },
  "files": [
    "dist/",
    "README.md"
  ],
  "repository": {
    "type": "git",
    "directory": "packages/{{ projectCategory }}/{{ projectName }}",
    "url": "https://github.com/rosmarinus-project/rosmarinus-universal.git"
  },
  "keywords": [
    "rosmarinus"
  ],
  "license": "MIT",
  "dependencies": {
    "tslib": "^2.6.2"
  },
  "devDependencies": {
    "@babel/core": "^7.23.5",
    "@babel/preset-env": "^7.23.5",
    "@babel/preset-typescript": "^7.23.3",
    "@jest/globals": "^29.7.0",
    "@rosmarinus/common-plugins": "workspace:*",
    "@rosmarinus/eslint-config-rosmarinus": "latest",
    "@types/node": "^18.14.0",
    "husky": "^8.0.3",
    "jest": "^29.7.0",
    "jest-json-reporter": "^1.2.2",
    "rimraf": "^5.0.5",
    "rollup": "^4.6.1",
    "typescript": "^5.3.3"
  }
}
