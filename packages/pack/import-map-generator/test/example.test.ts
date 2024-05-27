import { resolve } from 'path';
import { genExportMap } from '../src';
import { loadContext } from '../src/context';

describe('样例', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('样例', async () => {
    const ctx = await loadContext({
      config: resolve('map.config.js'),
    });

    await genExportMap(ctx);
  });
});
