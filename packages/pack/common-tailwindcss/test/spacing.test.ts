import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { spacingPaletteToCssVarMap } from '../src/components/spacing';

describe('spacing', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('spacingPaletteToCssVarMap', () => {
    expect(
      spacingPaletteToCssVarMap({
        sss: 1,
      }),
    ).toStrictEqual({
      '--sss': '1px',
    });
  });
});
