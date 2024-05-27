import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';

const external = [];

/**
 *
 * @param {{
 * input: string | object;
 * format: string;
 * output?: string;
 * banner?: string;
 * }} param0
 * @returns {import('rollup').RollupOptions}
 */
function getConfig({ input, format, output, banner }) {
  const dir = `dist/${output || format}`;

  return {
    input,
    output: {
      dir,
      format,
      banner,
      sourcemap: true,
      entryFileNames: format === 'cjs' ?  '[name].cjs' : undefined,
    },
    external,
    plugins: [
      commonjs(),
      resolve(),
      json(),
      typescript({
        outDir: dir,
        declarationDir: dir,
        tsconfig: './tsconfig.json',
      }),
      babel({
        babelHelpers: 'bundled',
      }),
    ],
  };
}

export default [
  getConfig({ input: 'src/cli.ts', format: 'cjs', output: 'bin', banner: '#!/usr/bin/env node' }),
  getConfig({ input: 'src/index.ts', format: 'es' }),
  getConfig({ input: 'src/index.ts', format: 'cjs' }),
];
