import { select, input } from '@inquirer/prompts';
import i18n from '@rosmarinus/i18n';
import { getParams } from './cmd';
import { loadContext } from './loadContext';
import { VersionMode } from './enum';
import { changePackageVersion } from './flow/version';
import { runUnitTest } from './flow/test';
import { publish } from './flow/publish';
import { checkout } from './flow/checkout';
import { buildChangelog } from './flow/changelog';

async function main() {
  const params = await getParams();
  const context = await loadContext(params);
  const version = await select({
    message: `${i18n().t('local-publish-tool.rule-input')}: `,
    choices: [{ value: VersionMode.major }, { value: VersionMode.minor }, { value: VersionMode.patch }],
  });
  const features = (
    await input({
      message: `${i18n().t('local-publish-tool.feature-input')}: `,
    })
  ).trim();

  checkout({
    master: context.master,
    pkgManager: context.pkgManager,
    cwd: context.cwd,
  });

  await runUnitTest({
    cwd: context.cwd,
    testNpm: context.testNpm,
  });

  await changePackageVersion(version, context.cwd);
  await buildChangelog();
  publish({
    pkgManager: context.pkgManager,
    cwd: context.cwd,
    version: require(`${context.cwd}/package.json`).version,
    master: context.master,
    features,
  });
}

main();
