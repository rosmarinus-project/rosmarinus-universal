# @rosmarinus/local-publish-tool

<p align="center">
  <a href="https://www.npmjs.com/package/@rosmarinus/local-publish-tool"><img src="https://img.shields.io/npm/v/@rosmarinus/local-publish-tool" alt="npm package"></a>
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

This is an npm package publishing tool, and finally triggers github actions through push tag.

This npm is convenient for self-publishing and encapsulates the following publishing process:
1. Change the version number locally
2. Run single test locally
3. Tag and push to remote end
4. git actions release

# How to Install

```bash
npm i @rosmarinus/local-publish-tool -D
```

# How To Publish With It
```bash
rosmarinus-publish
```