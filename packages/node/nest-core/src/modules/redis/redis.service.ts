import { AsyncTask } from '@rosmarinus/common-utils';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

export interface RedisInitParams {
  port: number;
  host: string;
  password?: string;
}

@Injectable()
export class RedisService {
  private redisInitTask?: AsyncTask<Redis>;

  public init(params: RedisInitParams) {
    const redis = new Redis(params);

    redis.on('error', (err) => {
      console.log('Redis cluster Error', err);
      this.redisInitTask?.fail(err);
    });
    redis.on('connect', () => {
      console.log('redis连接成功');
      this.redisInitTask?.done(redis);
    });
    this.redisInitTask = new AsyncTask();

    return this.redisInitTask.promise;
  }

  public async getRedisClient() {
    if (!this.redisInitTask) {
      throw new Error('redis未初始化');
    }

    return this.redisInitTask.promise;
  }
}
