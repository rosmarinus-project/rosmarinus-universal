@rosmarinus/common-plugins

<p align="center">
  <a href="https://www.npmjs.com/package/@rosmarinus/common-plugins"><img src="https://img.shields.io/npm/v/@rosmarinus/common-plugins" alt="npm package"></a>
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

some common plugins for rollup. always used in rosmarinus projects.

# How to Install

```bash
npm i @rosmarinus/common-plugins -D
```

# How to Use

```js
// rollup.config.js
import commonPlugin from '@rosmarinus/common-plugins';

export default {
  input: 'src/index.ts',
  plugins: [
    commonPlugin(),
  ],
};
```
