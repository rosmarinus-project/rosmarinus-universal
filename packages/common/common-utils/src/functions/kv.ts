interface BaseKV {
  key: string;
}

interface KVWithValue extends BaseKV {
  value: string;
}

export function addKVToList<T extends BaseKV>(list: T[], kv: T): T[] {
  const newList = list.filter((item) => item.key !== kv.key);

  return [...newList, kv];
}

export function isListHasKV<T extends BaseKV>(list: T[], kv: T): boolean {
  return list.some((item) => item.key === kv.key);
}

export function removeKVFromList<T extends BaseKV>(list: T[], kv: T): T[] {
  return list.filter((item) => item.key !== kv.key);
}

export function kvListToRecord<T extends KVWithValue>(list: T[]): Record<string, string> {
  return list.reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item.value;

    return acc;
  }, {});
}

export function mergeKVListInto<T extends BaseKV>(from: T[], into: T[], mergeFn?: (oldItem: T, newItem: T) => T): T[] {
  const merged = Array.from(into);
  let itemToAppend = Array.from(from);

  merged.forEach((kvItem, i) => {
    const kvItemFrom = from.find((item) => item.key === kvItem.key);

    if (kvItemFrom) {
      itemToAppend = removeKVFromList(itemToAppend, kvItemFrom);
      merged[i] = mergeFn?.(merged[i], kvItemFrom) ?? kvItemFrom;
    }
  });

  return merged.concat(itemToAppend);
}

export function recordToKVList<T extends KVWithValue>(
  record: Record<string, string>,
  handler: (kv: KVWithValue) => T,
): T[] {
  return Object.entries(record).map(([key, value]) => {
    return handler?.({ key, value });
  });
}
