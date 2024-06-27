import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import {
  addKVToList,
  recordToKVList,
  removeKVFromList,
  kvListToRecord,
  mergeKVListInto,
  isListHasKV,
} from '../../src/functions/kv';

describe('kv', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('addKVToList append', () => {
    expect(addKVToList([{ key: 'k1' }], { key: 'k2' })).toEqual([{ key: 'k1' }, { key: 'k2' }]);
  });

  test('addKVToList replace', () => {
    expect(addKVToList([{ key: 'k1' }], { key: 'k1' })).toEqual([{ key: 'k1' }]);
  });

  test('recordToKVList', () => {
    expect(recordToKVList({ k1: 'v1' }, ({ key, value }) => ({ key, value }))).toEqual([{ key: 'k1', value: 'v1' }]);
  });

  test('removeKVFromList success', () => {
    expect(removeKVFromList([{ key: 'k1' }, { key: 'k2' }], { key: 'k1' })).toEqual([{ key: 'k2' }]);
  });

  test('removeKVFromList fail', () => {
    expect(removeKVFromList([{ key: 'k1' }, { key: 'k2' }], { key: 'k3' })).toEqual([{ key: 'k1' }, { key: 'k2' }]);
  });

  test('kvListToRecord', () => {
    expect(kvListToRecord([{ key: 'k1', value: 'v1' }])).toEqual({ k1: 'v1' });
  });

  test('isListHasKV success', () => {
    expect(isListHasKV([{ key: 'k1' }], { key: 'k1' })).toBeTruthy();
  });

  test('isListHasKV fail', () => {
    expect(isListHasKV([{ key: 'k1' }], { key: 'k2' })).toBeFalsy();
  });

  test('mergeKVListInto', () => {
    expect(mergeKVListInto([{ key: 'k1' }], [{ key: 'k1' }])).toEqual([{ key: 'k1' }]);
  });

  test('mergeKVListInto duplicate', () => {
    expect(mergeKVListInto([{ key: 'k1' }], [{ key: 'k1' }, { key: 'k2' }])).toEqual([{ key: 'k1' }, { key: 'k2' }]);
  });
});
