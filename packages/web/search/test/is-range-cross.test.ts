import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { isRangeCross } from '../src/web-search/range';

describe('is-range-cross', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('rangeA 在 rangeB 左', () => {
    expect(isRangeCross([0, 1], [2, 3])).toBe(false);
  });

  test('rangeA 在 rangeB 右', () => {
    expect(isRangeCross([2, 3], [0, 1])).toBe(false);
  });

  test('rangeA 在 rangeB 内', () => {
    expect(isRangeCross([1, 2], [0, 3])).toBe(true);
  });

  test('rangeA 在 rangeB 外', () => {
    expect(isRangeCross([0, 3], [1, 2])).toBe(true);
  });

  test('rangeA 与 rangeB 重合', () => {
    expect(isRangeCross([0, 3], [0, 3])).toBe(true);
  });

  test('rangeA 与 rangeB 重合左一部分', () => {
    expect(isRangeCross([0, 3], [1, 4])).toBe(true);
  });

  test('rangeA 与 rangeB 重合右一部分', () => {
    expect(isRangeCross([1, 4], [0, 3])).toBe(true);
  });

  test('rangeA 与 rangeB 重合左一点', () => {
    expect(isRangeCross([0, 3], [3, 4])).toBe(true);
  });

  test('rangeA 与 rangeB 重合右一点', () => {
    expect(isRangeCross([3, 4], [0, 3])).toBe(true);
  });
});
