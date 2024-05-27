module.exports = {
  input: ['src/functions/*.ts', 'src/modules/*.ts'],
  exclude: ['src/functions/index.ts', 'src/modules/index.ts'],
  outputFileName: 'dist/map.json',
  srcDir: 'src',
};
