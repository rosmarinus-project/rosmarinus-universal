import common from '@rosmarinus/common-plugins';
import { defineConfig } from 'rollup';
import { sync } from 'glob';

const external = [];

/**
 * @param {import('rollup').InternalModuleFormat} format
 * @param {string} input
 * @param {string | undefined} banner
 */
function getConfig(format, input, banner = undefined) {
  return defineConfig({
    input: `src/${input}.ts`,
    output: {
      file: `dist/${format}/${input}/index.${format === 'cjs' ? 'cjs' : 'js'}`,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [
      common({
        ts: {
          outDir: `dist/${format}/${input}`,
        },
      }),
    ],
  });
}

export default sync('src/*.ts')
  .map((input) => {
    const inputName = input.split('/').pop()?.split('.')[0] || '';

    return [getConfig('cjs', inputName, '#!/usr/bin/env node'), getConfig('es', inputName)];
  })
  .flat();
