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
