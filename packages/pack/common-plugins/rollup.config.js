import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import fse from 'fs-extra';

const { dependencies } = fse.readJSONSync('./package.json');

const external = Object.keys(dependencies);

function getConfig(format, banner) {
  return {
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.js`,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [
      commonjs(),
      resolve({
        preferBuiltins: true,
      }),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      babel({
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      }),
    ],
  };
}

export default [getConfig('cjs'), getConfig('es')];
