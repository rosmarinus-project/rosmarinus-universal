# @rosmarinus/babel-plugin-tree-cutting

<p align="center">
  <a href="https://www.npmjs.com/package/@rosmarinus/babel-plugin-tree-cutting"><img src="https://img.shields.io/npm/v/@rosmarinus/babel-plugin-tree-cutting" alt="npm package"></a>
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

This npm is used to transform the import code to import from the correct sub path.

Always use with @rosmarinus/import-map-generator.

For examples:
```typescript
import { foo } from 'npm'

// will be transformed to
import { foo } from 'npm/foo'
```

# How to Install

```bash
npm i @rosmarinus/babel-plugin-tree-cutting
```

# How to Use

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      '@rosmarinus/babel-plugin-tree-cutting',
      {
        npmName: 'your npm name',
        exportMapPath: 'the path of @rosmarinus/import-map-generator output'
      }
    ],
  ]
}
