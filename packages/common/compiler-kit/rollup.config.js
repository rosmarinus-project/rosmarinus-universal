import common from '@rosmarinus/common-plugins';

const external = [];

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
    plugins: [common()],
  };
}

export default [getConfig('cjs'), getConfig('es')];
