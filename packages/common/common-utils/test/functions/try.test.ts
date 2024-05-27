import { tryPromise } from '../../src/functions/try';

describe('try', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('try-good', async () => {
    const res = await tryPromise(Promise.resolve('a'));

    expect(res).toBe('a');
  });

  test('try-bad', async () => {
    const res = await tryPromise(Promise.reject('a'));

    expect(res).toBe(undefined);
  });
});
