# @rosmarinus/compiler-kit

<p align="center">
  <a href="https://www.npmjs.com/package/@rosmarinus/compiler-kit"><img src="https://img.shields.io/npm/v/@rosmarinus/compiler-kit" alt="npm package"></a>
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

This is a compiler utils in babel and htmlparser2.

## Installation
```sh
npm install @rosmarinus/compiler-kit
```

## Usage

### ES
```typescript
import { esCompiler } from '@rosmarinus/compiler-kit';
const ast = esCompiler.parse('const a = 1;');

esCompiler.walker(ast, {
  // babel traverse
});

const codeGen = esCompiler.builder(ast);
```

### HTML
```typescript
import { htmlCompiler } from '@rosmarinus/compiler-kit';
const ast = htmlCompiler.parse('<div>hello world</div>');

htmlCompiler.walker(ast, {
  // htmlparser2 traverse
});

const codeGen = htmlCompiler.builder(ast);
```