export function chainInvoke<Params, Result>(
  fnList: ((params: Params) => { res: Result | undefined; params?: Params } | undefined)[],
  params: Params,
): Result | undefined {
  let innerParams = { ...params };

  for (const fn of fnList) {
    const result = fn(params);

    if (result?.res) {
      return result.res;
    }

    if (result?.params) {
      innerParams = { ...innerParams, ...result.params };
    }
  }
}

export function mergeInvokeAll<Params, Result>(
  fnList: ((params: Params) => { res: Result | undefined; params?: Params } | undefined)[],
  merge: (resultList: Result[]) => Result,
  params: Params,
): Result | undefined {
  let innerParams = { ...params };
  const resultList: Result[] = [];

  for (const fn of fnList) {
    const result = fn(params);

    if (result?.res) {
      resultList.push(result.res);
    }

    if (result?.params) {
      innerParams = { ...innerParams, ...result.params };
    }
  }

  return merge(resultList);
}
