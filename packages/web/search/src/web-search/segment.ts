export function splitTextInSegmenter(text: string, locales = 'zh') {
  const seg = new Intl.Segmenter(locales ?? 'zh-CN', { granularity: 'word' });
  const res = seg.segment(text);

  return Array.from(res);
}
