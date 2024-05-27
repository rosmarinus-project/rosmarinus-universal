import common from '@rosmarinus/common-plugins';

const external = [];

/**
 *
 * @returns {import('rollup').RollupOptions}
 */
function getConfig(input, format) {
  const dir = `dist/${format}`;

  return {
    input,
    output: {
      dir,
      format,
      sourcemap: true,
    },
    external,
    plugins: [
      common({
        ts: {
          outDir: dir,
          declarationDir: dir,
          tsconfig: './tsconfig.json',
        },
      }),
    ],
  };
}

export default [getConfig('src/index.ts', 'es'), getConfig('src/index.ts', 'cjs')];
