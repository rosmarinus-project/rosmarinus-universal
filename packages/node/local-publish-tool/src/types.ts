import type { PkgManager, TestNpm } from './enum';

export interface Params {
  config: string;
}

export interface Context {
  cwd: string;
  pkgManager: PkgManager;
  master: string;
  testNpm: TestNpm;
}
