# @rosmarinus/import-map-generator

<p align="center">
  <a href="https://www.npmjs.com/package/@rosmarinus/import-map-generator"><img src="https://img.shields.io/npm/v/@rosmarinus/import-map-generator" alt="npm package"></a>
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

Generate an import map from your source code, which can be used to load modules in sub path.

# Install
```bash
npm install @rosmarinus/import-map-generator -D
```

# Usage

## CLI
```bash
rosmarinus-import-map-generator gen-export-map --config map.config.js
```

## API
```typescript
import { genExportMap } from '@rosmarinus/import-map-generator';

await genExportMap({
  input: ['src/modules/*.ts'];
  outputFileName: 'dist/map.json';
  cwd: process.cwd();
});

```

# Configuration
```javascript
// map.config.js
module.exports = {
  // glob pattern to find all files that should be included in the export map
  input: ['src/modules/*.ts'],
  exclude: [],
  // output file name
  outputFileName: 'dist/map.json',
  // current working directory
  srcDir: 'src',
};
```