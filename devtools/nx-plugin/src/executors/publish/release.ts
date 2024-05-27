import { ExecutorContext, logger } from '@nx/devkit';
import { $, cd } from 'zx';
import { readJSON } from 'fs-extra';
import semver from 'semver';

export default async function packagePublishReleaseExecutor(
  _: any,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const { projectName } = context;

  if (!projectName) {
    throw new Error('No project name provided');
  }

  const projectPath = context.workspace?.projects[projectName].sourceRoot;
  const { version, name } = await readJSON(`${projectPath}/package.json`);

  try {
    cd(projectPath);

    const res = await $`npm view ${name} version`;
    const latest = res.stdout;

    if (latest && semver.gte(latest, version)) {
      console.log(`${name} ${latest} greater than local ${version}`);

      return {
        success: true,
      };
    }

    await $`pnpm publish --no-git-checks`;
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
