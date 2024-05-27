import babel from '@rollup/plugin-babel';
import type { Plugin } from 'vite';

export function vitePlugin(): Plugin {
  const b = babel({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs'],
    plugins: ['@rosmarinus/common-utils/babel-plugin'],
  });

  return {
    ...b,
    name: '@rosmarinus/common-utils/vite-plugin',
  } as any;
}
