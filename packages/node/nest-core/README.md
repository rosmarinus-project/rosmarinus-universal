# @rosmarinus/nest-core

<p align="center">
  <a href="https://www.npmjs.com/package/@rosmarinus/nest-core"><img src="https://img.shields.io/npm/v/@rosmarinus/nest-core" alt="npm package"></a>
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

 

This npm package contains some function encapsulation commonly used in development, which is more engineering-oriented.

# How to Install

```bash
npm i @rosmarinus/nest-core
```

# Modules introduction

1. Context

Context decorator, will automatically encapsulate the context of each interface, for example, it will encapsulate the logger used for the interface

2. AllExceptionsFilter

This module will capture global errors and return uniform results

3. HeadersMiddleware

This module will add Fcgi-Srtime and Request-Id to the headers of all returned results.

4. RedisService and RedisModule

This module encapsulates ioredis into a nest module