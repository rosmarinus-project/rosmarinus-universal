import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { mergeSearchSegList } from '../src/web-search/match';
import { type SearchResultSeg } from '../src/common/types';

// eslint-disable-next-line max-lines-per-function
describe('merge-search-seg-list', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('两个完全分离的 range 合并', () => {
    const source = '1234567890';
    const seg1: SearchResultSeg[] = [
      { type: 'match', segment: '123' },
      { type: 'normal', segment: '4567890' },
    ];
    const seg2: SearchResultSeg[] = [
      { type: 'normal', segment: '1234' },
      { type: 'match', segment: '567' },
      { type: 'normal', segment: '890' },
    ];

    expect(mergeSearchSegList(seg1, seg2, source)).toStrictEqual([
      { type: 'match', segment: '123' },
      { type: 'normal', segment: '4' },
      { type: 'match', segment: '567' },
      { type: 'normal', segment: '890' },
    ]);
  });

  test('两个有部分重合的 range 合并', () => {
    const source = '1234567890';
    const seg1: SearchResultSeg[] = [
      { type: 'match', segment: '1234' },
      { type: 'normal', segment: '567890' },
    ];
    const seg2: SearchResultSeg[] = [
      { type: 'normal', segment: '12' },
      { type: 'match', segment: '34567' },
      { type: 'normal', segment: '890' },
    ];

    expect(mergeSearchSegList(seg1, seg2, source)).toStrictEqual([
      { type: 'match', segment: '1234567' },
      { type: 'normal', segment: '890' },
    ]);
  });

  test('两个有部分重合的 range 合并 2', () => {
    const source = '1234567890';
    const seg1: SearchResultSeg[] = [
      { type: 'normal', segment: '1' },
      { type: 'match', segment: '234' },
      { type: 'normal', segment: '567890' },
    ];
    const seg2: SearchResultSeg[] = [
      { type: 'normal', segment: '12' },
      { type: 'match', segment: '34567' },
      { type: 'normal', segment: '890' },
    ];

    expect(mergeSearchSegList(seg1, seg2, source)).toStrictEqual([
      { type: 'normal', segment: '1' },
      { type: 'match', segment: '234567' },
      { type: 'normal', segment: '890' },
    ]);
  });

  test('两个完全重合的 range 合并', () => {
    const source = '1234567890';
    const seg1: SearchResultSeg[] = [
      { type: 'normal', segment: '1' },
      { type: 'match', segment: '23456' },
      { type: 'normal', segment: '7890' },
    ];
    const seg2: SearchResultSeg[] = [
      { type: 'normal', segment: '12' },
      { type: 'match', segment: '345' },
      { type: 'normal', segment: '67890' },
    ];

    expect(mergeSearchSegList(seg1, seg2, source)).toStrictEqual([
      { type: 'normal', segment: '1' },
      { type: 'match', segment: '23456' },
      { type: 'normal', segment: '7890' },
    ]);
  });

  test('bad case 1', () => {
    const source = 'arc browser';
    const seg1: SearchResultSeg[] = [
      {
        segment: '',
        type: 'normal',
      },
      {
        segment: 'arc',
        type: 'match',
      },
      {
        segment: '',
        type: 'normal',
      },
      {
        segment: ' ',
        type: 'normal',
      },
      {
        segment: '',
        type: 'normal',
      },
      {
        segment: 'br',
        type: 'match',
      },
      {
        segment: 'owser',
        type: 'normal',
      },
    ];
    const seg2: SearchResultSeg[] = [
      {
        segment: 'arc br',
        type: 'match',
      },
      {
        segment: 'owser',
        type: 'normal',
      },
    ];

    // debugger;
    expect(mergeSearchSegList(seg1, seg2, source)).toStrictEqual([
      {
        segment: 'arc br',
        type: 'match',
      },
      {
        segment: 'owser',
        type: 'normal',
      },
    ]);
  });
});
