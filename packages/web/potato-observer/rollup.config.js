import common from '@rosmarinus/common-plugins';
import { defineConfig } from 'rollup';

const external = [];

/**
 * @param {import('rollup').InternalModuleFormat} format
 * @param {string | undefined} banner
 */
function getConfig(format, banner = undefined) {
  const outDir = `dist/${format}`;

  return defineConfig({
    input: 'src/index.ts',
    output: {
      dir: outDir,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [
      common({
        ts: {
          outDir,
          declarationDir: outDir,
        },
      }),
    ],
  });
}

export default [getConfig('cjs'), getConfig('es')];
