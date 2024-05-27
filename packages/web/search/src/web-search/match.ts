import Pinyin from 'pinyin-match';
import { isArray } from '@rosmarinus/common-utils';
import { SearchResultSeg } from '../common/types';
import { chainInvoke, mergeInvokeAll } from './invoke';
import { splitTextInSegmenter } from './segment';
import { getSegMatchRange, isRangeCross, Range } from './range';

export interface SearchMatchResult {
  /** 原料加工后的产物 */
  sourceSegList: SearchResultSeg[];
  /** 命中次数 */
  matchCount: number;
  /**
   * 以空格隔开的情况下，是否所有部分都有命中的
   *
   * 如果用于判断是否命中搜索，则要用这个来判断，而不是 matchCount
   */
  isAllPieceMatch: boolean;
}

/** 将两个搜索结果合并，如果有一部分两个都命中，则取最长来合并。如果只有其中一个命中，则算命中 */
// eslint-disable-next-line max-lines-per-function
export function mergeSearchSegList(
  segListA: SearchResultSeg[],
  segListB: SearchResultSeg[],
  source: string,
): SearchResultSeg[] {
  const result: SearchResultSeg[] = [];

  const allMatches = getSegMatchRange(segListA).concat(getSegMatchRange(segListB));

  const allMatchesSorted = allMatches.sort((a, b) => a[0] - b[0]);

  let nowIndex = 0;

  for (let i = 0; i < allMatchesSorted.length; i += 1) {
    const matchRange = allMatchesSorted[i];

    const [startA, endA] = matchRange;

    let skipMergeLen = 0;
    let mergeRange: Range = matchRange;

    for (let j = i + 1; j < allMatchesSorted.length; j += 1) {
      const nextMatchRange = allMatchesSorted[j];

      // 多个相邻的重合，合并
      if (isRangeCross(mergeRange, nextMatchRange)) {
        const [startB, endB] = nextMatchRange;
        // 两个重合，取最长
        const newStart = Math.min(startA, startB);
        const newEnd = Math.max(endA, endB);

        mergeRange = [newStart, newEnd];

        // 跳过下一个
        skipMergeLen += 1;
      } else {
        // 如果能合并的必定相邻，所以不相邻就可以跳出了。后续看看这里是否有 bad case
        break;
      }
    }

    if (skipMergeLen !== 0) {
      // 多个重合的合并
      const [newStart, newEnd] = mergeRange;

      if (nowIndex < newStart) {
        result.push({
          segment: source.slice(nowIndex, newStart),
          type: 'normal',
        });
      }

      result.push({
        segment: source.slice(newStart, newEnd),
        type: 'match',
      });
      nowIndex = newEnd;

      i += skipMergeLen;
    } else {
      // 没有找到重合，取前一个
      const [start, end] = matchRange;

      if (nowIndex < start) {
        result.push({
          segment: source.slice(nowIndex, start),
          type: 'normal',
        });
      }

      result.push({
        segment: source.slice(start, end),
        type: 'match',
      });
      nowIndex = end;
    }
  }

  if (nowIndex !== source.length) {
    result.push({
      segment: source.slice(nowIndex),
      type: 'normal',
    });
  }

  return result;
}

function matchSegmenter(query: string, source: string): number[] {
  return (
    chainInvoke(
      [
        ({ query, source }) => {
          // 不区分大小写
          const index = source.toLowerCase().indexOf(query.toLowerCase());

          if (~index) {
            return { res: [index, index + query.length] };
          }
        },
      ],
      { query, source },
    ) || []
  );
}

interface MatchParams {
  querySegList: string[];
  sourceSegList: string[];
  query: string;
  source: string;
}

/**
 * 获取检索相似度结果
 *
 * @param query 用户输入的检索词
 * @param source 数据原料
 * @returns
 */
export function match(query: string, source: string, locales?: string): SearchMatchResult {
  const sourceSegList = splitTextInSegmenter(source, locales).map((seg) => seg.segment);
  const querySegList = splitTextInSegmenter(query, locales).map((seg) => seg.segment);

  const resultSegList =
    mergeInvokeAll(
      [longestSegMatch, pinyinMatch],
      (res) => {
        let result: SearchResultSeg[] = [];

        res.forEach((segList) => {
          result = mergeSearchSegList(result, segList, source);
        });

        return result;
      },
      { querySegList, sourceSegList, query, source },
    ) || [];

  const count = resultSegList.filter((seg) => seg.type === 'match').length;

  const spaceSegList = query.split(' ').filter(Boolean);

  return {
    isAllPieceMatch:
      !!query.trim() &&
      spaceSegList.every((seg) => {
        return resultSegList
          .filter((item) => item.type === 'match')
          .some((segItem) => segItem.segment.toLowerCase().includes(seg.toLowerCase()));
      }),
    matchCount: count,
    sourceSegList: resultSegList,
  };
}

function longestSegMatch({ sourceSegList, querySegList }: MatchParams) {
  const resultSegList: SearchResultSeg[] = [];

  sourceSegList.forEach((sourceSeg) => {
    let thisSourceSegList: SearchResultSeg[] = [];
    let hitLen = 0;

    querySegList.forEach((querySeg) => {
      const matchRange = matchSegmenter(querySeg, sourceSeg);

      if (matchRange.length === 2 && !!querySeg.trim()) {
        // 看看命中多少个
        const prefixPart = sourceSeg.slice(0, matchRange[0]);
        const suffixPart = sourceSeg.slice(matchRange[1]);

        if (matchRange[1] - matchRange[0] <= hitLen) {
          // 只要最长匹配
          return;
        }

        thisSourceSegList = [
          { segment: prefixPart, type: 'normal' },
          { segment: sourceSeg.slice(matchRange[0], matchRange[1]), type: 'match' },
          { segment: suffixPart, type: 'normal' },
        ];
        hitLen = matchRange[1] - matchRange[0];
      }
    });

    if (hitLen === 0) {
      // 不命中
      resultSegList.push({ segment: sourceSeg, type: 'normal' });

      return;
    }

    resultSegList.push(...thisSourceSegList);
  });

  return { res: resultSegList };
}

function pinyinMatch({ source, query }: MatchParams) {
  const res = Pinyin.match(source, query);

  const result: SearchResultSeg[] = [];

  if (!isArray(res)) {
    return undefined;
  }

  const start = res[0] ?? 0;
  const end = (res[1] ?? 0) + 1;

  if (end <= start) {
    return undefined;
  }

  start > 0 && result.push({ segment: source.slice(0, start), type: 'normal' });
  result.push({ segment: source.slice(start, end), type: 'match' });
  end < source.length && result.push({ segment: source.slice(end), type: 'normal' });

  return { res: result };
}
