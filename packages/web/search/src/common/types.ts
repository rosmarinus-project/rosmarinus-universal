export interface SearchResultSeg {
  /** 分词 */
  segment: string;
  /** match: 命中，normal: 没命中的部分 */
  type: 'match' | 'normal';
}
