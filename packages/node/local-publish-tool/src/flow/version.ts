import { resolve } from 'path';
import i18n from '@rosmarinus/i18n';
import semver from 'semver';
import { readJSON, writeJSON } from 'fs-extra';
import { VersionMode } from '../enum';

export async function changePackageVersion(versionMode: VersionMode, cwd?: string) {
  const pkgPath = resolve(cwd || process.cwd(), 'package.json');
  const pkg = await readJSON(pkgPath);

  const newVersion = semver.inc(pkg.version, versionMode);

  if (!newVersion) {
    throw new Error('Invalid version');
  }

  pkg.version = newVersion;

  await writeJSON(pkgPath, pkg, { spaces: 2 });

  console.log(`${i18n().t('local-publish-tool.new-version')}: ${newVersion}`);
}
