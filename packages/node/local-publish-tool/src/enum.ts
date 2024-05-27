export const enum VersionMode {
  major = 'major',
  minor = 'minor',
  patch = 'patch',
}

export const enum PkgManager {
  npm = 'npm',
  pnpm = 'pnpm',
  yarn = 'yarn',
}

export const enum TestNpm {
  jest = 'jest',
}

export const LOCK_FILE_MAP: Record<PkgManager, string> = {
  [PkgManager.npm]: 'package-lock.json',
  [PkgManager.pnpm]: 'pnpm-lock.yaml',
  [PkgManager.yarn]: 'yarn.lock',
};
