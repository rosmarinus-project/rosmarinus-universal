import { isPromise } from '../../src/functions/is-type';

describe('样例', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('isPromise true', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
  });

  test('isPromise false', () => {
    expect(isPromise({})).toBe(false);
  });
});
