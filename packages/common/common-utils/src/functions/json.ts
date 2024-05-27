import stringify from 'fast-safe-stringify';

export const safeJSONStringify = stringify;

export function safeJSONParse<T = any>(json: string | null | undefined, defaultValue?: T): T | undefined {
  if (!json) {
    return defaultValue;
  }

  try {
    return JSON.parse(json);
  } catch {
    // error
  }

  return defaultValue;
}
