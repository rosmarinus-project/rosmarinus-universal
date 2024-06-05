import Pinyin from 'pinyin-match';
import fuzzysort from 'fuzzysort';
import { isArray } from '@rosmarinus/common-utils';
import type { SearchResultSeg } from '../common/types';
import { chainInvoke } from './invoke';

export interface MatchParams {
  querySegList: string[];
  sourceSegList: string[];
  query: string;
  source: string;
}

export interface MatchResult {
  res: SearchResultSeg[];
}

/**
 * 自己实现的最长匹配
 */
export function longestSegMatch({ sourceSegList, querySegList }: MatchParams): MatchResult {
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

/** 拼音匹配算法 */
export function pinyinMatch({ source, query }: MatchParams): MatchResult | undefined {
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

export function fuzzyMatch({ source, query }: MatchParams): MatchResult | undefined {
  const result = fuzzysort.single(query, source);
  const indexList = result?.indexes;

  if (!indexList?.length) {
    return undefined;
  }

  const matchResult: SearchResultSeg[] = [];
  let idx = 0;
  let indexIdx = 0;

  while (idx < source.length) {
    // 一开始 idx 指向未匹配的左端，indexIdx 寻找并指向匹配的左端，这样选出未匹配的部分
    let index = indexList[indexIdx];

    if (index > idx) {
      matchResult.push({ segment: source.slice(idx, index), type: 'normal' });
    }

    // 第二步，idx 指向匹配的左端，indexIdx 寻找并指向匹配的右端，这样选出匹配的部分
    idx = index;

    indexIdx += 1;

    // 连续匹配部分合并
    while (indexIdx < indexList.length && indexList[indexIdx] === index + 1) {
      indexIdx += 1;
      index += 1;
    }

    matchResult.push({ segment: source.slice(idx, index + 1), type: 'match' });

    idx = index + 1;
  }

  return { res: matchResult };
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
