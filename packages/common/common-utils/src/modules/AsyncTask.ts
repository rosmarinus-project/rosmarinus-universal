/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 异步任务。可以将调用与回调分隔的操作封装成一个 promise
 *
 * @example
 * const task = new AsyncTask();
 * emitter.on('finish', () => {
 *  // 合适的时机调用 done，以让 promise resolve
 *  task.done();
 * });
 * emitter.on('error', (err) => {
 *  // 合适的时机调用 fail，以让 promise reject
 *  task.fail(err);
 * });
 * // 最好再设置下超时时间，超时的时候会让 promise reject
 * task.setTimeout(10000);
 * await task.promise;
 */
export class AsyncTask<T> {
  public readonly promise;

  private resolve?: (value: T | PromiseLike<T>) => void;

  private reject?: (reason?: any) => void;

  private timer: ReturnType<typeof setTimeout> | null = null;

  private isDone = false;

  public get hasDone() {
    return this.isDone;
  }

  public constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /**
   * 异步任务完成
   *
   * @param data 任务完成时的数据，会给到 promise
   */
  public done(data: T) {
    this.isDone = true;
    this.resolve?.(data);
  }

  /**
   * 异步任务失败
   *
   * @param err 任务失败时的错误信息，会以错误的形式抛给 promise
   */
  public fail(err: any) {
    this.isDone = true;
    this.reject?.(err);
  }

  /**
   * 设定异步任务的超时时间
   *
   * @param timeout 超时时间，单位毫秒
   * @param timeoutCallback 可以在触发超时时做些逻辑
   */
  public setTimeout(timeout: number, timeoutCallback?: () => void) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      timeoutCallback?.();
      this.fail('timeout');
    }, timeout);
  }
}

/**
 * 异步任务池
 *
 * AsyncTask 的再封装版本, 可以根据 key 来管理多个异步任务。一般用于非常多异步任务的场景
 *
 * 例如有个方法是要通过 uid 去查某个用户的信息，但是查询调用和回调是分开的。
 *
 * @example
 * const pool = new AsyncTaskPool<number, Info>();
 *
 * function getInfoByUid(uid: number) {
 *  // 当然你也可以通过 pool.get(uid) 来判断是否已经有任务了, 以避免重复的 promise
 *  const task = new AsyncTask<Info>();
 *  pool.add(uid, task);
 *  return task.promise;
 * }
 *
 * emitter.on('onGetInfo', (uid, info) => {
 *  pool.done(uid, info);
 * });
 */
export class AsyncTaskPool<K, V> {
  private source = new Map<K, AsyncTask<V>[]>();

  /**
   * 通过 key 获取加进来的异步任务列表
   *
   * @param key 查找的键值
   */
  public get(key: K): AsyncTask<V>[] | undefined {
    return this.source.get(key);
  }

  /**
   * 判断某个 key 值下面是否有异步任务
   */
  public has(key: K): boolean {
    return !!this.source.get(key)?.length;
  }

  /**
   * 主要方法，加入异步任务
   *
   * @param key 插入的键值
   * @param task 插入的任务
   * @param timeout 可选，超时时间，单位毫秒
   */
  public add(key: K, task: AsyncTask<V>, timeout?: number): boolean {
    const tasks = this.source.get(key);

    if (tasks?.find((t) => t === task)) {
      return false;
    }

    if (tasks) {
      tasks.push(task);
    } else {
      this.source.set(key, [task]);
    }

    if (typeof timeout === 'number') {
      task.setTimeout(timeout, () => {
        this.remove(key, task);
      });
    }

    return true;
  }

  /**
   * 主要方法，完成某个 key 值下的所有异步任务
   *
   * @param key 查找的键值
   * @param data 异步任务最后完成获取的数据，将会传给 这个 key 值下面的所有异步任务
   */
  public done(key: K, data: V) {
    const tasks = this.source.get(key);

    if (tasks) {
      tasks.forEach((task) => {
        task.done(data);
      });
      this.source.delete(key);
    }
  }

  /**
   * 让某个 key 值下面的所有异步任务失败
   *
   * @param key 查找的键值
   */
  public fail(key: K, err: any) {
    const tasks = this.source.get(key);

    if (tasks) {
      tasks.forEach((task) => {
        task.fail(err);
      });
      this.source.delete(key);
    }
  }

  /**
   * 让所有的异步任务都失败，一般在销毁时期调用
   *
   * @param errMsg 错误信息
   */
  public failAll(errMsg: string) {
    this.source.forEach((tasks) => {
      tasks.forEach((task) => {
        task.fail(errMsg);
      });
    });
    this.source.clear();
  }

  /**
   * 移除异步任务
   *
   * @param key 查找的键值
   * @param task 要移除的任务。一个 key 下面可能有多个任务
   */
  public remove(key: K, task: AsyncTask<V>) {
    const tasks = this.source.get(key);

    if (tasks) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  }

  /**
   * 获取当前异步任务池子里面还有多少个异步任务
   */
  public size() {
    return [...this.source.values()].reduce((sum, tasks) => sum + tasks.length, 0);
  }
}
