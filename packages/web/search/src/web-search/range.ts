import type { SearchResultSeg } from '../common/types';

/** 左闭右开 */
export type Range = [number, number];

export function getSpaceRange(source: string): Range[] {
  const result: Range[] = [];

  let nowIndex = 0;

  source.split(' ').forEach((item) => {
    if (!item.trim()) {
      nowIndex += item.length || 1;

      return;
    }

    const end = nowIndex + item.length;

    result.push([nowIndex, end]);
    nowIndex = end + 1;
  });

  return result;
}

export function isRangeCross(rangeA: Range, rangeB: Range): boolean {
  const [startA, endA] = rangeA;
  const [startB, endB] = rangeB;

  return startA <= endB && startB <= endA;
}

export function getSegMatchRange(segList: SearchResultSeg[]): Range[] {
  let index = 0;
  const result: Range[] = [];

  segList.forEach((seg) => {
    if (seg.type === 'match') {
      result.push([index, index + seg.segment.length]);
    }

    index += seg.segment.length;
  });

  return result;
}
