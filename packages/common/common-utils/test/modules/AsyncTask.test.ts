import { describe, it, expect } from '@jest/globals';
import { AsyncTask, AsyncTaskPool } from '../../src';

// eslint-disable-next-line max-lines-per-function
describe('async task', () => {
  // test AsyncTask

  it('task done', async () => {
    const task = new AsyncTask<string>();

    setTimeout(() => {
      task.done('finish');
    }, 3);
    const data = await task.promise;

    expect(data).toBe('finish');
  });

  it('task fail', async () => {
    const task = new AsyncTask<string>();

    setTimeout(() => {
      task.fail('error');
    }, 3);
    expect(task.promise).rejects.toMatch('error');
  });

  it('task timeout', async () => {
    const task = new AsyncTask<string>();

    task.setTimeout(3);
    expect(task.promise).rejects.toMatch('timeout');
  });

  // test AsyncTaskPool

  it('pool done', async () => {
    const pool = new AsyncTaskPool<string, string>();

    setTimeout(() => {
      pool.done('key', 'value');
    }, 3);
    const task = new AsyncTask<string>();

    pool.add('key', task);
    const data = await task.promise;

    expect(data).toBe('value');
  });

  it('pool fail', async () => {
    const pool = new AsyncTaskPool<string, string>();

    setTimeout(() => {
      pool.fail('key', 'error');
    }, 3);
    const task = new AsyncTask<string>();

    pool.add('key', task);

    expect(task.promise).rejects.toMatch('error');
  });

  it('pool timeout', async () => {
    const pool = new AsyncTaskPool<string, string>();
    const task = new AsyncTask<string>();

    pool.add('key', task, 3);
    expect(task.promise).rejects.toMatch('timeout');
  });

  it('pool remove', async () => {
    const pool = new AsyncTaskPool<string, string>();
    const task = new AsyncTask<string>();

    pool.add('key', task);
    expect(pool.get('key')?.length).toBe(1);
    pool.remove('key', task);
    expect(pool.get('key')?.length).toBe(0);
  });

  it('pool pool size success', async () => {
    const pool = new AsyncTaskPool<string, string>();
    const task = new AsyncTask<string>();

    pool.add('key', task);
    expect(pool.size()).toBe(1);
    pool.done('key', 'value');
    expect(pool.size()).toBe(0);
  });

  it('pool pool size fail', async () => {
    const pool = new AsyncTaskPool<string, string>();
    const task = new AsyncTask<string>();

    pool.add('key', task);
    expect(pool.size()).toBe(1);
    pool.fail('key', 'err');
    expect(pool.size()).toBe(0);
    expect(task.promise).rejects.toBe('err');
  });
});
