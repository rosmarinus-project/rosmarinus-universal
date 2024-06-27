import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { hookAsyncData } from '../../src/functions/hooks';

describe('hooks', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('setData', async () => {
    const { setData, getData } = hookAsyncData(async () => 'a');

    setData('b');
    expect(await getData()).toBe('b');
  });

  test('setDataInFn', async () => {
    const { setDataInFn, getData } = hookAsyncData(async () => 'a');

    await setDataInFn((p) => `${p}b`);
    expect(await getData()).toBe('ab');
  });
});
