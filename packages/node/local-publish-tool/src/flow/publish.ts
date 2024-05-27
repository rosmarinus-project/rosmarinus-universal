import shell from 'shelljs';
import i18n from '@rosmarinus/i18n';
import { LOCK_FILE_MAP, PkgManager } from '../enum';

export interface PublishParams {
  cwd: string;
  pkgManager: PkgManager;
  version: string;
  master: string;
  features?: string;
}

export function publish(params: PublishParams) {
  const { cwd } = params;

  shell.exec(`git add ${LOCK_FILE_MAP[params.pkgManager]}`, { cwd, silent: true });
  shell.exec('git add package.json', { cwd, silent: true });
  shell.exec('git add CHANGELOG.md', { cwd, silent: true });

  const commitMsg = `chore: bump version to ${params.version}`;

  shell.exec(`git commit -m "${commitMsg}"`, { cwd });

  if (shell.exec(`git diff ${params.master} origin/${params.master}`, { cwd, silent: true }).stdout) {
    console.log(i18n().t('local-publish-tool.push', params.master));
    shell.exec('git push', { cwd, silent: true });
  }

  // 打 tag
  const tagGit = shell.exec('git ls-remote', { cwd, silent: true }).stdout.includes(`refs/tags/v${params.version}`);

  if (!tagGit) {
    console.log(i18n().t('local-publish-tool.push-tag', params.version));
    shell.exec(`git tag -a "v${params.version}" -m "${params.features || params.version}"`, { cwd, silent: true });
    shell.exec(`git push origin "v${params.version}"`, { cwd, silent: true });
  }
}
