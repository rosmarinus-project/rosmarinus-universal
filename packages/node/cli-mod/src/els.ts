// encode ls
import { readdirSync } from 'fs';
import { Command } from 'commander';
import { getCmdParams } from './common/cmd';

async function main() {
  try {
    const program = new Command()
      .command('els')
      .description('encode all file name in now dir')
      .option('-p, --prefix <prefix>', 'prefix of every file name');

    const params = await getCmdParams<{ prefix?: string }>(program);

    const files = readdirSync(process.cwd());
    const output = files.map((fileName) => `${params.prefix || ''}${encodeURIComponent(fileName)}`).join('\n\n');

    console.log(output);
  } catch (e) {
    console.error('els fail: ', e);
  }
}

main();
