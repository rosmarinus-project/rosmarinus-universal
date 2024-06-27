import { resolve } from 'path';
import { describe, beforeEach, afterEach, test } from '@jest/globals';
import { genExportMap } from '../src';
import { loadContext } from '../src/context';

describe('example', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('case', async () => {
    const ctx = await loadContext({
      config: resolve('map.config.js'),
    });

    await genExportMap(ctx);
  });
});
