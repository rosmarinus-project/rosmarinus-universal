# rosmarinus-universal

<p align="center">
  <a href="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml"><img src="https://github.com/rosmarinus-project/rosmarinus-universal/actions/workflows/publish.yml/badge.svg" alt="build status"></a>
  <a href="https://pr.new/rosmarinus-project/rosmarinus-universal"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

monorepo for all rosmarinus projects

## Packages
1. [@rosmarinus/common-utils](./packages/common/common-utils/README.md) for common functions and modules
2. [@rosmarinus/compiler-kit](./packages/common/compiler-kit/README.md) for compiler and parser
3. [@rosmarinus/cli-mod](./packages/node/cli-mod/README.md) for git cli module
4. [@rosmarinus/local-publish-tool](./packages/node/local-publish-tool/README.md) for npm package publishing tool
5. [@rosmarinus/nest-core](./packages/node/nest-core/README.md) for nestjs useful core module
6. [@rosmarinus/node-utils](./packages/node/node-utils/README.md) for utils that only work in nodejs
7. [@rosmarinus/babel-plugin-tree-cutting](./packages/pack/babel-plugin-tree-cutting/README.md) for babel plugin to make tree shaking
8. [@rosmarinus/common-plugins](./packages/pack/common-plugins/README.md) for rollup plugins
9. [@rosmarinus/common-tailwindcss](./packages/pack/common-tailwindcss/README.md) for useful tailwindcss plugins
10. [@rosmarinus/import-map-generator](./packages/pack/import-map-generator/README.md) for generating export map
11. [@rosmarinus/potato-observer](./packages/web/potato-observer/README.md) for expose observer working in browser
12. [@rosmarinus/search](./packages/web/search/README.md) for searching algorithm working in browser
13. [@rosmarinus/html-entities-decoder](./packages/common/html-entities-decoder/README.md) for decoding html entities

## How to dev
```bash
# install dependencies
pnpm install

# publish
pnpm changeset
```