/**
 * 使用正则表达式解码常见的HTML字符实体
 * 适用于非浏览器环境
 */
// eslint-disable-next-line max-lines-per-function
export function decodeHtmlEntitiesRegex(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    // eslint-disable-next-line @typescript-eslint/quotes
    '&#39;': "'",
    // eslint-disable-next-line @typescript-eslint/quotes
    '&apos;': "'",
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&bull;': '•',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
    '&infin;': '∞',
    '&ne;': '≠',
    '&le;': '≤',
    '&ge;': '≥',
    '&asymp;': '≈',
    '&radic;': '√',
    '&sum;': '∑',
    '&prod;': '∏',
    '&int;': '∫',
    '&alpha;': 'α',
    '&beta;': 'β',
    '&gamma;': 'γ',
    '&delta;': 'δ',
    '&epsilon;': 'ε',
    '&zeta;': 'ζ',
    '&eta;': 'η',
    '&theta;': 'θ',
    '&iota;': 'ι',
    '&kappa;': 'κ',
    '&lambda;': 'λ',
    '&mu;': 'μ',
    '&nu;': 'ν',
    '&xi;': 'ξ',
    '&omicron;': 'ο',
    '&pi;': 'π',
    '&rho;': 'ρ',
    '&sigma;': 'σ',
    '&tau;': 'τ',
    '&upsilon;': 'υ',
    '&phi;': 'φ',
    '&chi;': 'χ',
    '&psi;': 'ψ',
    '&omega;': 'ω',
    '&Alpha;': 'Α',
    '&Beta;': 'Β',
    '&Gamma;': 'Γ',
    '&Delta;': 'Δ',
    '&Epsilon;': 'Ε',
    '&Zeta;': 'Ζ',
    '&Eta;': 'Η',
    '&Theta;': 'Θ',
    '&Iota;': 'Ι',
    '&Kappa;': 'Κ',
    '&Lambda;': 'Λ',
    '&Mu;': 'Μ',
    '&Nu;': 'Ν',
    '&Xi;': 'Ξ',
    '&Omicron;': 'Ο',
    '&Pi;': 'Π',
    '&Rho;': 'Ρ',
    '&Sigma;': 'Σ',
    '&Tau;': 'Τ',
    '&Upsilon;': 'Υ',
    '&Phi;': 'Φ',
    '&Chi;': 'Χ',
    '&Psi;': 'Ψ',
    '&Omega;': 'Ω',
  };

  // 先处理命名的HTML实体
  let result = text;

  for (const [entity, char] of Object.entries(htmlEntities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }

  // 处理数字HTML实体 (如 &#160;, &#x00A0;)
  result = result.replace(/&#(\d+);/g, (_, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });

  // 处理十六进制HTML实体 (如 &#x00A0;)
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return result;
}