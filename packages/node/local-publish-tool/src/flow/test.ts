import type { TestNpm } from '../enum';
import checkModule from '../checkModule';

export interface RunUnitTestParams {
  cwd: string;
  testNpm: TestNpm;
}

export async function runUnitTest(params: RunUnitTestParams) {
  if (!checkModule(params.testNpm)) {
    return;
  }

  const root = params.cwd;

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const jest = require('jest');
  const { results } = await jest.runCLI(
    {
      coverage: true,
    },
    [root],
  );

  return results;
}
