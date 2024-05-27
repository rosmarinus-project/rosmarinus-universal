import common from '@rosmarinus/common-plugins';

const external = ['shelljs', 'conventional-changelog'];

/**
 * @returns {import('rollup').RollupOptions}
 */
function getConfig(format, banner) {
  return {
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.${format === 'cjs' ? 'cjs' : 'js'}`,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [common()],
  };
}

export default [getConfig('cjs', '#!/usr/bin/env node'), getConfig('es')];
