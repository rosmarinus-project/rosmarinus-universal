import { SearchResultSeg } from '../common/types';
import { mergeInvokeAll } from './invoke';
import { splitTextInSegmenter } from './segment';
import { getSegMatchRange, isRangeCross, Range } from './range';
import { longestSegMatch, MatchResult, pinyinMatch, MatchParams, fuzzyMatch } from './algorithms';

export const enum SearchAlgorithmFlag {
  /** 最长匹配 */
  LONGEST_MATCH = 1 << 0,
  /** 拼音匹配 */
  PINYIN_MATCH = 1 << 1,
  /** fuzzysort 匹配 */
  FUZZYSORT_MATCH = 1 << 2,
}

export interface SearchOptions {
  locales?: string;
  /** 默认用 fuzzysort 匹配和拼音匹配 */
  enableAlgorithm?: SearchAlgorithmFlag;
}

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

function getMatchFnList(flag?: SearchAlgorithmFlag): ((params: MatchParams) => MatchResult | undefined)[] {
  const result: ((params: MatchParams) => MatchResult | undefined)[] = [];

  if (flag === undefined) {
    result.push(fuzzyMatch, pinyinMatch);
  } else {
    if (flag & SearchAlgorithmFlag.LONGEST_MATCH) {
      result.push(longestSegMatch);
    }

    if (flag & SearchAlgorithmFlag.FUZZYSORT_MATCH) {
      result.push(fuzzyMatch);
    }

    if (flag & SearchAlgorithmFlag.PINYIN_MATCH) {
      result.push(pinyinMatch);
    }
  }

  return result;
}

/**
 * 获取检索相似度结果
 *
 * @param query 用户输入的检索词
 * @param source 数据原料
 * @returns
 */
export function match(query: string, source: string, options?: SearchOptions): SearchMatchResult {
  const sourceSegList = splitTextInSegmenter(source, options?.locales).map((seg) => seg.segment);
  const querySegList = splitTextInSegmenter(query, options?.locales).map((seg) => seg.segment);

  const resultSegList =
    mergeInvokeAll(
      getMatchFnList(options?.enableAlgorithm),
      (res) => {
        let result: SearchResultSeg[] = [{ type: 'normal', segment: source }];

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
