import { existsSync, readJSON } from 'fs-extra';
import i18n from '@rosmarinus/i18n';
import type { Context, Params } from './types';
import { PkgManager, LOCK_FILE_MAP, TestNpm } from './enum';

function getPkgManger(cwd: string) {
  if (existsSync(`${cwd}/${LOCK_FILE_MAP[PkgManager.pnpm]}`)) {
    return PkgManager.pnpm;
  }

  if (existsSync(`${cwd}/${LOCK_FILE_MAP[PkgManager.yarn]}`)) {
    return PkgManager.yarn;
  }

  return PkgManager.npm;
}

export async function loadContext(params: Params): Promise<Context> {
  let cwd = process.cwd();
  let pkgManager = getPkgManger(cwd);
  let master = 'main';
  let testNpm = TestNpm.jest;

  if (params.config && existsSync(params.config)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const config = await require(params.config);

      config.cwd && (cwd = config.cwd);
      config.pkgManager && (pkgManager = config.pkgManager);
      config.master && (master = config.master);
      config.testNpm && (testNpm = config.testNpm);
    } catch (e) {
      console.warn(i18n().t('local-publish-tool.config-fail'));
    }

    const config = await readJSON(params.config);

    return config;
  }

  return {
    cwd,
    pkgManager,
    master,
    testNpm,
  };
}
