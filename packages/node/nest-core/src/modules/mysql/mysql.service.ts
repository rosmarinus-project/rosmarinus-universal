import { Injectable } from '@nestjs/common';
import knex, { Knex } from 'knex';

export interface MysqlInitParams {
  address: string;
  username?: string;
  password: string;
  database?: string;
  port?: number;
}

@Injectable()
export class MysqlService {
  private knex?: ReturnType<typeof knex>;

  public init(params: MysqlInitParams, options?: Knex.Config) {
    this.knex = knex({
      client: 'mysql2',
      connection: {
        host: params.address,
        port: params.port,
        user: params.username,
        password: params.password,
        database: params.database,
      },
      pool: {
        min: 1,
        max: 10,
      },
      ...options,
    });
  }

  public getMysqlClient(): ReturnType<typeof knex> {
    if (!this.knex) {
      throw new Error('mysql 未初始化');
    }

    return this.knex;
  }
}
