import { describe, afterEach, test, expect } from '@jest/globals';
import { match } from '../src/web-search/match';

// eslint-disable-next-line max-lines-per-function
describe('match', () => {
  afterEach(() => {});

  test('english match', () => {
    expect(
      match('bilibili', 'https://www.bilibili.com/video/BV1oh4y167SE/?spm_id_from=333.788.recommend_more_video.0')
        .isAllPieceMatch,
    ).toBe(true);
  });

  test('uppercase match', () => {
    expect(
      match('BILIBILI', 'https://www.bilibili.com/video/BV1oh4y167SE/?spm_id_from=333.788.recommend_more_video.0')
        .isAllPieceMatch,
    ).toBe(true);
  });

  test('space match', () => {
    expect(
      match('bilibili ', 'https://www.bilibili.com/video/BV1oh4y167SE/?spm_id_from=333.788.recommend_more_video.0')
        .isAllPieceMatch,
    ).toBe(true);
  });

  test('path match', () => {
    expect(match('match', 'packages/web/search/test/match.test.ts').sourceSegList).toStrictEqual([
      {
        segment: 'packages/web/search/test/',
        type: 'normal',
      },
      {
        segment: 'match',
        type: 'match',
      },
      {
        segment: '.test.ts',
        type: 'normal',
      },
    ]);
  });

  test('component name match', () => {
    expect(match('match-file', 'packages/web/search-p-folder/test-folder/match-file.ts').sourceSegList).toStrictEqual([
      {
        segment: 'packages/web/search-p-folder/test-folder/',
        type: 'normal',
      },
      {
        segment: 'match-file',
        type: 'match',
      },
      {
        segment: '.ts',
        type: 'normal',
      },
    ]);
  });

  test('multiple part match', () => {
    expect(match('folder', 'packages/web/search-p-folder/test-folder/match-file.ts').sourceSegList).toStrictEqual([
      {
        segment: 'packages/web/search-p-',
        type: 'normal',
      },
      {
        segment: 'folder',
        type: 'match',
      },
      {
        segment: '/test-folder/match-file.ts',
        type: 'normal',
      },
    ]);
  });

  test('2 part match', () => {
    expect(match('packa/ui-button', 'f/packages/ui-button/src/a.vue').sourceSegList).toStrictEqual([
      {
        segment: 'f/',
        type: 'normal',
      },
      {
        segment: 'packa',
        type: 'match',
      },
      {
        segment: 'ges',
        type: 'normal',
      },
      {
        segment: '/ui-button',
        type: 'match',
      },
      {
        segment: '/src/a.vue',
        type: 'normal',
      },
    ]);
  });

  test('match empty', () => {
    expect(match('yyy', 'xxxxx').sourceSegList).toStrictEqual([
      {
        segment: 'xxxxx',
        type: 'normal',
      },
    ]);
  });
});
