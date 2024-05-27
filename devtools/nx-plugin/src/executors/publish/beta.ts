import { execSync } from 'child_process';
import { logger } from '@nx/devkit';
import { $, cd, fs } from 'zx';
import type { ExecutorContext } from '@nx/devkit';

const { readJSONSync, writeJSONSync } = fs;

const pattern = /[^\d]*([\d]+\.[\d]+\.[\d]+)(?:.*)/;

const getCurrentBranchName = (): string =>
  execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf8',
  });

const getFormatedBranchName = (): string => {
  const curBranchName = getCurrentBranchName();

  return curBranchName.replace('\n', '').replace(/[/|_]/g, '-');
};

const getBetaVersion = (version: string): string => {
  const timeVersion = process.env.TIME_STAMP;
  const formatedBranchName = getFormatedBranchName();

  return version.replace(pattern, (_, numVersion) => `${numVersion}-${formatedBranchName}-${timeVersion}`);
};

export default async function packagePublishBetaExecutor(
  _: any,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const { projectName } = context;
  const projectPath = context?.workspace?.projects[projectName].sourceRoot;

  const packageJson = readJSONSync(`${projectPath}/package.json`);

  const betaVersion = getBetaVersion(packageJson.version);
  const newPackageJson = { ...packageJson, version: betaVersion };

  Object.keys(newPackageJson.dependencies).forEach((key) => {
    if (newPackageJson.dependencies[key].startsWith('workspace:^')) {
      newPackageJson.dependencies[key] = newPackageJson.dependencies[key].replace('workspace:^', 'workspace:*');
    }
  });

  writeJSONSync(`${projectPath}/package.json`, newPackageJson, {
    spaces: 2,
  });

  try {
    cd(projectPath!);
    await $`pnpm publish --tag beta --no-git-checks`;
  } catch (e) {
    logger.error(e);

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}
