# @rosmarinus/common-utils

<p align="center">
  <a href="https://www.npmjs.com/package/@rosmarinus/common-utils"><img src="https://img.shields.io/npm/v/@rosmarinus/common-utils" alt="npm package"></a>
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>


This npm package contains some function encapsulation commonly used in development, which is more engineering-oriented.

# How to Install

```bash
npm i @rosmarinus/common-utils
```

# Functions introduction

1. logger

This module encapsulates chalk as output, and the input parameters are the same as the console module.

2. sleep

This module encapsulates several common delay methods into promise output

3. uuid

This module is a wrapper for the uuid npm library

4. AsyncTask

AsyncTask is an encapsulation of promise and is used in scenarios where calls and callbacks are separated.

4. FileLogger

FileLogger is a file logger that can be used in nodejs and environments to output log to a local file.

5. json

This module is a wrapper for the JSON.stringify and JSON.parse methods to make them more secure.

6. is-type

Some functions to determine the type of data, such as isArray, isObject, isString, etc.

7. try

This module is a wrapper for try-catch, which can return undefined when an error occurs.

8. url

This module is a collection of url handle function, such as handling url params to object.


# About Tree shaking
this npm doesn't support tree shaking, because it use some npm packages that don't support tree shaking.

But there is always a way to solve this problem, you can use babel-plugin from this npm to solve this problem.

```js
// babel.config.js
module.exports = {
  plugins: ['@rosmarinus/common-utils/babel-plugin'],
};
```