import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { safeJSONParse, safeJSONStringify } from '../../src/functions/json';

describe('json', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('parse success', () => {
    const obj = safeJSONParse('{"a":1}');

    expect(obj).toEqual({ a: 1 });
  });

  test('parse fail', () => {
    const obj = safeJSONParse('{"a":1');

    expect(obj).toBeUndefined();
  });

  test('stringify success', () => {
    const str = safeJSONStringify({ a: 1 });

    expect(str).toBe('{"a":1}');
  });

  test('stringify fail', () => {
    const a: any = {};
    const b: any = { a };

    a.b = b;
    const str = safeJSONStringify({ a, b });

    expect(str).toBe('{"a":{"b":{"a":"[Circular]"}},"b":{"a":"[Circular]"}}');
  });
});
