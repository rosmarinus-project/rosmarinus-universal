import { execSync, exec } from 'child_process';
import { confirm } from '@inquirer/prompts';

/** 为了缩小包体积，用最原生的 shell */
export function shell(cmd: string) {
  try {
    return execSync(cmd, { cwd: process.cwd() }).toString();
  } catch (e) {
    throw '命令执行失败';
  }
}

/** 为了缩小包体积，用最原生的 shell */
export async function shellAsync(cmd: string) {
  try {
    return new Promise<string>((resolve, reject) => {
      exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  } catch (e) {
    throw '命令执行失败';
  }
}

export async function shellConfirm(content: string) {
  return confirm({ message: content });
}
