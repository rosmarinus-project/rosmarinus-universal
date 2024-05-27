import { colorPaletteToCssVarMap, colorPaletteToCssVarMapList } from '../src/components/colors';
import { arrToCssVarObj } from '../src/utils';

describe('color', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('colorPaletteToCssVarMap', () => {
    expect(
      colorPaletteToCssVarMap({
        'neutral/100': '#ffffff',
        'NEUTRAL/400/100': '#ffffff',
        neutral_1000: '#ffffff',
        'neutral-200': '#ffffff',
      }),
    ).toStrictEqual({
      '--neutral-100': '#ffffff',
      '--neutral-400-100': '#ffffff',
      '--neutral-1000': '#ffffff',
      '--neutral-200': '#ffffff',
    });
  });

  test('arrToCssVarObj', () => {
    expect(
      arrToCssVarObj(['neutral/100', 'NEUTRAL/400/100', 'neutral_1000', 'neutral-200', '--neutral-300']),
    ).toStrictEqual({
      'neutral-100': 'var(--neutral-100)',
      'neutral-400-100': 'var(--neutral-400-100)',
      'neutral-1000': 'var(--neutral-1000)',
      'neutral-200': 'var(--neutral-200)',
      'neutral-300': 'var(--neutral-300)',
    });
  });

  test('colorPaletteToCssVarMapList', () => {
    expect(
      colorPaletteToCssVarMapList({
        'neutral-100': ['#ffffff', '#000000'],
      }),
    ).toStrictEqual([{ '--neutral-100': '#ffffff' }, { '--neutral-100': '#000000' }]);
  });
});
