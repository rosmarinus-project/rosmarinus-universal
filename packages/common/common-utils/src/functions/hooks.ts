import { isPromise } from './is-type';

export interface HookAsyncDataOptions<T> {
  beforeUpdate?: (data: T) => void | Promise<void>;
  afterUpdate?: (data: T) => void | Promise<void>;
}

export function hookAsyncData<T>(init: Promise<T> | (() => Promise<T>), options?: HookAsyncDataOptions<T>) {
  const initPromise = isPromise(init) ? init : init();
  let data: T | undefined = undefined;

  const getData = async () => {
    if (data !== undefined) {
      return data;
    }

    return initPromise;
  };

  return {
    getData,
    setData: (newData: T) => {
      options?.beforeUpdate?.(newData);
      data = newData;
      options?.afterUpdate?.(newData);
    },
    setDataInFn: async (fn: (data: T) => T | Promise<T>) => {
      const nowData = await getData();

      await options?.beforeUpdate?.(nowData);
      const res = fn(nowData);

      data = isPromise(res) ? await res : res;
      await options?.afterUpdate?.(data);
    },
  };
}
