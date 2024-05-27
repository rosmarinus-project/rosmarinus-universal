import { REPO } from './common/const';
import { shell, shellAsync, shellConfirm } from './common/shell';

function getAllLocalBranches() {
  const branch = shell('git branch');

  return branch
    .split('\n')
    .filter((line) => !!line)
    .map((line) => line.trim().replace('*', ''));
}

async function isBranchExistInRemote(branch: string) {
  return !!(await shellAsync(`git ls-remote --heads ${REPO} ${branch}`));
}

async function getBranchesNeedToRemove() {
  const localBranches = getAllLocalBranches();
  const isExist = localBranches.map((branch) => isBranchExistInRemote(branch));
  const existBranches = await Promise.all(isExist);

  return localBranches.filter((branch, index) => !existBranches[index]);
}

function deleteBranchLocal(branch: string) {
  return shell(`git branch -D ${branch}`);
}

async function main() {
  try {
    const branches = await getBranchesNeedToRemove();
    let output = '';

    if (!branches.length) {
      output = 'There is no branch need to remove';
    } else {
      console.log(`\n${branches.join('\n')}\n`);
      const canRemove = await shellConfirm('Are you sure to remove these branches?');

      if (canRemove) {
        branches.forEach((branch) => {
          output += `\nbranch ${branch} has been removed`;
          deleteBranchLocal(branch);
        });
      } else {
        output = 'You have canceled the operation';
      }
    }

    console.log(`\n${output}\n`);
  } catch (e) {
    console.error('gbc fail: ', e);
  }
}

main();
