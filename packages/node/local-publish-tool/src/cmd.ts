import { Command } from 'commander';
import i18n from '@rosmarinus/i18n';
import type { Params } from './types';

const program = new Command();

program.name('rosmarinus-publish').usage('<command> [options]').description(i18n().t('local-publish-tool.desc'));

export function getParams(): Promise<Params> {
  return new Promise((resolve) => {
    program
      .command('publish')
      .option('--config', i18n().t('local-publish-tool.config'))
      .action((result) => {
        resolve(result);
      });
    program.parse(process.argv);
  });
}
