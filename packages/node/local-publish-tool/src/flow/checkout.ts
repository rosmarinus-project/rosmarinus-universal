import shell from 'shelljs';
import i18n from '@rosmarinus/i18n';
import { PkgManager } from '../enum';

export interface CheckoutParams {
  master: string;
  pkgManager: PkgManager;
  cwd: string;
}

const installCmdMap: Record<PkgManager, string> = {
  [PkgManager.npm]: 'npm i',
  [PkgManager.pnpm]: 'pnpm i',
  [PkgManager.yarn]: 'yarn',
};

export function checkout(params: CheckoutParams) {
  const { cwd } = params;
  const gitChanges = shell.exec('git status --porcelain', { cwd }).stdout;

  if (gitChanges) {
    console.log(i18n().t('local-publish-tool.git-change-warn'), gitChanges);
    process.exit(1);
  }

  console.log(i18n().t('local-publish-tool.clean-warn'));
  shell.exec('git checkout .', { cwd, silent: true });
  shell.exec('git clean -df', { cwd, silent: true });
  console.log(i18n().t('local-publish-tool.checkout', params.master));
  shell.exec(`git checkout ${params.master}`, { cwd, silent: true });
  shell.exec('git pull', { cwd, silent: true });

  const installCmd = installCmdMap[params.pkgManager];

  if (installCmd) {
    shell.exec(installCmd, { cwd, silent: true });
  } else {
    console.warn(i18n().t('local-publish-tool.no-pkg-mgr'));
  }
}
