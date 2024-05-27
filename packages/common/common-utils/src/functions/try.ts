export async function tryPromise<T>(res: Promise<T>): Promise<T | undefined> {
  return res.then((v) => v).catch(() => undefined);
}
