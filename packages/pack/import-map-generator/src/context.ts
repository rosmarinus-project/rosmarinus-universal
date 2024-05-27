import { resolve } from 'path';
import { existsSync } from 'fs-extra';
import { sync } from 'glob';
import type { Context, Params } from './types';

export async function loadContext(params: Params): Promise<Context> {
  let cwd = process.cwd();

  let input: string[] = [];
  let outputFileName = 'dist/map.json';
  let srcDir: string | undefined;
  let transform: undefined | ((path: string) => string);

  const configPath = params.config;

  if (configPath && existsSync(configPath)) {
    try {
      const config = await (async () => {
        const configContent = await import(resolve(configPath));
        return configContent.default || configContent;
      })()

      config.cwd && (cwd = config.cwd);
      srcDir = config.srcDir;
      transform = config.transform;

      if (config.input) {
        if (typeof config.input === 'string') {
          input = [config.input];
        } else if (Array.isArray(config.input)) {
          input = [];
          const inputList = config.input.filter((file: any) => typeof file === 'string') as string[];

          inputList.forEach((file) => {
            const list = sync(file, { cwd });

            input.push(...list);
          });
        }
      }

      if (Array.isArray(config.exclude)) {
        const excludeList = config.exclude.filter((file: any) => typeof file === 'string') as string[];

        input = input.filter((file) => !excludeList.includes(file));
      }

      typeof config.outputFileName === 'string' && (outputFileName = config.outputFileName);
    } catch (e) {
      console.warn('load config error');
    }
  }

  return {
    srcDir,
    transform,
    input,
    outputFileName,
    cwd,
  };
}
