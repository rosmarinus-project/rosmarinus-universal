import { Command } from 'commander';
import type { Params } from './types';
import { genExportMap } from './index';
import { loadContext } from './context';

const program = new Command();

program
  .name('rosmarinus-import-map-generator')
  .usage('<command> [options]')
  .description('a tool help make project tree-shaking');

export function getParams(): Promise<Params> {
  return new Promise((resolve) => {
    program
      .command('gen-export-map')
      .option('--config <path>', 'config file path')
      .action((result) => {
        resolve(result);
      });
    program.parse(process.argv);
  });
}

async function main() {
  const params = await getParams();
  const ctx = await loadContext(params);

  await genExportMap(ctx);
}

main();
