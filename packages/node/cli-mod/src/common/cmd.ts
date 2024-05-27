import type { Command } from 'commander';

export function getCmdParams<Params>(command: Command): Promise<Params> {
  return new Promise<Params>((resolve) => {
    command.action((result) => {
      resolve(result);
    });
    command.parse(process.argv);
  });
}
