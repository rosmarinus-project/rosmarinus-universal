export function urlToJson(url: string): Record<string, string> {
  const result: Record<string, string> = {};

  if (!url) {
    return result;
  }

  let paramList = url.split('?');

  if (paramList.length !== 2 && paramList.length !== 1) {
    // only one or two parts are allowed
    return result;
  }

  paramList = paramList[paramList.length - 1].split('&');
  paramList.forEach((paramEntry) => {
    const entry = paramEntry.split('=');

    if (entry.length === 2) {
      const [key, value] = entry;

      result[key] = decodeURIComponent(value);
    }
  });

  return result;
}

export function parseURLSearchParams(url?: string): [string, Record<string, string>] {
  if (!url) {
    return ['', {}] as const;
  }

  const [urlWithoutSearch, search] = url.split('?');

  if (!search) {
    return [urlWithoutSearch, {}] as const;
  }

  return [urlWithoutSearch, Object.fromEntries(new URLSearchParams(search))] as const;
}

export function stringifyURLSearchParams(url: string, search?: Record<string, string>): string {
  const searchParams = new URLSearchParams(search);
  const searchStr = searchParams.toString();

  if (!searchStr) {
    return url;
  }

  return `${url}?${searchStr}`;
}
